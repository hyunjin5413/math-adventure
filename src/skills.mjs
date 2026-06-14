// =============================================================================
// skills.mjs — 개념(스킬) 단위 문제 생성기 + 오답 보기(distractor) 규칙
//
// PRD §4.2(Phase), §6.2(문제 유형), §6.3(힌트), §12(자동 생성/문제 풀)을 코드화.
// 각 스킬은 다음을 정의한다:
//   - phase     : 소속 Phase (0~6)
//   - label     : 사람이 읽는 개념 이름
//   - inputs    : 이 개념에 적합한 입력 방식 후보 (PRD §6.2)
//   - gen(p,rng): 파라미터 p와 시드 RNG로 문제 1개의 "코어"를 생성
//   - distract  : (선택) 숫자 답에 대한 오답 후보 목록 규칙
//
// gen()이 돌려주는 코어 형태:
//   {
//     kind: 'num' | 'sym' | 'expr',   // 답의 종류
//     operands: [...],                // 분석/검수용 피연산자
//     operator: '+',                  // 분석/검수용 연산
//     answer: 8 | '>' | '3×4',        // 정답
//     promptText: '6 + 2 = ?',        // 화면 표시 텍스트(짧게)
//     ttsText: '6 더하기 2는 얼마일까요?', // 음성 안내(읽기 능력 보조, §8.3)
//     visual: {...} | null,           // 시각 보조(사물/텐프레임/배열/수직선)
//     distractors: [..],              // 오답 후보(보기형일 때 사용)
//     hintRef: 'make_ten'             // 힌트 타입 키(§6.3)
//   }
// =============================================================================

// ---- 시드 기반 결정적 난수 (재현 가능한 콘텐츠 생성을 위해) --------------------
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ri = (rng, min, max) => min + Math.floor(rng() * (max - min + 1)); // 정수 [min,max]
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
export function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 숫자 보기 만들기: 정답 + 유효/유일한 오답 후보로 보기 구성
export function buildNumChoices(rng, answer, candidates, count, { min = 0, max = 999 } = {}) {
  const seen = new Set([answer]);
  const out = [];
  for (const c of candidates) {
    if (out.length >= count - 1) break;
    if (!Number.isInteger(c) || c === answer || c < min || c > max || seen.has(c)) continue;
    seen.add(c); out.push(c);
  }
  let guard = 0;
  while (out.length < count - 1 && guard++ < 200) {
    const c = answer + ri(rng, -Math.max(2, count), Math.max(2, count));
    if (c === answer || c < min || c > max || seen.has(c)) continue;
    seen.add(c); out.push(c);
  }
  return shuffle(rng, [answer, ...out]);
}

