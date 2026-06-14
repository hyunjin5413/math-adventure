# 배포 가이드 (빠른 공유)

이 앱은 **백엔드 없는 순수 정적 사이트**입니다. `web/` 폴더 하나만 올리면 동작합니다.
진척도는 브라우저 `localStorage`에 저장되므로 서버/DB가 필요 없습니다.

> 배포 전 항상 한 번: `node build.mjs` — 최신 콘텐츠를 `web/stages.json`에 복사합니다.
> (`node build.mjs --variants 3` 로 매 시도 다른 문제 세트까지 포함)

## 가장 빠른 3가지 방법

### 1) Netlify Drop — 계정만 있으면 1분, 설정 0
1. `node build.mjs` 실행
2. https://app.netlify.com/drop 접속
3. **`web/` 폴더를 통째로 드래그&드롭** → 즉시 `https://....netlify.app` 링크 발급

### 2) Cloudflare Pages / Vercel — Git 연결 자동 배포
- 레포 연결 후 설정:
  - **빌드 명령**: `node build.mjs`
  - **출력(배포) 디렉터리**: `web`
- 이후 push 할 때마다 자동 재배포.

### 3) GitHub Pages — 포함된 워크플로 사용
- 레포를 GitHub에 푸시 → Settings → Pages → Source를 **GitHub Actions**로 설정
- `.github/workflows/deploy-pages.yml` 가 `main` 푸시마다 `web/` 를 게시
- 링크: `https://<user>.github.io/<repo>/`

### 로컬에서 잠깐 공유만
```bash
node build.mjs
npx serve web        # 또는: python3 -m http.server -d web 8137
```

## 접속 경로
- 위 방법들은 모두 `web/` 를 **사이트 루트**로 배포하므로 도메인 루트(`/`)로 접속하면 바로 앱입니다.
- 레포 전체를 루트로 올리는 호스트라면 `/web/` 경로로 접속하세요(앱이 데이터 경로를 자동 폴백).

## 지금은 안 되는 것 (실제 출시 전 보완 권장 — PRD §10)
- **오프라인 플레이**: 서비스워커 미구현. 현재는 온라인 필요(React를 CDN에서 로드).
- **CDN 의존 제거**: 안정성·프라이버시·오프라인을 위해 React/htm 번들 vendoring 또는 Vite 빌드 전환 권장.
- **분석/광고**: 아동 대상이므로 PII 수집 금지, 광고 배제(§10).
- 위 보완이 필요하면 "프로덕션 하드닝"으로 진행하면 됩니다.
