// =============================================================================
// characters.mjs — 오리지널 마스코트 캐릭터 (SVG)
//
// ※ 저작권 안전: 요청하신 IP(포켓몬/마블/카봇/미니특공대)를 베끼지 않고,
//   각 장르 "무드"만 연상시키는 자체 디자인입니다. 이름/로고도 오리지널.
//   - dino   : 공룡 (W1 공룡 알 마을)
//   - carbot : 변신 로봇/자동차 (W2 변신 정비소)  → 카봇 무드
//   - ranger : 미니 특공대원 (W3 특공대 기지)     → 미니특공대 무드
//   - hero   : 망토 슈퍼히어로 (W4 히어로 시티)   → 마블 무드
//   - spark  : 전기 몬스터 (W5 몬스터 도감)       → 포켓몬 무드
//   - aqua/flora/flame : 수집용 몬스터들
// =============================================================================
import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';
const html = htm.bind(React.createElement);

export const WORLD_THEME = {
  1: { mascot: 'dino',   name: '콩룡',     c1: '#e4f7c8', c2: '#8fd14f', accent: '#5aa02c' },
  2: { mascot: 'carbot', name: '부릉봇',   c1: '#d4e4ff', c2: '#5b8def', accent: '#2f5fd0' },
  3: { mascot: 'ranger', name: '레드대장', c1: '#ffdada', c2: '#ff6b6b', accent: '#d63a3a' },
  4: { mascot: 'hero',   name: '캡틴스타', c1: '#ece2ff', c2: '#9b6dff', accent: '#6a3fd0' },
  5: { mascot: 'spark',  name: '삐까',     c1: '#fff2c4', c2: '#ffce4f', accent: '#e0a400' },
};

// 수집 도감용 전체 캐릭터 목록
export const COLLECTION = ['dino', 'carbot', 'ranger', 'hero', 'spark', 'aqua', 'flora', 'flame'];
export const CHAR_NAME = {
  dino: '콩룡', carbot: '부릉봇', ranger: '레드대장', hero: '캡틴스타',
  spark: '삐까', aqua: '아쿠아', flora: '플로라', flame: '불꽃이',
};

// 공통 얼굴 (눈/볼/입). cx 중심, ey 눈높이
function face(ey = 44, dx = 11, my = 58, smile = true) {
  return html`<g>
    <ellipse cx=${50 - dx} cy=${ey} rx="6.5" ry="7.5" fill="#fff" />
    <ellipse cx=${50 + dx} cy=${ey} rx="6.5" ry="7.5" fill="#fff" />
    <circle cx=${50 - dx + 1} cy=${ey + 1} r="3.4" fill="#2b2b3a" />
    <circle cx=${50 + dx + 1} cy=${ey + 1} r="3.4" fill="#2b2b3a" />
    <circle cx=${50 - dx + 2.4} cy=${ey - 0.6} r="1.2" fill="#fff" />
    <circle cx=${50 + dx + 2.4} cy=${ey - 0.6} r="1.2" fill="#fff" />
    <circle cx=${50 - dx - 4} cy=${ey + 7} r="3.2" fill="#ff9a9a" opacity="0.7" />
    <circle cx=${50 + dx + 4} cy=${ey + 7} r="3.2" fill="#ff9a9a" opacity="0.7" />
    ${smile
      ? html`<path d=${`M ${50 - 7} ${my} Q 50 ${my + 6} ${50 + 7} ${my}`} stroke="#2b2b3a" stroke-width="2.4" fill="none" stroke-linecap="round" />`
      : null}
  </g>`;
}

function Dino({ t }) {
  return html`<g>
    <path d="M70 70 Q 92 60 84 44 Q 80 56 70 58 Z" fill=${t.c2} />
    <polygon points="40,20 46,30 34,30" fill=${t.accent} />
    <polygon points="50,16 57,28 43,28" fill=${t.accent} />
    <polygon points="60,20 66,30 54,30" fill=${t.accent} />
    <ellipse cx="50" cy="55" rx="30" ry="28" fill=${t.c2} />
    <ellipse cx="50" cy="62" rx="18" ry="17" fill=${t.c1} />
    <rect x="33" y="78" width="12" height="14" rx="6" fill=${t.c2} />
    <rect x="55" y="78" width="12" height="14" rx="6" fill=${t.c2} />
    ${face(46, 11, 60)}
  </g>`;
}

function Carbot({ t }) {
  return html`<g>
    <line x1="50" y1="14" x2="50" y2="24" stroke=${t.accent} stroke-width="2.5" />
    <circle cx="50" cy="12" r="4" fill=${t.accent} />
    <circle cx="30" cy="82" r="11" fill="#2b2b3a" /><circle cx="30" cy="82" r="4.5" fill="#cfd6e0" />
    <circle cx="70" cy="82" r="11" fill="#2b2b3a" /><circle cx="70" cy="82" r="4.5" fill="#cfd6e0" />
    <rect x="20" y="34" width="60" height="46" rx="16" fill=${t.c2} />
    <rect x="27" y="40" width="46" height="20" rx="10" fill="#1f2b45" />
    <circle cx="40" cy="50" r="5.5" fill="#5ad9ff" /><circle cx="60" cy="50" r="5.5" fill="#5ad9ff" />
    <circle cx="40" cy="50" r="2" fill="#fff" /><circle cx="60" cy="50" r="2" fill="#fff" />
    <polygon points="50,64 55,72 45,72" fill="#ffd54f" />
    <circle cx="24" cy="72" r="3" fill="#ffd54f" /><circle cx="76" cy="72" r="3" fill="#ffd54f" />
  </g>`;
}

