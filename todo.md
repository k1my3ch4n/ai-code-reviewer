# TODO

취약점 분석을 통해 발견된 문제들과 문서 개선 작업 목록입니다.

---

## 버그 수정 / 기능 개선

### 🔴 긴급

- [x] **AI API 타임아웃 추가** (`src/ai/claude.ts`, `src/ai/gemini.ts`)
  - 현재 타임아웃 없이 무한 대기 가능 → GitHub Actions 분(minute) 낭비
  - `AbortSignal.timeout(60_000)`으로 60초 타임아웃 처리

- [x] **중복 코멘트 방지** (`src/github.ts`, `src/review/formatter.ts`)
  - PR 업데이트(synchronize)마다 새 코멘트가 달리는 문제
  - HTML 마커(`<!-- ai-code-reviewer -->`) 삽입 후 기존 코멘트 찾아 `updateComment`로 교체

### 🟠 높음

- [x] **GitHub API 페이지네이션 처리** (`src/github.ts`)
  - `per_page: 100` 고정으로 파일 100개 초과 시 누락
  - `octokit.paginate`로 전체 파일 수집

- [x] **프롬프트 인젝션 방지** (`src/review/prompts.ts`)
  - PR 제목·본문이 프롬프트에 그대로 삽입되어 AI 응답 조작 가능
  - 길이 제한(제목 200자, 본문 500자) + XML 태그로 데이터 영역 명확히 구분

### 🟡 중간

- [ ] **큰 PR 분할 처리** (`src/review/prompts.ts`)
  - 대용량 diff를 하나의 프롬프트로 전송 → 토큰 한계 초과 또는 품질 저하
  - 파일별 또는 N토큰 단위로 분할하여 순차 처리

- [ ] **API 재시도 로직 추가** (`src/ai/claude.ts`, `src/ai/gemini.ts`)
  - 429(rate limit), 503(서비스 일시 중단) 등 일시 오류 시 즉시 실패
  - exponential backoff로 최대 3회 재시도

- [ ] **파일 필터링 glob 패턴 수정** (`src/review/analyzer.ts`)
  - `minimatch`에서 `*.lock`은 서브디렉토리 파일(`subdir/package-lock.json`)에 미적용
  - 기본 패턴을 `**/*.lock,**/*.md,...` 형태로 변경 또는 `matchBase: true` 옵션 추가

### 🟢 낮음

- [ ] **`suggestion` 코드블록 방식 수정** (`src/review/formatter.ts`)
  - `issues.createComment`에서는 suggestion 버튼이 작동하지 않음
  - `pulls.createReviewComment`(인라인 리뷰) 방식으로 전환하거나 일반 코드블록으로 변경

- [ ] **`model` 입력값 유효성 검증** (`src/index.ts`)
  - 잘못된 모델명 입력 시 API 오류로 전체 실패
  - 허용 모델 목록 정의 후 사전 검증 또는 에러 메시지 개선

- [ ] **patch 없는 파일 처리 안내** (`src/review/analyzer.ts`)
  - 파일이 너무 크면 GitHub API가 `patch`를 반환하지 않음 — 현재 조용히 건너뜀
  - 건너뛴 파일 목록을 리뷰 코멘트 하단에 표시

---

## 문서 업데이트

- [ ] **README.md — 알려진 제한 사항 섹션 추가**
  - 파일 100개 초과 시 누락 이슈 (페이지네이션 미지원, 수정 전까지)
  - 대용량 PR(diff가 매우 큰 경우) 처리 한계
  - `exclude-patterns` 글로브 패턴 작동 방식 명확히 설명 (`**/*.ts` vs `*.ts`)

- [ ] **README.md — Known Issues / Changelog 섹션 추가**
  - 각 버전별 수정 내역 기록 시작 (v1.x 기준)

- [ ] **README.md — `suggestion` 코드블록 동작 설명 수정**
  - 현재 예시에서 suggestion이 실제로 적용 가능한 것처럼 보임 → 실제 동작 방식으로 수정

- [ ] **`example-usage.yml.example` — `exclude-patterns` 패턴 수정**
  - `*.lock` → `**/*.lock` 형태로 올바른 glob 패턴 예시 제공

- [ ] **CHANGELOG.md 파일 신규 생성**
  - 위 버그 수정 완료 후 v1.1.0 릴리즈 노트 작성
