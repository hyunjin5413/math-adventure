// =============================================================================
// characters.mjs — 오리지널 캐릭터 9종 + 아이콘/아이템 (전부 SVG, 이모지 없음)
//
// ※ 저작권 안전: 실제 IP를 베끼지 않고 "무드"만 연상시키는 자체 디자인입니다.
//   이름/로고/형태 모두 오리지널.
// =============================================================================
import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';
const html = htm.bind(React.createElement);

// 캐릭터 한글 이름
export const CHAR_NAME = {
  // 기본 친구들
  kongryong: '꽁룡', poopbot: '뿡뿡봇', captainkorea: '캡틴코리아', ppika: '삐까쭈',
  baboon: '개코원숭', imagine: '이매진드래곤', superabbit: '슈퍼래빗뽀이',
  balduncle: '대머리아저씨', andongki: '안똥끼', kkongryong: '콩룡', ppokkattu: '뽀까뚜',
  // W1 공룡 친구들
  bbyeo: '뼈다구스', allog: '알록이',
  // W2 로봇 친구들
  drill: '드르륵', bbabang: '빠방카', chulkung: '철컹이', ppiriri: '삐리리',
  // W3 특공대 친구들
  pungpung: '펑펑이', syungsyung: '슝슝이', salgeum: '살금이',
  // W4 히어로 친구들
  bulkkot: '불꽃맨', shadowcat: '그림자냥', mujeokgom: '무적곰',
  // W5 몬스터 친구들
  bugeul: '부글이', mongsil: '몽실이',
  // 보스들
  daewang: '대왕',
  tyranno: '티라노왕', gocheolking: '고철킹', blackwolf: '검은늑대',
  darkmask: '다크마스크', wangmon: '왕몬',
};

// 월드별 보스 (각 월드 20번째 스테이지의 주인)
export const WORLD_BOSS = { 1: 'tyranno', 2: 'gocheolking', 3: 'blackwolf', 4: 'darkmask', 5: 'wangmon' };

export const WORLD_LABEL = {
  1: '공룡 알 마을', 2: '변신 정비소', 3: '특공대 기지', 4: '히어로 시티', 5: '몬스터 도감',
};
// 월드별 스페셜 친구 5명(손그림, 4스테이지 클리어마다 발견)
export const WORLD_SPECIALS = {
  1: ['kongryong', 'kkongryong', 'imagine', 'bbyeo', 'allog'],
  2: ['poopbot', 'drill', 'bbabang', 'chulkung', 'ppiriri'],
  3: ['balduncle', 'baboon', 'pungpung', 'syungsyung', 'salgeum'],
  4: ['captainkorea', 'superabbit', 'bulkkot', 'shadowcat', 'mujeokgom'],
  5: ['ppika', 'ppokkattu', 'andongki', 'bugeul', 'mongsil'],
};

// ---- 월드별 문제 담당 친구 20명(변형 생성) --------------------------------
// 색/모양/장식 조합으로 20종을 만들되, 이름은 월드 테마로 자동 부여.
const HOST_PREFIX = ['아기', '꼬마', '초록', '노랑', '파랑', '빨강', '보라', '주황', '점박', '뿔난',
  '왕눈', '번개', '통통', '날쌘', '느림', '알록', '하늘', '반짝', '씩씩', '멋쟁이'];
const HOST_SUFFIX = { 1: '룡', 2: '봇', 3: '대원', 4: '맨', 5: '몬' };
const PREFIX_HUE = {
  '초록': [130, 62, 60], '노랑': [48, 90, 62], '파랑': [212, 70, 62], '빨강': [4, 78, 62],
  '보라': [270, 55, 64], '주황': [26, 85, 60], '하늘': [195, 70, 64], '점박': [200, 20, 62],
  '번개': [50, 95, 60], '알록': [320, 60, 66], '반짝': [45, 88, 66], '분홍': [335, 70, 70],
};
const DEFAULT_HUES = [[160, 55, 62], [20, 70, 62], [255, 45, 66], [90, 55, 60], [300, 50, 66],
  [180, 55, 60], [340, 60, 66], [70, 70, 60]];
function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }
function hostPalette(prefix, i) {
  const base = PREFIX_HUE[prefix] || DEFAULT_HUES[i % DEFAULT_HUES.length];
  const [h, s, l] = base;
  return { c2: hsl(h, s, l), c1: hsl(h, Math.max(30, s - 25), Math.min(92, l + 26)), accent: hsl(h, s, Math.max(30, l - 28)) };
}
export const HOST_SHAPE = ['round', 'tall', 'bean', 'egg']; // 몸 실루엣
export const HOST_TOPPER = ['none', 'horn', 'antenna', 'ears', 'spike', 'leaf', 'bolt', 'tuft']; // 머리 장식

// 월드별 20 호스트 생성 → id: h{w}_{i}
export const WORLD_HOSTS = {};
const HOST_META = {}; // id → { name, palette, shape, topper }
for (let w = 1; w <= 5; w++) {
  WORLD_HOSTS[w] = [];
  for (let i = 0; i < 20; i++) {
    const id = `h${w}_${i}`;
    const prefix = HOST_PREFIX[i];
    HOST_META[id] = {
      name: prefix + HOST_SUFFIX[w],
      palette: hostPalette(prefix, i + w),
      shape: HOST_SHAPE[(i + w) % HOST_SHAPE.length],
      topper: HOST_TOPPER[(i * 3 + w) % HOST_TOPPER.length],
    };
    WORLD_HOSTS[w].push(id);
  }
}

// 하위호환/공용: 월드 친구 = 스페셜(발견 보너스 풀)
export const WORLD_CHARS = WORLD_SPECIALS;
// 발견 가능한 전체 친구
export const ROSTER = [1, 2, 3, 4, 5].flatMap((w) => [...WORLD_HOSTS[w], ...WORLD_SPECIALS[w]]);
// 특별(보스) 친구: 대왕 + 월드 보스들
export const SPECIALS = ['daewang', 'tyranno', 'gocheolking', 'blackwolf', 'darkmask', 'wangmon'];
// 도감 전체 목록: 월드별(호스트20+스페셜5) + 보스
export const DEX = [
  ...[1, 2, 3, 4, 5].flatMap((w) => [...WORLD_HOSTS[w], ...WORLD_SPECIALS[w]]),
  ...SPECIALS,
];

// 호스트 이름/팔레트를 공용 맵에 등록
for (const [id, m] of Object.entries(HOST_META)) {
  CHAR_NAME[id] = m.name;
  // eslint-disable-next-line no-use-before-define
}
// 월드 대표 마스코트 (맵 배너용)
export const WORLD_MASCOT = { 1: 'kongryong', 2: 'poopbot', 3: 'captainkorea', 4: 'superabbit', 5: 'ppika' };

// 월드 배경 팔레트 (동물의 숲톤: 부드럽고 자연스러운 색)
export const WORLD_THEME = {
  1: { c1: '#e6f6d6', c2: '#9bd86a', accent: '#5fa838' },
  2: { c1: '#dbeafb', c2: '#7fb0ef', accent: '#4377cc' },
  3: { c1: '#ffe2dc', c2: '#ff9a8b', accent: '#e0604f' },
  4: { c1: '#efe6ff', c2: '#b69bf0', accent: '#7a59d0' },
  5: { c1: '#fff1cf', c2: '#ffd368', accent: '#dba300' },
};

// 캐릭터별 색/강조색 (이펙트, 도감 카드)
export const CHAR_THEME = {
  kongryong:   { c2: '#9bd86a', c1: '#e6f6d6', accent: '#5fa838' },
  poopbot:     { c2: '#aeb9cc', c1: '#e3e9f3', accent: '#6b7a90' },
  captainkorea:{ c2: '#5b8def', c1: '#dbe6ff', accent: '#2f4fb0' },
  ppika:       { c2: '#ffd368', c1: '#fff1cf', accent: '#dba300' },
  baboon:      { c2: '#cf9b66', c1: '#f3e0c8', accent: '#8a5a2b' },
  imagine:     { c2: '#8a6df0', c1: '#e3dbfb', accent: '#5a3fd0' },
  superabbit:  { c2: '#f3f4f8', c1: '#ffffff', accent: '#5b8def' },
  balduncle:   { c2: '#ffd9b3', c1: '#fff0e0', accent: '#c98a3a' },
  andongki:    { c2: '#b4814f', c1: '#e7cba6', accent: '#7a4f25' },
  kkongryong:  { c2: '#f0a0c8', c1: '#fde3f0', accent: '#d0568f' },
  ppokkattu:   { c2: '#ffb35c', c1: '#ffe9cc', accent: '#e07f1f' },
  daewang:     { c2: '#8a6df0', c1: '#e3dbfb', accent: '#4a2fa8' },
  // W1 공룡
  bbyeo:       { c2: '#e8e4d8', c1: '#f8f6ef', accent: '#a09880' },
  allog:       { c2: '#8fd8c8', c1: '#e0f5ef', accent: '#3fa88f' },
  // W2 로봇
  drill:       { c2: '#ffb35c', c1: '#ffe9cc', accent: '#c87820' },
  bbabang:     { c2: '#ff8f8f', c1: '#ffe0e0', accent: '#d05050' },
  chulkung:    { c2: '#9aa8bc', c1: '#e0e6ef', accent: '#5a6b85' },
  ppiriri:     { c2: '#7fd0e8', c1: '#dff3f9', accent: '#3898b8' },
  // W3 특공대
  pungpung:    { c2: '#4a4a5a', c1: '#d8d8e0', accent: '#ff8f3f' },
  syungsyung:  { c2: '#ff9a52', c1: '#ffe4d0', accent: '#e06a20' },
  salgeum:     { c2: '#7bb87a', c1: '#dff0de', accent: '#4a8a49' },
  // W4 히어로
  bulkkot:     { c2: '#ff7a52', c1: '#ffe0d5', accent: '#d84a20' },
  shadowcat:   { c2: '#5a5a6e', c1: '#dcdce4', accent: '#38384a' },
  mujeokgom:   { c2: '#c89a6a', c1: '#f0e0cc', accent: '#8a5f30' },
  // W5 몬스터
  bugeul:      { c2: '#5bc8ff', c1: '#d6f2ff', accent: '#2f8fd0' },
  mongsil:     { c2: '#e8e0f8', c1: '#f8f5ff', accent: '#9a88c8' },
  // 보스들
  tyranno:     { c2: '#6a9a48', c1: '#dff0d0', accent: '#3d6a22' },
  gocheolking: { c2: '#8a7a68', c1: '#e5ddd2', accent: '#584a3a' },
  blackwolf:   { c2: '#6a6a7e', c1: '#e0e0e8', accent: '#3a3a4e' },
  darkmask:    { c2: '#7a4fd0', c1: '#e5dbf8', accent: '#48287e' },
  wangmon:     { c2: '#e05a8a', c1: '#fbdce8', accent: '#a82858' },
};
// 호스트 20종 팔레트 등록
for (const [id, m] of Object.entries(HOST_META)) CHAR_THEME[id] = m.palette;

