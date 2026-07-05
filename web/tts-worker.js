// =============================================================================
// tts-worker.js — 오픈소스 한국어 TTS 합성 전용 웹워커
// 무거운 WASM 합성(~3초)을 메인스레드 밖에서 수행 → UI가 절대 멈추지 않음
// =============================================================================
let pipePromise = null;

async function getPipe() {
  if (!pipePromise) {
    pipePromise = (async () => {
      const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
      env.allowLocalModels = false;
      return pipeline('text-to-speech', 'Xenova/mms-tts-kor', { quantized: true });
    })();
  }
  return pipePromise;
}

self.onmessage = async (e) => {
  const { id, type, text } = e.data;
  try {
    if (type === 'init') {
      const pipe = await getPipe();
      const warm = await pipe('annyeong'); // 워밍업 + 동작 검증
      if (!warm || !warm.audio || !warm.audio.length) throw new Error('empty audio');
      self.postMessage({ id, type: 'ready' });
    } else if (type === 'synth') {
      const pipe = await getPipe();
      const out = await pipe(text);
      self.postMessage(
        { id, type: 'audio', sr: out.sampling_rate, audio: out.audio },
        [out.audio.buffer],
      );
    }
  } catch (err) {
    self.postMessage({ id, type: 'error', message: String(err) });
  }
};
