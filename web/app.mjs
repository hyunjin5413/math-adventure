// =============================================================================
// 수학 어드벤처 — W1 플레이 가능 프로토타입
// 빌드 도구 없이 ESM CDN(React) + htm(JSX 유사 템플릿). 정적 서버로 바로 실행.
//   python3 -m http.server 8080  →  http://localhost:8080/web/
// 데이터: ../output/stages.json (generate.mjs 산출물)
// PRD §7(점수/별점/결과), §8(태블릿/터치/TTS) 반영.
// =============================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);
const { useRef } = React;

// ---- 데이터 로드 -----------------------------------------------------------
// 배포(self-contained): 같은 폴더의 ./stages.json. 없으면 개발용 ../output/stages.json 폴백.
const DATA_URLS = [
  new URL('./stages.json', import.meta.url),
  new URL('../output/stages.json', import.meta.url),
];
async function fetchStages() {
  let lastErr;
  for (const u of DATA_URLS) {
    try {
      const r = await fetch(u);
      if (r.ok) return r.json();
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('stages.json not found');
}

// ---- 진척도 저장 (localStorage) --------------------------------------------
const SAVE_KEY = 'math-adventure-progress';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || { stars: {} }; }
  catch { return { stars: {} }; }
}
function saveProgress(p) { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }

// ---- TTS (읽기 보조, §8.3) -------------------------------------------------
function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

// ===========================================================================
// 시각 보조 컴포넌트 (visual.type → 그림)
// ===========================================================================
const MOOD_ICON = { '공룡': '🦕', '변신 로봇': '🤖', '특공대': '🚀', '히어로': '⭐', '수집형 몬스터': '👾' };

function Visual({ v, mood }) {
  if (!v) return null;
  const icon = MOOD_ICON[mood] || '🟡';
  switch (v.type) {
    case 'objects':
      return html`<div class="visual">${range(v.count).map((i) => html`<span key=${i} class="obj">${icon}</span>`)}</div>`;
    case 'objects_add':
      return html`<div class="visual">
        ${range(v.a).map((i) => html`<span key=${'a'+i} class="obj">${icon}</span>`)}
        <span class="obj">➕</span>
        ${range(v.b).map((i) => html`<span key=${'b'+i} class="obj">🥚</span>`)}
      </div>`;
    case 'objects_sub':
      return html`<div class="visual">
        ${range(v.a).map((i) => html`<span key=${i} class="obj" style=${{ opacity: i >= v.a - v.b ? 0.25 : 1 }}>${icon}</span>`)}
      </div>`;
    case 'ten_frame':
      return html`<${TenFrame} filled=${v.filled} />`;
    case 'ten_frame_add':
      return html`<div class="visual"><${TenFrame} filled=${v.a} second=${v.b} /></div>`;
    case 'ten_frame_sub':
      return html`<${TenFrame} filled=${v.a} strike=${v.b} />`;
    case 'array':
      return html`<div class="array">${range(v.rows).map((r) => html`<div key=${r} class="row">${range(v.cols).map((c) => html`<div key=${c} class="dot"></div>`)}</div>`)}</div>`;
    case 'groups':
      return html`<div class="visual">${range(v.groups).map((g) => html`<div key=${g} style=${{ display:'flex', gap:'4px', padding:'8px', border:'3px dashed #bbb', borderRadius:'12px' }}>${range(v.per).map((i) => html`<span key=${i} class="obj">${icon}</span>`)}</div>`)}</div>`;
    case 'compare_groups':
      return html`<div class="cmp">
        <div class="stack">${range(v.a).map((i) => html`<div key=${i} class="blk"></div>`)}</div>
        <div class="stack">${range(v.b).map((i) => html`<div key=${i} class="blk" style=${{ background:'#5b8def' }}></div>`)}</div>
      </div>`;
    case 'compose_bond':
      return html`<div class="bond"><div class="part">${v.a}</div><span>+</span><div class="part">${v.b}</div><span>=</span><div class="whole">?</div></div>`;
    case 'decompose_bond':
      return html`<div class="bond"><div class="whole">${v.whole}</div><span>→</span><div class="part">${v.part}</div><span>+</span><div class="part">?</div></div>`;
    case 'base_ten':
      return html`<${BaseTen} tens=${v.tens} ones=${v.ones} />`;
    case 'spoken_number':
      return html`<button class="speak-btn" onClick=${() => speak(numKo(v.value))}>🔊</button>`;
    case 'number_line':
      return html`<div class="visual" style=${{ fontSize:'22px', fontWeight:800 }}>0 ─${'─'.repeat(3)}▶</div>`;
    default:
      return null;
  }
}

