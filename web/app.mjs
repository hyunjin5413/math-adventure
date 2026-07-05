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
import { Character, Item, Icon, WORLD_THEME, CHAR_THEME, CHAR_NAME, ROSTER, DEX, SPECIALS, WORLD_CHARS, WORLD_LABEL, WORLD_MASCOT, WORLD_BOSS, VOICE, VOICE_STYLE, pickLine } from './characters.mjs';
import { serverGet, serverPut } from './sync.mjs';

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

// ===========================================================================
// 계정: 온라인(kvdb 간이 KV) 우선 + 로컬 폴백/캐시
//  - 비밀번호는 PBKDF2 해시로만 저장(평문 저장 안 함)
//  - 서버가 안 되면(오프라인 등) 로컬만으로도 전부 동작
// ===========================================================================
const ACCOUNTS_KEY = 'ma-accounts';
const SESSION_KEY = 'ma-session';

// 현재 로그인 세션의 인증 정보(서버 저장 레코드 작성에 필요)
let CURRENT_AUTH = null; // { id, salt, hash }

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch { return {}; }
}
function saveAccounts(a) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a)); }

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (s) => new Uint8Array(s.match(/.{2}/g).map((h) => parseInt(h, 16)));
function randomSaltHex() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return hex(a.buffer);
}
async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromHex(saltHex), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256,
  );
  return hex(bits);
}

// 계정 생성/로그인. 결과: { ok, error? }
// 서버 우선, 실패(오프라인 등) 시 로컬 폴백. 성공 시 로컬 미러 갱신.
async function createAccount(id, password) {
  id = id.trim();
  if (!id) return { ok: false, error: '아이디를 입력하세요.' };
  if (password.length < 4) return { ok: false, error: '비밀번호는 4자 이상으로 해주세요.' };
  const accounts = loadAccounts();

  // 서버에서 중복 확인 (서버 불가 시 로컬만 확인)
  let serverOk = false;
  try {
    const existing = await serverGet(id);
    if (existing) return { ok: false, error: '이미 있는 아이디예요.' };
    serverOk = true;
  } catch { /* 오프라인 → 로컬 검사만 */ }
  if (accounts[id]) return { ok: false, error: '이미 있는 아이디예요.' };

  const salt = randomSaltHex();
  const hashv = await hashPassword(password, salt);
  accounts[id] = { salt, hash: hashv, createdAt: Date.now() };
  saveAccounts(accounts);
  CURRENT_AUTH = { id, salt, hash: hashv };
  if (serverOk) {
    try {
      await serverPut(id, { salt, hash: hashv, progress: { stars: {}, collected: [] }, updatedAt: Date.now() });
    } catch { /* 다음 저장 때 재시도 */ }
  }
  return { ok: true };
}

// 진행기록 병합: 별점은 스테이지별 최대값, 도감은 합집합(먼저 얻은 사유 유지)
function mergeProgress(a, b) {
  const stars = { ...(a?.stars || {}) };
  for (const [k, v] of Object.entries(b?.stars || {})) stars[k] = Math.max(stars[k] || 0, v);
  const collected = [...(a?.collected || [])];
  for (const c of b?.collected || []) if (!collected.some((x) => x.id === c.id)) collected.push(c);
  return { stars, collected };
}

async function verifyLogin(id, password) {
  id = id.trim();
  // 1) 서버 기록 우선
  try {
    const rec = await serverGet(id);
    if (rec && rec.salt && rec.hash) {
      const hashv = await hashPassword(password, rec.salt);
      if (hashv !== rec.hash) return { ok: false, error: '비밀번호가 달라요.' };
      // 로컬 미러 갱신 + 서버/로컬 진행기록 병합(어느 쪽도 잃지 않음)
      const accounts = loadAccounts();
      accounts[id] = { salt: rec.salt, hash: rec.hash, createdAt: rec.createdAt || Date.now() };
      saveAccounts(accounts);
      const merged = mergeProgress(loadProgress(id), rec.progress);
      saveProgressLocal(id, merged);
      CURRENT_AUTH = { id, salt: rec.salt, hash: rec.hash };
      serverPut(id, { salt: rec.salt, hash: rec.hash, progress: merged, updatedAt: Date.now() }).catch(() => {});
      return { ok: true };
    }
  } catch { /* 서버 불가 → 로컬 폴백 */ }

  // 2) 로컬 폴백
  const accounts = loadAccounts();
  const acc = accounts[id];
  if (!acc) return { ok: false, error: '없는 아이디예요. 새 계정을 만들어 주세요.' };
  const hashv = await hashPassword(password, acc.salt);
  if (hashv !== acc.hash) return { ok: false, error: '비밀번호가 달라요.' };
  CURRENT_AUTH = { id, salt: acc.salt, hash: acc.hash };
  // 서버에 아직 없는 로컬 계정이면 업로드 시도(마이그레이션)
  serverPut(id, { salt: acc.salt, hash: acc.hash, progress: loadProgress(id), updatedAt: Date.now() }).catch(() => {});
  return { ok: true };
}

