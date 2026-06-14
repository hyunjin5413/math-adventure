// =============================================================================
// curriculum.mjs — 100 스테이지 마스터 정의 (PRD §4.3 / §4.4 / §4.5)
//
// 5 월드 × 20 스테이지 = 100. 각 월드의 10번째=미니복습, 20번째=보스전.
// 설계 원칙(PRD §4.1): 수감각 우선 / CRA(구체→표상→추상) / 작은 단계 적층 /
//                       간격 반복 / 적응형 / 무감점.
//
// 스테이지 한 칸의 형태:
//   {
//     n, world, stageInWorld, type,           // 위치/종류
//     title, concept,                         // 표시용
//     phase,                                  // 소속 Phase
//     primary: { skill, params, input },      // 핵심 개념(스테이지당 1개)
//     review: [skill...],                     // 간격 반복용 직전 개념 풀
//     problemCount, reviewRatio,              // 문제 수 / 복습 비율
//     reward                                  // 보상(도감/조각/별)
//   }
// =============================================================================

export const WORLDS = [
  { id: 1, name: 'W1 공룡 알 마을', mood: '공룡', icon: '🥚', range: [1, 20] },
  { id: 2, name: 'W2 변신 정비소', mood: '변신 로봇', icon: '🤖', range: [21, 40] },
  { id: 3, name: 'W3 특공대 기지', mood: '특공대', icon: '🚀', range: [41, 60] },
  { id: 4, name: 'W4 히어로 시티', mood: '히어로', icon: '🦸', range: [61, 80] },
  { id: 5, name: 'W5 몬스터 도감', mood: '수집형 몬스터', icon: '👾', range: [81, 100] },
];

// 핵심 개념만 적은 압축 정의. 미니복습(10번째)·보스(20번째)는 자동 생성한다.
// 각 항목: [stageInWorld, title, skill, params, input?]
const W1 = [
  [1, '0~5 수 세기', 'count_objects', { min: 1, max: 5 }, 'tap_count'],
  [2, '0~10 수 세기', 'count_objects', { min: 1, max: 10 }, 'tap_count'],
  [3, '숫자 인식 0~10', 'number_recognition', { min: 0, max: 10 }],
  [4, '0~20 수 세기', 'count_objects', { min: 5, max: 20 }, 'tap_count'],
  [5, '수 크기 비교(0~10)', 'compare', { max: 10 }],
  [6, '수 크기 비교(0~20)', 'compare', { max: 20 }],
  [7, '그림 덧셈(합 5 이하)', 'add_within_10', { maxSum: 5, concrete: true }, 'tap_count'],
  [8, '그림 덧셈(합 10 이하)', 'add_within_10', { maxSum: 10, concrete: true }, 'choice'],
  [9, '그림 덧셈 연습', 'add_within_10', { maxSum: 10, concrete: true }, 'choice'],
  // 10: 미니 복습 (자동)
  [11, '숫자식 덧셈(합 10 이하)', 'add_within_10', { maxSum: 10 }, 'choice'],
  [12, '숫자식 덧셈 연습 1', 'add_within_10', { maxSum: 10 }, 'keypad'],
  [13, '숫자식 덧셈 연습 2', 'add_within_10', { maxSum: 10 }, 'keypad'],
  [14, '숫자식 덧셈 연습 3', 'add_within_10', { maxSum: 10 }, 'keypad'],
  [15, '10 만들기', 'make_10', {}, 'choice'],
  [16, '10 만들기 연습', 'make_10', {}, 'drag_match'],
  [17, '수 모으기', 'compose', { maxSum: 10 }, 'choice'],
  [18, '수 모으기/가르기', 'compose', { maxSum: 10 }, 'keypad'],
  [19, '종합 연습', 'mixed', { pool: ['add_within_10', 'make_10', 'compose'] }],
  // 20: 보스전 (자동)
];