// 캐릭터별 음성 대사 (센스있게, 캐릭터마다 말투 다름)
export const VOICE = {
  kongryong:   { hi: ['크앙! 나는 꽁룡이야!'], ok: ['크앙! 정답이야!', '쿵쿵! 잘했어!', '공룡 파워 발동!', '오, 똑똑한걸 크앙!', '알에서 배운 실력이군!', '멋진 정답 크아앙!'], no: ['크앙? 다시 해볼까?', '괜찮아, 또 도전!', '으음, 아깝다 크앙!', '천천히 다시 크앙~'] },
  poopbot:     { hi: ['삑삑! 뿡뿡봇 가동!'], ok: ['삑! 정답 처리 완료!', '뿌웅~ 멋진데?', '계산 정확도 백 퍼센트!', '삑삑! 데이터 저장 완료!', '완벽 계산, 뿌웅!', '정답 확인, 삐리릭!'], no: ['삐빅, 오류! 다시!', '뿡… 한 번 더 가자!', '재계산 필요, 삑!', '괜찮아, 다시 부팅!'] },
  captainkorea:{ hi: ['정의의 캡틴코리아 등장!'], ok: ['정의는 승리한다, 정답!', '훌륭해, 시민!', '방패처럼 단단한 정답!', '멋진 활약이야!', '히어로급 정답이군!', '완벽하게 막아냈어!'], no: ['포기는 없다, 다시!', '히어로는 다시 일어선다!', '괜찮아, 재정비하자!', '다음엔 꼭 성공이야!'] },
  ppika:       { hi: ['삐까쭈 등장! 삐까삐까!'], ok: ['삐까삐까! 번쩍 정답!', '찌릿! 맞았어!', '전기 충전 완료!', '번쩍번쩍 대단해!', '십만 볼트 정답!', '찌리릿, 완벽해!'], no: ['찌직… 다시 해보까?', '삐… 한 번 더!', '방전됐다, 재충전!', '괜찮아 삐까삐까!'] },
  baboon:      { hi: ['우끼끼! 개코원숭이다!'], ok: ['우끼끼! 맞았어!', '바나나 줄게, 정답!', '끼끼끽 똑똑한걸!', '나무 위에서도 인정!', '우끼! 천재 아냐?', '끼끼, 완벽 정답!'], no: ['우끼? 다시 해봐!', '끽! 아쉽다, 또!', '바나나 먹고 다시!', '우끼끼, 힘내!'] },
  imagine:     { hi: ['용용~ 이매진드래곤!'], ok: ['용용 정답!', '불꽃처럼 뜨거운 정답!', '드래곤도 인정!', '하늘을 나는 정답!', '용용, 눈부신걸!', '전설의 정답이군!'], no: ['용… 다시 날아보자!', '한 번 더 도전!', '불씨를 다시 지피자!', '괜찮아, 용용!'] },
  superabbit:  { hi: ['슈퍼래빗뽀이 출동!'], ok: ['슈퍼 점프 정답!', '깡총! 맞았어!', '당근 만점이야!', '토끼 귀도 쫑긋, 정답!', '슈퍼 스피드 정답!', '깡총깡총 대단해!'], no: ['깡총, 다시 가자!', '괜찮아, 또 점프!', '당근 먹고 다시!', '한 번 더 깡총!'] },
  balduncle:   { hi: ['허허, 대머리아저씨일세.'], ok: ['허허, 정답일세!', '아주 똑똑하구먼!', '반짝이는 정답이야!', '허허, 기특하구먼!', '머리가 번쩍 빛나는군!', '역시 될성부른 나무야!'], no: ['어이쿠, 아깝구먼~', '허허, 다시 해보게나.', '괜찮네, 천천히 하게.', '이런, 한 번 더!'] },
  andongki:    { hi: ['안녕, 안똥끼야!'], ok: ['오~ 똑똑한걸!', '말랑말랑 정답!', '안똥끼도 깜짝!', '몽글몽글 정답이야!', '오오, 대단해!', '말랑! 완벽해!'], no: ['에구, 다시 해볼까?', '괜찮아, 또 하면 돼!', '조물조물 다시!', '힘내, 말랑말랑!'] },
  kkongryong:  { hi: ['콩! 나는 콩룡이야~'], ok: ['콩콩! 정답이야!', '분홍 파워 정답!', '콩룡이 신났다!', '콩콩콩, 대단해!', '분홍빛 완벽 정답!', '콩! 최고야!'], no: ['콩… 다시 해보자!', '괜찮아, 콩!', '콩콩, 힘내!', '다시 한 번 콩!'] },
  ppokkattu:   { hi: ['뽀까뽀까! 뽀까뚜야!'], ok: ['뽀까! 대단해!', '뚜뚜~ 정답!', '뽀까뚜 인정!', '뽀까뽀까 완벽!', '삐약! 멋진 정답!', '뚜뚜, 최고야!'], no: ['뽀… 아깝다!', '뚜… 한 번 더!', '뽀까, 힘내!', '괜찮아 뚜뚜!'] },
  bbyeo:       { hi: ['덜그럭! 뼈다구스야!'], ok: ['뼈부터 짜릿한 정답!', '덜그럭 덜그럭 신난다!', '해골도 놀란 정답!', '으드득, 완벽해!', '뼈대 있는 정답이군!', '덜그럭! 최고야!'], no: ['덜그럭… 다시!', '뼈 아프게 아깝다!', '뼈 맞추고 다시!', '괜찮아, 덜그럭!'] },
  allog:       { hi: ['알록알록~ 알록이야!'], ok: ['알에서 나올 만큼 놀라운 정답!', '알록! 맞았어!', '알록달록 완벽해!', '반짝반짝 정답이야!', '알알이 똑똑해!', '알록! 최고!'], no: ['알… 다시 해보자!', '껍질 속에서 응원할게!', '톡톡, 다시 두드려봐!', '괜찮아 알록!'] },
  drill:       { hi: ['드르르륵! 드르륵이야!'], ok: ['드르륵! 뚫었다, 정답!', '공사 완료! 정답!', '드르륵 드르륵 대단해!', '단단한 문제도 뚫었어!', '완벽 시공, 정답!', '드릴 파워 정답!'], no: ['드륵… 다시 뚫자!', '살짝 빗나갔어!', '드르륵, 재시도!', '괜찮아, 다시 파자!'] },
  bbabang:     { hi: ['빠방! 빠방카 출발!'], ok: ['부릉부릉 정답 도착!', '빠방! 1등 정답!', '풀 액셀 정답!', '부릉! 멋지게 골인!', '빠방빠방 대단해!', '스피드 정답이야!'], no: ['끼익! 다시 출발!', '후진해서 다시 가자!', '빠방, 재출발!', '괜찮아, 부릉!'] },
  chulkung:    { hi: ['철컹철컹! 철컹이다!'], ok: ['철컹! 강철 정답!', '단단한 정답이군!', '철컹철컹 완벽해!', '강철처럼 튼튼한 정답!', '철커덕, 대단해!', '무쇠 정답이야!'], no: ['철컹… 나사 조이고 다시!', '괜찮아, 다시 조립!', '철컹, 재정비!', '한 번 더 철컹!'] },
  ppiriri:     { hi: ['삐리리~ 신호 왔다!'], ok: ['삐리리! 정답 수신 완료!', '주파수 딱 맞았어!', '삐리리 완벽 신호!', '전파 최고, 정답!', '삐리릭, 대단해!', '수신 양호, 정답!'], no: ['치지직… 다시 맞춰보자!', '삐… 신호 재전송!', '주파수 다시!', '괜찮아 삐리리!'] },
  pungpung:    { hi: ['펑! 폭탄 담당 펑펑이야!'], ok: ['펑! 정답이 터졌다!', '대폭발 정답!', '펑펑 신나는 정답!', '콰광! 완벽해!', '불꽃놀이 정답!', '펑! 대단해!'], no: ['피식… 불발! 다시!', '심지 다시 켜자!', '펑, 재장전!', '괜찮아, 다시 펑!'] },
  syungsyung:  { hi: ['슝슝! 로켓 담당 슝슝이!'], ok: ['슝! 정답으로 발사!', '3, 2, 1, 정답!', '우주까지 슝 정답!', '슝슝 완벽 발사!', '로켓 스피드 정답!', '슝! 대단해!'], no: ['슈웅… 다시 발사 준비!', '괜찮아, 재발사!', '카운트다운 다시!', '슝, 힘내!'] },
  salgeum:     { hi: ['쉿… 살금살금, 살금이야.'], ok: ['쉿! 조용히 완벽한 정답!', '살금살금 정답 접수!', '들키지 않고 정답!', '쉿, 완벽 잠입!', '조용히 대단한걸!', '살금! 최고야!'], no: ['들켰다… 다시 숨자!', '쉿, 한 번 더!', '살금살금 재시도!', '괜찮아, 다시 쉿!'] },
  bulkkot:     { hi: ['활활! 불꽃맨 등장!'], ok: ['활활 타오르는 정답!', '불꽃 슛! 정답!', '뜨거운 정답이야!', '활활, 대단해!', '불꽃처럼 빛나!', '화르륵 완벽!'], no: ['치익… 다시 불붙이자!', '불꽃은 꺼지지 않아!', '활활, 재점화!', '괜찮아, 다시 활활!'] },
  shadowcat:   { hi: ['냐옹… 그림자냥이다.'], ok: ['냐옹! 그림자처럼 빠른 정답!', '완벽해서 소름 냐옹!', '살며시 정답 냐옹!', '냐옹, 멋진걸!', '어둠 속 정답이야!', '냐아옹 대단해!'], no: ['냐… 다시 노려보자!', '그림자 속에서 한 번 더!', '냐옹, 재도전!', '괜찮아 냐옹~'] },
  mujeokgom:   { hi: ['쿵쿵! 무적곰이다!'], ok: ['무적의 정답!', '곰발바닥 도장 쾅! 정답!', '어흥! 완벽해!', '무적곰도 감탄!', '쿵쿵, 대단해!', '든든한 정답이야!'], no: ['어흥… 다시 가자!', '무적곰은 포기 안 해!', '쿵쿵, 재도전!', '괜찮아, 다시 어흥!'] },
  bugeul:      { hi: ['부글부글~ 부글이야!'], ok: ['부글! 시원한 정답!', '물방울 팡팡 정답!', '부글부글 완벽해!', '퐁당, 대단해!', '시원하게 정답!', '보글보글 최고!'], no: ['보글… 다시 해보자!', '괜찮아, 부글부글!', '퐁당, 재도전!', '한 번 더 부글!'] },
  mongsil:     { hi: ['둥실둥실~ 몽실이야!'], ok: ['구름 위로 붕~ 정답!', '몽실몽실 포근한 정답!', '둥실둥실 대단해!', '뭉게뭉게 완벽!', '포근한 정답이야!', '둥실! 최고야!'], no: ['비 오려 그래… 다시!', '둥실~ 한 번 더!', '몽실몽실 힘내!', '괜찮아, 둥실!'] },
  daewang:     {
    hi: ['크하하! 나는 대왕이다! 내 문제를 풀어보아라!'],
    ok: ['호오, 제법이군!', '크윽, 정답이라니!', '실력이 대단하구나!'],
    no: ['크하하! 아직 멀었군!', '내 문제는 쉽지 않지!'],
    win: ['대단하군! 오늘은 내가 졌다. 다음에 보자!'],
  },
  tyranno:     {
    hi: ['크르릉! 공룡의 왕, 티라노왕이다! 감히 내 알 마을에 왔느냐!'],
    ok: ['크릉?! 제법인데!', '내 이빨보다 날카로운 정답이군!', '으르릉… 인정한다!'],
    no: ['크하하! 공룡 왕을 이기긴 어렵지!', '크릉! 다시 덤벼라!'],
    win: ['크르릉… 대단하군! 알 마을의 용사로 인정한다. 다음에 보자!'],
  },
  gocheolking: {
    hi: ['철컹철컹! 고철킹이다! 내 계산 회로를 이겨보아라!'],
    ok: ['삐빅! 오차 없음, 정답!', '철컹! 회로가 놀랐다!', '완벽한 계산이군!'],
    no: ['삐빅! 계산 오류 감지!', '철컹철컹! 다시 계산해라!'],
    win: ['회로 과열… 내가 졌다! 정비소의 왕은 너다. 다음에 보자!'],
  },
  blackwolf:   {
    hi: ['아우우! 검은늑대다! 특공대 훈련을 통과할 수 있겠나!'],
    ok: ['흠, 훈련이 잘 됐군!', '아우! 날카로운 정답!', '늑대의 눈으로 봐도 완벽하다!'],
    no: ['아직 훈련이 부족하군!', '아우우! 다시 도전해라!'],
    win: ['아우우… 완벽한 대원이군! 특공대 최고 훈장을 주지. 다음에 보자!'],
  },
  darkmask:    {
    hi: ['후후후… 다크마스크다. 히어로 시티는 내 것이 될 것이다!'],
    ok: ['크윽! 히어로다운 정답!', '후후… 제법이군!', '이럴 수가, 완벽하다니!'],
    no: ['후후후! 그 실력으로 시티를 지키겠다고?', '어림없다! 다시!'],
    win: ['크으윽… 시티는 네가 지켜라! 오늘은 물러가지만, 다음에 보자!'],
  },
  wangmon:     {
    hi: ['부오오! 몬스터의 왕, 왕몬이다! 마지막 시험을 시작하지!'],
    ok: ['부오?! 놀라운 정답!', '몬스터들이 술렁인다!', '왕의 자리가 위험하군!'],
    no: ['부오오! 아직 멀었다!', '몬스터 왕은 쉽지 않지!'],
    win: ['부오오… 완벽하다! 이제 네가 몬스터 도감의 주인이다. 다음에 보자!'],
  },
};