function TenFrame({ filled = 0, second = 0, strike = 0 }) {
  const cells = range(10).map((i) => {
    let cls = 'cell';
    if (i < filled) cls += ' f1';
    else if (i < filled + second) cls += ' f2';
    const struck = strike && i >= filled - strike && i < filled;
    return html`<div key=${i} class=${cls}>${struck ? '✗' : ''}</div>`;
  });
  return html`<div class="tenframe">${cells}</div>`;
}

function BaseTen({ tens, ones }) {
  return html`<div class="visual">
    ${range(tens).map((i) => html`<div key=${'t'+i} style=${{ width:'18px', height:'90px', background:'#4caf72', borderRadius:'4px' }}></div>`)}
    ${range(ones).map((i) => html`<div key=${'o'+i} style=${{ width:'18px', height:'18px', background:'#ffce4f', borderRadius:'4px' }}></div>`)}
  </div>`;
}

// ===========================================================================
// 입력 위젯
// ===========================================================================
function ChoiceInput({ problem, locked, onAnswer }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [problem.id]);
  return html`<div class="choices">
    ${problem.choices.map((c) => {
      let cls = 'choice';
      if (picked != null) {
        if (c === problem.answer) cls += ' correct';
        else if (c === picked) cls += ' wrong';
      }
      return html`<button key=${String(c)} class=${cls} disabled=${locked}
        onClick=${() => { if (locked) return; setPicked(c); onAnswer(c === problem.answer, c); }}>${c}</button>`;
    })}
  </div>`;
}

function KeypadInput({ problem, locked, onAnswer }) {
  const [val, setVal] = useState('');
  useEffect(() => setVal(''), [problem.id]);
  const push = (d) => !locked && setVal((v) => (v + d).slice(0, 3));
  const submit = () => {
    if (locked || val === '') return;
    onAnswer(Number(val) === problem.answer, Number(val));
  };
  return html`<div style=${{ display:'grid', gap:'14px', justifyItems:'center' }}>
    <div class="answerbox">${val || '?'}</div>
    <div class="keypad">
      ${[1,2,3,4,5,6,7,8,9].map((d) => html`<button key=${d} class="key" onClick=${() => push(d)}>${d}</button>`)}
      <button class="key" onClick=${() => setVal('')}>⌫</button>
      <button class="key" onClick=${() => push(0)}>0</button>
      <button class="key" style=${{ background:'#4caf72', color:'#fff' }} onClick=${submit}>✓</button>
    </div>
  </div>`;
}

function InputArea(props) {
  const t = props.problem.inputType;
  if (t === 'keypad' || t === 'fill_blank' || t === 'tap_count') return html`<${KeypadInput} ...${props} />`;
  return html`<${ChoiceInput} ...${props} />`; // choice, drag_match, mixed → 보기
}

// ===========================================================================
// 점수 계산 (PRD §7.1)
// ===========================================================================
function comboBonus(streak) {
  if (streak === 10) return 20;
  if (streak === 5) return 10;
  if (streak === 3) return 5;
  return 0;
}
function speedBonus(ms) {
  if (ms < 2000) return 5;
  if (ms < 4000) return 3;
  if (ms < 6000) return 1;
  return 0;
}
function starsFor(accuracy) {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  if (accuracy >= 0.5) return 1;
  return 0;
}

