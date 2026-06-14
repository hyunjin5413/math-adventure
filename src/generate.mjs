// =============================================================================
// generate.mjs — 커리큘럼 + 스킬 → 전체 문제 풀 생성 & 검수 (PRD §12)
//
// 사용:
//   node src/generate.mjs                 # 전체 100스테이지 생성 → output/
//   node src/generate.mjs --variants 3    # 스테이지별 변형 세트 3벌(매 시도 다른 문제)
//   node src/generate.mjs --stage 15      # 특정 스테이지만 미리보기(stdout)
//
// 산출물:
//   output/stages.json   — 스테이지 메타 + 문제(검수용 정답 포함)
//   output/summary.json  — 스킬/월드/입력유형 분포 + 검증 리포트
// =============================================================================

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SKILLS, mulberry32, shuffle, buildNumChoices } from './skills.mjs';
import { buildCurriculum, WORLDS } from './curriculum.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'output');

// ---- 인자 ------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const VARIANTS = parseInt(getArg('--variants', '1'), 10);
const ONLY_STAGE = getArg('--stage', null);

// ---- 한 문제 만들기 --------------------------------------------------------
// stage 슬롯 i, 변형 v에 대해 스킬을 고르고 문제 1개를 조립한다.
function makeProblem(stage, slot, variant, rng) {
  // 간격 반복: reviewRatio 비율로 review 풀에서 출제
  let skill = stage.primary.skill;
  let params = stage.primary.params;
  let input = stage.primary.input;

  const isReviewSlot =
    stage.review.length > 0 && slot >= Math.round(stage.problemCount * (1 - stage.reviewRatio));

  if (skill === 'mixed') {
    const pool = params.pool || [];
    skill = pool[slot % pool.length];
    params = {};
    input = pickInput(stage, skill, rng);
  } else if (isReviewSlot) {
    skill = stage.review[(slot + variant) % stage.review.length];
    params = {};
    input = pickInput(stage, skill, rng);
  }

  const def = SKILLS[skill];
  const core = def.gen(params, rng);

  // 입력 방식 보정: 문제 종류가 보기 강제(sym/expr)면 choice로
  if (core.kind === 'sym' || core.kind === 'expr') input = 'choice';
  // 빈칸형 연산은 키패드/빈칸만 의미 있음
  if (input === 'tap_count' && core.kind === 'num' && !core.visual?.type?.includes('object')) {
    input = 'choice';
  }

  const problem = {
    id: `${stageId(stage)}-v${variant}-p${slot + 1}`,
    skill,
    skillLabel: def.label,
    phase: def.phase,
    inputType: input,
    isReview: skill !== stage.primary.skill && stage.primary.skill !== 'mixed',
    prompt: { text: core.promptText, tts: core.ttsText },
    operands: core.operands,
    operator: core.operator,
    answer: core.answer,
    visual: core.visual ?? null,
    hintRef: core.hintRef ?? null,
  };

  // 보기형이면 choices 구성
  if (input === 'choice' || input === 'drag_match') {
    const count = choiceCount(stage.phase);
    if (core.choices) {
      problem.choices = core.choices;
    } else if (core.kind === 'num') {
      problem.choices = buildNumChoices(rng, core.answer, core.distractors || [], count, choiceBounds(core));
    } else {
      problem.choices = shuffle(rng, [core.answer]);
    }
  }
  return problem;
}

function choiceCount(phase) {
  // 어린 단계는 보기 적게(2~3), 후반은 3~4 (PRD §6.2)
  return phase <= 0 ? 3 : phase <= 2 ? 3 : 4;
}
function choiceBounds(core) {
  // 음수/비현실 보기 방지
  if (['×', 'place_value'].includes(core.operator)) return { min: 0, max: 200 };
  return { min: 0, max: 99 };
}
function pickInput(stage, skill, rng) {
  const inputs = SKILLS[skill].inputs;
  return inputs[Math.floor(rng() * inputs.length)];
}
function stageId(stage) {
  return `W${stage.world}-S${String(stage.n).padStart(3, '0')}`;
}

// ---- 스테이지 전체 생성 ----------------------------------------------------
function generateStage(stage, variant) {
  // 시드: 스테이지 번호와 변형 번호로 결정 → 재현 가능 (PRD §12 검수 용이)
  const rng = mulberry32(stage.n * 1000 + variant * 7 + 13);
  const problems = [];
  for (let slot = 0; slot < stage.problemCount; slot++) {
    problems.push(makeProblem(stage, slot, variant, rng));
  }
  return problems;
}

// ---- 검증 ------------------------------------------------------------------
function recompute(p) {
  const [a, b, c] = p.operands;
  switch (p.operator) {
    case 'count': case 'read': return a;
    case 'compose': case '+': return c != null ? a + b + c : a + b;
    case '-': return a - b;
    case 'make10': return 10 - a;
    case 'decompose': return a - b;
    case '+missing': return b - a; // known=a, total=b
    case '-missing': return a - b; // a - □ = b → □ = a - b
    case 'skip': return null; // 시퀀스라 별도 — answer 신뢰
    case '×': return a * b;
    case '×missing': return p.answer; // □×b=product, 검증은 product/b
    case 'place_value': return a * 10 + b;
    case 'compare': return null;
    default: return null;
  }
}