// 캐릭터별 목소리 스타일: pitch(음높이), rate(속도), v(선호 보이스 순번)
export const VOICE_STYLE = {
  kongryong: { pitch: 1.15, rate: 1.0, v: 0 },  kkongryong: { pitch: 1.3, rate: 1.0, v: 1 },
  imagine: { pitch: 0.95, rate: 0.95, v: 2 },   bbyeo: { pitch: 0.85, rate: 1.0, v: 0 },
  allog: { pitch: 1.45, rate: 1.05, v: 1 },
  poopbot: { pitch: 0.8, rate: 1.05, v: 2 },    drill: { pitch: 0.9, rate: 1.1, v: 0 },
  bbabang: { pitch: 1.2, rate: 1.15, v: 1 },    chulkung: { pitch: 0.7, rate: 0.9, v: 2 },
  ppiriri: { pitch: 1.35, rate: 1.1, v: 0 },
  balduncle: { pitch: 0.75, rate: 0.85, v: 1 }, baboon: { pitch: 1.25, rate: 1.15, v: 2 },
  pungpung: { pitch: 1.0, rate: 1.1, v: 0 },    syungsyung: { pitch: 1.2, rate: 1.2, v: 1 },
  salgeum: { pitch: 0.9, rate: 0.8, v: 2 },
  captainkorea: { pitch: 0.9, rate: 0.95, v: 0 }, superabbit: { pitch: 1.3, rate: 1.15, v: 1 },
  bulkkot: { pitch: 1.05, rate: 1.1, v: 2 },    shadowcat: { pitch: 1.1, rate: 0.9, v: 0 },
  mujeokgom: { pitch: 0.65, rate: 0.9, v: 1 },
  ppika: { pitch: 1.5, rate: 1.1, v: 2 },       ppokkattu: { pitch: 1.4, rate: 1.05, v: 0 },
  andongki: { pitch: 1.2, rate: 0.95, v: 1 },   bugeul: { pitch: 1.15, rate: 1.0, v: 2 },
  mongsil: { pitch: 1.25, rate: 0.85, v: 0 },
  daewang: { pitch: 0.55, rate: 0.85, v: 1 },   tyranno: { pitch: 0.6, rate: 0.9, v: 0 },
  gocheolking: { pitch: 0.65, rate: 0.8, v: 2 }, blackwolf: { pitch: 0.7, rate: 0.9, v: 1 },
  darkmask: { pitch: 0.75, rate: 0.85, v: 0 },  wangmon: { pitch: 0.6, rate: 0.95, v: 2 },
};

// 호스트 20종: 이름을 넣은 다양한 대사 + 목소리 개성(인덱스로 분산)
const HOST_OK = (n) => [`${n}, 정답이야!`, '우와, 대단해!', '똑똑한걸!', '완벽해!', '최고야!', `${n}도 깜짝 놀랐어!`];
const HOST_NO = (n) => ['괜찮아, 다시 해볼까?', '아깝다! 한 번 더!', `${n}이랑 다시 도전!`, '천천히 생각해봐!'];
for (const [id, m] of Object.entries(HOST_META)) {
  VOICE[id] = { hi: [`안녕! 나는 ${m.name}이야!`], ok: HOST_OK(m.name), no: HOST_NO(m.name) };
  const i = parseInt(id.split('_')[1], 10);
  VOICE_STYLE[id] = { pitch: 0.85 + (i % 7) * 0.11, rate: 0.9 + (i % 4) * 0.08, v: i % 3 };
}