// ===========================================================================
// 스테이지 플레이 화면
// ===========================================================================
function StagePlay({ stage, mood, onExit, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'ok' | 'no'
  const [locked, setLocked] = useState(false);
  const startRef = useRef(performance.now());

  const problem = stage.problems[idx];
  const total = stage.problems.length;

  useEffect(() => {
    startRef.current = performance.now();
    setShowHint(false);
    const id = setTimeout(() => speak(problem.prompt.tts || problem.prompt.text), 250);
    return () => clearTimeout(id);
  }, [problem.id]);

  const handleAnswer = useCallback((isCorrect) => {
    setLocked(true);
    if (isCorrect) {
      const elapsed = performance.now() - startRef.current;
      const newCombo = combo + 1;
      const gained = 10 + speedBonus(elapsed) + comboBonus(newCombo);
      setScore((s) => s + gained);
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setCorrect((c) => c + 1);
      setWrongStreak(0);
      setFeedback('ok');
      speak('잘했어요!');
    } else {
      setCombo(0);
      setWrongStreak((w) => w + 1);
      setFeedback('no');
      speak('다시 해볼까요?');
    }
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);
      // 오답이면 같은 문제 재시도(무감점, §4.1-6). 정답이면 다음 문제.
      if (isCorrect) {
        if (idx + 1 >= total) {
          finish(correct + 1);
        } else {
          setIdx(idx + 1);
        }
      } else {
        // 연속 오답 2회 → 힌트 노출(§6.3)
        if (wrongStreak + 1 >= 2) setShowHint(true);
      }
    }, 900);
  }, [combo, idx, total, correct, wrongStreak]);

  function finish(finalCorrect) {
    const accuracy = finalCorrect / total;
    const stars = starsFor(accuracy);
    onComplete({ score, maxCombo, accuracy, stars, finalCorrect, total });
  }

  return html`<div class="play">
    <div class="progress"><div style=${{ width: `${(idx / total) * 100}%` }}></div></div>
    <div class="play-head">
      <button class="btn ghost" onClick=${onExit}>← 나가기</button>
      <div class="spacer"></div>
      <div class="pill">${idx + 1} / ${total}</div>
      ${combo >= 2 ? html`<div class="combo">🔥 ${combo} 콤보</div>` : null}
      <div class="pill">⭐ ${score}</div>
    </div>

    <div class="stage-main">
      <div style=${{ display:'flex', alignItems:'center', gap:'14px' }}>
        <button class="speak-btn" onClick=${() => speak(problem.prompt.tts || problem.prompt.text)}>🔊</button>
        <div class="prompt">${problem.prompt.text}</div>
      </div>
      <${Visual} v=${problem.visual} mood=${mood} />
      ${showHint ? html`<div style=${{ fontSize:'20px', color:'#9b6dff', fontWeight:800 }}>💡 힌트: ${hintText(problem.hintRef)}</div>` : null}
      <div class=${`feedback ${feedback === 'ok' ? 'ok' : feedback === 'no' ? 'no' : ''}`}>
        ${feedback === 'ok' ? '정답! 🎉' : feedback === 'no' ? '다시 해봐요 💪' : ''}
      </div>
    </div>

    <div style=${{ display:'grid', placeItems:'center', padding:'10px 0 26px' }}>
      <${InputArea} problem=${problem} locked=${locked} onAnswer=${handleAnswer} />
    </div>
  </div>`;
}

function hintText(ref) {
  return {
    make_ten: '10을 먼저 채워 보세요.',
    count_on: '큰 수부터 이어서 세어 보세요.',
    count_back: '큰 수에서 거꾸로 세어 보세요.',
    subtract_to_ten: '먼저 10을 만들고 빼 보세요.',
    array: '줄과 칸을 세어 보세요.',
    number_line: '수직선을 따라가 보세요.',
    base_ten: '십 묶음과 낱개를 세어 보세요.',
    number_bond: '두 수를 모아 보세요.',
    skip_count: '뛰어 세기를 해보세요.',
    count_one_by_one: '하나씩 짚으며 세어 보세요.',
  }[ref] || '천천히 다시 생각해 봐요.';
}

// ===========================================================================
// 결과 화면 (PRD §7.3)
// ===========================================================================
function ResultScreen({ stage, result, onNext, onRetry, onMap }) {
  const passed = result.stars > 0;
  useEffect(() => { speak(passed ? '참 잘했어요!' : '다시 도전해 볼까요?'); }, []);
  return html`<div class="result">
    <div class="stars-big">${'⭐'.repeat(result.stars)}${'☆'.repeat(3 - result.stars)}</div>
    <h1 style=${{ margin:0 }}>${passed ? '클리어!' : '아쉬워요'}</h1>
    ${passed && stage.reward ? html`<div class="reward">🎁 ${rewardLabel(stage.reward)}</div>` : null}
    <div class="stats">
      <div class="stat">총점<br/>${result.score}</div>
      <div class="stat">최대 콤보<br/>${result.maxCombo}</div>
      <div class="stat">정답률<br/>${Math.round(result.accuracy * 100)}%</div>
    </div>
    <div class="actions">
      <button class="btn ghost" onClick=${onMap}>도감/맵</button>
      <button class="btn purple" onClick=${onRetry}>다시 도전</button>
      ${passed ? html`<button class="btn green" onClick=${onNext}>다음 ▶</button>` : null}
    </div>
  </div>`;
}

function rewardLabel(r) {
  if (r.kind === 'rare_character') return `${r.mood} 희귀 캐릭터 획득!`;
  if (r.kind === 'shard') return `${r.mood} 캐릭터 조각 ×${r.amount}`;
  return '보상 획득';
}

