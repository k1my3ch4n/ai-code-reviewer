# AI Code Reviewer - 구현 계획

> **상태: 구현 완료** ✅

## 프로젝트 개요
GitHub Actions를 이용하여 PR(Pull Request) 생성 시 자동으로 AI 기반 코드 리뷰를 수행하는 액션

## 기술 스택 선정

### 런타임: Node.js 20
- GitHub Actions에서 가장 널리 사용되는 런타임
- @actions/core, @actions/github 등 공식 라이브러리 지원
- TypeScript 지원으로 타입 안정성 확보

### 언어: TypeScript
- 타입 안정성으로 런타임 에러 방지
- 더 나은 IDE 지원 및 자동완성
- 유지보수성 향상

### AI 모델 API
- **Claude API (Anthropic)**: 코드 분석에 강점, 긴 컨텍스트 지원
- **Gemini API (Google)**: 무료 티어 제공, 빠른 응답 속도
- 사용자가 선택할 수 있도록 두 API 모두 지원

### 빌드 도구: @vercel/ncc
- 모든 의존성을 단일 파일로 번들링
- GitHub Actions에서 node_modules 없이 실행 가능
- 빠른 액션 시작 시간

## 구현 단계

### Phase 1: 프로젝트 초기 설정 ✅
- [x] package.json 생성 및 의존성 정의
- [x] TypeScript 설정 (tsconfig.json)
- [x] ESLint 설정
- [x] action.yml 메타데이터 파일 생성
- [x] .gitignore 설정

### Phase 2: 핵심 기능 구현 ✅
- [x] GitHub API 연동 (PR diff 가져오기) - `src/github.ts`
- [x] Claude API 클라이언트 구현 - `src/ai/claude.ts`
- [x] Gemini API 클라이언트 구현 - `src/ai/gemini.ts`
- [x] AI 클라이언트 팩토리 패턴 적용 - `src/ai/index.ts`

### Phase 3: 리뷰 기능 구현 ✅
- [x] 변경된 파일 분석 로직 - `src/review/analyzer.ts`
- [x] 코드 리뷰 프롬프트 설계 (한국어/영어) - `src/review/prompts.ts`
- [x] AI 리뷰 요청 및 응답 처리
- [x] PR 코멘트 작성 기능

### Phase 4: 출력 포맷 구현 ✅
- [x] 전체 총평 섹션
- [x] 개선 필요 사항 섹션
- [x] 대안 제시 섹션
- [x] 잘된 점 섹션
- [x] 마크다운 포맷팅 - `src/review/formatter.ts`

### Phase 5: 빌드 및 배포 ✅
- [x] ncc 빌드 설정
- [x] dist 폴더 생성 (번들링 완료)
- [x] 테스트 워크플로우 작성 - `.github/workflows/test.yml`
- [x] dist 최신 상태 검증 CI 추가
- [x] 사용 예시 워크플로우 작성 - `.github/workflows/example-usage.yml.example`

### Phase 6: 문서화 ✅
- [x] README.md 작성 (사용법, 기술 선택 이유, 기대효과, 참조)

## 구현된 디렉토리 구조
```
ai-code-reviewer/
├── .github/
│   └── workflows/
│       ├── test.yml                    # 빌드/린트/타입체크/dist 검증
│       └── example-usage.yml.example   # 사용 예시 (다른 프로젝트용)
├── src/
│   ├── index.ts              # 메인 엔트리포인트
│   ├── github.ts             # GitHub API 연동
│   ├── types.ts              # 공통 타입 정의
│   ├── ai/
│   │   ├── index.ts          # AI 클라이언트 팩토리
│   │   ├── claude.ts         # Claude API 클라이언트
│   │   ├── gemini.ts         # Gemini API 클라이언트
│   │   └── types.ts          # AI 관련 타입 정의
│   └── review/
│       ├── index.ts          # 리뷰 모듈 export
│       ├── analyzer.ts       # 파일 필터링 로직
│       ├── formatter.ts      # 리뷰 결과 포맷팅
│       └── prompts.ts        # AI 프롬프트 템플릿
├── dist/                     # 빌드 결과물 (번들링됨, Git에 포함)
├── action.yml                # GitHub Action 메타데이터
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
├── plan.md                   # 이 파일
└── README.md
```

## 구현된 action.yml 입력 파라미터
| 파라미터 | 필수 | 기본값 | 설명 |
|---------|------|--------|------|
| `github-token` | O | - | GitHub API 접근용 토큰 |
| `ai-provider` | O | `claude` | AI 제공자 (`claude` 또는 `gemini`) |
| `claude-api-key` | - | - | Claude API 키 (Claude 사용 시 필수) |
| `gemini-api-key` | - | - | Gemini API 키 (Gemini 사용 시 필수) |
| `language` | - | `ko` | 리뷰 출력 언어 (`ko` 또는 `en`) |
| `model` | - | 자동 | 사용할 AI 모델 |
| `exclude-patterns` | - | `*.lock,*.md,...` | 리뷰 제외 파일 패턴 |

## 리뷰 출력 형식
```markdown
## 🤖 AI 코드 리뷰

### 📋 총평
전반적인 코드 품질과 변경사항에 대한 요약...

### ⚠️ 개선 필요 사항
1. **파일명:라인번호** - 개선 내용
   ```suggestion
   제안 코드
   ```

### 💡 더 나은 방법 제안
1. 대안적 접근 방식에 대한 설명...

### ✅ 잘된 점
1. 긍정적인 피드백...

---
📊 검토된 파일: N | 제공: CLAUDE
```

## 사용 방법

### 1. 이 저장소 배포
```bash
# 저장소를 GitHub에 푸시
git add .
git commit -m "Initial commit"
git push origin main

# 릴리즈 태그 생성
git tag v1
git push origin v1
```

### 2. 다른 프로젝트에서 사용
```yaml
# .github/workflows/code-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
      - uses: k1my3ch4n/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ai-provider: 'claude'
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
          language: 'ko'
```

### 3. API 키 설정
Repository Settings > Secrets and variables > Actions에서:
- Claude: `CLAUDE_API_KEY`
- Gemini: `GEMINI_API_KEY`