const W2 = [
  [21, '덧셈 복습(합 10 이하)', 'add_within_10', { maxSum: 10 }, 'keypad'],
  [22, '세 수 덧셈', 'add_three', { maxSum: 10 }, 'keypad'],
  [23, '수 가르기', 'decompose', { min: 4, max: 10 }, 'choice'],
  [24, '그림 뺄셈 입문', 'sub_within_10', { maxA: 10, concrete: true }, 'tap_count'],
  [25, '숫자식 뺄셈 1', 'sub_within_10', { maxA: 10 }, 'choice'],
  [26, '숫자식 뺄셈 2', 'sub_within_10', { maxA: 10 }, 'keypad'],
  [27, '10에서 빼기', 'sub_from_10', {}, 'keypad'],
  [28, '가르기/모으기 연계', 'decompose', { min: 5, max: 10 }, 'drag_match'],
  [29, '덧셈·뺄셈 종합', 'mixed', { pool: ['add_within_10', 'sub_within_10'] }],
  // 30: 미니 복습
  [31, '뺄셈 심화', 'sub_within_10', { maxA: 10 }, 'keypad'],
  [32, '덧셈 빈칸 채우기', 'add_missing', { maxSum: 10 }, 'fill_blank'],
  [33, '뺄셈 빈칸 채우기', 'sub_missing', { max: 10 }, 'fill_blank'],
  [34, '덧셈·뺄셈 관계(수 가족)', 'mixed', { pool: ['add_missing', 'sub_missing'] }],
  [35, '10 가르기', 'decompose', { min: 10, max: 10 }, 'choice'],
  [36, '합·차 혼합', 'mixed', { pool: ['add_within_10', 'sub_within_10', 'sub_from_10'] }],
  [37, '문장형 그림(모으기)', 'compose', { maxSum: 10 }, 'choice'],
  [38, '종합 연습 1', 'mixed', { pool: ['add_within_10', 'sub_within_10', 'make_10'] }],
  [39, '종합 연습 2', 'mixed', { pool: ['sub_within_10', 'sub_from_10', 'decompose'] }],
  // 40: 보스전
];

const W3 = [
  [41, '10 채우기 전략 복습', 'make_10', {}, 'choice'],
  [42, '받아올림 9 + □', 'add_carry', { firstAddend: 9 }, 'keypad'],
  [43, '받아올림 8 + □', 'add_carry', { firstAddend: 8 }, 'keypad'],
  [44, '받아올림 6·7 + □', 'add_carry', {}, 'keypad'],
  [45, '받아올림 종합 1', 'add_carry', {}, 'choice'],
  [46, '받아올림 연습', 'add_carry', {}, 'keypad'],
  [47, '받아올림 빈칸 채우기', 'add_carry', {}, 'fill_blank'],
  [48, '받아올림 종합 2', 'add_carry', {}, 'keypad'],
  [49, '받아올림 종합 연습', 'add_carry', {}, 'keypad'],
  // 50: 미니 복습
  [51, '받아내림 입문', 'sub_borrow', {}, 'keypad'],
  [52, '받아내림 13 - □', 'sub_borrow', {}, 'keypad'],
  [53, '받아내림 연습 1', 'sub_borrow', {}, 'choice'],
  [54, '받아내림 연습 2', 'sub_borrow', {}, 'keypad'],
  [55, '받아내림 종합', 'sub_borrow', {}, 'keypad'],
  [56, '받아내림 빈칸 채우기', 'sub_borrow', {}, 'fill_blank'],
  [57, '받아올림·받아내림 혼합', 'mixed', { pool: ['add_carry', 'sub_borrow'] }],
  [58, '문장형(받아올림/내림)', 'mixed', { pool: ['add_carry', 'sub_borrow'] }],
  [59, '종합 연습', 'mixed', { pool: ['add_carry', 'sub_borrow'] }],
  // 60: 보스전
];