// ===========================================================================
// 월드 맵
// ===========================================================================
function WorldMap({ data, progress, onPlay }) {
  const maxN = highestUnlocked(progress);
  return html`<div>
    <div class="topbar">
      <div class="title">🧮 수학 어드벤처</div>
      <div class="spacer"></div>
      <div class="pill">획득 별 ⭐ ${totalStars(progress)}</div>
    </div>
    <div class="map">
      ${data.worlds.map((w) => html`<div class="world" key=${w.id}>
        <h2>${w.icon} ${w.name}</h2>
        <div class="stage-grid">
          ${data.stages.filter((s) => s.world === w.id).map((s) => {
            const unlocked = s.n <= maxN;
            const stars = progress.stars[s.n] || 0;
            const cls = ['stage-node'];
            if (!unlocked) cls.push('locked');
            else cls.push('tappable');
            if (s.type === 'boss') cls.push('boss');
            if (s.type === 'mini_review') cls.push('mini');
            if (stars > 0) cls.push('cleared');
            return html`<div key=${s.n} class=${cls.join(' ')}
              onClick=${() => unlocked && onPlay(s)}>
              ${unlocked ? (s.type === 'boss' ? '👑' : s.type === 'mini_review' ? '🔁' : s.stageInWorld) : html`<span class="lock">🔒</span>`}
              ${stars > 0 ? html`<div class="stars">${'⭐'.repeat(stars)}</div>` : null}
            </div>`;
          })}
        </div>
      </div>`)}
    </div>
  </div>`;
}

function highestUnlocked(progress) {
  // 클리어한 최고 스테이지 + 1 까지 해제 (최소 1)
  const cleared = Object.keys(progress.stars).map(Number).filter((n) => progress.stars[n] > 0);
  return cleared.length ? Math.max(...cleared) + 1 : 1;
}
function totalStars(progress) {
  return Object.values(progress.stars).reduce((a, b) => a + b, 0);
}

// ===========================================================================
// 루트 앱
// ===========================================================================
function App() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState({ name: 'map' });

  useEffect(() => {
    fetchStages().then(setData).catch((e) => {
      document.getElementById('root').innerHTML =
        '<div class="boot">stages.json을 불러오지 못했습니다.<br/>먼저 <b>node build.mjs</b> 실행 후<br/>정적 서버로 열어주세요.</div>';
      console.error(e);
    });
  }, []);

  const playStage = useCallback((stage) => setView({ name: 'play', stage }), []);

  const completeStage = useCallback((stage, result) => {
    setProgress((prev) => {
      const next = { ...prev, stars: { ...prev.stars } };
      next.stars[stage.n] = Math.max(next.stars[stage.n] || 0, result.stars);
      saveProgress(next);
      return next;
    });
    setView({ name: 'result', stage, result });
  }, []);

  if (!data) return html`<div class="boot">불러오는 중…</div>`;

  const moodOf = (worldId) => data.worlds.find((w) => w.id === worldId)?.mood;

  let screen;
  if (view.name === 'map') {
    screen = html`<${WorldMap} data=${data} progress=${progress} onPlay=${playStage} />`;
  } else if (view.name === 'play') {
    screen = html`<${StagePlay}
      key=${view.stage.n}
      stage=${view.stage}
      mood=${moodOf(view.stage.world)}
      onExit=${() => setView({ name: 'map' })}
      onComplete=${(result) => completeStage(view.stage, result)} />`;
  } else if (view.name === 'result') {
    const next = data.stages.find((s) => s.n === view.stage.n + 1);
    screen = html`<${ResultScreen}
      stage=${view.stage}
      result=${view.result}
      onMap=${() => setView({ name: 'map' })}
      onRetry=${() => setView({ name: 'play', stage: view.stage })}
      onNext=${() => next ? setView({ name: 'play', stage: next }) : setView({ name: 'map' })} />`;
  }

  return html`<div>
    ${screen}
    <div class="rotate-hint">📱➡️ 태블릿을 가로로 돌려주세요!</div>
  </div>`;
}

// ---- 유틸 ------------------------------------------------------------------
function range(n) { return Array.from({ length: Math.max(0, n | 0) }, (_, i) => i); }
const SINO = ['영','일','이','삼','사','오','육','칠','팔','구'];
function numKo(n) {
  if (n == null) return '';
  if (n < 10) return SINO[n];
  if (n < 100) { const t = Math.floor(n/10), o = n%10; return (t===1?'십':SINO[t]+'십')+(o?SINO[o]:''); }
  return String(n);
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
