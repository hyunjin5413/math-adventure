// =============================================================================
// build.mjs — 배포용 빌드: 콘텐츠 생성 → web/stages.json 으로 복사
//
//   node build.mjs                 # 변형 1벌 (가벼움)
//   node build.mjs --variants 3    # 변형 3벌 (매 시도 다른 문제)
//
// 결과: web/ 폴더만 정적 호스트에 올리면 그대로 동작(self-contained).
// =============================================================================
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

// 1) 콘텐츠 생성 (src/generate.mjs)
execFileSync('node', [join(ROOT, 'src/generate.mjs'), ...args], { stdio: 'inherit' });

// 2) web/ 안으로 복사 → 배포 시 같은 폴더에서 로드
const from = join(ROOT, 'output/stages.json');
const to = join(ROOT, 'web/stages.json');
if (!existsSync(from)) {
  console.error('output/stages.json 이 없습니다. 생성 단계를 확인하세요.');
  process.exit(1);
}
copyFileSync(from, to);
const mb = (statSync(to).size / 1048576).toFixed(2);
console.log(`\n📦 web/stages.json 복사 완료 (${mb} MB) — 이제 web/ 폴더를 그대로 배포하세요.`);