const W4 = [
  [61, '두 자리 수 자리값', 'place_value', {}, 'choice'],
  [62, '두 자리 + 한 자리(받아올림 없음)', 'two_digit_add_one', { carry: false }, 'keypad'],
  [63, '두 자리 + 한 자리(받아올림)', 'two_digit_add_one', { carry: true }, 'keypad'],
  [64, '두 자리 + 두 자리(받아올림 없음)', 'two_digit_add_two', { carry: false }, 'keypad'],
  [65, '두 자리 + 두 자리(받아올림)', 'two_digit_add_two', { carry: true }, 'keypad'],
  [66, '두 자리 - 한 자리', 'two_digit_sub', { max: 99 }, 'keypad'],
  [67, '두 자리 - 두 자리', 'two_digit_sub', { max: 99, twoDigitSub: true }, 'keypad'],
  [68, '두 자리 연산 혼합', 'mixed', { pool: ['two_digit_add_two', 'two_digit_sub'] }],
  [69, '두 자리 종합 연습', 'mixed', { pool: ['two_digit_add_one', 'two_digit_add_two', 'two_digit_sub'] }],
  // 70: 미니 복습
  [71, '2씩 뛰어 세기', 'skip_count', { step: 2 }, 'fill_blank'],
  [72, '5씩 뛰어 세기', 'skip_count', { step: 5 }, 'fill_blank'],
  [73, '10씩 뛰어 세기', 'skip_count', { step: 10 }, 'fill_blank'],
  [74, '묶어 세기', 'group_count', { maxPer: 5, maxGroups: 5 }, 'choice'],
  [75, '같은 수 반복 더하기', 'repeated_add', { maxA: 5, maxN: 5 }, 'keypad'],
  [76, '배 개념', 'times_concept', {}, 'choice'],
  [77, '반복 덧셈 → 곱셈식', 'repeated_to_mult', {}, 'choice'],
  [78, '곱셈 의미 다지기', 'times_concept', {}, 'keypad'],
  [79, '곱셈 준비 종합', 'mixed', { pool: ['skip_count', 'group_count', 'repeated_add', 'times_concept'] }],
  // 80: 보스전
];

const W5 = [
  [81, '곱셈의 의미(배열)', 'mult_concept', {}, 'choice'],
  [82, '구구단 2단', 'multiplication', { dan: 2 }, 'keypad'],
  [83, '구구단 5단', 'multiplication', { dan: 5 }, 'keypad'],
  [84, '2·5단 종합', 'multiplication', { dan: [2, 5] }, 'choice'],
  [85, '구구단 3단', 'multiplication', { dan: 3 }, 'keypad'],
  [86, '구구단 4단', 'multiplication', { dan: 4 }, 'keypad'],
  [87, '3·4단 종합', 'multiplication', { dan: [3, 4] }, 'choice'],
  [88, '구구단 6단', 'multiplication', { dan: 6 }, 'keypad'],
  [89, '구구단 7단', 'multiplication', { dan: 7 }, 'keypad'],
  // 90: 미니 복습 (2~7단)
  [91, '구구단 8단', 'multiplication', { dan: 8 }, 'keypad'],
  [92, '구구단 9단', 'multiplication', { dan: 9 }, 'keypad'],
  [93, '6~9단 종합', 'multiplication', { dan: [6, 7, 8, 9] }, 'choice'],
  [94, '곱셈 빈칸 채우기', 'mult_missing', { dan: [2, 3, 4, 5] }, 'fill_blank'],
  [95, '곱셈 문장제', 'mult_word', { dan: [2, 3, 4, 5, 6] }, 'keypad'],
  [96, '2~9단 혼합 1', 'multiplication', { dan: [2, 3, 4, 5, 6, 7, 8, 9] }, 'keypad'],
  [97, '2~9단 혼합 2', 'multiplication', { dan: [2, 3, 4, 5, 6, 7, 8, 9] }, 'choice'],
  [98, '곱셈 종합(문장+식)', 'mixed', { pool: ['multiplication', 'mult_word', 'mult_missing'] }],
  [99, '곱셈 종합 연습', 'mixed', { pool: ['multiplication', 'mult_word'] }],
  // 100: 최종 보스전
];

const RAW = { 1: W1, 2: W2, 3: W3, 4: W4, 5: W5 };