function Ranger({ t }) {
  return html`<g>
    <rect x="36" y="58" width="28" height="30" rx="10" fill=${t.c2} />
    <rect x="32" y="62" width="8" height="20" rx="4" fill=${t.c2} />
    <rect x="60" y="62" width="8" height="20" rx="4" fill=${t.c2} />
    <rect x="40" y="84" width="8" height="10" rx="4" fill="#2b2b3a" />
    <rect x="52" y="84" width="8" height="10" rx="4" fill="#2b2b3a" />
    <rect x="38" y="70" width="24" height="6" fill="#fff" />
    <polygon points="50,66 54,73 46,73" fill="#ffd54f" />
    <ellipse cx="50" cy="40" rx="22" ry="21" fill=${t.c2} />
    <path d="M30 40 a20 20 0 0 1 40 0 Z" fill=${t.accent} opacity="0.25" />
    <rect x="33" y="36" width="34" height="12" rx="6" fill="#1f2b45" />
    <circle cx="43" cy="42" r="3.2" fill="#5ad9ff" /><circle cx="57" cy="42" r="3.2" fill="#5ad9ff" />
    <rect x="46" y="20" width="8" height="6" rx="2" fill="#fff" />
  </g>`;
}

function Hero({ t }) {
  return html`<g>
    <polygon points="32,40 68,40 76,86 24,86" fill=${t.accent} />
    <ellipse cx="50" cy="58" rx="22" ry="24" fill=${t.c2} />
    <polygon points="50,46 54,56 64,56 56,62 59,72 50,66 41,72 44,62 36,56 46,56" fill="#fff" />
    <rect x="34" y="80" width="12" height="12" rx="5" fill=${t.c2} />
    <rect x="54" y="80" width="12" height="12" rx="5" fill=${t.c2} />
    <circle cx="50" cy="30" r="17" fill="#ffe0bd" />
    <path d="M33 28 q17 -12 34 0 l0 6 q-17 -8 -34 0 Z" fill=${t.c2} />
    <circle cx="43" cy="30" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="30" r="2.6" fill="#2b2b3a" />
    <path d="M45 36 Q50 39 55 36" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>`;
}

function Spark({ t }) {
  return html`<g>
    <polygon points="22,40 8,30 18,38 6,46" fill="#ffd54f" stroke=${t.accent} stroke-width="1.5" />
    <path d="M28 28 L20 8 L30 22 L34 24 Z" fill=${t.c2} stroke=${t.accent} stroke-width="1.5" />
    <path d="M72 28 L80 8 L70 22 L66 24 Z" fill=${t.c2} stroke=${t.accent} stroke-width="1.5" />
    <circle cx="28" cy="22" r="3" fill="#2b2b3a" /><circle cx="72" cy="22" r="3" fill="#2b2b3a" />
    <ellipse cx="50" cy="55" rx="27" ry="26" fill=${t.c2} />
    <circle cx="33" cy="58" r="4.5" fill="#ff6b6b" /><circle cx="67" cy="58" r="4.5" fill="#ff6b6b" />
    ${face(48, 12, 64)}
  </g>`;
}

function Blob({ c2, c1, accent, topper }) {
  return html`<g>
    ${topper}
    <ellipse cx="50" cy="58" rx="28" ry="27" fill=${c2} />
    <ellipse cx="50" cy="64" rx="16" ry="14" fill=${c1} />
    ${face(50, 11, 66)}
  </g>`;
}

function Aqua() {
  return Blob({
    c2: '#5bc8ff', c1: '#d6f2ff', accent: '#2f8fd0',
    topper: html`<path d="M50 18 q-8 12 0 18 q8 -6 0 -18Z" fill="#bfe9ff" />`,
  });
}
function Flora() {
  return Blob({
    c2: '#7bd88f', c1: '#e0f7d8', accent: '#4caf72',
    topper: html`<g><line x1="50" y1="20" x2="50" y2="32" stroke="#4caf72" stroke-width="3" />
      <path d="M50 22 q12 -8 16 2 q-12 6 -16 -2Z" fill="#7bd88f" /></g>`,
  });
}
function Flame() {
  return Blob({
    c2: '#ff9a52', c1: '#ffe0c4', accent: '#e0662a',
    topper: html`<path d="M50 14 q10 12 0 22 q-10 -10 0 -22Z" fill="#ff6b3d" />`,
  });
}

const RENDER = { dino: Dino, carbot: Carbot, ranger: Ranger, hero: Hero, spark: Spark };

export function Character({ kind = 'dino', size = 80, anim = 'float', world, style }) {
  const t = WORLD_THEME[world] || WORLD_THEME[1];
  let inner;
  if (kind === 'aqua') inner = Aqua();
  else if (kind === 'flora') inner = Flora();
  else if (kind === 'flame') inner = Flame();
  else {
    const C = RENDER[kind] || Dino;
    // 캐릭터별 고유 테마(월드 무관) 매핑
    const own = { dino: 1, carbot: 2, ranger: 3, hero: 4, spark: 5 }[kind];
    inner = html`<${C} t=${WORLD_THEME[own] || t} />`;
  }
  return html`<svg class=${`char anim-${anim}`} width=${size} height=${size} viewBox="0 0 100 100"
    style=${{ overflow: 'visible', ...(style || {}) }}>${inner}</svg>`;
}
