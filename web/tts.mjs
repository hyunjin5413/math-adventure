// =============================================================================
// tts.mjs — 오픈소스 한국어 TTS (Meta MMS ko VITS, ONNX/WASM)
//
//  - 합성은 웹워커(tts-worker.js)에서 수행 → UI가 절대 멈추지 않음
//  - 모델: Xenova/mms-tts-kor (quantized ~37MB, 최초 1회 다운로드 후 브라우저 캐시)
//  - MMS 한국어 모델은 로마자 입력이라 한글→로마자(uroman식) 전처리 포함
//  - 로딩 전/실패 시엔 기기 Web Speech API로 자동 폴백 → 앱은 항상 소리 남
//  - 텍스트별 오디오 캐시(LRU) + 사전 합성(prefetch/prewarm)으로 체감 지연 제거
//  ※ 라이선스: MMS 모델은 CC-BY-NC 4.0(비상업). 상업 출시 시 교체 필요.
// =============================================================================

let state = 'idle'; // idle | loading | ready | failed
let worker = null;
let audioCtx = null;
let currentSrc = null;
const cache = new Map(); // text → AudioBuffer (LRU)
const CACHE_MAX = 150;
let seq = 0;      // 최신 재생 요청만 유효
let msgId = 0;    // 워커 요청 id
const pending = new Map(); // msgId → {resolve, reject}

export function ttsStatus() { return state; }
export function ttsBackend() { return state === 'ready' ? 'wasm-worker' : 'none'; }

// ---- 한글 → 로마자 (uroman식 개정로마자) -----------------------------------
const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG = ['','g','kk','gs','n','nj','nh','d','l','lg','lm','lb','ls','lt','lp','lh','m','b','bs','s','ss','ng','j','ch','k','t','p','h'];
const SINO = ['영','일','이','삼','사','오','육','칠','팔','구'];

function numToKorean(n) {
  n = parseInt(n, 10);
  if (isNaN(n)) return '';
  if (n < 10) return SINO[n];
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10;
    return (t === 1 ? '십' : SINO[t] + '십') + (o ? SINO[o] : '');
  }
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return (h === 1 ? '백' : SINO[h] + '백') + (r ? numToKorean(r) : '');
  }
  return String(n);
}

export function romanizeKorean(text) {
  let t = String(text).replace(/\d+/g, (m) => numToKorean(m));
  let out = '';
  for (const ch of t) {
    const c = ch.codePointAt(0);
    if (c >= 0xac00 && c <= 0xd7a3) {
      const i = c - 0xac00;
      out += CHO[Math.floor(i / 588)] + JUNG[Math.floor((i % 588) / 28)] + JONG[i % 28];
    } else if (/[a-zA-Z' -]/.test(ch)) {
      out += ch.toLowerCase();
    } else if (/[.,!?…~·]/.test(ch)) {
      out += ' ';
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

// ---- 워커 통신 ---------------------------------------------------------------
// synth 요청 타임아웃: 워커가 죽거나(iOS 메모리 회수) 멈추면 영원히 기다리지 않고
// 실패 처리 → 기기 음성 폴백. 연속 실패가 쌓이면 워커 TTS를 포기하고 영구 폴백.
const SYNTH_TIMEOUT_MS = 12000;
let synthFailStreak = 0;
function callWorker(type, payload = {}, timeoutMs = 0) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    let timer = null;
    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error('worker timeout'));
        }
      }, timeoutMs);
    }
    pending.set(id, {
      resolve: (v) => { if (timer) clearTimeout(timer); resolve(v); },
      reject: (e) => { if (timer) clearTimeout(timer); reject(e); },
    });
    worker.postMessage({ id, type, ...payload });
  });
}

export async function initOpenTTS() {
  if (state === 'loading' || state === 'ready') return;
  state = 'loading';
  try {
    worker = new Worker(new URL('./tts-worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const { id, type, message } = e.data;
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (type === 'error') p.reject(new Error(message));
      else p.resolve(e.data);
    };
    worker.onerror = (e) => { console.warn('TTS worker error', e); };
    await callWorker('init'); // 모델 다운로드 + 워밍업 (워커 안에서)
    state = 'ready';
    console.info('open TTS ready (wasm-worker)');
    drainPrefetch();
  } catch (e) {
    console.warn('open TTS load failed → Web Speech 폴백 유지', e);
    state = 'failed';
  }
}

// ---- 합성 + 재생 ---------------------------------------------------------------
// iOS/모바일: AudioContext가 수시로 suspended/interrupted 되므로
//  ① 사용자 제스처마다 즉시 잠금 해제(제스처 컨텍스트 안에서 resume)
//  ② 재생 직전 resume을 "기다린 후" 시작, 실패 시 Web Speech 폴백
function ensureCtx() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}
// 효과음(sfx.mjs) 등 외부에서 같은 컨텍스트 공유 (iOS는 컨텍스트 1개가 안전)
export function getAudioCtx() { return ensureCtx(); }