// ---- 진척도 저장 (계정별) --------------------------------------------------
const progKey = (id) => `ma-progress:${id}`;
function loadProgress(id) {
  try {
    const p = JSON.parse(localStorage.getItem(progKey(id))) || {};
    // 구버전(문자열 배열) → {id, reason} 객체로 마이그레이션
    const collected = (p.collected || []).map((c) =>
      typeof c === 'string' ? { id: c, reason: '스테이지 클리어 보상' } : c);
    return { stars: p.stars || {}, collected };
  } catch { return { stars: {}, collected: [] }; }
}
function saveProgressLocal(id, p) { localStorage.setItem(progKey(id), JSON.stringify(p)); }
// 저장: 로컬 즉시 + 서버 비동기(실패해도 앱은 계속, 다음 저장 때 재시도)
function saveProgress(id, p) {
  saveProgressLocal(id, p);
  if (CURRENT_AUTH && CURRENT_AUTH.id === id) {
    serverPut(id, { salt: CURRENT_AUTH.salt, hash: CURRENT_AUTH.hash, progress: p, updatedAt: Date.now() })
      .catch(() => {});
  }
}

// ---- TTS (읽기 보조, §8.3) -------------------------------------------------
// 기기에서 가장 자연스러운 한국어 보이스를 자동 선택하고,
// 캐릭터별로 다른 보이스/음높이/속도를 입힌다.
let KO_VOICES = [];
function refreshVoices() {
  if (!('speechSynthesis' in window)) return;
  const all = window.speechSynthesis.getVoices() || [];
  const ko = all.filter((v) => (v.lang || '').toLowerCase().startsWith('ko'));
  // 자연스러운 보이스 우선 정렬: Google/Apple(유나·소라 등)/MS 뉴럴 계열 먼저
  const score = (v) => {
    const n = (v.name || '').toLowerCase();
    if (n.includes('google')) return 0;
    if (/(yuna|유나|sora|소라|damayanti|jimin|지민)/.test(n)) return 1;
    if (/(sunhi|injoon|heami|natural|neural|online)/.test(n)) return 2;
    if (v.localService === false) return 3; // 원격(보통 고품질)
    return 4;
  };
  KO_VOICES = ko.sort((a, b) => score(a) - score(b));
}
if ('speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function speakRaw(text, { pitch = 1, rate = 0.95, v = 0 } = {}) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.pitch = pitch;
  u.rate = rate;
  if (KO_VOICES.length) u.voice = KO_VOICES[v % KO_VOICES.length];
  window.speechSynthesis.speak(u);
}

// 문제/안내용 기본 목소리 (가장 자연스러운 보이스, 또렷하게)
function speak(text) { speakRaw(text, { pitch: 1, rate: 0.95, v: 0 }); }
// 캐릭터 대사용 목소리 (캐릭터별 개성)
function speakAs(charId, text) { speakRaw(text, VOICE_STYLE[charId] || {}); }

// ===========================================================================
// 시각 보조 컴포넌트 (visual.type → 그림). 이모지 없이 전부 SVG.
// ===========================================================================
const PlusSign = () => html`<span class="opsign">+</span>`;

