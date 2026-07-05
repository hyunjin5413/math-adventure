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
function callWorker(type, payload = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
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
function ensureCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

async function synthToBuffer(text) {
  if (cache.has(text)) {
    const b = cache.get(text);
    cache.delete(text); cache.set(text, b);
    return b;
  }
  const roman = romanizeKorean(text);
  if (!roman) return null;
  const out = await callWorker('synth', { text: roman });
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
    if (!buf || my !== seq) return true; // 이미 다른 말로 대체됨
    const ctx = ensureCtx();
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
