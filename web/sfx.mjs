// =============================================================================
// sfx.mjs — 효과음 (WebAudio 합성, 에셋 없음)
//  - tap: 버튼 터치 톡톡이
//  - correct: 정답 아르페지오(도-미-솔+반짝)
//  - wrong: 부드러운 오답음(겁주지 않게 낮고 짧게)
//  - discover: 친구 발견 팡파레
//  - fanfare: 스테이지 클리어
// TTS와 같은 AudioContext를 공유(iOS에서 컨텍스트 1개 유지가 안전).
// =============================================================================
import { getAudioCtx } from './tts.mjs?v=202608010029';

function tone(ctx, { f = 440, f2 = null, type = 'sine', at = 0, dur = 0.15, peak = 0.2 }) {
  const t0 = ctx.currentTime + at;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.03);
}

export function sfx(name) {
  try {
    const ctx = getAudioCtx();
    if (ctx.state !== 'running') { ctx.resume().catch(() => {}); }
    switch (name) {
      case 'tap':
        tone(ctx, { f: 1300, f2: 900, type: 'sine', dur: 0.055, peak: 0.1 });
        break;
      case 'correct': // 도–미–솔 + 반짝
        tone(ctx, { f: 523.25, type: 'triangle', at: 0, dur: 0.16, peak: 0.2 });
        tone(ctx, { f: 659.25, type: 'triangle', at: 0.09, dur: 0.16, peak: 0.2 });
        tone(ctx, { f: 783.99, type: 'triangle', at: 0.18, dur: 0.2, peak: 0.22 });
        tone(ctx, { f: 1567.98, type: 'sine', at: 0.27, dur: 0.14, peak: 0.1 });
        break;
      case 'wrong': // 부드러운 "웁-" 두 번 (짧고 낮게)
        tone(ctx, { f: 330, f2: 262, type: 'triangle', at: 0, dur: 0.14, peak: 0.16 });
        tone(ctx, { f: 262, f2: 220, type: 'triangle', at: 0.15, dur: 0.16, peak: 0.14 });
        break;
      case 'discover': // 발견 팡파레(빠른 상승 아르페지오)
        tone(ctx, { f: 523.25, type: 'triangle', at: 0, dur: 0.12, peak: 0.18 });
        tone(ctx, { f: 659.25, type: 'triangle', at: 0.08, dur: 0.12, peak: 0.18 });
        tone(ctx, { f: 783.99, type: 'triangle', at: 0.16, dur: 0.12, peak: 0.18 });
        tone(ctx, { f: 1046.5, type: 'triangle', at: 0.24, dur: 0.22, peak: 0.22 });
        tone(ctx, { f: 2093, type: 'sine', at: 0.3, dur: 0.18, peak: 0.09 });
        break;
      case 'fanfare': // 클리어(따단-따-단!)
        tone(ctx, { f: 392, type: 'triangle', at: 0, dur: 0.14, peak: 0.2 });
        tone(ctx, { f: 523.25, type: 'triangle', at: 0.12, dur: 0.14, peak: 0.2 });
        tone(ctx, { f: 659.25, type: 'triangle', at: 0.24, dur: 0.14, peak: 0.2 });
        tone(ctx, { f: 783.99, type: 'triangle', at: 0.36, dur: 0.34, peak: 0.24 });
        tone(ctx, { f: 1567.98, type: 'sine', at: 0.44, dur: 0.24, peak: 0.1 });
        break;
      default:
        break;
    }
  } catch { /* 오디오 불가 환경에서도 앱은 계속 */ }
}