// =============================================================================
// 스킬 레지스트리
// =============================================================================
export const SKILLS = {
  // ---- Phase 0: 수 감각 ------------------------------------------------------
  count_objects: {
    phase: 0, label: '사물 세기', inputs: ['tap_count', 'choice'],
    gen(p, rng) {
      const n = ri(rng, p.min ?? 1, p.max ?? 10);
      return {
        kind: 'num', operands: [n], operator: 'count', answer: n,
        promptText: '모두 몇 개일까요?',
        ttsText: '그림을 세어 보세요. 모두 몇 개일까요?',
        visual: { type: 'objects', count: n },
        distractors: [n + 1, n - 1, n + 2, n - 2],
        hintRef: 'count_one_by_one',
      };
    },
  },

  number_recognition: {
    phase: 0, label: '숫자 인식', inputs: ['choice'],
    gen(p, rng) {
      const n = ri(rng, p.min ?? 0, p.max ?? 10);
      const confus = { 6: 9, 9: 6, 2: 5, 5: 2, 0: 8, 8: 0, 3: 8, 7: 1, 1: 7 };
      return {
        kind: 'num', operands: [n], operator: 'read', answer: n,
        promptText: '이 숫자를 찾아보세요',
        ttsText: `${numKo(n)}은(는) 어떤 숫자일까요?`,
        visual: { type: 'spoken_number', value: n },
        distractors: [confus[n], n + 1, n - 1, n + 2].filter((x) => x != null),
        hintRef: null,
      };
    },
  },

  compare: {
    phase: 0, label: '수 크기 비교', inputs: ['choice'],
    gen(p, rng) {
      const max = p.max ?? 10;
      const a = ri(rng, 0, max);
      const b = ri(rng, 0, max);
      const answer = a > b ? '>' : a < b ? '<' : '=';
      return {
        kind: 'sym', operands: [a, b], operator: 'compare', answer,
        promptText: `${a} □ ${b}`,
        ttsText: `${numKo(a)}와 ${numKo(b)} 중 어느 것이 더 클까요?`,
        visual: { type: 'compare_groups', a, b },
        choices: ['>', '<', '='],
        hintRef: 'number_line',
      };
    },
  },

  // ---- Phase 1: 한 자리 덧셈 --------------------------------------------------
  add_within_10: {
    phase: 1, label: '합 10 이하 덧셈', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const maxSum = p.maxSum ?? 10;
      const a = ri(rng, p.minA ?? 0, p.maxA ?? maxSum);
      const b = ri(rng, 0, Math.max(0, maxSum - a));
      const answer = a + b;
      return {
        kind: 'num', operands: [a, b], operator: '+', answer,
        promptText: `${a} + ${b} = ?`,
        ttsText: `${numKo(a)} 더하기 ${numKo(b)}는 얼마일까요?`,
        visual: p.concrete ? { type: 'objects_add', a, b } : { type: 'ten_frame_add', a, b },
        distractors: [answer + 1, answer - 1, Math.abs(a - b), answer + 2],
        hintRef: 'count_on',
      };
    },
  },

  make_10: {
    phase: 1, label: '10 만들기(짝)', inputs: ['choice', 'drag_match'],
    gen(p, rng) {
      const a = ri(rng, 1, 9);
      const answer = 10 - a;
      return {
        kind: 'num', operands: [a], operator: 'make10', answer,
        promptText: `${a} 와(과) 짝을 이뤄 10을 만드는 수는?`,
        ttsText: `${numKo(a)}와 짝을 이뤄 십을 만드는 수는 무엇일까요?`,
        visual: { type: 'ten_frame', filled: a },
        distractors: [answer + 1, answer - 1, a, answer + 2],
        hintRef: 'make_ten',
      };
    },
  },

  compose: {
    phase: 1, label: '수 모으기', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const maxSum = p.maxSum ?? 10;
      const a = ri(rng, 1, maxSum - 1);
      const b = ri(rng, 1, maxSum - a);
      const answer = a + b;
      return {
        kind: 'num', operands: [a, b], operator: 'compose', answer,
        promptText: `${a} 와(과) ${b} 를 모으면?`,
        ttsText: `${numKo(a)}와 ${numKo(b)}를 모으면 얼마일까요?`,
        visual: { type: 'compose_bond', a, b },
        distractors: [answer + 1, answer - 1, Math.abs(a - b)],
        hintRef: 'number_bond',
      };
    },
  },

  // ---- Phase 2: 한 자리 뺄셈 --------------------------------------------------
  sub_within_10: {
    phase: 2, label: '10 이하 뺄셈', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const a = ri(rng, p.minA ?? 2, p.maxA ?? 10);
      const b = ri(rng, 0, a);
      const answer = a - b;
      return {
        kind: 'num', operands: [a, b], operator: '-', answer,
        promptText: `${a} - ${b} = ?`,
        ttsText: `${numKo(a)} 빼기 ${numKo(b)}는 얼마일까요?`,
        visual: p.concrete ? { type: 'objects_sub', a, b } : { type: 'ten_frame_sub', a, b },
        distractors: [answer + 1, answer - 1, a + b, b],
        hintRef: 'count_back',
      };
    },
  },

  sub_from_10: {
    phase: 2, label: '10에서 빼기', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const b = ri(rng, 1, 9);
      const answer = 10 - b;
      return {
        kind: 'num', operands: [10, b], operator: '-', answer,
        promptText: `10 - ${b} = ?`,
        ttsText: `십 빼기 ${numKo(b)}는 얼마일까요?`,
        visual: { type: 'ten_frame_sub', a: 10, b },
        distractors: [answer + 1, answer - 1, b, 10 - b + 1],
        hintRef: 'make_ten',
      };
    },
  },

  decompose: {
    phase: 2, label: '수 가르기', inputs: ['choice', 'drag_match'],
    gen(p, rng) {
      const n = ri(rng, p.min ?? 4, p.max ?? 10);
      const a = ri(rng, 1, n - 1);
      const answer = n - a;
      return {
        kind: 'num', operands: [n, a], operator: 'decompose', answer,
        promptText: `${n} 은(는) ${a} 와(과) 몇으로 가를 수 있나요?`,
        ttsText: `${numKo(n)}은 ${numKo(a)}와 몇으로 가를 수 있을까요?`,
        visual: { type: 'decompose_bond', whole: n, part: a },
        distractors: [answer + 1, answer - 1, a, n],
        hintRef: 'number_bond',
      };
    },
  },

  add_three: {
    phase: 1, label: '세 수 덧셈', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const maxSum = p.maxSum ?? 10;
      const a = ri(rng, 1, maxSum - 2);
      const b = ri(rng, 1, maxSum - a - 1);
      const c = ri(rng, 1, maxSum - a - b);
      const answer = a + b + c;
      return {
        kind: 'num', operands: [a, b, c], operator: '+', answer,
        promptText: `${a} + ${b} + ${c} = ?`,
        ttsText: `${numKo(a)} 더하기 ${numKo(b)} 더하기 ${numKo(c)}는 얼마일까요?`,
        visual: { type: 'ten_frame', filled: answer },
        distractors: [answer + 1, answer - 1, a + b, b + c],
        hintRef: 'make_ten',
      };
    },
  },

  add_missing: {
    phase: 1, label: '덧셈 빈칸 채우기', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const maxSum = p.maxSum ?? 10;
      const total = ri(rng, 2, maxSum);
      const known = ri(rng, 0, total);
      const answer = total - known;
      const blankFirst = rng() < 0.5;
      return {
        kind: 'num', operands: [known, total], operator: '+missing', answer,
        promptText: blankFirst ? `□ + ${known} = ${total}` : `${known} + □ = ${total}`,
        ttsText: `네모 안에 들어갈 수는 무엇일까요?`,
        visual: { type: 'ten_frame', filled: known },
        distractors: [answer + 1, answer - 1, total, known],
        hintRef: 'count_on',
      };
    },
  },

  sub_missing: {
    phase: 2, label: '뺄셈 빈칸 채우기', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const a = ri(rng, 3, p.max ?? 10);
      const result = ri(rng, 0, a - 1);
      const answer = a - result; // a - □ = result  →  □ = a - result
      return {
        kind: 'num', operands: [a, result], operator: '-missing', answer,
        promptText: `${a} - □ = ${result}`,
        ttsText: `네모 안에 들어갈 수는 무엇일까요?`,
        visual: { type: 'ten_frame_sub', a, b: answer },
        distractors: [answer + 1, answer - 1, result, a],
        hintRef: 'count_back',
      };
    },
  },

  // ---- Phase 3: 받아올림 / 받아내림 ------------------------------------------
  add_carry: {
    phase: 3, label: '받아올림 덧셈', inputs: ['keypad', 'choice', 'fill_blank'],
    gen(p, rng) {
      // 합이 11~18, 두 한 자리 수, 받아올림 발생
      const fixed = p.firstAddend; // 예: 9, 8 (gap-to-ten 전략 연습용)
      let a, b;
      let guard = 0;
      do {
        a = fixed ?? ri(rng, 5, 9);
        b = ri(rng, 2, 9);
        guard++;
      } while ((a + b <= 10 || a + b > 18) && guard < 50);
      const answer = a + b;
      return {
        kind: 'num', operands: [a, b], operator: '+', answer,
        promptText: `${a} + ${b} = ?`,
        ttsText: `${numKo(a)} 더하기 ${numKo(b)}는 얼마일까요?`,
        visual: { type: 'ten_frame_add', a, b, twoFrames: true },
        // 대표 오답: 받아올림 무시(일의 자리만), ±1, 10 빼먹기
        distractors: [(a + b) % 10, answer - 10, answer + 1, answer - 1],
        hintRef: 'make_ten',
      };
    },
  },

  sub_borrow: {
    phase: 3, label: '받아내림 뺄셈', inputs: ['keypad', 'choice', 'fill_blank'],
    gen(p, rng) {
      // (10+x) - y, 받아내림 발생: 일의 자리 x < y
      let minuend, sub, x, y;
      let guard = 0;
      do {
        minuend = ri(rng, 11, 18);
        x = minuend - 10; // 일의 자리
        y = ri(rng, x + 1, 9); // y > x → 받아내림
        sub = y;
        guard++;
      } while (x >= y && guard < 50);
      const answer = minuend - sub;
      return {
        kind: 'num', operands: [minuend, sub], operator: '-', answer,
        promptText: `${minuend} - ${sub} = ?`,
        ttsText: `${numKo(minuend)} 빼기 ${numKo(sub)}는 얼마일까요?`,
        visual: { type: 'ten_frame_sub', a: minuend, b: sub, twoFrames: true },
        // 대표 오답: 거꾸로 빼기 |x-y|, ±1, 받아내림 실수
        distractors: [Math.abs(x - y), answer + 1, answer - 1, answer + 10],
        hintRef: 'subtract_to_ten',
      };
    },
  },

  // ---- Phase 4: 두 자리 연산 -------------------------------------------------
  place_value: {
    phase: 4, label: '자리값', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const tens = ri(rng, 1, 9);
      const ones = ri(rng, 0, 9);
      const answer = tens * 10 + ones;
      return {
        kind: 'num', operands: [tens, ones], operator: 'place_value', answer,
        promptText: `10이 ${tens}개, 1이 ${ones}개이면?`,
        ttsText: `십이 ${numKo(tens)}개, 일이 ${numKo(ones)}개이면 얼마일까요?`,
        visual: { type: 'base_ten', tens, ones },
        distractors: [ones * 10 + tens, answer + 1, answer - 1, tens * 10],
        hintRef: 'base_ten',
      };
    },
  },

  two_digit_add_one: {
    phase: 4, label: '두 자리 + 한 자리', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const carry = p.carry; // true/false/undefined
      let a, b;
      let guard = 0;
      do {
        a = ri(rng, 10, 89);
        b = ri(rng, 1, 9);
        guard++;
      } while (carry !== undefined && ((a % 10) + b > 9) !== carry && guard < 50);
      const answer = a + b;
      return {
        kind: 'num', operands: [a, b], operator: '+', answer,
        promptText: `${a} + ${b} = ?`,
        ttsText: `${numKo(a)} 더하기 ${numKo(b)}는 얼마일까요?`,
        visual: { type: 'base_ten_add', a, b },
        distractors: [answer + 1, answer - 1, answer + 10, answer - 10],
        hintRef: 'column_add',
      };
    },
  },

  two_digit_add_two: {
    phase: 4, label: '두 자리 + 두 자리', inputs: ['keypad'],
    gen(p, rng) {
      const carry = p.carry;
      let a, b;
      let guard = 0;
      do {
        a = ri(rng, 10, p.max ?? 49);
        b = ri(rng, 10, p.max ?? 49);
        guard++;
      } while (carry !== undefined && ((a % 10) + (b % 10) > 9) !== carry && guard < 50);
      const answer = a + b;
      return {
        kind: 'num', operands: [a, b], operator: '+', answer,
        promptText: `${a} + ${b} = ?`,
        ttsText: `${numKo(a)} 더하기 ${numKo(b)}는 얼마일까요?`,
        visual: { type: 'base_ten_add', a, b },
        distractors: [answer + 1, answer - 1, answer + 10, answer - 10],
        hintRef: 'column_add',
      };
    },
  },

  two_digit_sub: {
    phase: 4, label: '두 자리 뺄셈', inputs: ['keypad'],
    gen(p, rng) {
      const a = ri(rng, 20, p.max ?? 99);
      const b = ri(rng, 1, p.twoDigitSub ? a - 10 : 9);
      const answer = a - b;
      return {
        kind: 'num', operands: [a, b], operator: '-', answer,
        promptText: `${a} - ${b} = ?`,
        ttsText: `${numKo(a)} 빼기 ${numKo(b)}는 얼마일까요?`,
        visual: { type: 'base_ten_sub', a, b },
        distractors: [answer + 1, answer - 1, answer + 10, answer - 10],
        hintRef: 'column_sub',
      };
    },
  },

  // ---- Phase 5: 곱셈 준비 ----------------------------------------------------
  skip_count: {
    phase: 5, label: '뛰어 세기', inputs: ['fill_blank', 'choice'],
    gen(p, rng) {
      const step = p.step ?? pick(rng, [2, 5, 10]);
      const start = step * ri(rng, 1, 3);
      const len = 5;
      const seq = Array.from({ length: len }, (_, i) => start + i * step);
      const blankIdx = ri(rng, 1, len - 1);
      const answer = seq[blankIdx];
      const shown = seq.map((v, i) => (i === blankIdx ? '□' : v));
      return {
        kind: 'num', operands: [start, step], operator: 'skip', answer,
        promptText: shown.join(', '),
        ttsText: `${numKo(step)}씩 뛰어 세기예요. 네모에 들어갈 수는 무엇일까요?`,
        visual: { type: 'number_line', start, step, blankIdx, len },
        distractors: [answer + step, answer - step, answer + 1, answer - 1],
        hintRef: 'number_line',
      };
    },
  },

  group_count: {
    phase: 5, label: '묶어 세기', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const per = ri(rng, 2, p.maxPer ?? 5);
      const groups = ri(rng, 2, p.maxGroups ?? 5);
      const answer = per * groups;
      return {
        kind: 'num', operands: [per, groups], operator: '×', answer,
        promptText: `${per}개씩 ${groups}묶음이면 모두 몇 개?`,
        ttsText: `한 묶음에 ${numKo(per)}개씩 ${numKo(groups)}묶음이면 모두 몇 개일까요?`,
        visual: { type: 'groups', per, groups },
        distractors: [answer + per, answer - per, per + groups, answer + 1],
        hintRef: 'skip_count',
      };
    },
  },

  repeated_add: {
    phase: 5, label: '같은 수 반복 더하기', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const a = ri(rng, 2, p.maxA ?? 5);
      const n = ri(rng, 2, p.maxN ?? 5);
      const answer = a * n;
      return {
        kind: 'num', operands: [a, n], operator: '×', answer,
        promptText: Array(n).fill(a).join(' + ') + ' = ?',
        ttsText: `${numKo(a)}를 ${numKo(n)}번 더하면 얼마일까요?`,
        visual: { type: 'groups', per: a, groups: n },
        distractors: [answer + a, answer - a, a * (n + 1), a + n],
        hintRef: 'skip_count',
      };
    },
  },

  repeated_to_mult: {
    phase: 5, label: '반복 덧셈 → 곱셈식', inputs: ['choice'],
    gen(p, rng) {
      const a = ri(rng, 2, 5);
      const n = ri(rng, 2, 5);
      const answer = `${a}×${n}`;
      const choices = shuffle(rng, [answer, `${a}+${n}`, `${a}×${n + 1}`, `${a + 1}×${n}`]);
      return {
        kind: 'expr', operands: [a, n], operator: 'to_mult', answer,
        promptText: Array(n).fill(a).join(' + ') + ' 와 같은 곱셈식은?',
        ttsText: `${numKo(a)}를 ${numKo(n)}번 더한 것과 같은 곱셈식을 찾아보세요.`,
        visual: { type: 'groups', per: a, groups: n },
        choices,
        hintRef: 'array',
      };
    },
  },

  times_concept: {
    phase: 5, label: '배 개념', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const a = ri(rng, 2, 5);
      const n = ri(rng, 2, 4);
      const answer = a * n;
      return {
        kind: 'num', operands: [a, n], operator: '×', answer,
        promptText: `${a}의 ${n}배는?`,
        ttsText: `${numKo(a)}의 ${numKo(n)}배는 얼마일까요?`,
        visual: { type: 'array', rows: n, cols: a },
        distractors: [answer + a, answer - a, a + n, a * (n + 1)],
        hintRef: 'array',
      };
    },
  },

  // ---- Phase 6: 곱셈 / 구구단 -------------------------------------------------
  mult_concept: {
    phase: 6, label: '곱셈의 의미(배열)', inputs: ['choice', 'keypad'],
    gen(p, rng) {
      const rows = ri(rng, 2, 5);
      const cols = ri(rng, 2, 5);
      const answer = rows * cols;
      return {
        kind: 'num', operands: [rows, cols], operator: '×', answer,
        promptText: `${rows} × ${cols} = ?`,
        ttsText: `${numKo(rows)} 곱하기 ${numKo(cols)}는 얼마일까요?`,
        visual: { type: 'array', rows, cols },
        distractors: [answer + rows, answer - cols, rows + cols, answer + 1],
        hintRef: 'array',
      };
    },
  },

  multiplication: {
    // 구구단 단(dan) 지정: params.dan = 숫자 또는 [숫자들]
    phase: 6, label: '구구단', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const dans = Array.isArray(p.dan) ? p.dan : [p.dan ?? ri(rng, 2, 9)];
      const a = pick(rng, dans);
      const b = ri(rng, p.minB ?? 1, p.maxB ?? 9);
      const answer = a * b;
      // 표시 순서를 가끔 뒤집어 교환법칙 노출
      const flip = rng() < 0.5;
      const [x, y] = flip ? [b, a] : [a, b];
      return {
        kind: 'num', operands: [x, y], operator: '×', answer, dan: a,
        promptText: `${x} × ${y} = ?`,
        ttsText: `${numKo(x)} 곱하기 ${numKo(y)}는 얼마일까요?`,
        visual: { type: 'array', rows: x, cols: y },
        // 대표 오답: ±한 단(±a), 인접 곱(a*(b±1)), ±1
        distractors: [answer + a, answer - a, a * (b + 1), a * (b - 1), answer + 1, answer - 1],
        hintRef: 'array',
      };
    },
  },

  mult_missing: {
    phase: 6, label: '곱셈 빈칸 채우기', inputs: ['keypad', 'choice', 'fill_blank'],
    gen(p, rng) {
      const dans = Array.isArray(p.dan) ? p.dan : [p.dan ?? ri(rng, 2, 9)];
      const a = pick(rng, dans);
      const b = ri(rng, 2, 9);
      const product = a * b;
      const answer = a; // □ × b = product
      return {
        kind: 'num', operands: [b, product], operator: '×missing', answer,
        promptText: `□ × ${b} = ${product}`,
        ttsText: `네모 안에 들어갈 수는 무엇일까요?`,
        visual: { type: 'array', rows: a, cols: b },
        distractors: [answer + 1, answer - 1, b, product],
        hintRef: 'array',
      };
    },
  },

  mult_word: {
    phase: 6, label: '곱셈 문장제', inputs: ['keypad', 'choice'],
    gen(p, rng) {
      const dans = Array.isArray(p.dan) ? p.dan : [p.dan ?? ri(rng, 2, 9)];
      const per = pick(rng, dans);
      const groups = ri(rng, 2, 9);
      const answer = per * groups;
      const item = pick(rng, ['사과', '구슬', '별', '쿠키', '몬스터 알']);
      const unit = pick(rng, ['묶음', '바구니', '상자', '접시']);
      return {
        kind: 'num', operands: [per, groups], operator: '×', answer,
        promptText: `${item}가 ${per}개씩 ${groups}${unit}, 모두 몇 개?`,
        ttsText: `${item}가 ${numKo(per)}개씩 ${numKo(groups)}${unit} 있어요. 모두 몇 개일까요?`,
        visual: { type: 'groups', per, groups },
        distractors: [answer + per, answer - per, per + groups, answer + 1],
        hintRef: 'array',
      };
    },
  },
};

// =============================================================================
// 한글 수 읽기 (0~99) — TTS 텍스트용 (숫자 단독은 보통 한자어 수사로 읽음)
// =============================================================================
const SINO = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
export function numKo(n) {
  if (n == null) return '';
  if (n < 10) return SINO[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return (t === 1 ? '십' : SINO[t] + '십') + (o ? SINO[o] : '');
  }
  return String(n);
}