// ---------------------------------------------------------------------------
// 공통 얼굴 (눈/볼/입)
// ---------------------------------------------------------------------------
function face(ey = 48, dx = 11, my = 62, { cheek = '#ff9a9a', smile = true } = {}) {
  return html`<g>
    <ellipse cx=${50 - dx} cy=${ey} rx="6.5" ry="7.6" fill="#fff" />
    <ellipse cx=${50 + dx} cy=${ey} rx="6.5" ry="7.6" fill="#fff" />
    <circle cx=${50 - dx + 0.8} cy=${ey + 1} r="3.5" fill="#2b2b3a" />
    <circle cx=${50 + dx + 0.8} cy=${ey + 1} r="3.5" fill="#2b2b3a" />
    <circle cx=${50 - dx + 2.4} cy=${ey - 0.8} r="1.3" fill="#fff" />
    <circle cx=${50 + dx + 2.4} cy=${ey - 0.8} r="1.3" fill="#fff" />
    <circle cx=${50 - dx - 4.5} cy=${ey + 8} r="3.4" fill=${cheek} opacity="0.65" />
    <circle cx=${50 + dx + 4.5} cy=${ey + 8} r="3.4" fill=${cheek} opacity="0.65" />
    ${smile ? html`<path d=${`M ${50 - 7} ${my} Q 50 ${my + 6} ${50 + 7} ${my}`} stroke="#2b2b3a" stroke-width="2.4" fill="none" stroke-linecap="round" />` : null}
  </g>`;
}

const P = CHAR_THEME;

