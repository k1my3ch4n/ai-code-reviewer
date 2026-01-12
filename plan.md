# AI Code Reviewer - 구현 계획

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

### Phase 1: 프로젝트 초기 설정
- [ ] package.json 생성 및 의존성 정의
- [ ] TypeScript 설정 (tsconfig.json)
- [ ] ESLint 설정
- [ ] action.yml 메타데이터 파일 생성

### Phase 2: 핵심 기능 구현
- [ ] GitHub API 연동 (PR diff 가져오기)
- [ ] Claude API 클라이언트 구현
- [ ] Gemini API 클라이언트 구현
- [ ] 코드 리뷰 프롬프트 설계

### Phase 3: 리뷰 기능 구현
- [ ] 변경된 파일 분석 로직
- [ ] AI 리뷰 요청 및 응답 처리
- [ ] PR 코멘트 작성 기능

### Phase 4: 출력 포맷 구현
- [ ] 전체 총평 섹션
- [ ] 개선 필요 사항 섹션
- [ ] 대안 제시 섹션
- [ ] 마크다운 포맷팅

### Phase 5: 빌드 및 배포
- [ ] ncc 빌드 설정
- [ ] dist 폴더 생성
- [ ] 테스트 워크플로우 작성

## 디렉토리 구조
```
ai-code-reviewer/
├── .github/
│   └── workflows/
│       └── test.yml          # 테스트용 워크플로우
├── src/
│   ├── index.ts              # 메인 엔트리포인트
│   ├── github.ts             # GitHub API 연동
│   ├── ai/
│   │   ├── claude.ts         # Claude API 클라이언트
│   │   ├── gemini.ts         # Gemini API 클라이언트
│   │   └── types.ts          # AI 관련 타입 정의
│   ├── review/
│   │   ├── analyzer.ts       # 코드 분석 로직
│   │   ├── formatter.ts      # 리뷰 결과 포맷팅
│   │   └── prompts.ts        # AI 프롬프트 템플릿
│   └── types.ts              # 공통 타입 정의
├── dist/                     # 빌드 결과물
├── action.yml                # GitHub Action 메타데이터
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## action.yml 입력 파라미터
```yaml
inputs:
  github-token:
    description: 'GitHub token for API access'
    required: true
  ai-provider:
    description: 'AI provider to use (claude or gemini)'
    required: true
    default: 'claude'
  claude-api-key:
    description: 'Anthropic Claude API key'
    required: false
  gemini-api-key:
    description: 'Google Gemini API key'
    required: false
  language:
    description: 'Review language (ko or en)'
    required: false
    default: 'ko'
```

## 리뷰 출력 형식 예시
```markdown
## 🤖 AI Code Review

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
```

## 예상 사용 방법
```yaml
# .github/workflows/code-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: {owner}/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ai-provider: 'claude'
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
          language: 'ko'
```