function validateProblems(problems, issues) {
  for (const p of problems) {
    // 1) 정답 재계산 일치
    const expected = recompute(p);
    if (expected != null && expected !== p.answer && p.operator !== '×missing') {
      issues.push({ id: p.id, type: 'answer_mismatch', got: p.answer, expected });
    }
    if (p.operator === '×missing') {
      const [b, product] = p.operands;
      if (p.answer * b !== product) issues.push({ id: p.id, type: 'mult_missing_bad' });
    }
    // 2) 보기에 정답 포함 & 중복 없음
    if (p.choices) {
      if (!p.choices.includes(p.answer)) issues.push({ id: p.id, type: 'answer_not_in_choices' });
      if (new Set(p.choices).size !== p.choices.length) issues.push({ id: p.id, type: 'dup_choices' });
    }
    // 3) 음수/비현실 답 방지
    if (typeof p.answer === 'number' && p.answer < 0) issues.push({ id: p.id, type: 'negative_answer' });
  }
}

function validate(stages) {
  const issues = [];
  let total = 0;        // 변형 1벌(variant 0) 기준 문제 수
  let totalAll = 0;     // 모든 변형 합
  let slotPairs = 0;    // 변형 간 비교한 (스테이지×슬롯) 쌍
  let slotDistinct = 0; // 그중 변형끼리 promptText가 모두 다른 쌍
  for (const st of stages) {
    validateProblems(st.problems, issues);
    total += st.problems.length;

    const sets = st.variantSets || [st.problems];
    for (const set of sets) totalAll += set.length;
    if (st.variantSets && st.variantSets.length > 1) {
      validateProblems(st.variantSets.flat(), issues);
      // 변형 다양성: 슬롯별로 변형들의 prompt가 서로 다른지
      const len = st.variantSets[0].length;
      for (let slot = 0; slot < len; slot++) {
        const prompts = st.variantSets.map((s) => s[slot]?.prompt.text);
        slotPairs++;
        if (new Set(prompts).size === st.variantSets.length) slotDistinct++;
      }
    }
  }
  return { total, totalAll, issues, slotPairs, slotDistinct };
}

// ---- 요약 통계 -------------------------------------------------------------
function summarize(stages) {
  const bySkill = {};
  const byInput = {};
  const byWorld = {};
  let reviewCount = 0;
  for (const st of stages) {
    byWorld[st.world] = (byWorld[st.world] || 0) + st.problems.length;
    for (const p of st.problems) {
      bySkill[p.skill] = (bySkill[p.skill] || 0) + 1;
      byInput[p.inputType] = (byInput[p.inputType] || 0) + 1;
      if (p.isReview) reviewCount++;
    }
  }
  return { bySkill, byInput, byWorld, reviewCount };
}

// ---- 메인 ------------------------------------------------------------------
function main() {
  const curriculum = buildCurriculum();

  if (ONLY_STAGE) {
    const st = curriculum.find((s) => s.n === parseInt(ONLY_STAGE, 10));
    if (!st) { console.error('스테이지를 찾을 수 없음:', ONLY_STAGE); process.exit(1); }
    const problems = generateStage(st, 0);
    console.log(JSON.stringify({ ...st, problems }, null, 2));
    return;
  }

  const stages = curriculum.map((st) => {
    const variants = [];
    for (let v = 0; v < VARIANTS; v++) variants.push(generateStage(st, v));
    // 기본 출력은 variant 0; 변형은 variantSets에 보관
    return {
      ...st,
      id: stageId(st),
      problems: variants[0],
      ...(VARIANTS > 1 ? { variantSets: variants } : {}),
    };
  });

  const report = validate(stages);
  const summary = summarize(stages);

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'stages.json'), JSON.stringify({ worlds: WORLDS, stages }, null, 2));
  writeFileSync(
    join(OUT, 'summary.json'),
    JSON.stringify(
      {
        stageCount: stages.length,
        variants: VARIANTS,
        problemsPerVariant: report.total,
        problemsAllVariants: report.totalAll,
        variantDiversity: report.slotPairs
          ? +(report.slotDistinct / report.slotPairs).toFixed(4)
          : null,
        ...summary,
        validation: { total: report.total, totalAll: report.totalAll, issues: report.issues },
      },
      null,
      2,
    ),
  );

  // 콘솔 리포트
  console.log('=== 수학 어드벤처 콘텐츠 생성 완료 ===');
  console.log(`스테이지: ${stages.length}개 / 변형: ${VARIANTS}벌`);
  console.log(`총 문제(변형1벌 기준): ${report.total}개  | 복습 문제: ${summary.reviewCount}개`);
  if (VARIANTS > 1) {
    const pct = report.slotPairs ? ((report.slotDistinct / report.slotPairs) * 100).toFixed(1) : '0';
    console.log(`전체 변형 합산 문제: ${report.totalAll}개`);
    console.log(`변형 다양성: 슬롯의 ${pct}% 가 ${VARIANTS}벌 모두 서로 다른 문제`);
  }
  console.log('\n[월드별 문제 수]');
  for (const w of WORLDS) console.log(`  ${w.name}: ${summary.byWorld[w.id]}개`);
  console.log('\n[입력 유형 분포]');
  for (const [k, v] of Object.entries(summary.byInput).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  console.log('\n[개념별 문제 수]');
  for (const [k, v] of Object.entries(summary.bySkill).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k} (${SKILLS[k]?.label ?? '?'}): ${v}`);
  }
  console.log('\n[검증]');
  if (report.issues.length === 0) {
    console.log('  ✅ 오류 0건 — 모든 정답/보기/범위 검증 통과');
  } else {
    console.log(`  ⚠️ 오류 ${report.issues.length}건:`);
    for (const i of report.issues.slice(0, 20)) console.log('   ', JSON.stringify(i));
  }
  console.log(`\n출력: output/stages.json, output/summary.json`);
}

main();