const DRAW = {
  kongryong: () => html`<g>
    <path d="M72 72 Q92 62 84 46 Q80 58 70 60Z" fill=${P.kongryong.c2} />
    <polygon points="42,22 48,32 36,32" fill=${P.kongryong.accent} />
    <polygon points="50,18 57,30 43,30" fill=${P.kongryong.accent} />
    <polygon points="58,22 64,32 52,32" fill=${P.kongryong.accent} />
    <ellipse cx="50" cy="56" rx="30" ry="29" fill=${P.kongryong.c2} />
    <ellipse cx="50" cy="64" rx="18" ry="16" fill=${P.kongryong.c1} />
    <rect x="33" y="80" width="12" height="14" rx="6" fill=${P.kongryong.c2} />
    <rect x="55" y="80" width="12" height="14" rx="6" fill=${P.kongryong.c2} />
    ${face(48, 11, 62)}
  </g>`,

  poopbot: () => html`<g>
    <path d="M76 60 q14 -2 16 8 q-10 4 -16 -8Z" fill="#cdeccb" />
    <circle cx="88" cy="66" r="3" fill="#cdeccb" />
    <line x1="50" y1="14" x2="50" y2="24" stroke=${P.poopbot.accent} stroke-width="2.5" />
    <circle cx="50" cy="12" r="4" fill=${P.poopbot.accent} />
    <rect x="22" y="30" width="56" height="50" rx="16" fill=${P.poopbot.c2} />
    <rect x="28" y="38" width="44" height="22" rx="11" fill="#27324a" />
    <circle cx="41" cy="49" r="5.5" fill="#7fe7ff" /><circle cx="59" cy="49" r="5.5" fill="#7fe7ff" />
    <circle cx="41" cy="49" r="2" fill="#fff" /><circle cx="59" cy="49" r="2" fill="#fff" />
    <rect x="40" y="66" width="20" height="6" rx="3" fill=${P.poopbot.accent} />
    <rect x="30" y="80" width="14" height="12" rx="5" fill=${P.poopbot.accent} />
    <rect x="56" y="80" width="14" height="12" rx="5" fill=${P.poopbot.accent} />
  </g>`,

  captainkorea: () => html`<g>
    <ellipse cx="50" cy="60" rx="24" ry="26" fill=${P.captainkorea.c2} />
    <circle cx="50" cy="60" r="15" fill="#fff" />
    <circle cx="50" cy="60" r="10" fill="#ff6b6b" />
    <polygon points="50,52 52.5,58 59,58 53.5,62 55.5,69 50,65 44.5,69 46.5,62 41,58 47.5,58" fill="#fff" />
    <rect x="34" y="82" width="12" height="11" rx="5" fill=${P.captainkorea.c2} />
    <rect x="54" y="82" width="12" height="11" rx="5" fill=${P.captainkorea.c2} />
    <circle cx="50" cy="32" r="17" fill="#ffe0bd" />
    <path d="M33 30 a17 17 0 0 1 34 0 l0 4 q-17 -7 -34 0Z" fill=${P.captainkorea.c2} />
    <path d="M50 15 l3 0 0 6 6 0 0 3 -6 0 0 6 -3 0 0 -6 -6 0 0 -3 6 0Z" fill="#fff" opacity=".9" />
    <circle cx="43" cy="32" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="32" r="2.6" fill="#2b2b3a" />
    <path d="M45 38 Q50 41 55 38" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>`,

  ppika: () => html`<g>
    <polygon points="22,46 8,36 18,44 6,52" fill=${P.ppika.c2} stroke=${P.ppika.accent} stroke-width="1.5" />
    <path d="M30 30 L22 8 L33 24 L37 26Z" fill=${P.ppika.c2} stroke=${P.ppika.accent} stroke-width="1.5" />
    <path d="M70 30 L78 8 L67 24 L63 26Z" fill=${P.ppika.c2} stroke=${P.ppika.accent} stroke-width="1.5" />
    <circle cx="28" cy="24" r="3" fill="#2b2b3a" /><circle cx="72" cy="24" r="3" fill="#2b2b3a" />
    <ellipse cx="50" cy="58" rx="28" ry="27" fill=${P.ppika.c2} />
    <circle cx="32" cy="62" r="4.5" fill="#ff6b6b" /><circle cx="68" cy="62" r="4.5" fill="#ff6b6b" />
    ${face(52, 12, 68)}
  </g>`,

  baboon: () => html`<g>
    <ellipse cx="50" cy="58" rx="28" ry="28" fill=${P.baboon.c2} />
    <circle cx="26" cy="52" r="9" fill=${P.baboon.c2} /><circle cx="74" cy="52" r="9" fill=${P.baboon.c2} />
    <circle cx="26" cy="52" r="4.5" fill="#f3c89a" /><circle cx="74" cy="52" r="4.5" fill="#f3c89a" />
    <ellipse cx="50" cy="62" rx="19" ry="20" fill=${P.baboon.c1} />
    <ellipse cx="50" cy="66" rx="6.5" ry="9" fill="#e07a8a" />
    <ellipse cx="43" cy="52" rx="5.5" ry="6.5" fill="#fff" /><ellipse cx="57" cy="52" rx="5.5" ry="6.5" fill="#fff" />
    <circle cx="43" cy="53" r="3" fill="#2b2b3a" /><circle cx="57" cy="53" r="3" fill="#2b2b3a" />
    <path d="M44 74 Q50 78 56 74" stroke="#7a4f25" stroke-width="2.2" fill="none" stroke-linecap="round" />
  </g>`,

  imagine: () => html`<g>
    <path d="M24 50 Q6 40 10 64 Q22 60 30 64Z" fill=${P.imagine.accent} />
    <path d="M76 50 Q94 40 90 64 Q78 60 70 64Z" fill=${P.imagine.accent} />
    <polygon points="40,20 45,32 35,32" fill=${P.imagine.accent} />
    <polygon points="60,20 65,32 55,32" fill=${P.imagine.accent} />
    <ellipse cx="50" cy="58" rx="27" ry="28" fill=${P.imagine.c2} />
    <ellipse cx="50" cy="66" rx="15" ry="14" fill=${P.imagine.c1} />
    <path d="M40 66 h20 M43 71 h14" stroke=${P.imagine.accent} stroke-width="2" stroke-linecap="round" />
    ${face(50, 11, 60)}
  </g>`,

  superabbit: () => html`<g>
    <polygon points="36,42 64,42 74,84 26,84" fill=${P.superabbit.accent} />
    <ellipse cx="38" cy="26" rx="6" ry="20" fill=${P.superabbit.c2} stroke="#dcdce6" stroke-width="1.5" />
    <ellipse cx="62" cy="26" rx="6" ry="20" fill=${P.superabbit.c2} stroke="#dcdce6" stroke-width="1.5" />
    <ellipse cx="38" cy="28" rx="2.6" ry="12" fill="#ffc2d6" /><ellipse cx="62" cy="28" rx="2.6" ry="12" fill="#ffc2d6" />
    <ellipse cx="50" cy="58" rx="26" ry="27" fill=${P.superabbit.c2} stroke="#e6e6ee" stroke-width="1.5" />
    <path d="M33 50 q17 -9 34 0 l0 5 q-17 -7 -34 0Z" fill=${P.superabbit.accent} />
    <circle cx="43" cy="50" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="50" r="2.6" fill="#2b2b3a" />
    <ellipse cx="50" cy="58" rx="3.2" ry="2.4" fill="#ff9a9a" />
    <path d="M45 64 Q50 67 55 64" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>`,

  balduncle: () => html`<g>
    <rect x="34" y="78" width="32" height="14" rx="7" fill=${P.balduncle.accent} />
    <circle cx="50" cy="50" r="30" fill=${P.balduncle.c2} />
    <path d="M24 44 q26 -34 52 0 q-26 -12 -52 0Z" fill=${P.balduncle.c2} />
    <ellipse cx="36" cy="50" rx="9" ry="3" fill="#fff" opacity=".5" />
    <circle cx="42" cy="48" r="8" fill="#fff" stroke="#8a5a2b" stroke-width="2" />
    <circle cx="58" cy="48" r="8" fill="#fff" stroke="#8a5a2b" stroke-width="2" />
    <line x1="50" y1="48" x2="50" y2="48" stroke="#8a5a2b" stroke-width="2" />
    <circle cx="42" cy="48" r="3" fill="#2b2b3a" /><circle cx="58" cy="48" r="3" fill="#2b2b3a" />
    <path d="M40 64 q10 8 20 0 q-10 4 -20 0Z" fill="#7a4f25" />
    <path d="M42 62 Q50 66 58 62" stroke="#7a4f25" stroke-width="2" fill="none" />
  </g>`,

  andongki: () => html`<g>
    <ellipse cx="50" cy="74" rx="26" ry="12" fill=${P.andongki.c2} />
    <path d="M30 74 Q34 50 50 50 Q66 50 70 74Z" fill=${P.andongki.c2} />
    <path d="M38 54 Q40 38 50 38 Q60 38 62 54Z" fill=${P.andongki.c1} />
    <path d="M44 42 Q50 30 56 42Z" fill=${P.andongki.c2} />
    ${face(60, 9, 70)}
  </g>`,

  kkongryong: () => html`<g>
    <path d="M28 72 Q8 62 16 46 Q20 58 30 60Z" fill=${P.kkongryong.c2} />
    <path d="M38 24 q4 -10 10 0 q4 -12 10 0 q4 -8 8 2 l-28 4Z" fill=${P.kkongryong.accent} />
    <ellipse cx="50" cy="56" rx="30" ry="29" fill=${P.kkongryong.c2} />
    <ellipse cx="50" cy="64" rx="18" ry="16" fill=${P.kkongryong.c1} />
    <rect x="33" y="80" width="12" height="14" rx="6" fill=${P.kkongryong.c2} />
    <rect x="55" y="80" width="12" height="14" rx="6" fill=${P.kkongryong.c2} />
    <path d="M36 42 q4 -4 8 0 M56 42 q4 -4 8 0" stroke="#2b2b3a" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <circle cx="41" cy="52" r="3.4" fill="#2b2b3a" /><circle cx="59" cy="52" r="3.4" fill="#2b2b3a" />
    <circle cx="35" cy="59" r="3.4" fill="#ff9ac8" opacity=".8" /><circle cx="65" cy="59" r="3.4" fill="#ff9ac8" opacity=".8" />
    <path d="M44 64 Q50 69 56 64" stroke="#2b2b3a" stroke-width="2.4" fill="none" stroke-linecap="round" />
  </g>`,

  ppokkattu: () => html`<g>
    <path d="M50 12 q-3 8 0 12 M50 12 q5 6 2 12" stroke=${P.ppokkattu.accent} stroke-width="2.5" fill="none" stroke-linecap="round" />
    <ellipse cx="50" cy="58" rx="27" ry="28" fill=${P.ppokkattu.c2} />
    <path d="M23 58 q-10 4 -6 14 q8 -2 10 -8Z" fill=${P.ppokkattu.accent} />
    <path d="M77 58 q10 4 6 14 q-8 -2 -10 -8Z" fill=${P.ppokkattu.accent} />
    <ellipse cx="50" cy="68" rx="16" ry="13" fill=${P.ppokkattu.c1} />
    <polygon points="50,56 57,62 50,67 43,62" fill="#ff8f3f" />
    <rect x="38" y="84" width="8" height="8" rx="3" fill="#ff8f3f" />
    <rect x="54" y="84" width="8" height="8" rx="3" fill="#ff8f3f" />
    ${face(48, 11, 0, { smile: false })}
  </g>`,

  // ---- W1 공룡 친구들 ----
  bbyeo: () => html`<g>
    <polygon points="44,18 50,10 56,18 52,18 52,26 48,26 48,18" fill="#f8f6ef" stroke=${P.bbyeo.accent} stroke-width="2" />
    <ellipse cx="50" cy="56" rx="29" ry="28" fill=${P.bbyeo.c2} />
    <path d="M32 56 h36 M34 64 h32 M38 72 h24" stroke="#fff" stroke-width="5" stroke-linecap="round" />
    <path d="M32 56 h36 M34 64 h32 M38 72 h24" stroke=${P.bbyeo.accent} stroke-width="1.5" stroke-linecap="round" opacity=".4" />
    <rect x="34" y="80" width="12" height="13" rx="6" fill=${P.bbyeo.c2} />
    <rect x="54" y="80" width="12" height="13" rx="6" fill=${P.bbyeo.c2} />
    ${face(44, 11, 50)}
  </g>`,
  allog: () => html`<g>
    <path d="M28 62 a22 26 0 0 1 44 0 l0 8 a22 16 0 0 1 -44 0Z" fill="#fff" stroke="#e0d8c0" stroke-width="2" />
    <path d="M28 62 l7 6 7 -7 8 7 8 -7 7 7 7 -6" fill="none" stroke="#e0d8c0" stroke-width="2.5" />
    <circle cx="50" cy="38" r="20" fill=${P.allog.c2} />
    <polygon points="46,16 50,24 42,24" fill=${P.allog.accent} />
    <circle cx="43" cy="36" r="3" fill="#2b2b3a" /><circle cx="57" cy="36" r="3" fill="#2b2b3a" />
    <circle cx="38" cy="43" r="3" fill="#ff9a9a" opacity=".7" /><circle cx="62" cy="43" r="3" fill="#ff9a9a" opacity=".7" />
    <path d="M45 45 Q50 49 55 45" stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <circle cx="34" cy="70" r="3" fill=${P.allog.c2} /><circle cx="50" cy="74" r="3" fill=${P.allog.accent} /><circle cx="66" cy="70" r="3" fill=${P.allog.c2} />
  </g>`,

  // ---- W2 로봇 친구들 ----
  drill: () => html`<g>
    <polygon points="50,6 58,26 42,26" fill=${P.drill.accent} />
    <path d="M46 12 l8 4 M44 18 l12 5" stroke="#fff" stroke-width="2" opacity=".6" />
    <rect x="26" y="26" width="48" height="42" rx="12" fill=${P.drill.c2} />
    <rect x="32" y="34" width="36" height="16" rx="8" fill="#27324a" />
    <circle cx="42" cy="42" r="4.5" fill="#ffe27a" /><circle cx="58" cy="42" r="4.5" fill="#ffe27a" />
    <rect x="38" y="56" width="24" height="5" rx="2.5" fill=${P.drill.accent} />
    <rect x="30" y="70" width="16" height="18" rx="6" fill=${P.drill.accent} />
    <rect x="54" y="70" width="16" height="18" rx="6" fill=${P.drill.accent} />
    <circle cx="38" cy="88" r="6" fill="#2b2b3a" /><circle cx="62" cy="88" r="6" fill="#2b2b3a" />
  </g>`,
  bbabang: () => html`<g>
    <path d="M20 62 l8 -18 q3 -6 10 -6 h24 q7 0 10 6 l8 18Z" fill=${P.bbabang.c2} />
    <path d="M34 44 h32 l5 12 h-42Z" fill="#bfe4ff" />
    <rect x="16" y="60" width="68" height="18" rx="9" fill=${P.bbabang.accent} />
    <circle cx="32" cy="80" r="9" fill="#2b2b3a" /><circle cx="32" cy="80" r="3.6" fill="#cfd6e0" />
    <circle cx="68" cy="80" r="9" fill="#2b2b3a" /><circle cx="68" cy="80" r="3.6" fill="#cfd6e0" />
    <circle cx="22" cy="66" r="3.5" fill="#ffe27a" /><circle cx="78" cy="66" r="3.5" fill="#ffe27a" />
    <circle cx="43" cy="52" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="52" r="2.6" fill="#2b2b3a" />
    <path d="M46 56 Q50 59 54 56" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>`,
  chulkung: () => html`<g>
    <rect x="40" y="12" width="20" height="10" rx="3" fill=${P.chulkung.accent} />
    <rect x="24" y="22" width="52" height="48" rx="8" fill=${P.chulkung.c2} />
    <circle cx="30" cy="28" r="2" fill="#fff" /><circle cx="70" cy="28" r="2" fill="#fff" />
    <circle cx="30" cy="64" r="2" fill="#fff" /><circle cx="70" cy="64" r="2" fill="#fff" />
    <rect x="32" y="32" width="36" height="18" rx="4" fill="#27324a" />
    <rect x="38" y="38" width="8" height="6" rx="2" fill="#7fe7ff" /><rect x="54" y="38" width="8" height="6" rx="2" fill="#7fe7ff" />
    <rect x="36" y="56" width="28" height="6" rx="3" fill=${P.chulkung.accent} />
    <rect x="28" y="72" width="18" height="16" rx="4" fill=${P.chulkung.accent} />
    <rect x="54" y="72" width="18" height="16" rx="4" fill=${P.chulkung.accent} />
  </g>`,
  ppiriri: () => html`<g>
    <line x1="36" y1="20" x2="30" y2="8" stroke=${P.ppiriri.accent} stroke-width="2.5" /><circle cx="30" cy="8" r="3.5" fill=${P.ppiriri.accent} />
    <line x1="64" y1="20" x2="70" y2="8" stroke=${P.ppiriri.accent} stroke-width="2.5" /><circle cx="70" cy="8" r="3.5" fill=${P.ppiriri.accent} />
    <ellipse cx="50" cy="52" rx="28" ry="30" fill=${P.ppiriri.c2} />
    <ellipse cx="42" cy="44" rx="6" ry="7" fill="#fff" /><ellipse cx="58" cy="44" rx="6" ry="7" fill="#fff" />
    <circle cx="43" cy="45" r="3" fill="#2b2b3a" /><circle cx="57" cy="45" r="3" fill="#2b2b3a" />
    <rect x="38" y="60" width="24" height="12" rx="6" fill="#27324a" />
    <path d="M42 66 h16 M42 63 h16 M42 69 h16" stroke="#7fe7ff" stroke-width="1.6" />
    <path d="M18 46 q-6 6 0 12 M82 46 q6 6 0 12" stroke=${P.ppiriri.accent} stroke-width="3" fill="none" stroke-linecap="round" />
  </g>`,

  // ---- W3 특공대 친구들 ----
  pungpung: () => html`<g>
    <path d="M56 16 q10 -8 14 2" stroke="#8a5a2b" stroke-width="3" fill="none" />
    <circle cx="72" cy="16" r="4" fill="#ffd54f" /><path d="M69 12 l6 8 M75 12 l-6 8" stroke="#ff8f3f" stroke-width="2" />
    <circle cx="50" cy="56" r="30" fill=${P.pungpung.c2} />
    <path d="M26 46 q24 -10 48 0 l0 8 q-24 -8 -48 0Z" fill="#ff8f3f" opacity=".9" />
    <ellipse cx="41" cy="58" rx="5.5" ry="6.5" fill="#fff" /><ellipse cx="59" cy="58" rx="5.5" ry="6.5" fill="#fff" />
    <circle cx="42" cy="59" r="3" fill="#2b2b3a" /><circle cx="58" cy="59" r="3" fill="#2b2b3a" />
    <path d="M44 72 Q50 76 56 72" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <ellipse cx="36" cy="42" rx="7" ry="4" fill="#fff" opacity=".25" />
  </g>`,
  syungsyung: () => html`<g>
    <polygon points="50,8 62,30 38,30" fill=${P.syungsyung.accent} />
    <rect x="38" y="30" width="24" height="42" rx="10" fill=${P.syungsyung.c2} />
    <circle cx="50" cy="44" r="8" fill="#bfe4ff" stroke="#fff" stroke-width="2.5" />
    <circle cx="47" cy="43" r="2" fill="#2b2b3a" /><circle cx="53" cy="43" r="2" fill="#2b2b3a" />
    <path d="M47 47 Q50 49 53 47" stroke="#2b2b3a" stroke-width="1.6" fill="none" stroke-linecap="round" />
    <polygon points="38,58 26,74 38,72" fill=${P.syungsyung.accent} />
    <polygon points="62,58 74,74 62,72" fill=${P.syungsyung.accent} />
    <path d="M44 74 q6 12 12 0 q-6 16 -12 0Z" fill="#ffd54f" />
    <path d="M46 76 q4 8 8 0" fill="#ff6b3d" />
  </g>`,
  salgeum: () => html`<g>
    <ellipse cx="50" cy="54" rx="27" ry="28" fill=${P.salgeum.c2} />
    <path d="M23 46 q27 -12 54 0 l0 14 q-27 -10 -54 0Z" fill="#3a5a39" />
    <ellipse cx="41" cy="52" rx="6" ry="5" fill="#fff" /><ellipse cx="59" cy="52" rx="6" ry="5" fill="#fff" />
    <circle cx="42" cy="52" r="2.8" fill="#2b2b3a" /><circle cx="58" cy="52" r="2.8" fill="#2b2b3a" />
    <path d="M74 60 q14 2 10 14 q-8 -2 -12 -8Z" fill="#3a5a39" />
    <path d="M44 70 Q50 73 56 70" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6" />
    <rect x="34" y="82" width="10" height="10" rx="4" fill="#3a5a39" />
    <rect x="56" y="82" width="10" height="10" rx="4" fill="#3a5a39" />
  </g>`,

  // ---- W4 히어로 친구들 ----
  bulkkot: () => html`<g>
    <path d="M50 4 q10 12 2 20 q12 -4 8 12 l-20 0 q-8 -16 10 -32Z" fill="#ff6b3d" />
    <path d="M48 14 q6 8 0 14 l8 0 q4 -8 -8 -14Z" fill="#ffd54f" />
    <polygon points="34,42 66,42 74,84 26,84" fill=${P.bulkkot.accent} />
    <ellipse cx="50" cy="56" rx="21" ry="22" fill=${P.bulkkot.c2} />
    <path d="M50 46 q8 8 0 16 q-8 -8 0 -16Z" fill="#fff" />
    <circle cx="50" cy="34" r="15" fill="#ffe0bd" />
    <path d="M36 32 q14 -10 28 0 l0 5 q-14 -7 -28 0Z" fill="#ff6b3d" />
    <circle cx="44" cy="34" r="2.4" fill="#2b2b3a" /><circle cx="56" cy="34" r="2.4" fill="#2b2b3a" />
    <path d="M46 39 Q50 42 54 39" stroke="#2b2b3a" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <rect x="36" y="80" width="11" height="11" rx="5" fill=${P.bulkkot.c2} />
    <rect x="53" y="80" width="11" height="11" rx="5" fill=${P.bulkkot.c2} />
  </g>`,
  shadowcat: () => html`<g>
    <polygon points="30,26 38,10 46,24" fill=${P.shadowcat.c2} />
    <polygon points="70,26 62,10 54,24" fill=${P.shadowcat.c2} />
    <polygon points="33,23 38,14 43,22" fill="#ffc2d6" /><polygon points="67,23 62,14 57,22" fill="#ffc2d6" />
    <ellipse cx="50" cy="52" rx="27" ry="28" fill=${P.shadowcat.c2} />
    <path d="M23 44 q27 -10 54 0 l0 12 q-27 -8 -54 0Z" fill=${P.shadowcat.accent} />
    <ellipse cx="41" cy="50" rx="6.5" ry="5.5" fill="#ffe27a" /><ellipse cx="59" cy="50" rx="6.5" ry="5.5" fill="#ffe27a" />
    <ellipse cx="41" cy="50" rx="2" ry="4" fill="#2b2b3a" /><ellipse cx="59" cy="50" rx="2" ry="4" fill="#2b2b3a" />
    <path d="M44 64 q3 3 6 0 q3 3 6 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M20 58 h10 M20 64 h9 M70 58 h10 M71 64 h9" stroke="#fff" stroke-width="1.6" opacity=".5" />
    <path d="M74 70 q16 4 10 18" stroke=${P.shadowcat.c2} stroke-width="6" fill="none" stroke-linecap="round" />
  </g>`,
  mujeokgom: () => html`<g>
    <circle cx="30" cy="26" r="10" fill=${P.mujeokgom.c2} /><circle cx="70" cy="26" r="10" fill=${P.mujeokgom.c2} />
    <circle cx="30" cy="26" r="4.5" fill="#f0d8b8" /><circle cx="70" cy="26" r="4.5" fill="#f0d8b8" />
    <polygon points="32,50 68,50 74,88 26,88" fill="#e04a4a" />
    <ellipse cx="50" cy="44" rx="26" ry="25" fill=${P.mujeokgom.c2} />
    <ellipse cx="50" cy="52" rx="13" ry="10" fill="#f0d8b8" />
    <ellipse cx="50" cy="48" rx="4" ry="3" fill="#2b2b3a" />
    <circle cx="41" cy="40" r="3" fill="#2b2b3a" /><circle cx="59" cy="40" r="3" fill="#2b2b3a" />
    <path d="M46 56 Q50 59 54 56" stroke="#7a4f25" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M50 62 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1Z" fill="#ffd54f" />
  </g>`,

  // ---- W5 몬스터 친구들 ----
  bugeul: () => html`<g>
    <circle cx="28" cy="20" r="5" fill="#bfe9ff" /><circle cx="70" cy="14" r="4" fill="#bfe9ff" /><circle cx="80" cy="30" r="3" fill="#bfe9ff" />
    <path d="M50 16 q-9 12 0 20 q9 -8 0 -20Z" fill="#8fd8ff" />
    <ellipse cx="50" cy="58" rx="28" ry="27" fill=${P.bugeul.c2} />
    <ellipse cx="50" cy="64" rx="16" ry="14" fill=${P.bugeul.c1} />
    <circle cx="38" cy="70" r="4" fill="#fff" opacity=".6" /><circle cx="60" cy="74" r="3" fill="#fff" opacity=".6" />
    ${face(50, 11, 66)}
  </g>`,
  mongsil: () => html`<g>
    <circle cx="32" cy="52" r="16" fill=${P.mongsil.c2} />
    <circle cx="68" cy="52" r="16" fill=${P.mongsil.c2} />
    <circle cx="50" cy="42" r="19" fill=${P.mongsil.c2} />
    <ellipse cx="50" cy="60" rx="30" ry="20" fill=${P.mongsil.c2} />
    <ellipse cx="50" cy="64" rx="17" ry="11" fill="#fff" />
    ${face(52, 10, 66)}
    <path d="M36 82 l-3 8 M50 84 l0 8 M64 82 l3 8" stroke="#9ad0f0" stroke-width="3" stroke-linecap="round" opacity=".7" />
  </g>`,

  // ---- 월드 보스들 ----
  tyranno: () => html`<g>
    <path d="M36 18 L42 8 L48 18 L54 8 L60 18 L64 12 L66 20Z" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" />
    <ellipse cx="52" cy="52" rx="30" ry="28" fill=${P.tyranno.c2} />
    <path d="M40 22 q-14 4 -12 18 q8 -4 14 -2Z" fill=${P.tyranno.c2} />
    <path d="M30 62 q-14 -2 -16 10 q10 4 18 -2Z" fill=${P.tyranno.c2} />
    <ellipse cx="56" cy="62" rx="18" ry="14" fill=${P.tyranno.c1} />
    <path d="M42 66 l5 7 5 -7 5 7 5 -7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    <path d="M34 40 l10 5 M70 40 l-10 5" stroke="#2b2b3a" stroke-width="3" stroke-linecap="round" />
    <ellipse cx="43" cy="49" rx="5.5" ry="6" fill="#ffe27a" /><ellipse cx="63" cy="49" rx="5.5" ry="6" fill="#ffe27a" />
    <circle cx="44" cy="50" r="3" fill="#2b2b3a" /><circle cx="62" cy="50" r="3" fill="#2b2b3a" />
    <polygon points="46,24 50,30 42,30" fill=${P.tyranno.accent} />
    <rect x="38" y="80" width="13" height="13" rx="6" fill=${P.tyranno.c2} />
    <rect x="58" y="80" width="13" height="13" rx="6" fill=${P.tyranno.c2} />
  </g>`,
  gocheolking: () => html`<g>
    <path d="M34 16 L40 6 L46 16 L52 6 L58 16 L64 8 L66 18Z" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" />
    <rect x="22" y="18" width="56" height="54" rx="10" fill=${P.gocheolking.c2} />
    <circle cx="29" cy="25" r="2.4" fill="#fff" opacity=".7" /><circle cx="71" cy="25" r="2.4" fill="#fff" opacity=".7" />
    <path d="M60 24 q10 2 8 10" stroke="#c88a3a" stroke-width="4" fill="none" opacity=".6" />
    <rect x="30" y="28" width="40" height="20" rx="5" fill="#27324a" />
    <rect x="36" y="34" width="10" height="7" rx="2" fill="#ff8f3f" /><rect x="54" y="34" width="10" height="7" rx="2" fill="#ff8f3f" />
    <path d="M36 56 h28 M40 62 h20" stroke=${P.gocheolking.accent} stroke-width="4" stroke-linecap="round" />
    <rect x="26" y="74" width="20" height="16" rx="5" fill=${P.gocheolking.accent} />
    <rect x="54" y="74" width="20" height="16" rx="5" fill=${P.gocheolking.accent} />
    <circle cx="18" cy="46" r="7" fill=${P.gocheolking.accent} /><circle cx="82" cy="46" r="7" fill=${P.gocheolking.accent} />
  </g>`,
  blackwolf: () => html`<g>
    <polygon points="28,28 34,8 44,24" fill=${P.blackwolf.c2} />
    <polygon points="72,28 66,8 56,24" fill=${P.blackwolf.c2} />
    <polygon points="31,24 35,13 41,22" fill="#8a8aa0" /><polygon points="69,24 65,13 59,22" fill="#8a8aa0" />
    <ellipse cx="50" cy="54" rx="29" ry="30" fill=${P.blackwolf.c2} />
    <path d="M21 46 q29 -12 58 0 l0 10 q-29 -8 -58 0Z" fill=${P.blackwolf.accent} />
    <ellipse cx="40" cy="50" rx="6.5" ry="5.5" fill="#ffe27a" /><ellipse cx="60" cy="50" rx="6.5" ry="5.5" fill="#ffe27a" />
    <ellipse cx="40" cy="50" rx="2.2" ry="4" fill="#2b2b3a" /><ellipse cx="60" cy="50" rx="2.2" ry="4" fill="#2b2b3a" />
    <path d="M64 38 l8 -6" stroke="#8a8aa0" stroke-width="2.5" stroke-linecap="round" />
    <ellipse cx="50" cy="66" rx="10" ry="8" fill="#e0e0e8" />
    <ellipse cx="50" cy="62" rx="3.5" ry="2.6" fill="#2b2b3a" />
    <path d="M44 70 l3 4 3 -4 3 4 3 -4" fill="none" stroke="#2b2b3a" stroke-width="2" stroke-linecap="round" />
  </g>`,
  darkmask: () => html`<g>
    <path d="M26 40 Q20 90 34 88 L66 88 Q80 90 74 40Z" fill=${P.darkmask.accent} />
    <ellipse cx="50" cy="44" rx="25" ry="26" fill=${P.darkmask.c2} />
    <path d="M25 40 q25 -10 50 0 l0 12 q-25 -8 -50 0Z" fill="#2b2038" />
    <path d="M33 44 l10 -4 2 8Z" fill="#ffe27a" /><path d="M67 44 l-10 -4 -2 8Z" fill="#ffe27a" />
    <path d="M44 60 Q50 64 56 60" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M50 12 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1Z" fill="#ffce4f" />
    <path d="M20 52 q-8 10 2 16 M80 52 q8 10 -2 16" stroke=${P.darkmask.accent} stroke-width="5" fill="none" stroke-linecap="round" />
  </g>`,
  wangmon: () => html`<g>
    <path d="M30 22 q-8 -14 6 -12 q2 8 -2 12Z" fill=${P.wangmon.accent} />
    <path d="M70 22 q8 -14 -6 -12 q-2 8 2 12Z" fill=${P.wangmon.accent} />
    <path d="M38 16 L44 6 L50 16 L56 6 L62 16Z" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" />
    <ellipse cx="50" cy="56" rx="31" ry="30" fill=${P.wangmon.c2} />
    <ellipse cx="50" cy="66" rx="19" ry="15" fill=${P.wangmon.c1} />
    <circle cx="50" cy="42" r="8" fill="#fff" /><circle cx="50" cy="43" r="4.2" fill="#2b2b3a" />
    <circle cx="52" cy="41" r="1.4" fill="#fff" />
    <circle cx="32" cy="52" r="4" fill="#fff" /><circle cx="32" cy="52" r="2" fill="#2b2b3a" />
    <circle cx="68" cy="52" r="4" fill="#fff" /><circle cx="68" cy="52" r="2" fill="#2b2b3a" />
    <path d="M40 70 l4 5 4 -5 4 5 4 -5 4 5" fill="none" stroke="#a82858" stroke-width="2.5" stroke-linecap="round" />
    <path d="M22 74 q-8 8 0 14 M78 74 q8 8 0 14" stroke=${P.wangmon.accent} stroke-width="4" fill="none" stroke-linecap="round" />
  </g>`,

  daewang: () => html`<g>
    <path d="M28 26 L34 12 L42 24 L50 8 L58 24 L66 12 L72 26Z" fill="#ffce4f" stroke="#e0a400" stroke-width="2" stroke-linejoin="round" />
    <circle cx="34" cy="14" r="3" fill="#ff6b6b" /><circle cx="50" cy="10" r="3" fill="#5ad9ff" /><circle cx="66" cy="14" r="3" fill="#7bd88f" />
    <ellipse cx="50" cy="60" rx="32" ry="32" fill=${P.daewang.c2} />
    <ellipse cx="50" cy="70" rx="20" ry="17" fill=${P.daewang.c1} />
    <path d="M34 44 l10 6 M66 44 l-10 6" stroke="#2b2b3a" stroke-width="3" stroke-linecap="round" />
    <ellipse cx="41" cy="54" rx="6" ry="7" fill="#fff" /><ellipse cx="59" cy="54" rx="6" ry="7" fill="#fff" />
    <circle cx="42" cy="55" r="3.2" fill="#2b2b3a" /><circle cx="58" cy="55" r="3.2" fill="#2b2b3a" />
    <path d="M40 70 Q50 76 60 70" stroke="#2b2b3a" stroke-width="2.6" fill="none" stroke-linecap="round" />
    <polygon points="43,70 46,76 49,70" fill="#fff" /><polygon points="51,70 54,76 57,70" fill="#fff" />
    <path d="M20 74 q-8 6 -2 12 M80 74 q8 6 2 12" stroke=${P.daewang.accent} stroke-width="4" fill="none" stroke-linecap="round" />
  </g>`,
};

