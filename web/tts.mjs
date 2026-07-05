// =============================================================================
// tts.mjs — 오픈소스 한국어 TTS (Meta MMS ko VITS, ONNX → transformers.js/WASM)
//
//  - 모델: Xenova/mms-tts-kor (quantized ~37MB, 최초 1회 다운로드 후 브라우저 캐시)
//  - MMS 한국어 모델은 로마자 입력을 받으므로 한글→로마자(uroman식) 전처리 포함
//  - 로딩 전/실패 시엔 기기 Web Speech API로 자동 폴백 → 앱은 항상 소리 남
//  - 캐릭터 개성: 재생 속도(playbackRate)로 음높이+속도 변주, 합성음은 텍스트별 캐시
//  ※ 라이선스: MMS 모델은 CC-BY-NC 4.0(비상업). 상업 출시 시 교체 필요.
// =============================================================================

let state = 'idle'; // idle | loading | ready | failed
let synthPipe = null;
let audioCtx = null;
let currentSrc = null;
const cache = new Map(); // text → AudioBuffer (LRU)
const CACHE_MAX = 150;
let seq = 0; // 최신 요청만 재생

export function ttsStatus() { return state; }

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
  // 숫자 → 한글 수사
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
      out += ' '; // 문장부호는 쉼으로
    }
    // 그 외 기호(×, □ 등)는 무시
  }
  return out.replace(/\s+/g, ' ').trim();
}

// ---- 모델 로딩 (백그라운드) --------------------------------------------------
export async function initOpenTTS() {
  if (state === 'loading' || state === 'ready') return;
  state = 'loading';
  try {
    const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    env.allowLocalModels = false;
    synthPipe = await pipeline('text-to-speech', 'Xenova/mms-tts-kor', { quantized: true });
    // 워밍업(첫 합성 지연 감소) + 동작 검증
    const warm = await synthPipe(romanizeKorean('안녕'));
    if (!warm || !warm.audio || !warm.audio.length) throw new Error('empty audio');
    state = 'ready';
  } catch (e) {
    console.warn('open TTS load failed → Web Speech 폴백 유지', e);
    state = 'failed';
  }
}

// ---- 합성 + 재생 -------------------------------------------------------------
function ensureCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

async function synthToBuffer(text) {
  if (cache.has(text)) {
    const b = cache.get(text);
    cache.delete(text); cache.set(text, b); // LRU 갱신
    return b;
  }
  const roman = romanizeKorean(text);
  if (!roman) return null;
  const out = await synthPipe(roman);
  const ctx = ensureCtx();
  const buf = ctx.createBuffer(1, out.audio.length, out.sampling_rate);
  buf.getChannelData(0).set(out.audio);
  cache.set(text, buf);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  return buf;
}

// 재생 없이 미리 합성해 캐시에 넣기 (다음 문제 선낭독 대비)
let prefetching = false;
export async function prefetchSpeech(text) {
  if (state !== 'ready' || !text || cache.has(text) || prefetching) return;
  prefetching = true;
  try { await synthToBuffer(text); } catch { /* noop */ }
  prefetching = false;
}

export function stopOpenSpeech() {
  seq++;
  if (currentSrc) { try { currentSrc.stop(); } catch { /* noop */ } currentSrc = null; }
}

// 캐릭터 개성: pitch/rate → 재생 속도로 근사 (높으면 빠르고 높은 목소리)
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