// 사용자 제스처 안에서 오디오 잠금 해제 (아이는 계속 탭하므로 항상 running 유지)
let audioUnlocked = false;
let speechPrimed = false;
function unlockAudio() {
  try {
    const ctx = ensureCtx();
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    if (!audioUnlocked) {
      // iOS 클래식 언락: 제스처 안에서 무음 버퍼 1회 재생
      const b = ctx.createBuffer(1, 1, 22050);
      const s = ctx.createBufferSource();
      s.buffer = b; s.connect(ctx.destination); s.start(0);
      audioUnlocked = true;
    }
    // iOS Web Speech 언락: 첫 제스처 안에서 무음 발화 1회 → 이후 프로그램 발화 허용
    if (!speechPrimed && 'speechSynthesis' in window) {
      speechPrimed = true;
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch { /* noop */ }
}
if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'touchend', 'mousedown', 'keydown']) {
    window.addEventListener(ev, unlockAudio, { capture: true, passive: true });
  }
  // 백그라운드 갔다 오면(잠금/앱전환) 컨텍스트 재개
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audioCtx && audioCtx.state !== 'running') {
      audioCtx.resume().catch(() => {});
    }
  });
}

async function synthToBuffer(text) {
  if (cache.has(text)) {
    const b = cache.get(text);
    cache.delete(text); cache.set(text, b);
    return b;
  }
  const roman = romanizeKorean(text);
  if (!roman) return null;
  let out;
  try {
    out = await callWorker('synth', { text: roman }, SYNTH_TIMEOUT_MS);
    synthFailStreak = 0;
  } catch (e) {
    // 워커 무응답이 반복되면(iOS가 워커를 죽인 경우 등) 워커 TTS 포기 → 이후 전부 기기 음성
    synthFailStreak++;
    if (synthFailStreak >= 3 && state === 'ready') {
      state = 'failed';
      console.warn('open TTS 워커 무응답 반복 → 기기 음성으로 전환');
    }
    throw e;
  }
  const ctx = ensureCtx();
  const buf = ctx.createBuffer(1, out.audio.length, out.sr);
  buf.getChannelData(0).set(out.audio);
  cache.set(text, buf);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  return buf;
}

// 재생 없이 미리 합성해 캐시에 넣기 — 순차 대기열(중복 제거)
const prefetchQ = [];
let prefetchBusy = false;
async function drainPrefetch() {
  if (prefetchBusy || state !== 'ready') return;
  prefetchBusy = true;
  while (prefetchQ.length) {
    const text = prefetchQ.shift();
    if (!cache.has(text)) {
      try { await synthToBuffer(text); } catch { /* noop */ }
    }
  }
  prefetchBusy = false;
}
export function prefetchSpeech(text) {
  if (!text || cache.has(text) || prefetchQ.includes(text)) return;
  prefetchQ.push(text);
  if (state === 'ready') drainPrefetch();
}
// 이미 합성돼 즉시 재생 가능한지 (라이브 재생은 절대 합성을 기다리지 않는다)
export function hasCachedSpeech(text) { return cache.has(text); }
export function prewarmLines(texts) { for (const t of texts || []) prefetchSpeech(t); }

export function stopOpenSpeech() {
  seq++;
  if (currentSrc) { try { currentSrc.stop(); } catch { /* noop */ } currentSrc = null; }
}

// 캐릭터 개성: pitch/rate → 재생 속도로 근사
function playbackRateOf({ pitch = 1, rate = 0.95 } = {}) {
  const r = pitch * 0.75 + rate * 0.3;
  return Math.min(1.45, Math.max(0.62, r));
}

// 오픈소스 TTS로 말하기. 성공 시 true, 불가하면 false(폴백 필요).
export async function speakOpen(text, style) {
  if (state !== 'ready' || !text) return false;
  const my = ++seq;
  try {
    const buf = await synthToBuffer(text);
    if (!buf) return false;
    if (my !== seq) return true; // 이미 다른 말로 대체됨
    const ctx = ensureCtx();
    // 재생 전에 반드시 running 상태 확보 (iOS: suspended/interrupted 복구)
    if (ctx.state !== 'running') {
      try { await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 700))]); } catch { /* noop */ }
    }
    if (ctx.state !== 'running') return false; // 재개 불가 → 기기 음성 폴백
    if (my !== seq) return true;
    if (currentSrc) { try { currentSrc.stop(); } catch { /* noop */ } }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = playbackRateOf(style);
    src.connect(ctx.destination);
    src.start();
    currentSrc = src;
    return true;
  } catch (e) {
    console.warn('open TTS synth failed', e);
    return false;
  }
}
