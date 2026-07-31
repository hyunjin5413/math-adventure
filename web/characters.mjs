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
  // W3 특공대 친구들 (검은늑대는 보스 → 스페셜 친구로 이동)
  pungpung: '뽕따폭탄병', syungsyung: '캡틴아프리카', salgeum: '살금닌자',
  // W4 히어로 친구들
  bulkkot: '불꽃뽕맨', shadowcat: '그림자냥냥', mujeokgom: '무적꼼',
  // W5 몬스터 친구들
  bugeul: '뽀글몬', mongsil: '뭉게뭉게',
  // 신규 스페셜 친구들
  clonetrooper: '끌론트루퍼봇', stormtrooper: '스똠트루퍼봇', darthbot: '따스베이더봇',
  roborabbit: '로보레빗보이', ultraviking: '울트라킹바이킹',
  poopoo: '응가똥', frozenbread: '꽁꽁꽁아저씨빵',
  // 보스들
  daewang: '대왕',
  tyranno: '티라노왕', professorx: '프로뻬서엑스', shadowking: '그림자 대마왕',
  darkmask: '다크마스크', wangmon: '왕몬',
  gocheolking: '고철킹', blackwolf: '검은늑대',
};

// 월드별 보스 (각 월드 20번째 스테이지의 주인)
export const WORLD_BOSS = { 1: 'tyranno', 2: 'professorx', 3: 'shadowking', 4: 'darkmask', 5: 'wangmon' };

export const WORLD_LABEL = {
  1: '공룡 알 마을', 2: '변신 정비소', 3: '특공대 기지', 4: '히어로 시티', 5: '몬스터 도감',
};
// 월드별 스페셜 친구 5명(손그림, 4스테이지 클리어마다 발견)
export const WORLD_SPECIALS = {
  1: ['kongryong', 'kkongryong', 'imagine', 'bbyeo', 'allog'],
  2: ['poopbot', 'drill', 'bbabang', 'chulkung', 'ppiriri', 'clonetrooper', 'stormtrooper', 'darthbot', 'gocheolking'],
  3: ['balduncle', 'baboon', 'blackwolf', 'syungsyung', 'salgeum', 'ultraviking'],
  4: ['captainkorea', 'superabbit', 'bulkkot', 'shadowcat', 'mujeokgom', 'roborabbit'],
  5: ['ppika', 'ppokkattu', 'andongki', 'bugeul', 'mongsil', 'poopoo', 'frozenbread'],
};

// ---- 월드별 문제 담당 친구 20명(변형 생성) --------------------------------
// W1 공룡: 색+룡 이름. W2~W5: 규칙 없는 재미난 한국 이름 + 이름에 맞는 목소리 톤.
// tone: hi(높게) / fast(빠르게) / lo(굵고 낮게) / slow(느리게) / mid(보통)
const W1_PREFIX = ['아기', '꼬마', '초록', '노랑', '파랑', '빨강', '보라', '주황', '점박', '뿔난',
  '왕눈', '번개', '통통', '날쌘', '느림', '알록', '하늘', '반짝', '씩씩', '멋쟁이'];
// [이름, 목소리톤, 말버릇, 일러스트 소품키]
//  W2 11~20번은 변신 로봇(카봇·또봇·미니특공대 무드), W3는 특공대 레인저,
//  W4는 히어로(마블 무드를 우스꽝스러운 발음으로), W5는 수집형 몬스터.
const HOST_NAMES = {
  2: [['뿡빵', 'fast', '뿡빵!', 'wheel'], ['삐용이', 'hi', '삐용삐용!', 'siren'], ['우르릉', 'lo', '우르릉!', 'tread'],
    ['나사못', 'mid', '뚜르르!', 'bolt'], ['딱깍이', 'fast', '딱깍딱깍!', 'clock'],
    ['부릉이', 'fast', '부릉부릉!', 'wheel'], ['번쩍이', 'hi', '번쩍!', 'bulb'], ['왕나사', 'lo', '끼이익!', 'bolt'],
    ['왈그락', 'lo', '왈그락달그락!', 'tread'], ['찌릿이', 'hi', '찌릿찌릿!', 'bulb'],
    // 11~20: 변신 로봇 친구들
    ['또뽕엑스', 'mid', '변신! 또뽕엑스!', 'transform'], ['또뽕와이', 'hi', '또뽕! 합체 준비!', 'transform'],
    ['까봇차땅', 'fast', '부릉! 까봇차땅 출발!', 'car'], ['슈퍼까봇', 'lo', '슈퍼 변신 완료!', 'car'],
    ['따이탄', 'lo', '따이탄! 합체 완료!', 'titan'], ['뽈트대장', 'mid', '뽈트대장 출동!', 'lion'],
    ['쌤총알', 'fast', '쌤! 총알처럼!', 'jet'], ['맥쓰펀치', 'lo', '맥쓰 펀치!', 'fist'],
    ['루씨빛', 'hi', '루씨 반짝!', 'wing'], ['애쓸론감마', 'mid', '애쓸론 감마 발진!', 'titan']],
  // [이름, 톤, 말버릇, 소품, (몸체), (색상 hue)]
  3: [['뽜워레드', 'mid', '뽜워레드!', 'visorR'], ['뽜워블루', 'mid', '뽜워블루!', 'visorB'],
    ['뽜워옐로', 'hi', '뽜워옐로!', 'visorY'],
    ['써니', 'hi', '반짝반짝!', 'sunray', 'sun', 48],
    ['루', 'mid', '루루!', 'star2', 'blob', 200],
    ['슈퍼 래빗 보이', 'fast', '슈퍼 점프!', 'cape2', 'rabbit', 212],
    ['킹 바이킹', 'lo', '크하하! 내가 왕이다!', 'crown2', 'vikingking', 24],
    ['퍼니', 'hi', '히히! 재밌지?', 'clownnose', 'clown', 340],
    ['러니', 'fast', '달려달려!', 'speed', 'kid', 130],
    ['딜리', 'slow', '딜리딜리~', 'flower', 'blob', 290],
    ['노래하는 강아지', 'mid', '왈왈~ 노래할게!', 'note2', 'dog', 30],
    ['카이라', 'mid', '카이라 준비 완료!', 'ponytail', 'kid', 320],
    ['조디 레이서', 'fast', '부릉! 출발!', 'goggles', 'racer', 8],
    ['퀸 스푸키', 'slow', '우우우… 무섭지?', 'ghostcrown', 'ghost', 270],
    ['나니', 'hi', '나니나니!', 'ribbon', 'blob', 170],
    ['코치 코니', 'lo', '자, 훈련 시작!', 'whistle', 'kid', 60],
    ['럼피 범피', 'lo', '럼피! 범피!', 'lumps', 'lump', 100],
    ['헬가', 'mid', '헬가가 간다!', 'braids', 'kid', 250],
    ['에릭', 'mid', '안녕! 에릭이야!', 'cap', 'kid', 190],
    ['슈퍼 래빗 보스', 'lo', '내가 진짜 보스다!', 'bosscrown', 'rabbit', 350]],
  4: [['아이옹맨', 'mid', '치이잉! 슈트 가동!', 'core'], ['스빠이더뽕', 'fast', '뿅! 거미줄 발사!', 'web'],
    ['헐끄', 'lo', '으라차차! 헐끄 화났다!', 'muscle'], ['또르', 'lo', '천둥이여! 또르!', 'hammer'],
    ['캡틴빵빵', 'mid', '방패 던지기! 빵!', 'shield'], ['블랙위도옹', 'mid', '조용히… 위도옹.', 'belt'],
    ['호꾸아이', 'fast', '슝! 화살 발사!', 'bow'], ['앤뚱맨', 'hi', '작아졌다! 앤뚱!', 'antenna2'],
    ['닥터스뜨렌지', 'slow', '수리수리… 마법진!', 'magic'], ['블랙빤써', 'mid', '어흥! 빤써!', 'claw'],
    ['그루뚜', 'slow', '나는… 그루뚜.', 'branch'], ['로꼬비', 'mid', '후후, 로꼬비 등장!', 'horns2'],
    ['완다뿅', 'hi', '뿅! 마법 파워!', 'magic'], ['데드뿌울', 'fast', '안녕! 데드뿌울이야!', 'mask2'],
    ['울버링', 'lo', '스컥! 발톱 나왔다!', 'claw'], ['실버뽀드', 'mid', '쓩~ 은빛 보드!', 'board'],
    ['뽈콘', 'fast', '날개 펴고 슝!', 'wing2'], ['윈떠솔져', 'lo', '철팔 준비 완료.', 'metalarm'],
    ['비쥔', 'mid', '이마 보석이 빛난다!', 'gem'], ['까모라', 'mid', '칼 준비! 까모라!', 'sword']],
  5: [['꼬북꼬북', 'mid', '꼬북꼬북!', 'shell'], ['빠이리', 'fast', '빠이리! 불꽃!', 'flametail'],
    ['이상해뽕', 'slow', '이상해뽕~', 'leaf2'], ['잠만뽀', 'slow', '쿨쿨… 잠만뽀…', 'sleep'],
    ['찌릿쭈', 'hi', '찌릿쭈!', 'bolt3'], ['이뿌이', 'hi', '이뿌이!', 'furtail'],
    ['뮤뚱', 'lo', '뮤뚱…', 'psy'], ['갸르릉', 'lo', '갸르릉!', 'fin'],
    ['메따몽', 'mid', '메따! 변신!', 'blobface'], ['푸우린', 'hi', '푸우린~♪', 'note'],
    ['야똥란', 'slow', '야똥… 란…', 'shell'], ['또까스', 'mid', '뽀글뽀글 또까스!', 'gasball'],
    ['꼬일', 'fast', '위잉! 꼬일!', 'magnet'], ['근육뿅', 'lo', '근육 뿅!', 'muscle2'],
    ['윤뻴라', 'mid', '윤뻴라… 집중!', 'psy'], ['딱꾸리', 'lo', '딱! 딱꾸리!', 'rock'],
    ['라이뚜', 'fast', '라이뚜! 번쩍!', 'bolt3'], ['리짜몽', 'lo', '크아앙! 리짜몽!', 'wing3'],
    ['개구뿍', 'mid', '개구뿍!', 'tongue'], ['몽지뿅', 'hi', '몽지뿅!', 'note']],
};
function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }
// 20종이 확실히 다른 색을 갖도록 색상환을 크게 돌린다
function paletteFromHue(h) {
  return { c2: hsl(h, 62, 62), c1: hsl(h, 42, 88), accent: hsl(h, 62, 36) };
}