function Visual({ v, theme }) {
  if (!v) return null;
  const item = (key, i, faded) => html`<${Item} key=${key} size=${42} kind="apple" faded=${faded} />`;
  switch (v.type) {
    case 'objects':
      return html`<div class="visual">${range(v.count).map((i) => item('o' + i, i))}</div>`;
    case 'objects_add':
      return html`<div class="visual">
        ${range(v.a).map((i) => item('a' + i, i))}
        <${PlusSign} />
        ${range(v.b).map((i) => html`<${Item} key=${'b' + i} size=${42} kind="acorn" />`)}
      </div>`;
    case 'objects_sub':
      return html`<div class="visual">${range(v.a).map((i) => item('s' + i, i, i >= v.a - v.b))}</div>`;
    case 'ten_frame':
      return html`<${TenFrame} filled=${v.filled} />`;
    case 'ten_frame_add':
      return html`<div class="visual"><${TenFrame} filled=${v.a} second=${v.b} /></div>`;
    case 'ten_frame_sub':
      return html`<${TenFrame} filled=${v.a} strike=${v.b} />`;
    case 'array':
      return html`<div class="array">${range(v.rows).map((r) => html`<div key=${r} class="row">${range(v.cols).map((c) => html`<div key=${c} class="dot"></div>`)}</div>`)}</div>`;
    case 'groups':
      return html`<div class="visual">${range(v.groups).map((g) => html`<div key=${g} class="grp">${range(v.per).map((i) => item(g + '_' + i, i))}</div>`)}</div>`;
    case 'compare_groups':
      return html`<div class="cmp">
        <div class="stack">${range(v.a).map((i) => html`<div key=${i} class="blk"></div>`)}</div>
        <div class="stack">${range(v.b).map((i) => html`<div key=${i} class="blk b2"></div>`)}</div>
      </div>`;
    case 'compose_bond':
      return html`<div class="bond"><div class="part">${v.a}</div><span>+</span><div class="part">${v.b}</div><span>=</span><div class="whole">?</div></div>`;
    case 'decompose_bond':
      return html`<div class="bond"><div class="whole">${v.whole}</div><span>→</span><div class="part">${v.part}</div><span>+</span><div class="part">?</div></div>`;
    case 'base_ten':
      return html`<${BaseTen} tens=${v.tens} ones=${v.ones} />`;
    case 'spoken_number':
      return html`<button class="speak-btn" onClick=${() => speak(numKo(v.value))}><${Icon} name="speaker" size=${34} color="#7a5a16" /></button>`;
    case 'number_line':
      return html`<${NumberLine} />`;
    default:
      return null;
  }
}

function NumberLine() {
  return html`<svg width="280" height="50" viewBox="0 0 280 50">
    <line x1="14" y1="30" x2="262" y2="30" stroke="#c8b88f" stroke-width="4" stroke-linecap="round" />
    <polygon points="262,22 276,30 262,38" fill="#c8b88f" />
    ${range(6).map((i) => html`<g key=${i}>
      <circle cx=${20 + i * 44} cy="30" r="6" fill="#7fb0ef" />
      <text x=${20 + i * 44} y="14" text-anchor="middle" font-size="13" font-weight="700" fill="#5a6b85">${i}</text>
    </g>`)}
  </svg>`;
}