// ---------------------------------------------------------------------------
// 변형 캐릭터 렌더러 (호스트 20종용): 몸 실루엣 + 장식 + 얼굴 조합
// ---------------------------------------------------------------------------
function hostBody(shape, c2, c1) {
  if (shape === 'tall') return html`<g><ellipse cx="50" cy="56" rx="24" ry="32" fill=${c2} /><ellipse cx="50" cy="62" rx="13" ry="18" fill=${c1} /></g>`;
  if (shape === 'bean') return html`<g><path d="M26 58 q-4 -34 24 -34 q28 0 24 34 q-2 24 -24 24 q-22 0 -24 -24Z" fill=${c2} /><ellipse cx="50" cy="64" rx="15" ry="13" fill=${c1} /></g>`;
  if (shape === 'egg') return html`<g><path d="M50 20 q22 6 22 40 q0 24 -22 24 q-22 0 -22 -24 q0 -34 22 -40Z" fill=${c2} /><ellipse cx="50" cy="62" rx="14" ry="15" fill=${c1} /></g>`;
  return html`<g><ellipse cx="50" cy="56" rx="30" ry="28" fill=${c2} /><ellipse cx="50" cy="64" rx="16" ry="14" fill=${c1} /></g>`; // round
}
function hostTopper(topper, accent, c2) {
  switch (topper) {
    case 'horn': return html`<polygon points="50,8 56,26 44,26" fill=${accent} />`;
    case 'antenna': return html`<g><line x1="50" y1="14" x2="50" y2="26" stroke=${accent} stroke-width="3" /><circle cx="50" cy="11" r="4" fill=${accent} /></g>`;
    case 'ears': return html`<g><ellipse cx="32" cy="26" rx="7" ry="12" fill=${c2} /><ellipse cx="68" cy="26" rx="7" ry="12" fill=${c2} /></g>`;
    case 'spike': return html`<g><polygon points="40,20 45,30 35,30" fill=${accent} /><polygon points="50,15 56,28 44,28" fill=${accent} /><polygon points="60,20 65,30 55,30" fill=${accent} /></g>`;
    case 'leaf': return html`<g><line x1="50" y1="18" x2="50" y2="28" stroke=${accent} stroke-width="3" /><path d="M50 20 q12 -8 16 2 q-12 6 -16 -2Z" fill=${c2} /></g>`;
    case 'bolt': return html`<polygon points="54,8 40,28 50,28 46,40 62,20 52,20" fill=${accent} />`;
    case 'tuft': return html`<path d="M44 24 q6 -14 12 0 q-6 -4 -12 0Z" fill=${accent} />`;
    default: return null;
  }
}
function variantChar(meta, i) {
  const { palette: p, shape, topper } = meta;
  const eyeDx = 9 + (i % 3) * 2;
  const eyeY = 52 + (i % 2) * 2;
  const cheek = ['#ff9a9a', '#ffb0c8', '#ffc27a'][i % 3];
  return html`<g>
    ${hostTopper(topper, p.accent, p.c2)}
    ${hostBody(shape, p.c2, p.c1)}
    <circle cx=${50 - eyeDx} cy=${eyeY} r="6.5" fill="#fff" /><circle cx=${50 + eyeDx} cy=${eyeY} r="6.5" fill="#fff" />
    <circle cx=${50 - eyeDx + 0.5} cy=${eyeY + 1} r="3.3" fill="#2b2b3a" /><circle cx=${50 + eyeDx + 0.5} cy=${eyeY + 1} r="3.3" fill="#2b2b3a" />
    <circle cx=${50 - eyeDx + 2} cy=${eyeY - 1} r="1.2" fill="#fff" /><circle cx=${50 + eyeDx + 2} cy=${eyeY - 1} r="1.2" fill="#fff" />
    <circle cx=${50 - eyeDx - 4} cy=${eyeY + 8} r="3" fill=${cheek} opacity=".6" /><circle cx=${50 + eyeDx + 4} cy=${eyeY + 8} r="3" fill=${cheek} opacity=".6" />
    <path d=${`M ${50 - 6} ${eyeY + 12} Q 50 ${eyeY + 17} ${50 + 6} ${eyeY + 12}`} stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />
  </g>`;
}