// 월드별 20 호스트 생성 → id: h{w}_{i}
export const WORLD_HOSTS = {};
const HOST_META = {}; // id → { name, tone, world, idx, palette }
for (let w = 1; w <= 5; w++) {
  WORLD_HOSTS[w] = [];
  for (let i = 0; i < 20; i++) {
    const id = `h${w}_${i}`;
    let name, tone, quip = null, prop = null, body = null, hue = null;
    if (w === 1) { name = W1_PREFIX[i] + '룡'; tone = null; }
    else { [name, tone, quip, prop, body, hue] = HOST_NAMES[w][i]; }
    HOST_META[id] = {
      name, tone, quip, prop, body, world: w, idx: i,
      palette: paletteFromHue(hue != null ? hue : (i * 47 + w * 23) % 360),
    };
    WORLD_HOSTS[w].push(id);
  }
}

// 하위호환/공용: 월드 친구 = 스페셜(발견 보너스 풀)
export const WORLD_CHARS = WORLD_SPECIALS;
// 발견 가능한 전체 친구
export const ROSTER = [1, 2, 3, 4, 5].flatMap((w) => [...WORLD_HOSTS[w], ...WORLD_SPECIALS[w]]);
// 특별(보스) 친구: 대왕 + 월드 보스들
export const SPECIALS = ['daewang', 'tyranno', 'professorx', 'shadowking', 'darkmask', 'wangmon'];
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
  syungsyung:  { c2: '#3fae7a', c1: '#d8f0e2', accent: '#1f6b48' }, // 캡틴아프리카
  salgeum:     { c2: '#7bb87a', c1: '#dff0de', accent: '#4a8a49' },
  // W4 히어로
  bulkkot:     { c2: '#ff7a52', c1: '#ffe0d5', accent: '#d84a20' },
  shadowcat:   { c2: '#5a5a6e', c1: '#dcdce4', accent: '#38384a' },
  mujeokgom:   { c2: '#c89a6a', c1: '#f0e0cc', accent: '#8a5f30' },
  // W5 몬스터
  bugeul:      { c2: '#5bc8ff', c1: '#d6f2ff', accent: '#2f8fd0' },
  mongsil:     { c2: '#e8e0f8', c1: '#f8f5ff', accent: '#9a88c8' },
  // 신규 스페셜
  clonetrooper: { c2: '#e8ecf2', c1: '#f8fafc', accent: '#5a6b85' },
  stormtrooper: { c2: '#f2f4f8', c1: '#ffffff', accent: '#2b2b3a' },
  darthbot:     { c2: '#3a3a48', c1: '#d8d8e0', accent: '#111118' },
  roborabbit:   { c2: '#e8f0ff', c1: '#ffffff', accent: '#4377cc' },
  ultraviking:  { c2: '#c89a5a', c1: '#f0e0c8', accent: '#7a4f20' },
  poopoo:       { c2: '#a9714a', c1: '#e2c4a8', accent: '#6b4426' },
  frozenbread:  { c2: '#f0d9a8', c1: '#fdf3e0', accent: '#b8d8ee' },
  // 보스들
  tyranno:     { c2: '#6a9a48', c1: '#dff0d0', accent: '#3d6a22' },
  professorx:  { c2: '#7a6ad0', c1: '#e4dffa', accent: '#3f3080' },
  gocheolking: { c2: '#8a7a68', c1: '#e5ddd2', accent: '#584a3a' },
  blackwolf:   { c2: '#6a6a7e', c1: '#e0e0e8', accent: '#3a3a4e' },
  shadowking:  { c2: '#3a2f52', c1: '#d9d2ee', accent: '#150f28' },
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
  syungsyung:  {
    hi: ['우아아! 초원의 수호자, 캡틴아프리카 등장!'],
    ok: ['멋지다, 용사여!', '초원이 환호한다!', '사자처럼 용맹한 정답!', '우아아! 완벽해!', '북소리가 울린다, 정답!', '대단하구나!'],
    no: ['괜찮다, 다시 일어서라!', '초원의 용사는 포기하지 않지!', '한 번 더 도전!', '우아… 아깝구나!'],
  },
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
  clonetrooper: {
    hi: ['끌론 부대 도착! 끌론트루퍼봇 대기 완료!'],
    ok: ['임무 성공!', '끌론 부대도 인정!', '명령대로 완벽 수행!', '기록해두겠다, 정답!'],
    no: ['재정비 후 다시!', '끌론은 포기하지 않는다!', '한 번 더 시도!'],
  },
  stormtrooper: {
    hi: ['스똠! 스똠트루퍼봇 순찰 중!'],
    ok: ['명중! 이번엔 안 놓쳤다!', '스똠! 대단하군!', '완벽한 조준, 정답!'],
    no: ['빗나갔다! 다시 조준!', '스똠… 한 번 더!', '괜찮다, 재장전!'],
  },
  darthbot: {
    hi: ['쉬익… 쉬익… 나는 따스베이더봇이다.'],
    ok: ['쉬익… 훌륭하다.', '어둠도 인정하는 정답.', '네 실력을 느낀다.'],
    no: ['쉬익… 아직 부족하다.', '어둠에서 다시 배워라.', '집중이 흐트러졌군.'],
  },
  roborabbit: {
    hi: ['삐빅! 로보레빗보이 점프 준비!'],
    ok: ['로켓 점프 정답!', '삐빅! 완벽 착지!', '깡총 로봇도 감탄!', '당근 회로 충전 완료!'],
    no: ['착지 실패! 다시 점프!', '삐빅, 재시도!', '괜찮아, 다시 깡총!'],
  },
  ultraviking: {
    hi: ['우오오! 울트라킹바이킹 상륙!'],
    ok: ['우오오! 용사의 정답!', '바이킹도 감탄한다!', '뿔피리를 불어라, 정답!', '왕의 이름으로 인정!'],
    no: ['우오… 다시 노를 저어라!', '폭풍을 뚫고 다시!', '바이킹은 물러서지 않아!'],
  },
  poopoo: {
    hi: ['뿌우웅! 나는 응가똥이야!'],
    ok: ['뿌웅! 정답이야!', '구수하게 맞았어!', '응가똥도 깜짝!', '뽀글뽀글 정답!'],
    no: ['뿌… 다시 해볼까?', '뿡… 아깝다!', '괜찮아, 뿌우웅!'],
  },
  frozenbread: {
    hi: ['꽁꽁꽁! 꽁꽁꽁아저씨빵이란다!'],
    ok: ['꽁꽁! 시원한 정답!', '얼음처럼 딱 맞았어!', '갓 구운 정답이구먼!', '꽁꽁꽁, 훌륭해!'],
    no: ['꽁… 좀 더 녹여보자!', '아직 덜 구워졌구먼~', '괜찮네, 다시 해보게!'],
  },
  professorx: {
    hi: ['후후, 나는 프로뻬서엑스. 네 머릿속 계산을 읽고 있다!'],
    ok: ['호오, 내 예측보다 빠르군!', '생각을 읽었지만… 정답이다!', '두뇌가 훌륭하구나!'],
    no: ['네 생각이 흔들리는군.', '집중해라, 다시!', '후후, 계산이 어긋났다!'],
    win: ['놀랍군! 네 두뇌가 나를 넘어섰다. 정비소는 네 것이다. 다음에 보자!'],
  },
  gocheolking: {
    hi: ['철컹철컹! 고철킹이다! 내 계산 회로를 이겨보아라!'],
    ok: ['삐빅! 오차 없음, 정답!', '철컹! 회로가 놀랐다!', '완벽한 계산이군!'],
    no: ['삐빅! 계산 오류 감지!', '철컹철컹! 다시 계산해라!'],
    win: ['회로 과열… 내가 졌다! 정비소의 왕은 너다. 다음에 보자!'],
  },
  // 검은늑대: 보스에서 특공대 스페셜 친구(교관)로 이동
  blackwolf:   {
    hi: ['아우우! 특공대 교관, 검은늑대다!'],
    ok: ['흠, 훈련이 잘 됐군!', '아우! 날카로운 정답!', '늑대의 눈으로 봐도 완벽하다!', '아우우! 훌륭한 대원이야!', '멋진 실력이군!', '합격이다!'],
    no: ['아직 훈련이 부족하군!', '아우우! 다시 도전해라!', '괜찮다, 한 번 더!', '집중해라, 대원!'],
  },
  shadowking:  {
    hi: ['크크크… 어둠의 지배자, 그림자 대마왕이다! 네 그림자도 내 것이 될 것이다!'],
    ok: ['크윽! 빛나는 정답이라니!', '어둠이 흔들린다…', '제법이군, 작은 용사!', '크크… 인정하마!'],
    no: ['크크크! 어둠은 깊지!', '그림자에서 벗어날 수 있겠나!', '아직이다!'],
    win: ['크아아… 내 그림자가 걷힌다! 기지는 네 것이다. 다음에 보자!'],
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
// 캐릭터별 목소리 개성 (pitch 0.3~2.0, rate 0.6~1.6). 편차를 크게 벌려 확실히 구별.
export const VOICE_STYLE = {
  // W1 공룡
  kongryong: { pitch: 1.2, rate: 1.0, v: 0 },   kkongryong: { pitch: 1.55, rate: 1.05, v: 1 },
  imagine: { pitch: 0.7, rate: 0.9, v: 0 },     bbyeo: { pitch: 0.6, rate: 1.25, v: 1 },
  allog: { pitch: 1.85, rate: 1.05, v: 0 },
  // W2 로봇 (기계적 느낌: 낮거나 아주 빠르거나)
  poopbot: { pitch: 0.55, rate: 1.15, v: 0 },   drill: { pitch: 0.8, rate: 1.5, v: 1 },
  bbabang: { pitch: 1.15, rate: 1.55, v: 0 },   chulkung: { pitch: 0.4, rate: 0.8, v: 1 },
  ppiriri: { pitch: 1.7, rate: 1.35, v: 0 },
  // W3 특공대
  balduncle: { pitch: 0.5, rate: 0.72, v: 0 },  baboon: { pitch: 1.5, rate: 1.5, v: 1 },
  pungpung: { pitch: 0.95, rate: 1.3, v: 0 },   syungsyung: { pitch: 0.8, rate: 0.95, v: 1 }, // 캡틴아프리카: 든든한 저음
  salgeum: { pitch: 0.85, rate: 0.68, v: 0 },
  // W4 히어로
  captainkorea: { pitch: 0.85, rate: 0.95, v: 0 }, superabbit: { pitch: 1.6, rate: 1.4, v: 1 },
  bulkkot: { pitch: 1.0, rate: 1.2, v: 0 },     shadowcat: { pitch: 1.25, rate: 0.8, v: 1 },
  mujeokgom: { pitch: 0.35, rate: 0.78, v: 0 },
  // W5 몬스터
  ppika: { pitch: 2.0, rate: 1.35, v: 0 },      ppokkattu: { pitch: 1.75, rate: 1.15, v: 1 },
  andongki: { pitch: 1.3, rate: 0.85, v: 0 },   bugeul: { pitch: 1.1, rate: 1.05, v: 1 },
  mongsil: { pitch: 1.45, rate: 0.72, v: 0 },
  // 신규 스페셜
  clonetrooper: { pitch: 0.95, rate: 1.15, v: 0 }, stormtrooper: { pitch: 1.05, rate: 1.25, v: 1 },
  darthbot: { pitch: 0.3, rate: 0.7, v: 0 },    roborabbit: { pitch: 1.5, rate: 1.3, v: 1 },
  ultraviking: { pitch: 0.45, rate: 0.88, v: 0 }, poopoo: { pitch: 1.25, rate: 1.0, v: 1 },
  frozenbread: { pitch: 0.6, rate: 0.75, v: 0 },
  professorx: { pitch: 0.55, rate: 0.78, v: 1 },
  // 보스(굵고 낮고 느리게)
  daewang: { pitch: 0.35, rate: 0.82, v: 0 },   tyranno: { pitch: 0.32, rate: 0.85, v: 0 },
  gocheolking: { pitch: 0.4, rate: 0.72, v: 1 }, blackwolf: { pitch: 0.45, rate: 0.9, v: 0 },
  shadowking: { pitch: 0.3, rate: 0.7, v: 1 },  // 그림자 대마왕: 가장 낮고 느리게
  darkmask: { pitch: 0.5, rate: 0.8, v: 1 },    wangmon: { pitch: 0.34, rate: 0.92, v: 0 },
};

// 호스트 20종: 이름을 넣은 다양한 대사 + 목소리 개성(인덱스로 분산)
// 등장 인사(intro)는 길게, 정답/오답 대사는 첫 감탄사(cry)만 짧게 섞어 자연스럽게.
const cryOf = (intro) => (intro ? `${intro.split('!')[0]}!` : '');
const HOST_OK = (n, intro) => {
  const c = cryOf(intro);
  return c
    ? [`${c} 정답이야!`, `${c} 대단해!`, '우와, 똑똑한걸!', `${n}도 깜짝 놀랐어!`, `${c} 완벽해!`, '최고야!']
    : [`${n}, 정답이야!`, '우와, 대단해!', '똑똑한걸!', '완벽해!', '최고야!', `${n}도 깜짝 놀랐어!`];
};
const HOST_NO = (n, intro) => {
  const c = cryOf(intro);
  return c
    ? [`${c} 다시 해볼까?`, '아깝다! 한 번 더!', `${n}이랑 다시 도전!`, '천천히 생각해봐!']
    : ['괜찮아, 다시 해볼까?', '아깝다! 한 번 더!', `${n}이랑 다시 도전!`, '천천히 생각해봐!'];
};
// 이름 톤 → 기본 pitch/rate (이름 느낌과 목소리를 맞춤)
const TONE_STYLE = {
  hi:   { p: 1.7, r: 1.2 },
  fast: { p: 1.15, r: 1.5 },
  lo:   { p: 0.5, r: 0.85 },
  slow: { p: 0.85, r: 0.68 },
  mid:  { p: 1.05, r: 1.0 },
};
// W1(톤 없음)은 색+룡이라 월드 기본값에 인덱스 편차를 준다.
const WORLD_VOICE_BASE = { 1: 1.05 };
for (const [id, m] of Object.entries(HOST_META)) {
  VOICE[id] = {
    // 등장 인사: 말버릇에 이름이 이미 있으면 그대로, 없으면 이름을 붙인다(중복 방지)
    hi: [m.quip
      ? (m.quip.includes(m.name) ? m.quip : `${m.quip} 나는 ${m.name}!`)
      : `안녕! 나는 ${m.name}이야!`],
    ok: HOST_OK(m.name, m.quip),
    no: HOST_NO(m.name, m.quip),
  };
  const i = m.idx;
  if (m.tone) {
    const t = TONE_STYLE[m.tone] || TONE_STYLE.mid;
    // 같은 톤이라도 캐릭터마다 살짝 다르게(±지터), 클램프
    const pitch = Math.min(2.0, Math.max(0.3, t.p + ((i % 5) - 2) * 0.06));
    const rate = Math.min(1.6, Math.max(0.6, t.r + ((i % 3) - 1) * 0.06));
    VOICE_STYLE[id] = { pitch, rate, v: i % 2 };
  } else {
    const base = WORLD_VOICE_BASE[m.world] || 1.0;
    const pitch = Math.min(1.95, Math.max(0.45, base + ((i % 10) - 4.5) * 0.11));
    VOICE_STYLE[id] = { pitch, rate: 0.85 + (i % 5) * 0.12, v: i % 2 };
  }
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
    <!-- 캡틴아프리카: 초원의 수호자 (사자 갈기 투구 + 방패 + 창) -->
    <polygon points="30,44 70,44 78,88 22,88" fill=${P.syungsyung.accent} />
    <ellipse cx="50" cy="60" rx="23" ry="24" fill=${P.syungsyung.c2} />
    <ellipse cx="50" cy="62" rx="13" ry="12" fill=${P.syungsyung.c1} />
    <path d="M42 56 h16 M50 50 v18" stroke=${P.syungsyung.accent} stroke-width="3" stroke-linecap="round" />
    <rect x="34" y="84" width="12" height="10" rx="5" fill=${P.syungsyung.c2} />
    <rect x="54" y="84" width="12" height="10" rx="5" fill=${P.syungsyung.c2} />
    <circle cx="50" cy="30" r="21" fill="#c8873f" opacity=".95" />
    <circle cx="50" cy="30" r="15" fill="#8a5a2b" />
    <path d="M50 6 v-5 M32 12 l-4 -4 M68 12 l4 -4 M26 30 h-6 M74 30 h6" stroke="#c8873f" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="43" cy="30" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="30" r="2.6" fill="#2b2b3a" />
    <path d="M45 37 Q50 40 55 37" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
    <circle cx="20" cy="64" r="12" fill="#e0a840" stroke="#fff" stroke-width="2" />
    <path d="M20 56 l4 8 -4 8 -4 -8Z" fill=${P.syungsyung.accent} />
    <rect x="80" y="26" width="4" height="52" rx="2" fill="#8a5a2b" />
    <polygon points="82,18 87,28 77,28" fill="#d8dce4" />
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

  // ---- 신규 스페셜 친구들 ----
  // 끌론트루퍼봇: 흰 장갑 병사 로봇 (파란 줄무늬 헬멧)
  clonetrooper: () => html`<g>
    <rect x="34" y="58" width="32" height="30" rx="9" fill=${P.clonetrooper.c2} stroke="#c8d0dc" stroke-width="1.5" />
    <rect x="26" y="60" width="9" height="22" rx="4" fill=${P.clonetrooper.c2} stroke="#c8d0dc" stroke-width="1.5" />
    <rect x="65" y="60" width="9" height="22" rx="4" fill=${P.clonetrooper.c2} stroke="#c8d0dc" stroke-width="1.5" />
    <rect x="38" y="86" width="10" height="9" rx="4" fill=${P.clonetrooper.accent} />
    <rect x="52" y="86" width="10" height="9" rx="4" fill=${P.clonetrooper.accent} />
    <rect x="42" y="64" width="16" height="7" rx="3" fill="#5b8def" />
    <path d="M30 40 q20 -22 40 0 l0 12 q-20 -6 -40 0Z" fill=${P.clonetrooper.c2} stroke="#c8d0dc" stroke-width="1.5" />
    <path d="M48 20 h4 l0 22 h-4Z" fill="#5b8def" opacity=".8" />
    <path d="M34 44 q16 -6 32 0 l0 6 q-16 -5 -32 0Z" fill="#27324a" />
    <circle cx="42" cy="47" r="3" fill="#7fe7ff" /><circle cx="58" cy="47" r="3" fill="#7fe7ff" />
    <path d="M42 54 q8 4 16 0" stroke="#8a95a8" stroke-width="2" fill="none" />
  </g>`,
  // 스똠트루퍼봇: 새까만 눈구멍 헬멧 + 각진 어깨
  stormtrooper: () => html`<g>
    <rect x="32" y="58" width="36" height="30" rx="7" fill=${P.stormtrooper.c2} stroke="#d8dce4" stroke-width="1.5" />
    <rect x="22" y="58" width="11" height="14" rx="4" fill=${P.stormtrooper.c2} stroke="#d8dce4" stroke-width="1.5" />
    <rect x="67" y="58" width="11" height="14" rx="4" fill=${P.stormtrooper.c2} stroke="#d8dce4" stroke-width="1.5" />
    <rect x="38" y="86" width="10" height="9" rx="3" fill=${P.stormtrooper.accent} />
    <rect x="52" y="86" width="10" height="9" rx="3" fill=${P.stormtrooper.accent} />
    <rect x="40" y="66" width="20" height="5" rx="2" fill=${P.stormtrooper.accent} />
    <path d="M30 42 q20 -24 40 0 q2 12 -6 16 q-14 4 -28 0 q-8 -4 -6 -16Z" fill=${P.stormtrooper.c2} stroke="#d8dce4" stroke-width="1.5" />
    <path d="M38 42 q6 -6 10 0 q-2 8 -10 6Z" fill="#2b2b3a" />
    <path d="M62 42 q-6 -6 -10 0 q2 8 10 6Z" fill="#2b2b3a" />
    <path d="M48 52 h4 l-1 6 h-2Z" fill="#2b2b3a" />
    <path d="M44 30 q6 -4 12 0" stroke="#c8ccd4" stroke-width="2" fill="none" />
  </g>`,
  // 따스베이더봇: 검은 헬멧 + 붉은 눈 + 망토
  darthbot: () => html`<g>
    <polygon points="30,44 70,44 78,90 22,90" fill="#22222c" />
    <rect x="36" y="56" width="28" height="30" rx="8" fill=${P.darthbot.c2} />
    <rect x="40" y="64" width="20" height="8" rx="2" fill="#ff4d4d" opacity=".85" />
    <rect x="42" y="76" width="4" height="4" fill="#7fe7ff" /><rect x="48" y="76" width="4" height="4" fill="#ffce4f" />
    <rect x="54" y="76" width="4" height="4" fill="#ff8f8f" />
    <path d="M28 40 q22 -26 44 0 q0 14 -8 18 q-14 6 -28 0 q-8 -4 -8 -18Z" fill=${P.darthbot.accent} />
    <path d="M36 40 q14 -10 28 0 l0 8 q-14 -6 -28 0Z" fill=${P.darthbot.c2} />
    <path d="M38 42 q6 -5 9 0 q-2 7 -9 5Z" fill="#ff4d4d" />
    <path d="M62 42 q-6 -5 -9 0 q2 7 9 5Z" fill="#ff4d4d" />
    <path d="M44 52 q6 4 12 0 l-2 6 h-8Z" fill="#1a1a22" />
    <path d="M20 60 q-8 14 0 26 M80 60 q8 14 0 26" stroke="#22222c" stroke-width="5" fill="none" stroke-linecap="round" />
  </g>`,
  // 로보레빗보이: 금속 토끼 히어로 (로켓 귀 + 망토)
  roborabbit: () => html`<g>
    <polygon points="34,44 66,44 74,86 26,86" fill=${P.roborabbit.accent} />
    <rect x="34" y="26" width="9" height="24" rx="4" fill=${P.roborabbit.c2} stroke="#c8d8f0" stroke-width="1.5" />
    <rect x="57" y="26" width="9" height="24" rx="4" fill=${P.roborabbit.c2} stroke="#c8d8f0" stroke-width="1.5" />
    <rect x="37" y="30" width="3" height="14" rx="1.5" fill="#ff8fb0" />
    <rect x="60" y="30" width="3" height="14" rx="1.5" fill="#ff8fb0" />
    <ellipse cx="50" cy="58" rx="25" ry="24" fill=${P.roborabbit.c2} stroke="#c8d8f0" stroke-width="1.5" />
    <rect x="32" y="50" width="36" height="14" rx="6" fill="#27324a" />
    <circle cx="42" cy="57" r="4.5" fill="#7fe7ff" /><circle cx="58" cy="57" r="4.5" fill="#7fe7ff" />
    <circle cx="42" cy="57" r="1.8" fill="#fff" /><circle cx="58" cy="57" r="1.8" fill="#fff" />
    <ellipse cx="50" cy="70" rx="4" ry="3" fill="#ff8fb0" />
    <rect x="36" y="82" width="11" height="10" rx="4" fill=${P.roborabbit.accent} />
    <rect x="53" y="82" width="11" height="10" rx="4" fill=${P.roborabbit.accent} />
    <polygon points="50,14 54,24 46,24" fill="#ffce4f" />
  </g>`,
  // 울트라킹바이킹: 뿔투구 + 수염 + 방패
  ultraviking: () => html`<g>
    <ellipse cx="50" cy="62" rx="27" ry="26" fill=${P.ultraviking.c2} />
    <path d="M26 56 q24 -10 48 0 l0 10 q-24 -8 -48 0Z" fill=${P.ultraviking.accent} />
    <circle cx="50" cy="38" r="18" fill="#ffe0bd" />
    <path d="M30 34 q20 -20 40 0 l0 6 q-20 -8 -40 0Z" fill="#b8b8c4" />
    <path d="M32 30 q-14 -12 -6 -20 q10 6 10 16Z" fill="#f0e4c8" stroke=${P.ultraviking.accent} stroke-width="1.5" />
    <path d="M68 30 q14 -12 6 -20 q-10 6 -10 16Z" fill="#f0e4c8" stroke=${P.ultraviking.accent} stroke-width="1.5" />
    <circle cx="43" cy="38" r="2.6" fill="#2b2b3a" /><circle cx="57" cy="38" r="2.6" fill="#2b2b3a" />
    <path d="M36 46 q14 14 28 0 q-6 16 -28 0Z" fill="#e8d8b0" />
    <path d="M42 44 q8 6 16 0" stroke="#8a5a2b" stroke-width="2" fill="none" />
    <circle cx="24" cy="70" r="11" fill="#c05050" stroke="#f0e4c8" stroke-width="2.5" />
    <circle cx="24" cy="70" r="4" fill="#f0e4c8" />
    <path d="M74 58 l10 -8 4 6 -10 8Z" fill="#b8b8c4" />
  </g>`,
  // 응가똥: 소용돌이 응가 (귀엽게)
  poopoo: () => html`<g>
    <ellipse cx="50" cy="82" rx="30" ry="11" fill=${P.poopoo.c2} />
    <ellipse cx="50" cy="70" rx="25" ry="13" fill=${P.poopoo.c2} />
    <ellipse cx="50" cy="56" rx="18" ry="12" fill=${P.poopoo.c2} />
    <ellipse cx="50" cy="44" rx="11" ry="9" fill=${P.poopoo.c2} />
    <path d="M50 35 q5 -6 0 -10 q-5 5 0 10Z" fill=${P.poopoo.accent} />
    <ellipse cx="42" cy="56" rx="5.5" ry="6.5" fill="#fff" /><ellipse cx="58" cy="56" rx="5.5" ry="6.5" fill="#fff" />
    <circle cx="43" cy="57" r="3" fill="#2b2b3a" /><circle cx="59" cy="57" r="3" fill="#2b2b3a" />
    <circle cx="44" cy="55.5" r="1.1" fill="#fff" /><circle cx="60" cy="55.5" r="1.1" fill="#fff" />
    <path d="M44 66 Q50 71 56 66" stroke="#4a2c14" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <circle cx="32" cy="63" r="3" fill="#ff9a9a" opacity=".5" /><circle cx="68" cy="63" r="3" fill="#ff9a9a" opacity=".5" />
    <path d="M22 44 q-6 -4 -4 -10 M78 44 q6 -4 4 -10" stroke="#c8a888" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7" />
  </g>`,
  // 꽁꽁꽁아저씨빵: 얼어붙은 식빵 아저씨 (콧수염 + 고드름)
  frozenbread: () => html`<g>
    <path d="M26 46 q0 -18 24 -18 q24 0 24 18 l0 32 q0 8 -8 8 l-32 0 q-8 0 -8 -8Z" fill=${P.frozenbread.c2} stroke="#d8b878" stroke-width="1.5" />
    <path d="M30 48 q20 -8 40 0 l0 6 q-20 -7 -40 0Z" fill="#fdf3e0" opacity=".7" />
    <ellipse cx="41" cy="58" rx="6" ry="7" fill="#fff" /><ellipse cx="59" cy="58" rx="6" ry="7" fill="#fff" />
    <circle cx="42" cy="59" r="3" fill="#2b2b3a" /><circle cx="58" cy="59" r="3" fill="#2b2b3a" />
    <path d="M34 50 q7 -4 13 -1 M66 50 q-7 -4 -13 -1" stroke="#b08040" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M38 70 q12 6 24 0 q-6 5 -12 5 q-6 0 -12 -5Z" fill="#e8e8f0" />
    <path d="M40 68 q10 4 20 0" stroke="#c8a060" stroke-width="2.4" fill="none" />
    <path d="M30 84 l3 8 3 -8Z" fill=${P.frozenbread.accent} />
    <path d="M46 84 l3 9 3 -9Z" fill=${P.frozenbread.accent} />
    <path d="M62 84 l3 7 3 -7Z" fill=${P.frozenbread.accent} />
    <path d="M24 32 l4 -8 4 8Z" fill=${P.frozenbread.accent} opacity=".8" />
    <path d="M68 30 l4 -9 4 9Z" fill=${P.frozenbread.accent} opacity=".8" />
  </g>`,

  // ---- 월드 보스들 ----
  // 그림자 대마왕: 어둠의 후드 + 붉은 눈 + 그림자 촉수 + 왕관
  shadowking: () => html`<g>
    <path d="M18 92 q32 -10 64 0 q-32 10 -64 0Z" fill="#150f28" opacity=".55" />
    <path d="M22 86 q-10 -30 8 -44 q-4 -14 20 -18 q24 4 20 18 q18 14 8 44 q-28 8 -56 0Z" fill=${P.shadowking.c2} />
    <path d="M30 44 q20 -16 40 0 q4 20 -20 24 q-24 -4 -20 -24Z" fill=${P.shadowking.accent} />
    <path d="M32 20 L38 4 L46 18 L50 2 L54 18 L62 4 L68 20Z" fill="#8a6df0" stroke="#c8b8ff" stroke-width="1.5" stroke-linejoin="round" />
    <circle cx="41" cy="50" r="5.5" fill="#ff3a3a" /><circle cx="59" cy="50" r="5.5" fill="#ff3a3a" />
    <circle cx="41" cy="50" r="2" fill="#ffd0d0" /><circle cx="59" cy="50" r="2" fill="#ffd0d0" />
    <path d="M34 40 l10 5 M66 40 l-10 5" stroke="#c8b8ff" stroke-width="2.5" stroke-linecap="round" />
    <path d="M40 66 q10 6 20 0 q-10 10 -20 0Z" fill="#150f28" />
    <path d="M16 60 q-12 12 -6 26 M84 60 q12 12 6 26" stroke=${P.shadowking.c2} stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M10 84 q-6 4 -4 10 M90 84 q6 4 4 10" stroke=${P.shadowking.accent} stroke-width="4" fill="none" stroke-linecap="round" />
    <circle cx="14" cy="46" r="3" fill="#8a6df0" opacity=".7" /><circle cx="86" cy="42" r="3" fill="#8a6df0" opacity=".7" />
  </g>`,
  // 프로뻬서엑스: 텔레파시 보스 (대머리 + 뇌파 링 + 휠체어 왕좌)
  professorx: () => html`<g>
    <path d="M18 30 q32 -16 64 0" stroke=${P.professorx.accent} stroke-width="2.5" fill="none" opacity=".55" />
    <path d="M24 22 q26 -14 52 0" stroke=${P.professorx.accent} stroke-width="2" fill="none" opacity=".35" />
    <circle cx="18" cy="30" r="3" fill=${P.professorx.c2} /><circle cx="82" cy="30" r="3" fill=${P.professorx.c2} />
    <path d="M26 62 q24 -8 48 0 l0 22 q-24 8 -48 0Z" fill=${P.professorx.c2} />
    <path d="M34 68 h32 M34 76 h32" stroke=${P.professorx.accent} stroke-width="2" opacity=".5" />
    <circle cx="30" cy="88" r="8" fill="#3a3448" /><circle cx="70" cy="88" r="8" fill="#3a3448" />
    <circle cx="30" cy="88" r="3" fill="#c8c0e0" /><circle cx="70" cy="88" r="3" fill="#c8c0e0" />
    <circle cx="50" cy="44" r="20" fill="#ffe0bd" />
    <ellipse cx="41" cy="42" rx="7" ry="4" fill="#fff" opacity=".45" />
    <path d="M34 40 q7 -5 13 -2 M66 40 q-7 -5 -13 -2" stroke="#8a5a2b" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <circle cx="43" cy="46" r="3" fill="#2b2b3a" /><circle cx="57" cy="46" r="3" fill="#2b2b3a" />
    <path d="M43 56 Q50 60 57 56" stroke="#8a5a2b" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M46 36 l-8 -6 M54 36 l8 -6" stroke=${P.professorx.accent} stroke-width="2.5" stroke-linecap="round" opacity=".7" />
  </g>`,
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
// 변형 캐릭터 렌더러 (호스트 20종용): 월드 장르별 몸체 + i로 다양화
//   W1 공룡 / W2 로봇 / W3 특공대 / W4 히어로 / W5 몬스터
// ---------------------------------------------------------------------------
function eyes(dx, y, r = 6, look = 0) {
  return html`<g>
    <circle cx=${50 - dx} cy=${y} r=${r} fill="#fff" /><circle cx=${50 + dx} cy=${y} r=${r} fill="#fff" />
    <circle cx=${50 - dx + look} cy=${y + 0.6} r=${r * 0.52} fill="#2b2b3a" /><circle cx=${50 + dx + look} cy=${y + 0.6} r=${r * 0.52} fill="#2b2b3a" />
    <circle cx=${50 - dx + look + 1.4} cy=${y - 1} r="1.1" fill="#fff" /><circle cx=${50 + dx + look + 1.4} cy=${y - 1} r="1.1" fill="#fff" />
  </g>`;
}
const smile = (y, w = 6) => html`<path d=${`M ${50 - w} ${y} Q 50 ${y + 5} ${50 + w} ${y}`} stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />`;
const cheeks = (dx, y, col = '#ff9a9a') => html`<g><circle cx=${50 - dx} cy=${y} r="3" fill=${col} opacity=".6" /><circle cx=${50 + dx} cy=${y} r="3" fill=${col} opacity=".6" /></g>`;

// W1 공룡: 알록달록 아기공룡 (등 가시 개수/뿔/꼬리 변형)
function dinoHost(p, i) {
  const spikes = 2 + (i % 3);
  const sx = [];
  for (let k = 0; k < spikes; k++) { const x = 40 + k * (20 / Math.max(1, spikes - 1)); sx.push(html`<polygon key=${k} points=${`${x},22 ${x + 5},33 ${x - 5},33`} fill=${p.accent} />`); }
  return html`<g>
    <path d="M74 74 Q92 64 84 48 Q80 60 70 60Z" fill=${p.c2} />
    ${sx}
    <ellipse cx="50" cy="56" rx="29" ry="28" fill=${p.c2} />
    <ellipse cx="50" cy="64" rx="17" ry="15" fill=${p.c1} />
    <rect x="34" y="80" width="12" height="13" rx="6" fill=${p.c2} /><rect x="54" y="80" width="12" height="13" rx="6" fill=${p.c2} />
    ${i % 2 ? html`<polygon points="50,16 55,26 45,26" fill=${p.accent} />` : null}
    ${eyes(11, 50, 6)} ${cheeks(20, 58)} ${smile(63)}
  </g>`;
}

// W2 로봇: 각진 머리/안테나/바퀴·다리 변형 (딱 봐도 로봇)
function robotHost(p, i) {
  const legKind = i % 3;
  const anten = i % 4;
  return html`<g>
    ${anten === 0 ? html`<g><line x1="50" y1="12" x2="50" y2="24" stroke=${p.accent} stroke-width="3" /><circle cx="50" cy="9" r="4" fill=${p.accent} /></g>` : null}
    ${anten === 1 ? html`<g><line x1="34" y1="16" x2="30" y2="8" stroke=${p.accent} stroke-width="2.5" /><circle cx="30" cy="7" r="3" fill=${p.accent} /><line x1="66" y1="16" x2="70" y2="8" stroke=${p.accent} stroke-width="2.5" /><circle cx="70" cy="7" r="3" fill=${p.accent} /></g>` : null}
    ${anten === 2 ? html`<rect x="42" y="10" width="16" height="6" rx="3" fill=${p.accent} />` : null}
    <rect x="24" y="26" width="52" height="46" rx=${8 + (i % 3) * 4} fill=${p.c2} />
    <rect x="30" y="34" width="40" height="20" rx="7" fill="#27324a" />
    <circle cx="41" cy="44" r="5" fill="#7fe7ff" /><circle cx="59" cy="44" r="5" fill="#7fe7ff" />
    <circle cx="41" cy="44" r="2" fill="#fff" /><circle cx="59" cy="44" r="2" fill="#fff" />
    ${i % 2 ? html`<path d="M40 62 h20" stroke=${p.accent} stroke-width="3" stroke-linecap="round" />` : html`<circle cx="50" cy="63" r="4" fill=${p.accent} />`}
    <circle cx="28" cy="30" r="1.6" fill="#fff" opacity=".6" /><circle cx="72" cy="30" r="1.6" fill="#fff" opacity=".6" />
    ${legKind === 0 ? html`<g><circle cx="36" cy="80" r="8" fill="#2b2b3a" /><circle cx="64" cy="80" r="8" fill="#2b2b3a" /><circle cx="36" cy="80" r="3" fill="#cfd6e0" /><circle cx="64" cy="80" r="3" fill="#cfd6e0" /></g>`
      : legKind === 1 ? html`<g><rect x="30" y="72" width="14" height="18" rx="4" fill=${p.accent} /><rect x="56" y="72" width="14" height="18" rx="4" fill=${p.accent} /></g>`
      : html`<g><rect x="34" y="72" width="32" height="8" rx="4" fill=${p.accent} /><circle cx="40" cy="86" r="6" fill="#2b2b3a" /><circle cx="60" cy="86" r="6" fill="#2b2b3a" /></g>`}
  </g>`;
}

// W3 특공대: 헬멧+바이저+별 배지 (색/바이저 모양 변형)
function rangerHost(p, i) {
  return html`<g>
    <rect x="36" y="58" width="28" height="30" rx="10" fill=${p.c2} />
    <rect x="30" y="62" width="8" height="20" rx="4" fill=${p.c2} /><rect x="62" y="62" width="8" height="20" rx="4" fill=${p.c2} />
    <rect x="40" y="84" width="8" height="9" rx="4" fill="#2b2b3a" /><rect x="52" y="84" width="8" height="9" rx="4" fill="#2b2b3a" />
    <polygon points="50,64 54,71 46,71" fill="#ffd54f" />
    <ellipse cx="50" cy="40" rx="22" ry="21" fill=${p.c2} />
    <path d="M28 40 a22 21 0 0 1 44 0 Z" fill=${p.accent} opacity="0.3" />
    <rect x="32" y=${36 + (i % 2) * 2} width="36" height="11" rx=${i % 2 ? 6 : 3} fill="#1f2b45" />
    <circle cx="43" cy=${42 + (i % 2) * 2} r="3" fill="#7fe7ff" /><circle cx="57" cy=${42 + (i % 2) * 2} r="3" fill="#7fe7ff" />
    ${i % 3 === 0 ? html`<rect x="46" y="18" width="8" height="7" rx="2" fill="#fff" />` : null}
    ${i % 3 === 1 ? html`<polygon points="50,16 54,24 46,24" fill=${p.accent} />` : null}
  </g>`;
}

// W4 히어로: 망토+아이마스크+가슴 별 (망토색/엠블럼 변형)
function heroHost(p, i) {
  return html`<g>
    <polygon points="33,42 67,42 76,86 24,86" fill=${p.accent} />
    <ellipse cx="50" cy="58" rx="22" ry="24" fill=${p.c2} />
    ${i % 2
      ? html`<polygon points="50,47 53,56 63,56 55,62 58,72 50,66 42,72 45,62 37,56 47,56" fill="#fff" />`
      : html`<circle cx="50" cy="59" r="9" fill="#fff" /><path d="M50 51 v16 M42 59 h16" stroke=${p.accent} stroke-width="3" />`}
    <rect x="34" y="82" width="12" height="11" rx="5" fill=${p.c2} /><rect x="54" y="82" width="12" height="11" rx="5" fill=${p.c2} />
    <circle cx="50" cy="30" r="17" fill="#ffe0bd" />
    <path d="M33 30 q17 -13 34 0 l0 5 q-17 -7 -34 0Z" fill=${p.c2} />
    <path d=${`M34 28 q16 -8 32 0`} stroke=${p.accent} stroke-width="6" fill="none" opacity=".9" />
    <circle cx="43" cy="30" r="2.4" fill="#2b2b3a" /><circle cx="57" cy="30" r="2.4" fill="#2b2b3a" />
    ${smile(37, 5)}
  </g>`;
}

// W5 몬스터: 둥근 블롭 + 뿔/귀/더듬이 + 무늬 (색/장식 변형)
function monsterHost(p, i) {
  const top = i % 4;
  const bodyR = 28;
  return html`<g>
    ${top === 0 ? html`<g><polygon points="36,26 40,12 46,26" fill=${p.accent} /><polygon points="64,26 60,12 54,26" fill=${p.accent} /></g>` : null}
    ${top === 1 ? html`<g><ellipse cx="34" cy="24" rx="6" ry="11" fill=${p.c2} /><ellipse cx="66" cy="24" rx="6" ry="11" fill=${p.c2} /></g>` : null}
    ${top === 2 ? html`<g><line x1="40" y1="24" x2="34" y2="12" stroke=${p.accent} stroke-width="2.5" /><circle cx="34" cy="10" r="3.5" fill=${p.accent} /><line x1="60" y1="24" x2="66" y2="12" stroke=${p.accent} stroke-width="2.5" /><circle cx="66" cy="10" r="3.5" fill=${p.accent} /></g>` : null}
    ${top === 3 ? html`<path d="M44 22 q6 -12 12 0 q-6 -4 -12 0Z" fill=${p.accent} />` : null}
    <ellipse cx="50" cy="56" rx=${bodyR} ry="27" fill=${p.c2} />
    <ellipse cx="50" cy="63" rx="15" ry="13" fill=${p.c1} />
    ${i % 3 === 0 ? html`<g><circle cx="34" cy="52" r="3" fill=${p.accent} opacity=".5" /><circle cx="66" cy="60" r="2.5" fill=${p.accent} opacity=".5" /></g>` : null}
    ${eyes(i % 2 ? 13 : 10, 52, i % 2 ? 7 : 6)} ${cheeks(19, 60, '#ff8fb0')} ${smile(64, i % 2 ? 7 : 5)}
  </g>`;
}

// ---- 전용 몸체(body) 렌더러: 월드 기본 몸체 대신 캐릭터 성격에 맞는 형태 ----
const BODY_RENDER = {
  // 해님 친구
  sun: (p) => html`<g>
    ${[...Array(12)].map((_, k) => { const a = (k / 12) * Math.PI * 2;
      return html`<line key=${k} x1=${50 + Math.cos(a) * 34} y1=${52 + Math.sin(a) * 34}
        x2=${50 + Math.cos(a) * 44} y2=${52 + Math.sin(a) * 44} stroke=${p.accent} stroke-width="4" stroke-linecap="round" />`; })}
    <circle cx="50" cy="52" r="30" fill=${p.c2} />
    ${eyes(11, 48, 6)} ${cheeks(20, 58, '#ff9a9a')} ${smile(62, 8)}
  </g>`,
  // 동글동글 작은 친구
  blob: (p) => html`<g>
    <ellipse cx="50" cy="58" rx="27" ry="26" fill=${p.c2} />
    <ellipse cx="50" cy="66" rx="15" ry="12" fill=${p.c1} />
    ${eyes(10, 52, 6)} ${cheeks(19, 60, '#ff9ac8')} ${smile(66, 6)}
  </g>`,
  // 토끼 히어로
  rabbit: (p) => html`<g>
    <ellipse cx="37" cy="24" rx="7" ry="18" fill=${p.c2} /><ellipse cx="63" cy="24" rx="7" ry="18" fill=${p.c2} />
    <ellipse cx="37" cy="26" rx="3" ry="11" fill="#ffc2d6" /><ellipse cx="63" cy="26" rx="3" ry="11" fill="#ffc2d6" />
    <ellipse cx="50" cy="60" rx="25" ry="25" fill=${p.c2} />
    <ellipse cx="50" cy="68" rx="13" ry="11" fill=${p.c1} />
    ${eyes(10, 54, 6)} ${cheeks(19, 62, '#ff9a9a')}
    <ellipse cx="50" cy="63" rx="3.4" ry="2.6" fill="#ff8fb0" />
    <path d="M44 68 q6 5 12 0" stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <rect x="36" y="84" width="11" height="9" rx="4" fill=${p.accent} /><rect x="53" y="84" width="11" height="9" rx="4" fill=${p.accent} />
  </g>`,
  // 뿔투구 왕(악당)
  vikingking: (p) => html`<g>
    <rect x="28" y="52" width="44" height="34" rx="10" fill=${p.c2} />
    <rect x="20" y="56" width="10" height="22" rx="4" fill=${p.accent} /><rect x="70" y="56" width="10" height="22" rx="4" fill=${p.accent} />
    <rect x="34" y="84" width="12" height="10" rx="4" fill=${p.accent} /><rect x="54" y="84" width="12" height="10" rx="4" fill=${p.accent} />
    <ellipse cx="50" cy="38" rx="21" ry="19" fill="#e8d0b0" />
    <path d="M29 34 q21 -18 42 0 l0 6 q-21 -8 -42 0Z" fill="#9aa8bc" />
    <path d="M30 30 q-16 -12 -8 -22 q12 6 12 18Z" fill="#f0e4c8" stroke=${p.accent} stroke-width="1.5" />
    <path d="M70 30 q16 -12 8 -22 q-12 6 -12 18Z" fill="#f0e4c8" stroke=${p.accent} stroke-width="1.5" />
    <path d="M38 40 l9 4 M62 40 l-9 4" stroke="#2b2b3a" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="43" cy="42" r="2.8" fill="#2b2b3a" /><circle cx="57" cy="42" r="2.8" fill="#2b2b3a" />
    <path d="M42 50 q8 5 16 0 q-8 8 -16 0Z" fill="#8a5a2b" />
  </g>`,
  // 광대 친구
  clown: (p) => html`<g>
    <path d="M30 30 q10 -16 20 -4 q10 -12 20 4 q-20 8 -40 0Z" fill=${p.accent} />
    <ellipse cx="50" cy="58" rx="27" ry="26" fill=${p.c2} />
    <path d="M28 70 q22 10 44 0 l0 8 q-22 8 -44 0Z" fill=${p.c1} />
    ${eyes(11, 52, 6)}
    <circle cx="50" cy="60" r="6" fill="#ff5a5a" />
    <path d="M40 68 q10 8 20 0" stroke="#2b2b3a" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <circle cx="26" cy="46" r="4" fill="#ffce4f" /><circle cx="74" cy="46" r="4" fill="#7fe7ff" />
  </g>`,
  // 아이 대원(모자/머리 소품으로 구분)
  kid: (p) => html`<g>
    <rect x="34" y="58" width="32" height="28" rx="9" fill=${p.c2} />
    <rect x="26" y="60" width="9" height="20" rx="4" fill=${p.c2} />
    <rect x="65" y="60" width="9" height="20" rx="4" fill=${p.c2} />
    <rect x="37" y="84" width="10" height="10" rx="4" fill=${p.accent} /><rect x="53" y="84" width="10" height="10" rx="4" fill=${p.accent} />
    <circle cx="50" cy="38" r="19" fill="#ffe0bd" />
    <path d="M31 34 q19 -16 38 0 q-19 -6 -38 0Z" fill=${p.accent} />
    <circle cx="43" cy="40" r="2.8" fill="#2b2b3a" /><circle cx="57" cy="40" r="2.8" fill="#2b2b3a" />
    <circle cx="36" cy="45" r="3" fill="#ff9a9a" opacity=".6" /><circle cx="64" cy="45" r="3" fill="#ff9a9a" opacity=".6" />
    <path d="M45 47 q5 4 10 0" stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />
  </g>`,
  // 강아지
  dog: (p) => html`<g>
    <ellipse cx="26" cy="42" rx="8" ry="14" fill=${p.accent} /><ellipse cx="74" cy="42" rx="8" ry="14" fill=${p.accent} />
    <ellipse cx="50" cy="58" rx="27" ry="25" fill=${p.c2} />
    <ellipse cx="50" cy="68" rx="16" ry="12" fill=${p.c1} />
    <ellipse cx="50" cy="64" rx="5" ry="3.8" fill="#2b2b3a" />
    ${eyes(11, 52, 6)}
    <path d="M44 72 q6 5 12 0" stroke="#2b2b3a" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M76 70 q14 6 8 20" stroke=${p.accent} stroke-width="6" fill="none" stroke-linecap="round" />
  </g>`,
  // 레이서
  racer: (p) => html`<g>
    <rect x="32" y="60" width="36" height="26" rx="8" fill=${p.c2} />
    <rect x="37" y="84" width="11" height="10" rx="4" fill=${p.accent} /><rect x="52" y="84" width="11" height="10" rx="4" fill=${p.accent} />
    <path d="M40 66 h20 M46 72 h8" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    <circle cx="50" cy="38" r="21" fill=${p.c2} />
    <path d="M29 38 q21 -22 42 0 l0 4 q-21 -8 -42 0Z" fill=${p.accent} />
    <rect x="32" y="40" width="36" height="12" rx="6" fill="#27324a" />
    <rect x="35" y="43" width="30" height="6" rx="3" fill="#7fe7ff" opacity=".85" />
    <path d="M46 56 q4 3 8 0" stroke="#2b2b3a" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>`,
  // 유령 여왕
  ghost: (p) => html`<g>
    <path d="M24 78 q-6 -34 26 -34 q32 0 26 34 q-6 -8 -10 2 q-6 -10 -12 0 q-6 -10 -12 0 q-6 -10 -18 -2Z" fill=${p.c2} opacity=".92" />
    ${eyes(11, 52, 7)}
    <ellipse cx="50" cy="66" rx="6" ry="7" fill="#2b2b3a" opacity=".8" />
    <circle cx="22" cy="40" r="3" fill=${p.c2} opacity=".6" /><circle cx="80" cy="46" r="4" fill=${p.c2} opacity=".5" />
  </g>`,
  // 울퉁불퉁 덩치
  lump: (p) => html`<g>
    <path d="M20 82 q-4 -22 10 -30 q0 -14 14 -12 q4 -10 16 -4 q14 -4 16 10 q14 8 8 36 q-32 10 -64 0Z" fill=${p.c2} />
    <circle cx="32" cy="52" r="6" fill=${p.accent} opacity=".5" /><circle cx="70" cy="60" r="7" fill=${p.accent} opacity=".45" />
    <circle cx="56" cy="44" r="4" fill=${p.accent} opacity=".4" />
    ${eyes(12, 58, 6.5)}
    <path d="M42 72 q8 6 16 0 q-8 9 -16 0Z" fill="#2b2b3a" opacity=".8" />
  </g>`,
};

// 캐릭터별 소품(prop) — 이름과 매칭되는 상징물을 덧그려 확실히 구별되게 한다.
function hostProp(prop, p) {
  const A = p.accent, C = p.c2;
  switch (prop) {
    // W2 로봇/변신
    case 'wheel': return html`<g><circle cx="26" cy="84" r="8" fill="#2b2b3a" /><circle cx="74" cy="84" r="8" fill="#2b2b3a" /><circle cx="26" cy="84" r="3" fill="#cfd6e0" /><circle cx="74" cy="84" r="3" fill="#cfd6e0" /></g>`;
    case 'siren': return html`<g><rect x="42" y="8" width="16" height="9" rx="4" fill="#ff5a5a" /><path d="M34 12 l6 3 M66 12 l-6 3" stroke="#ff5a5a" stroke-width="2.5" stroke-linecap="round" /></g>`;
    case 'tread': return html`<g><rect x="18" y="76" width="64" height="14" rx="7" fill="#3a3a48" /><circle cx="30" cy="83" r="4" fill="#7a7a90" /><circle cx="50" cy="83" r="4" fill="#7a7a90" /><circle cx="70" cy="83" r="4" fill="#7a7a90" /></g>`;
    case 'bolt': return html`<g><circle cx="24" cy="34" r="5" fill=${A} /><circle cx="76" cy="34" r="5" fill=${A} /><path d="M21 34 h6 M73 34 h6" stroke="#fff" stroke-width="2" /></g>`;
    case 'clock': return html`<g><circle cx="50" cy="72" r="9" fill="#fff" stroke=${A} stroke-width="2" /><path d="M50 72 v-5 M50 72 h4" stroke=${A} stroke-width="2" stroke-linecap="round" /></g>`;
    case 'bulb': return html`<g><circle cx="50" cy="12" r="7" fill="#ffe27a" stroke=${A} stroke-width="1.5" /><path d="M44 6 l-4 -4 M56 6 l4 -4 M50 3 v-4" stroke="#ffce4f" stroke-width="2" stroke-linecap="round" /></g>`;
    case 'transform': return html`<g><path d="M30 16 l8 8 -8 8" stroke=${A} stroke-width="3" fill="none" stroke-linecap="round" /><path d="M70 16 l-8 8 8 8" stroke=${A} stroke-width="3" fill="none" stroke-linecap="round" /><rect x="44" y="6" width="12" height="10" rx="3" fill=${A} /></g>`;
    case 'car': return html`<g><path d="M18 78 l6 -12 h52 l6 12Z" fill=${A} /><rect x="30" y="68" width="40" height="8" rx="3" fill="#bfe4ff" /><circle cx="30" cy="86" r="8" fill="#2b2b3a" /><circle cx="70" cy="86" r="8" fill="#2b2b3a" /></g>`;
    case 'titan': return html`<g><rect x="16" y="40" width="10" height="30" rx="4" fill=${A} /><rect x="74" y="40" width="10" height="30" rx="4" fill=${A} /><path d="M36 10 l14 8 14 -8 -4 12 -20 0Z" fill="#ffce4f" /></g>`;
    case 'lion': return html`<g><circle cx="50" cy="30" r="24" fill=${A} opacity=".55" /><path d="M28 30 l-8 -6 M72 30 l8 -6 M50 6 v-6" stroke=${A} stroke-width="3" stroke-linecap="round" /></g>`;
    case 'jet': return html`<g><path d="M14 56 l16 -6 0 12Z" fill=${A} /><path d="M86 56 l-16 -6 0 12Z" fill=${A} /><path d="M46 86 q4 10 8 0" fill="#ff9a52" /></g>`;
    case 'fist': return html`<g><circle cx="22" cy="66" r="11" fill=${A} /><circle cx="78" cy="66" r="11" fill=${A} /><path d="M17 66 h10 M73 66 h10" stroke="#fff" stroke-width="2" opacity=".6" /></g>`;
    case 'wing': return html`<g><path d="M22 50 q-16 -8 -12 12 q10 -2 14 -4Z" fill="#fff" opacity=".85" /><path d="M78 50 q16 -8 12 12 q-10 -2 -14 -4Z" fill="#fff" opacity=".85" /></g>`;
    // W3 특공대
    case 'visorR': case 'visorB': case 'visorY': case 'visorP': case 'visorK': {
      const col = { visorR: '#ff5a5a', visorB: '#5b8def', visorY: '#ffce4f', visorP: '#ff8fc7', visorK: '#4a4a5a' }[prop];
      return html`<g><path d="M28 34 q22 -18 44 0 l0 8 q-22 -8 -44 0Z" fill=${col} /><path d="M50 12 v-8" stroke=${col} stroke-width="3" stroke-linecap="round" /><circle cx="50" cy="3" r="3" fill=${col} /></g>`;
    }
    case 'ninja': return html`<g><path d="M24 42 q26 -10 52 0 l0 7 q-26 -7 -52 0Z" fill="#2b2b3a" /><path d="M76 44 q10 4 8 14" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round" /></g>`;
    case 'bomb': return html`<g><circle cx="76" cy="26" r="9" fill="#3a3a48" /><path d="M76 17 q6 -6 10 -2" stroke="#8a5a2b" stroke-width="2.5" fill="none" /><path d="M84 12 l4 -5 M88 14 l5 -3" stroke="#ff8f3f" stroke-width="2" stroke-linecap="round" /></g>`;
    case 'stealth': return html`<g opacity=".55"><circle cx="50" cy="56" r="30" fill="#fff" opacity=".25" /><path d="M20 40 q30 -8 60 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6" /></g>`;
    case 'boots': return html`<g><rect x="30" y="84" width="16" height="10" rx="4" fill=${A} /><rect x="54" y="84" width="16" height="10" rx="4" fill=${A} /></g>`;
    case 'cannon': return html`<g><rect x="70" y="52" width="22" height="12" rx="5" fill="#5a5a6e" /><circle cx="92" cy="58" r="6" fill="#3a3a48" /></g>`;
    case 'medal': return html`<g><circle cx="50" cy="74" r="9" fill="#ffce4f" stroke=${A} stroke-width="2" /><polygon points="50,68 52,73 57,73 53,76 55,81 50,78 45,81 47,76 43,73 48,73" fill="#fff" /></g>`;
    case 'bolt2': return html`<polygon points="80,20 62,48 76,48 70,72 92,40 76,40" fill="#ffce4f" stroke=${A} stroke-width="1.5" />`;
    case 'fist2': return html`<g><circle cx="20" cy="60" r="12" fill=${A} /><path d="M14 60 h12" stroke="#fff" stroke-width="2.5" opacity=".7" /></g>`;
    case 'rotor': return html`<g><line x1="20" y1="12" x2="80" y2="12" stroke=${A} stroke-width="4" stroke-linecap="round" /><line x1="50" y1="12" x2="50" y2="24" stroke=${A} stroke-width="3" /></g>`;
    case 'glasses': return html`<g><circle cx="41" cy="50" r="9" fill="none" stroke="#2b2b3a" stroke-width="2.5" /><circle cx="59" cy="50" r="9" fill="none" stroke="#2b2b3a" stroke-width="2.5" /><path d="M50 50 h0" stroke="#2b2b3a" stroke-width="2.5" /></g>`;
    case 'siren2': return html`<g><rect x="40" y="6" width="20" height="10" rx="5" fill="#5b8def" /><path d="M32 10 l6 4 M68 10 l-6 4" stroke="#5b8def" stroke-width="2.5" stroke-linecap="round" /></g>`;
    // W4 히어로 (마블 무드)
    case 'core': return html`<g><circle cx="50" cy="60" r="9" fill="#7fe7ff" stroke="#fff" stroke-width="2.5" /><circle cx="50" cy="60" r="4" fill="#fff" /><path d="M34 40 q16 -8 32 0" stroke="#ffce4f" stroke-width="3" fill="none" /></g>`;
    case 'web': return html`<g stroke="#fff" stroke-width="1.6" fill="none" opacity=".85"><path d="M32 52 h36 M50 36 v32 M36 40 l28 24 M64 40 l-28 24" /><circle cx="50" cy="52" r="9" /></g>`;
    case 'muscle': return html`<g><circle cx="22" cy="62" r="12" fill=${C} /><circle cx="78" cy="62" r="12" fill=${C} /><path d="M36 84 l6 -8 6 8 6 -8 6 8" fill="none" stroke=${A} stroke-width="3" /></g>`;
    case 'hammer': return html`<g><rect x="70" y="30" width="20" height="14" rx="3" fill="#9aa8bc" stroke=${A} stroke-width="1.5" /><rect x="77" y="44" width="5" height="26" rx="2" fill="#8a5a2b" /></g>`;
    case 'shield': return html`<g><circle cx="24" cy="62" r="13" fill="#ff5a5a" stroke="#fff" stroke-width="2.5" /><circle cx="24" cy="62" r="7" fill="#fff" /><circle cx="24" cy="62" r="3.5" fill="#5b8def" /></g>`;
    case 'belt': return html`<g><rect x="32" y="66" width="36" height="7" rx="3" fill="#2b2b3a" /><circle cx="50" cy="69" r="4" fill="#ffce4f" /></g>`;
    case 'bow': return html`<g><path d="M76 36 q14 22 0 44" stroke=${A} stroke-width="3.5" fill="none" /><path d="M76 36 L76 80" stroke="#fff" stroke-width="1.5" /><path d="M62 58 h22" stroke="#8a5a2b" stroke-width="2.5" /></g>`;
    case 'antenna2': return html`<g><path d="M40 22 q-6 -12 -12 -14" stroke=${A} stroke-width="2.5" fill="none" /><path d="M60 22 q6 -12 12 -14" stroke=${A} stroke-width="2.5" fill="none" /><circle cx="27" cy="7" r="3" fill=${A} /><circle cx="73" cy="7" r="3" fill=${A} /></g>`;
    case 'magic': return html`<g fill="none" stroke="#ffce4f" stroke-width="2.5"><circle cx="76" cy="34" r="10" /><circle cx="76" cy="34" r="5" /><path d="M76 20 v-5 M90 34 h5 M76 48 v5 M62 34 h-5" /></g>`;
    case 'claw': return html`<g stroke="#e8e8f0" stroke-width="3" stroke-linecap="round"><path d="M18 56 l-8 -8 M18 64 l-9 0 M18 72 l-8 8" /></g>`;
    case 'branch': return html`<g><path d="M44 20 q-10 -10 -16 -8 M56 20 q10 -10 16 -8" stroke="#6b4420" stroke-width="3" fill="none" stroke-linecap="round" /><circle cx="27" cy="11" r="4" fill="#7bd88f" /><circle cx="73" cy="11" r="4" fill="#7bd88f" /></g>`;
    case 'horns2': return html`<g><path d="M34 24 q-6 -18 4 -22 q2 10 4 20Z" fill="#ffce4f" /><path d="M66 24 q6 -18 -4 -22 q-2 10 -4 20Z" fill="#ffce4f" /></g>`;
    case 'mask2': return html`<g><path d="M30 44 q20 -14 40 0 l0 10 q-20 -8 -40 0Z" fill="#c02a2a" /><ellipse cx="41" cy="47" rx="5" ry="4" fill="#fff" /><ellipse cx="59" cy="47" rx="5" ry="4" fill="#fff" /></g>`;
    case 'board': return html`<g><ellipse cx="50" cy="90" rx="30" ry="6" fill="#c8ccd8" /><ellipse cx="50" cy="88" rx="24" ry="4" fill="#e8ecf2" /></g>`;
    case 'wing2': return html`<g><path d="M20 48 q-18 -6 -14 16 q12 -4 16 -8Z" fill="#e8e8f0" /><path d="M80 48 q18 -6 14 16 q-12 -4 -16 -8Z" fill="#e8e8f0" /></g>`;
    case 'metalarm': return html`<g><rect x="12" y="52" width="14" height="26" rx="6" fill="#9aa8bc" stroke=${A} stroke-width="1.5" /><path d="M12 62 h14 M12 70 h14" stroke=${A} stroke-width="1.5" /><polygon points="19,58 22,62 16,62" fill="#ff5a5a" /></g>`;
    case 'gem': return html`<polygon points="50,20 55,28 50,36 45,28" fill="#ffce4f" stroke="#fff" stroke-width="1.5" />`;
    case 'sword': return html`<g><rect x="80" y="28" width="4" height="34" rx="2" fill="#d8dce4" /><rect x="74" y="60" width="16" height="5" rx="2" fill=${A} /></g>`;
    // W5 몬스터
    case 'shell': return html`<g><ellipse cx="50" cy="66" rx="22" ry="16" fill=${A} opacity=".85" /><path d="M34 66 h32 M50 52 v28 M38 56 l24 20 M62 56 l-24 20" stroke="#fff" stroke-width="1.5" opacity=".7" /></g>`;
    case 'flametail': return html`<g><path d="M78 70 q16 -6 10 -20 q-4 10 -12 12Z" fill="#ff8f3f" /><path d="M80 68 q8 -4 6 -12 q-3 6 -8 8Z" fill="#ffce4f" /></g>`;
    case 'leaf2': return html`<g><path d="M50 22 q-14 -10 -18 2 q12 8 18 -2Z" fill="#7bd88f" /><path d="M50 22 q14 -10 18 2 q-12 8 -18 -2Z" fill="#5fa838" /></g>`;
    case 'sleep': return html`<g fill="none" stroke="#8a95a8" stroke-width="2.5"><path d="M70 24 h10 l-10 12 h10" /><path d="M84 12 h7 l-7 9 h7" /></g>`;
    case 'bolt3': return html`<polygon points="20,22 6,50 18,50 12,72 32,42 18,42" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" />`;
    case 'furtail': return html`<g><path d="M76 70 q18 4 12 20 q-12 -2 -16 -10Z" fill="#fff" opacity=".9" /><path d="M28 30 q-8 -14 2 -18 q4 8 4 16Z" fill=${C} /></g>`;
    case 'psy': return html`<g fill="none" stroke="#c8a8ff" stroke-width="2.5" opacity=".9"><path d="M22 30 q28 -14 56 0" /><path d="M28 20 q22 -10 44 0" /></g>`;
    case 'fin': return html`<g><path d="M40 18 q10 -14 20 0 q-10 -4 -20 0Z" fill="#5b8def" /><path d="M78 66 q14 6 10 22 q-12 -4 -14 -12Z" fill="#5b8def" /></g>`;
    case 'blobface': return html`<g><path d="M34 66 q16 8 32 0" stroke="#2b2b3a" stroke-width="2.5" fill="none" /><circle cx="30" cy="46" r="3" fill="#fff" opacity=".7" /></g>`;
    case 'note': return html`<g fill="#ff8fc7"><circle cx="78" cy="30" r="5" /><rect x="82" y="14" width="3" height="18" /><circle cx="90" cy="20" r="4" /></g>`;
    case 'gasball': return html`<g opacity=".7"><circle cx="24" cy="34" r="6" fill="#b8a8d8" /><circle cx="76" cy="28" r="5" fill="#b8a8d8" /><circle cx="82" cy="44" r="4" fill="#b8a8d8" /></g>`;
    case 'magnet': return html`<g><path d="M28 24 q-14 6 -10 20 l8 -2 q-2 -10 6 -12Z" fill="#ff5a5a" /><path d="M72 24 q14 6 10 20 l-8 -2 q2 -10 -6 -12Z" fill="#5b8def" /></g>`;
    case 'muscle2': return html`<g><circle cx="20" cy="58" r="13" fill=${C} /><circle cx="80" cy="58" r="13" fill=${C} /></g>`;
    case 'rock': return html`<g><polygon points="26,80 34,66 44,80" fill=${A} /><polygon points="56,80 66,64 76,80" fill=${A} /></g>`;
    case 'wing3': return html`<g><path d="M18 44 q-16 -10 -12 14 q12 -2 18 -6Z" fill=${A} /><path d="M82 44 q16 -10 12 14 q-12 -2 -18 -6Z" fill=${A} /></g>`;
    case 'tongue': return html`<g><path d="M50 70 q6 14 -2 18 q-6 -6 -4 -18Z" fill="#ff7a9a" /></g>`;
    // W3 신규 친구 소품
    case 'sunray': return html`<g><circle cx="78" cy="22" r="5" fill="#ffce4f" opacity=".8" /><circle cx="22" cy="20" r="3.5" fill="#ffce4f" opacity=".7" /></g>`;
    case 'star2': return html`<polygon points="80,22 83,30 91,30 85,35 87,43 80,38 73,43 75,35 69,30 77,30" fill="#ffce4f" />`;
    case 'cape2': return html`<path d="M22 52 q-10 26 6 34 q6 -18 10 -26Z" fill=${A} opacity=".9" />`;
    case 'crown2': return html`<path d="M32 14 L38 2 L46 12 L50 0 L54 12 L62 2 L68 14Z" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" stroke-linejoin="round" />`;
    case 'bosscrown': return html`<g><path d="M30 12 L37 0 L44 10 L50 -2 L56 10 L63 0 L70 12Z" fill="#ffce4f" stroke="#e0a400" stroke-width="1.5" stroke-linejoin="round" /><circle cx="50" cy="6" r="3" fill="#ff5a5a" /></g>`;
    case 'clownnose': return html`<g><circle cx="24" cy="30" r="5" fill="#ff5a5a" /><circle cx="76" cy="30" r="5" fill="#7fe7ff" /></g>`;
    case 'speed': return html`<g stroke=${A} stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M14 50 h12 M10 60 h16 M14 70 h12" /></g>`;
    case 'flower': return html`<g><circle cx="72" cy="24" r="4" fill="#ff8fc7" /><circle cx="79" cy="20" r="4" fill="#ff8fc7" /><circle cx="79" cy="28" r="4" fill="#ff8fc7" /><circle cx="86" cy="24" r="4" fill="#ff8fc7" /><circle cx="79" cy="24" r="3" fill="#ffce4f" /></g>`;
    case 'note2': return html`<g fill="#7a59d0"><circle cx="80" cy="34" r="5" /><rect x="84" y="16" width="3" height="20" /><path d="M87 16 q7 3 7 8 q-3 -5 -7 -5Z" /></g>`;
    case 'ponytail': return html`<g><path d="M72 30 q14 6 10 24 q-12 -4 -14 -14Z" fill=${A} /><circle cx="70" cy="30" r="4" fill="#ff8fc7" /></g>`;
    case 'goggles': return html`<g><rect x="34" y="30" width="32" height="8" rx="4" fill="#ffce4f" /><circle cx="42" cy="34" r="3" fill="#7fe7ff" /><circle cx="58" cy="34" r="3" fill="#7fe7ff" /></g>`;
    case 'ghostcrown': return html`<g><path d="M34 26 L40 14 L47 24 L50 12 L53 24 L60 14 L66 26Z" fill="#c8b8ff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" /><circle cx="50" cy="18" r="2.5" fill="#8a6df0" /></g>`;
    case 'ribbon': return html`<g><path d="M50 22 q-12 -10 -14 0 q10 4 14 0Z" fill="#ff8fc7" /><path d="M50 22 q12 -10 14 0 q-10 4 -14 0Z" fill="#ff8fc7" /><circle cx="50" cy="23" r="3.5" fill="#ff5a9a" /></g>`;
    case 'whistle': return html`<g><path d="M62 62 q14 -4 18 6 q-14 6 -18 -6Z" fill="#ffce4f" stroke=${A} stroke-width="1.5" /><path d="M62 64 q-10 -6 -14 -18" stroke=${A} stroke-width="2.5" fill="none" /></g>`;
    case 'lumps': return html`<g opacity=".55"><circle cx="26" cy="40" r="5" fill=${A} /><circle cx="76" cy="36" r="6" fill=${A} /><circle cx="66" cy="82" r="5" fill=${A} /></g>`;
    case 'braids': return html`<g><path d="M28 34 q-12 10 -8 26 q10 -2 12 -12Z" fill=${A} /><path d="M72 34 q12 10 8 26 q-10 -2 -12 -12Z" fill=${A} /><circle cx="22" cy="60" r="3.5" fill="#ff8fc7" /><circle cx="78" cy="60" r="3.5" fill="#ff8fc7" /></g>`;
    case 'cap': return html`<g><path d="M30 30 q20 -18 40 0 l0 4 q-20 -7 -40 0Z" fill=${A} /><path d="M68 32 q14 2 16 8 l-16 0Z" fill=${A} /><circle cx="50" cy="14" r="3.5" fill=${C} /></g>`;
    default: return null;
  }
}

const WORLD_HOST_RENDER = { 1: dinoHost, 2: robotHost, 3: rangerHost, 4: heroHost, 5: monsterHost };
function variantChar(meta) {
  // 전용 몸체가 지정된 캐릭터는 그 형태로, 없으면 월드 기본 몸체로 그린다.
  const bodyFn = meta.body && BODY_RENDER[meta.body];
  const inner = bodyFn
    ? bodyFn(meta.palette)
    : (WORLD_HOST_RENDER[meta.world] || monsterHost)(meta.palette, meta.idx);
  return html`<g>${inner}${hostProp(meta.prop, meta.palette)}</g>`;
}

// ---------------------------------------------------------------------------
// 캐릭터 컴포넌트
// ---------------------------------------------------------------------------
export function Character({ kind = 'kongryong', size = 80, anim = 'float', style }) {
  let inner;
  if (HOST_META[kind]) {
    inner = variantChar(HOST_META[kind]);
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