function TenFrame({ filled = 0, second = 0, strike = 0 }) {
  const cells = range(10).map((i) => {
    let cls = 'cell';
    if (i < filled) cls += ' f1';
    else if (i < filled + second) cls += ' f2';
    const struck = strike && i >= filled - strike && i < filled;
    if (struck) cls += ' struck';
    return html`<div key=${i} class=${cls}></div>`;
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
      <button class="key" onClick=${() => setVal('')}><${Icon} name="del" size=${30} color="#8a8472" /></button>
      <button class="key" onClick=${() => push(0)}>0</button>
      <button class="key key-go" onClick=${submit}><${Icon} name="check" size=${32} color="#fff" /></button>
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
function StagePlay({ stage, world, onExit, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);   // 'ok' | 'no'
  const [bubble, setBubble] = useState('');          // 캐릭터 대사
  const [burst, setBurst] = useState(0);             // 정답 이펙트 트리거
  const [locked, setLocked] = useState(false);
  const startRef = useRef(performance.now());

  const problem = stage.problems[idx];
  const total = stage.problems.length;
  const isBoss = !!problem.bossSegment;              // 마지막 10문제 = 보스 구간
  // 보스: 20번째(보스 스테이지)는 월드 보스, 일반 스테이지는 대왕
  const bossChar = stage.type === 'boss' ? (WORLD_BOSS[world] || 'daewang') : 'daewang';
  const theme = isBoss ? bossChar : (problem.theme || (stage.themes && stage.themes[0]) || WORLD_MASCOT[world]);
  const ct = CHAR_THEME[theme] || WORLD_THEME[world];

  // 문제 등장 시: 테마가 새로 바뀌면 캐릭터 인사(대왕 구간 진입 시 대왕 등장 대사)
  const prevThemeRef = useRef(null);
  useEffect(() => {
    startRef.current = performance.now();
    setShowHint(false); setFeedback(null); setBubble('');
    const themeChanged = prevThemeRef.current && prevThemeRef.current !== theme;
    prevThemeRef.current = theme;
    const id = setTimeout(() => {
      if (themeChanged) {
        const hi = pickLine(theme, 'hi', idx);
        setBubble(hi); speakAs(theme, hi);
        // 인사 후 문제 읽기
        setTimeout(() => speak(problem.prompt.tts || problem.prompt.text), 2200);
      } else {
        speak(problem.prompt.tts || problem.prompt.text);
      }
    }, 250);
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
      setBurst((b) => b + 1);
      const line = pickLine(theme, 'ok', idx + newCombo);
      setBubble(line); speakAs(theme, line);
    } else {
      setCombo(0);
      setWrongStreak((w) => w + 1);
      setFeedback('no');
      const line = pickLine(theme, 'no', idx + wrongStreak);
      setBubble(line); speakAs(theme, line);
    }
    setTimeout(() => {
      setFeedback(null); setBubble(''); setLocked(false);
      if (isCorrect) {
        if (idx + 1 >= total) finish(correct + 1);
        else setIdx(idx + 1);
      } else if (wrongStreak + 1 >= 2) setShowHint(true);
    }, isCorrect ? 1100 : 950);
  }, [combo, idx, total, correct, wrongStreak, theme]);

  function finish(finalCorrect) {
    const accuracy = finalCorrect / total;
    const stars = starsFor(accuracy);
    // 보스의 항복 대사 (월드 보스 or 대왕)
    const winLines = (VOICE[bossChar] && VOICE[bossChar].win) || VOICE.daewang.win;
    speakAs(bossChar, winLines[0]);
    onComplete({ score, maxCombo, accuracy, stars, finalCorrect, total, beatBoss: stars > 0 });
  }

  const wt = WORLD_THEME[world] || WORLD_THEME[1];
  const buddyAnim = feedback === 'ok' ? 'bounce' : feedback === 'no' ? 'wiggle' : 'float';
  const blocks = stage.themes || [];
  const curBlock = Math.min(blocks.length - 1, Math.floor(idx / 10));
  return html`<div class=${`play theme ${isBoss ? 'bossmode' : ''}`} style=${{ '--wc1': isBoss ? '#d9ccff' : wt.c1, '--wc2': wt.c2 }}>
    ${feedback === 'ok' ? html`<${CorrectBurst} key=${burst} color=${ct.accent} /> ` : null}
    <div class="progress"><div style=${{ width: `${(idx / total) * 100}%` }}></div></div>
    <div class="play-head">
      <button class="btn ghost back" onClick=${onExit}><${Icon} name="back" size=${24} color="#8a8472" /> 나가기</button>
      <div class="blockbar">
        ${blocks.map((b, i) => html`<div key=${i} class=${`block-chip ${i === curBlock ? 'on' : ''} ${i < curBlock ? 'done' : ''}`}>
          <${Character} kind=${i === blocks.length - 1 ? bossChar : b} size=${30} anim="none" />
        </div>`)}
      </div>
      <div class="spacer"></div>
      <div class="pill">${idx + 1} / ${total}</div>
      ${combo >= 2 ? html`<div class="combo"><${Icon} name="bolt" size=${22} color="#ff8f3f" /> ${combo}</div>` : null}
      <div class="pill"><${Icon} name="star" size=${20} color="#ffce4f" /> ${score}</div>
    </div>

    <div class="stage-main">
      ${isBoss ? html`<div class="boss-banner">${CHAR_NAME[bossChar]}의 도전!</div>` : null}
      <div class="prompt-row">
        <button class="speak-btn" onClick=${() => speak(problem.prompt.tts || problem.prompt.text)}><${Icon} name="speaker" size=${32} color="#7a5a16" /></button>
        <div class="prompt">${problem.prompt.text}</div>
      </div>
      <${Visual} v=${problem.visual} theme=${theme} />
      ${showHint ? html`<div class="hint" style=${{ color: wt.accent }}>힌트 · ${hintText(problem.hintRef)}</div>` : null}
    </div>

    <div class="input-wrap">
      <${InputArea} problem=${problem} locked=${locked} onAnswer=${handleAnswer} />
    </div>

    <div class=${`buddy ${isBoss ? 'boss' : ''}`}>
      ${bubble ? html`<div class=${`bubble ${feedback || ''}`}>${bubble}</div>` : null}
      <${Character} key=${buddyAnim + idx + (feedback || '')} kind=${theme} size=${isBoss ? 140 : 104} anim=${buddyAnim} />
    </div>
  </div>`;
}


// 정답 시 큰 이펙트: 중앙 별 폭발 + 링
function CorrectBurst({ color }) {
  const rays = range(12);
  return html`<div class="burst">
    <div class="burst-ring" style=${{ borderColor: color }}></div>
    <div class="burst-center"><${Icon} name="star" size=${120} color="#ffce4f" /></div>
    ${rays.map((i) => {
      const ang = (i / rays.length) * 360;
      return html`<div key=${i} class="ray" style=${{ transform: `rotate(${ang}deg) translateY(-120px)`,
        background: i % 2 ? '#ffce4f' : color, animationDelay: `${(i % 4) * 0.03}s` }}></div>`;
    })}
    <div class="burst-text">정답!</div>
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
const CONFETTI_COLORS = ['#ff7a7a', '#ffce4f', '#44c47d', '#5b8def', '#9b6dff', '#ff8fc7'];
function Confetti() {
  // 결정적 배치(렌더마다 동일) — 좌우/지연/색을 인덱스로 분산
  const pieces = range(40).map((i) => ({
    left: (i * 53) % 100,
    delay: (i % 10) * 0.18,
    dur: 2.4 + (i % 5) * 0.4,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rot: (i * 37) % 360,
  }));
  return html`<div>${pieces.map((p, i) => html`<div key=${i} class="confetti"
    style=${{ left: `${p.left}%`, background: p.color,
      animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
      transform: `rotate(${p.rot}deg)` }}></div>`)}</div>`;
}

function ResultScreen({ stage, result, world, discovery, onNext, onRetry, onMap }) {
  const passed = result.stars > 0;
  const t = WORLD_THEME[world] || WORLD_THEME[1];
  const chars = stage.themes && stage.themes.length ? stage.themes : [WORLD_MASCOT[world]];
  useEffect(() => {
    speak(passed ? '참 잘했어요!' : '다시 도전해 볼까요?');
    if (discovery) setTimeout(() => speakAs(discovery.id, `새 친구 발견! ${CHAR_NAME[discovery.id]}! ${pickLine(discovery.id, 'hi', 0)}`), 1400);
  }, []);
  return html`<div class="result">
    ${passed ? html`<${Confetti} />` : null}
    ${discovery
      ? html`<div class="discover-card result-discover"
          style=${{ background: `linear-gradient(180deg, ${CHAR_THEME[discovery.id].c1}, #fff)` }}>
          <div class="discover-title">새 친구 발견!</div>
          <${Character} kind=${discovery.id} size=${110} anim="bounce" />
          <div class="discover-name">${CHAR_NAME[discovery.id]}</div>
          <div class="discover-reason">${discovery.reason}</div>
        </div>`
      : html`<div class="reward-chars">
          ${chars.map((c, i) => html`<${Character} key=${c} kind=${c} size=${passed ? 110 : 90}
            anim=${passed ? 'bounce' : 'float'} style=${{ animationDelay: `${i * 0.12}s` }} />`)}
        </div>`}
    <div class="stars-big">
      ${range(3).map((i) => html`<span key=${i}><${Icon} name="star" size=${64}
        color=${i < result.stars ? '#ffce4f' : '#e4ddcb'} /></span>`)}
    </div>
    <h1>${passed ? '클리어!' : '아쉬워요'}</h1>
    ${passed && !discovery ? html`<div class="reward-card">
      <div class="rhead" style=${{ color: t.accent }}>오늘 함께한 친구들</div>
      <div class="rname">${chars.map((c) => CHAR_NAME[c]).join(' · ')}</div>
    </div>` : null}
    <div class="stats">
      <div class="stat">총점<b>${result.score}</b></div>
      <div class="stat">최대 콤보<b>${result.maxCombo}</b></div>
      <div class="stat">정답률<b>${Math.round(result.accuracy * 100)}%</b></div>
    </div>
    <div class="actions">
      <button class="btn ghost" onClick=${onMap}>맵으로</button>
      <button class="btn purple" onClick=${onRetry}>다시 도전</button>
      ${passed ? html`<button class="btn green" onClick=${onNext}>다음</button>` : null}
    </div>
  </div>`;
}


// ===========================================================================
// 월드 맵
// ===========================================================================
function WorldMap({ data, progress, onPlay, user, onLogout, onCollection }) {
  const maxN = highestUnlocked(progress);
  const [menuOpen, setMenuOpen] = useState(false);
  return html`<div>
    <div class="topbar">
      <div class="title"><${Character} kind="kongryong" size=${38} anim="none" /> 수학 어드벤처</div>
      <div class="spacer"></div>
      <div class="pill user"><${Icon} name="user" size=${20} color="#5b8def" /> ${user}</div>
      <div class="pill"><${Icon} name="star" size=${20} color="#ffce4f" /> ${totalStars(progress)}</div>
      <button class="btn ghost icon-btn" onClick=${onCollection} title="도감"><${Icon} name="book" size=${24} color="#7a59d0" /> 도감</button>
      <div class="more-wrap">
        <button class="btn ghost icon-btn more-btn" onClick=${() => setMenuOpen((v) => !v)} title="더보기">
          <${Icon} name="dots" size=${22} color="#8a8472" />
        </button>
        ${menuOpen ? html`<div class="more-menu" onClick=${() => setMenuOpen(false)}>
          <button class="more-item" onClick=${onLogout}>
            <${Icon} name="logout" size=${20} color="#8a8472" /> 로그아웃
          </button>
        </div>` : null}
      </div>
    </div>
    ${menuOpen ? html`<div class="more-backdrop" onClick=${() => setMenuOpen(false)}></div>` : null}
    <div class="map">
      ${data.worlds.map((w) => {
        const t = WORLD_THEME[w.id];
        const mascot = WORLD_MASCOT[w.id];
        return html`<div class="world" key=${w.id}
          style=${{ background: `linear-gradient(180deg, ${t.c1}, #fffdf8)` }}>
          <div class="world-banner">
            <${Character} kind=${mascot} size=${64} anim="float" />
            <div>
              <h2 style=${{ color: t.accent }}>${w.name}</h2>
              <div class="wsub">대표 친구 · ${CHAR_NAME[mascot]}</div>
            </div>
          </div>
          <div class="stage-grid">
            ${data.stages.filter((s) => s.world === w.id).map((s) => {
              const unlocked = s.n <= maxN;
              const stars = progress.stars[s.n] || 0;
              const cls = ['stage-node'];
              if (!unlocked) cls.push('locked');
              else cls.push('tappable');
              if (s.type === 'boss') cls.push('boss');
              if (s.type === 'mini_review') cls.push('mini');
              const grad = s.type === 'mini_review'
                ? 'radial-gradient(circle at 35% 28%, #ffe69a, #eda600)'
                : `radial-gradient(circle at 35% 28%, ${t.c2}, ${t.accent})`;
              const shadow = `0 6px 0 ${t.accent}, 0 9px 12px rgba(0,0,0,.14)`;
              return html`<div key=${s.n} class=${cls.join(' ')}
                style=${unlocked ? { background: grad, boxShadow: shadow } : {}}
                onClick=${() => unlocked && onPlay(s)}>
                ${s.type === 'boss' ? html`<div class="badge"><${Icon} name="crown" size=${22} color="#ffce4f" /></div>` : null}
                ${s.type === 'mini_review' ? html`<div class="badge"><${Icon} name="refresh" size=${18} color="#fff" /></div>` : null}
                ${unlocked
                  ? (s.type === 'boss'
                      ? html`<${Character} kind=${WORLD_BOSS[w.id]} size=${46} anim="none" />`
                      : s.stageInWorld)
                  : html`<${Icon} name="lock" size=${26} color="#b3ab93" />`}
                ${stars > 0 ? html`<div class="stars">${range(stars).map((i) => html`<${Icon} key=${i} name="star" size=${13} color="#ffce4f" />`)}</div>` : null}
              </div>`;
            })}
          </div>
        </div>`;
      })}
    </div>
  </div>`;
}

// ===========================================================================
// 도감 (모은 캐릭터)
// ===========================================================================
function DexCard({ k, entry, onSelect }) {
  const ct = CHAR_THEME[k];
  return html`<div class=${`dex-card ${entry ? 'owned' : 'locked'}`}
    style=${entry ? { background: `linear-gradient(180deg, ${ct.c1}, #fff)` } : {}}
    onClick=${() => entry && onSelect(entry)}>
    ${entry
      ? html`<${Character} kind=${k} size=${90} anim="float" />`
      : html`<div class="dex-silhouette"><${Character} kind=${k} size=${90} anim="none" /></div>`}
    <div class="dex-name">${entry ? CHAR_NAME[k] : '???'}</div>
  </div>`;
}

function Collection({ progress, onBack }) {
  const entries = new Map((progress.collected || []).map((c) => [c.id, c]));
  const [selected, setSelected] = useState(null); // 탭한 캐릭터 entry
  return html`<div>
    <div class="topbar">
      <button class="btn ghost back" onClick=${onBack}><${Icon} name="back" size=${24} color="#8a8472" /> 맵으로</button>
      <div class="title" style=${{ marginLeft: '8px' }}>친구 도감</div>
      <div class="spacer"></div>
      <div class="pill">${entries.size} / ${DEX.length}</div>
    </div>
    <div class="collection-scroll">
      ${[1, 2, 3, 4, 5].map((w) => {
        const chars = WORLD_CHARS[w];
        const ownedCount = chars.filter((k) => entries.has(k)).length;
        const wt = WORLD_THEME[w];
        return html`<div key=${w} class="dex-section">
          <div class="dex-sec-head" style=${{ color: wt.accent }}>
            W${w} ${WORLD_LABEL[w]} <span class="dex-sec-count">${ownedCount}/${chars.length}</span>
          </div>
          <div class="collection">
            ${chars.map((k) => html`<${DexCard} key=${k} k=${k} entry=${entries.get(k)} onSelect=${setSelected} />`)}
          </div>
        </div>`;
      })}
      <div class="dex-section">
        <div class="dex-sec-head" style=${{ color: '#4a2fa8' }}>
          보스 친구들 <span class="dex-sec-count">${SPECIALS.filter((k) => entries.has(k)).length}/${SPECIALS.length}</span>
        </div>
        <div class="collection">
          ${SPECIALS.map((k) => html`<${DexCard} key=${k} k=${k} entry=${entries.get(k)} onSelect=${setSelected} />`)}
        </div>
      </div>
    </div>
    ${selected ? html`<div class="dex-modal" onClick=${() => setSelected(null)}>
      <div class="dex-modal-card" style=${{ background: `linear-gradient(180deg, ${CHAR_THEME[selected.id].c1}, #fff)` }}
        onClick=${(e) => e.stopPropagation()}>
        <${Character} kind=${selected.id} size=${150} anim="bounce" />
        <div class="dex-modal-name">${CHAR_NAME[selected.id]}</div>
        <div class="dex-modal-reason">
          <${Icon} name="gift" size=${20} color=${CHAR_THEME[selected.id].accent} />
          ${selected.reason}
        </div>
        ${VOICE[selected.id] ? html`<button class="btn ghost" style=${{ minHeight: '46px', fontSize: '16px' }}
          onClick=${() => speakAs(selected.id, pickLine(selected.id, 'hi', 0))}>
          <${Icon} name="speaker" size=${18} color="#8a8472" /> 인사 듣기
        </button>` : null}
        <button class="btn green" style=${{ minHeight: '48px' }} onClick=${() => setSelected(null)}>닫기</button>
      </div>
    </div>` : null}
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
// 로그인 / 계정 만들기 화면
// ===========================================================================
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const existing = Object.keys(loadAccounts());

  const submit = async () => {
    setError(''); setBusy(true);
    try {
      if (mode === 'signup') {
        const r = await createAccount(id, pw);
        if (!r.ok) { setError(r.error); return; }
        await verifyLogin(id, pw);
        onLogin(id.trim());
      } else {
        const r = await verifyLogin(id, pw);
        if (!r.ok) { setError(r.error); return; }
        onLogin(id.trim());
      }
    } finally { setBusy(false); }
  };

  return html`<div class="login">
    <div class="login-mascots">
      ${['poopbot', 'ppika', 'baboon', 'captainkorea', 'kkongryong', 'imagine', 'superabbit', 'ppokkattu', 'andongki', 'balduncle'].map((k, i) => html`<${Character}
        key=${k} kind=${k} size=${70} anim="float"
        style=${{ animationDelay: `${(i % 4) * 0.4}s` }} />`)}
    </div>
    <div class="login-card">
      <div class="login-top"><${Character} kind="kongryong" size=${110} anim="wiggle" /></div>
      <h1>수학 어드벤처</h1>
      <p class="login-sub">${mode === 'login' ? '아이디로 로그인해요' : '새 계정을 만들어요'}</p>

      ${existing.length > 0 && mode === 'login' ? html`<div class="acc-chips">
        ${existing.map((a) => html`<button key=${a} class="acc-chip" onClick=${() => setId(a)}><${Icon} name="user" size=${16} color="#5b8def" /> ${a}</button>`)}
      </div>` : null}

      <input class="login-input" placeholder="아이디" value=${id}
        autocapitalize="off" autocorrect="off"
        onInput=${(e) => setId(e.target.value)} />
      <input class="login-input" placeholder="비밀번호" type="password" value=${pw}
        onInput=${(e) => setPw(e.target.value)}
        onKeyDown=${(e) => e.key === 'Enter' && submit()} />

      ${error ? html`<div class="login-error">${error}</div>` : null}

      <button class="btn green" style=${{ width: '100%' }} disabled=${busy || !id || !pw} onClick=${submit}>
        ${busy ? '잠시만요…' : mode === 'login' ? '로그인 ▶' : '계정 만들기 ▶'}
      </button>

      <button class="link-btn" onClick=${() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
        ${mode === 'login' ? '계정이 없어요 · 새로 만들기' : '이미 계정이 있어요 · 로그인'}
      </button>
      <p class="login-note">기록은 이 기기에 저장돼요.</p>
    </div>
  </div>`;
}

// ===========================================================================
// 루트 앱
// ===========================================================================
function App() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(() => localStorage.getItem(SESSION_KEY) || null);
  const [progress, setProgress] = useState({ stars: {} });
  const [view, setView] = useState({ name: 'map' });

  useEffect(() => {
    fetchStages().then(setData).catch((e) => {
      document.getElementById('root').innerHTML =
        '<div class="boot">stages.json을 불러오지 못했습니다.<br/>먼저 <b>node build.mjs</b> 실행 후<br/>정적 서버로 열어주세요.</div>';
      console.error(e);
    });
  }, []);

  // 로그인한 계정의 진척도 로드
  useEffect(() => {
    if (user) setProgress(loadProgress(user));
  }, [user]);

  const login = useCallback((id) => {
    localStorage.setItem(SESSION_KEY, id);
    setProgress(loadProgress(id));
    setUser(id);
    setView({ name: 'map' });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    CURRENT_AUTH = null;
    setUser(null);
    setProgress({ stars: {} });
    setView({ name: 'map' });
  }, []);

  const playStage = useCallback((stage) => setView({ name: 'play', stage }), []);

  // 플레이 중 친구 발견 → 즉시 도감에 저장
  const completeStage = useCallback((stage, result) => {
    let discovery = null;
    setProgress((prev) => {
      const next = { ...prev, stars: { ...prev.stars }, collected: [...(prev.collected || [])] };
      const firstClear = !(prev.stars[stage.n] > 0) && result.stars > 0;
      next.stars[stage.n] = Math.max(next.stars[stage.n] || 0, result.stars);
      const add = (id, reason) => {
        if (next.collected.some((c) => c.id === id)) return false;
        next.collected.push({ id, reason });
        return true;
      };
      if (result.stars > 0) {
        // 보스 물리치기(최초 1회): 보스 스테이지=월드 보스, 일반=대왕
        if (result.beatBoss) {
          if (stage.type === 'boss') {
            const b = WORLD_BOSS[stage.world];
            add(b, `W${stage.world} 보스 ${CHAR_NAME[b]} 물리치기`);
          } else {
            add('daewang', `스테이지 ${stage.n} 대왕과의 대결 승리`);
          }
        }
        // 스테이지 4개 완료마다 → 새 친구 발견! (지금 월드 친구 우선)
        if (firstClear) {
          const clearedCount = Object.values(next.stars).filter((s) => s > 0).length;
          if (clearedCount % 4 === 0) {
            const owned = new Set(next.collected.map((c) => c.id));
            const worldPool = (WORLD_CHARS[stage.world] || []).filter((c) => !owned.has(c));
            const candidates = worldPool.length ? worldPool : ROSTER.filter((c) => !owned.has(c));
            if (candidates.length) {
              const id = candidates[Math.floor(Math.random() * candidates.length)];
              const reason = `스테이지 ${clearedCount}개 완료`;
              add(id, reason);
              discovery = { id, reason };
            }
          }
        }
      }
      if (user) saveProgress(user, next);
      return next;
    });
    setView({ name: 'result', stage, result, discovery });
  }, [user]);

  if (!data) return html`<div class="boot">불러오는 중…</div>`;

  // 로그인 전이면 로그인 화면
  if (!user) {
    return html`<div>
      <${LoginScreen} onLogin=${login} />
      <div class="rotate-hint">태블릿을 가로로 돌려주세요!</div>
    </div>`;
  }

  let screen;
  if (view.name === 'map') {
    screen = html`<${WorldMap} data=${data} progress=${progress} onPlay=${playStage}
      user=${user} onLogout=${logout} onCollection=${() => setView({ name: 'collection' })} />`;
  } else if (view.name === 'collection') {
    screen = html`<${Collection} progress=${progress} onBack=${() => setView({ name: 'map' })} />`;
  } else if (view.name === 'play') {
    screen = html`<${StagePlay}
      key=${view.stage.n}
      stage=${view.stage}
      world=${view.stage.world}
      onExit=${() => setView({ name: 'map' })}
      onComplete=${(result) => completeStage(view.stage, result)} />`;
  } else if (view.name === 'result') {
    const next = data.stages.find((s) => s.n === view.stage.n + 1);
    screen = html`<${ResultScreen}
      stage=${view.stage}
      result=${view.result}
      world=${view.stage.world}
      discovery=${view.discovery || null}
      onMap=${() => setView({ name: 'map' })}
      onRetry=${() => setView({ name: 'play', stage: view.stage })}
      onNext=${() => next ? setView({ name: 'play', stage: next }) : setView({ name: 'map' })} />`;
  }

  return html`<div>
    ${screen}
    <div class="rotate-hint">태블릿을 가로로 돌려주세요!</div>
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
