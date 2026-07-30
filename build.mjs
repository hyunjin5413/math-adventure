// =============================================================================
// build.mjs — 배포용 빌드: 콘텐츠 생성 → web/stages.json 으로 복사
//
//   node build.mjs                 # 변형 1벌 (가벼움)
//   node build.mjs --variants 3    # 변형 3벌 (매 시도 다른 문제)
//
// 결과: web/ 폴더만 정적 호스트에 올리면 그대로 동작(self-contained).
// =============================================================================
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
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

// 3) 캐시 무효화: index.html의 ?v= 값을 빌드 시각으로 갱신
//    (기기 캐시에 구버전 app.mjs/styles.css가 남아 새 기능이 안 보이는 문제 방지)
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // YYYYMMDDHHMM

// (a) index.html의 진입점
const indexPath = join(ROOT, 'web/index.html');
let htmlSrc = readFileSync(indexPath, 'utf8');
const htmlBefore = htmlSrc;
htmlSrc = htmlSrc.replace(/(\.(?:mjs|css))\?v=[^"']*/g, `$1?v=${stamp}`);
if (htmlSrc !== htmlBefore) writeFileSync(indexPath, htmlSrc);

// (b) 모듈 간 내부 import도 함께 갱신 — app.mjs만 새로 받고 characters.mjs는
//     캐시된 구버전을 쓰는 문제(새 캐릭터가 안 보이는 등)를 방지
const MODULES = ['app.mjs', 'sfx.mjs', 'tts.mjs', 'sync.mjs', 'characters.mjs'];
const INTERNAL = /(from\s+['"]\.\/(?:characters|sfx|tts|sync)\.mjs)(?:\?v=[^'"]*)?(['"])/g;
for (const f of MODULES) {
  const p = join(ROOT, 'web', f);
  if (!existsSync(p)) continue;
  const src = readFileSync(p, 'utf8');
  const out = src.replace(INTERNAL, `$1?v=${stamp}$2`);
  if (out !== src) writeFileSync(p, out);
}
console.log(`🔄 캐시 버전 갱신: ?v=${stamp} (index.html + 내부 import)`);
