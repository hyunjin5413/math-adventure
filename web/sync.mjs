// =============================================================================
// sync.mjs — 계정 진행기록 온라인 저장 (textdb.dev 간이 텍스트 저장소)
//
// 방식: 사용자당 키 1개 (`<PREFIX>-<아이디>`) 에 { salt, hash, progress, updatedAt } JSON 저장.
//  - 읽기 GET, 쓰기 POST(text/plain) → CORS 프리플라이트 없이 브라우저에서 동작
//  - 서버 불가(오프라인 등) 시 조용히 로컬로 폴백 — 앱은 항상 동작
// 주의: 간이 공개 저장소(무작위 프리픽스로만 보호)라 민감정보 저장 금지.
//       비밀번호는 PBKDF2 해시만 저장한다.
// =============================================================================

const PREFIX = 'mathadv090744df26ddf85faf05'; // 무작위 네임스페이스(사실상 비밀키)
const BASE = 'https://textdb.dev/api/data';
const TIMEOUT_MS = 5000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS)),
  ]);
}

const keyOf = (id) => `${PREFIX}-u-${encodeURIComponent(id)}`;

// 서버에서 계정 레코드 읽기. 없으면 null, 서버 불가면 throw.
export async function serverGet(id) {
  const r = await withTimeout(fetch(`${BASE}/${keyOf(id)}`, { cache: 'no-store' }));
  if (!r.ok) throw new Error(`server ${r.status}`);
  const text = (await r.text()).trim();
  if (!text) return null; // 미존재 키 → 빈 응답
  try { return JSON.parse(text); } catch { return null; }
}

// 서버에 계정 레코드 쓰기(덮어쓰기). 실패 시 throw.
export async function serverPut(id, record) {
  const r = await withTimeout(fetch(`${BASE}/${keyOf(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // 단순 요청 → 프리플라이트 없음
    body: JSON.stringify(record),
  }));
  if (!r.ok) throw new Error(`server ${r.status}`);
}