// ---------------------------------------------------------------------------
// 캐릭터 컴포넌트
// ---------------------------------------------------------------------------
export function Character({ kind = 'kongryong', size = 80, anim = 'float', style }) {
  let inner;
  if (HOST_META[kind]) {
    inner = variantChar(HOST_META[kind], parseInt(kind.split('_')[1], 10));
  } else {
    inner = (DRAW[kind] || DRAW.kongryong)();
  }
  return html`<svg class=${`char anim-${anim}`} width=${size} height=${size} viewBox="0 0 100 100"
    style=${{ overflow: 'visible', ...(style || {}) }}>${inner}</svg>`;
}

// ---------------------------------------------------------------------------
// 세기용 아이템 (이모지 대신 SVG) — 도토리/사과 느낌
// ---------------------------------------------------------------------------
export function Item({ size = 40, kind = 'apple', faded = false }) {
  const o = faded ? 0.25 : 1;
  const arts = {
    apple: html`<g opacity=${o}><path d="M50 30 C30 30 24 48 30 66 C34 80 44 86 50 86 C56 86 66 80 70 66 C76 48 70 30 50 30Z" fill="#ff6b6b"/>
      <ellipse cx="42" cy="48" rx="6" ry="9" fill="#fff" opacity=".4"/>
      <path d="M50 30 q2 -10 10 -12" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M52 26 q8 -4 12 2 q-8 4 -12 -2Z" fill="#7bd88f"/></g>`,
    acorn: html`<g opacity=${o}><ellipse cx="50" cy="64" rx="20" ry="22" fill="#caa46a"/>
      <path d="M28 50 q22 -14 44 0 q-4 8 -22 8 q-18 0 -22 -8Z" fill="#8a5a2b"/>
      <rect x="48" y="32" width="4" height="8" rx="2" fill="#6b4420"/></g>`,
    star: html`<polygon opacity=${o} points="50,24 60,46 84,48 66,64 72,86 50,74 28,86 34,64 16,48 40,46" fill="#ffce4f" stroke="#e0a400" stroke-width="2"/>`,
  };
  return html`<svg width=${size} height=${size} viewBox="0 0 100 100" style=${{ overflow: 'visible' }}>${arts[kind] || arts.apple}</svg>`;
}