// 보스전이 종합 출제할 월드 핵심 스킬 풀 (PRD §4.5)
const BOSS_POOL = {
  1: ['add_within_10', 'make_10', 'compose', 'count_objects'],
  2: ['add_within_10', 'sub_within_10', 'sub_from_10', 'decompose'],
  3: ['add_carry', 'sub_borrow'],
  4: ['two_digit_add_two', 'two_digit_sub', 'group_count', 'times_concept'],
  5: ['multiplication', 'mult_word', 'mult_concept'],
};

import { SKILLS } from './skills.mjs';

// 직전 9개 스테이지의 핵심 스킬들을 펼쳐 미니 복습 풀을 만든다.
function reviewPoolBefore(stages, stageInWorld) {
  const pool = new Set();
  for (const s of stages) {
    if (s.stageInWorld >= stageInWorld) continue;
    if (s.primary.skill === 'mixed') (s.primary.params.pool || []).forEach((x) => pool.add(x));
    else pool.add(s.primary.skill);
  }
  return [...pool];
}

export function buildCurriculum() {
  const all = [];
  for (const world of WORLDS) {
    const wid = world.id;
    const raw = RAW[wid];
    const stages = [];

    // 1) 일반 스테이지(핵심 개념) 먼저 적재
    //    raw의 첫 칸은 "전역 스테이지 번호"(n). 월드 내 번호는 range로 환산한다.
    for (const [gn, title, skill, params = {}, input] of raw) {
      const phase = skill === 'mixed' ? phaseOfPool(params.pool) : SKILLS[skill].phase;
      stages.push({
        n: gn,
        world: wid,
        stageInWorld: gn - world.range[0] + 1,
        type: 'normal',
        title,
        concept: title,
        phase,
        primary: { skill, params, input: input || defaultInput(skill, params) },
        review: [],
        problemCount: 20,
        reviewRatio: gn - world.range[0] + 1 <= 2 ? 0 : 0.2, // 월드 초반은 복습 0, 이후 20% 간격 반복
        reward: { kind: 'shard', mood: world.mood, amount: 1 },
      });
    }

    // 2) 미니 복습(10번째) / 보스전(20번째) 삽입
    const mini = {
      n: world.range[0] + 9, world: wid, stageInWorld: 10, type: 'mini_review',
      title: '미니 복습', concept: '직전 개념 섞어 풀기',
      phase: stages[0].phase,
      primary: { skill: 'mixed', params: { pool: reviewPoolBefore(stages, 10) }, input: 'choice' },
      review: [], problemCount: 15, reviewRatio: 0,
      reward: { kind: 'shard', mood: world.mood, amount: 2 },
    };
    const boss = {
      n: world.range[1], world: wid, stageInWorld: 20, type: 'boss',
      title: wid === 5 ? '최종 보스전' : '보스전', concept: '월드 핵심 개념 종합',
      phase: stages[stages.length - 1].phase,
      primary: { skill: 'mixed', params: { pool: BOSS_POOL[wid] }, input: 'mixed' },
      review: [], problemCount: 20, reviewRatio: 0,
      reward: { kind: 'rare_character', mood: world.mood, amount: 1, condition: 'clear' },
    };

    // 3) 간격 반복: 각 일반 스테이지의 review 풀 = 같은 월드에서 그 이전에 나온 스킬
    for (const s of stages) {
      if (s.reviewRatio > 0) s.review = reviewPoolBefore(stages, s.stageInWorld);
    }

    const merged = [...stages, mini, boss].sort((a, b) => a.stageInWorld - b.stageInWorld);
    all.push(...merged);
  }
  return all.sort((a, b) => a.n - b.n);
}

function phaseOfPool(pool = []) {
  const phases = pool.map((s) => SKILLS[s]?.phase ?? 0);
  return Math.max(0, ...phases);
}

function defaultInput(skill, params) {
  const s = SKILLS[skill];
  if (!s) return 'choice';
  return s.inputs[0];
}