// ---------------------------------------------------------------------------
// UI 아이콘 (이모지 대신 SVG)
// ---------------------------------------------------------------------------
const ICONS = {
  speaker: (c) => html`<g fill=${c}><path d="M14 40 H30 L46 24 V76 L30 60 H14Z"/><path d="M58 38 q10 12 0 24" stroke=${c} stroke-width="6" fill="none" stroke-linecap="round"/><path d="M66 30 q18 20 0 40" stroke=${c} stroke-width="6" fill="none" stroke-linecap="round"/></g>`,
  lock: (c) => html`<g fill=${c}><rect x="26" y="46" width="48" height="38" rx="8"/><path d="M34 46 V36 a16 16 0 0 1 32 0 V46" stroke=${c} stroke-width="8" fill="none"/><circle cx="50" cy="62" r="6" fill="#fff"/></g>`,
  crown: (c) => html`<path d="M18 70 L26 34 L40 54 L50 28 L60 54 L74 34 L82 70Z" fill=${c} stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`,
  refresh: (c) => html`<g fill="none" stroke=${c} stroke-width="8" stroke-linecap="round"><path d="M74 40 a26 26 0 1 0 4 18"/><polyline points="74,22 76,42 56,40"/></g>`,
  star: (c) => html`<polygon points="50,16 62,42 90,44 68,63 76,90 50,74 24,90 32,63 10,44 38,42" fill=${c}/>`,
  gift: (c) => html`<g fill=${c}><rect x="22" y="44" width="56" height="40" rx="6"/><rect x="18" y="32" width="64" height="16" rx="4"/><rect x="44" y="32" width="12" height="52" fill="#fff" opacity=".85"/><path d="M50 32 q-16 -18 -22 -4 q-2 10 22 4Z"/><path d="M50 32 q16 -18 22 -4 q2 10 -22 4Z"/></g>`,
  user: (c) => html`<g fill=${c}><circle cx="50" cy="36" r="16"/><path d="M22 82 a28 24 0 0 1 56 0Z"/></g>`,
  book: (c) => html`<g fill=${c}><path d="M50 28 Q34 20 20 26 V76 Q34 70 50 78 Q66 70 80 76 V26 Q66 20 50 28Z"/><path d="M50 28 V78" stroke="#fff" stroke-width="3"/></g>`,
  back: (c) => html`<path d="M60 24 L34 50 L60 76" fill="none" stroke=${c} stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  check: (c) => html`<path d="M24 52 L44 72 L78 30" fill="none" stroke=${c} stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`,
  del: (c) => html`<g fill="none" stroke=${c} stroke-width="7" stroke-linecap="round"><path d="M40 28 H82 V72 H40 L18 50Z"/><path d="M52 42 L70 58 M70 42 L52 58"/></g>`,
  bolt: (c) => html`<polygon points="56,12 28,56 48,56 42,88 72,40 50,40" fill=${c}/>`,
  logout: (c) => html`<g fill="none" stroke=${c} stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M44 24 H24 V76 H44"/><polyline points="60,34 80,50 60,66"/><line x1="80" y1="50" x2="40" y2="50"/></g>`,
  dots: (c) => html`<g fill=${c}><circle cx="22" cy="50" r="9"/><circle cx="50" cy="50" r="9"/><circle cx="78" cy="50" r="9"/></g>`,
};
export function Icon({ name, size = 28, color = '#34324a' }) {
  const d = ICONS[name] || ICONS.star;
  return html`<svg width=${size} height=${size} viewBox="0 0 100 100" style=${{ display: 'block' }}>${d(color)}</svg>`;
}

// 임의 대사 고르기 (인덱스 기반 — 재현 가능하게 호출부에서 seed 전달)
export function pickLine(kind, type, seed = 0) {
  const arr = (VOICE[kind] && VOICE[kind][type]) || [''];
  return arr[Math.abs(seed) % arr.length];
}
