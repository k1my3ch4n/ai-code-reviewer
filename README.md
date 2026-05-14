# AI Code Reviewer

GitHub Actions를 이용한 AI 기반 자동 코드 리뷰어입니다. PR이 생성되면 AI가 자동으로 코드를 분석하고 리뷰를 작성합니다.

## 빠른 시작

### 1단계: 워크플로우 파일 생성

프로젝트의 `.github/workflows/ai-review.yml` 파일을 생성합니다:

```yaml
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

      - name: AI Code Review
        uses: k1my3ch4n/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ai-provider: 'claude'
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
```

### 2단계: API 키 설정

1. Repository → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. API 키 추가:
   - Claude 사용 시: Name: `CLAUDE_API_KEY`, Value: API 키
   - Gemini 사용 시: Name: `GEMINI_API_KEY`, Value: API 키

### 3단계: PR 생성

이제 PR을 생성하면 자동으로 AI 코드 리뷰가 실행됩니다.

---

## 사용 예시

### Claude 사용 (권장)

```yaml
- name: AI Code Review
  uses: k1my3ch4n/ai-code-reviewer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    ai-provider: 'claude'
    claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
    language: 'ko'
```

### Gemini 사용 (무료)

```yaml
- name: AI Code Review
  uses: k1my3ch4n/ai-code-reviewer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    ai-provider: 'gemini'
    gemini-api-key: ${{ secrets.GEMINI_API_KEY }}
    language: 'ko'
```

### 영어로 리뷰 받기

```yaml
- name: AI Code Review
  uses: k1my3ch4n/ai-code-reviewer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    ai-provider: 'claude'
    claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
    language: 'en'
```

### 특정 파일 제외하기

```yaml
- name: AI Code Review
  uses: k1my3ch4n/ai-code-reviewer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    ai-provider: 'claude'
    claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
    exclude-patterns: '*.lock,*.md,*.json,*.yml,*.yaml,*.svg,*.png,dist/*'
```

### 특정 모델 지정하기

```yaml
# Gemini Pro 모델 사용
- name: AI Code Review
  uses: k1my3ch4n/ai-code-reviewer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    ai-provider: 'gemini'
    gemini-api-key: ${{ secrets.GEMINI_API_KEY }}
    model: 'gemini-1.5-pro'
```

---

## 입력 파라미터

| 파라미터 | 필수 | 기본값 | 설명 |
|---------|------|--------|------|
| `github-token` | O | - | GitHub API 접근용 토큰 |
| `ai-provider` | O | `claude` | AI 제공자 (`claude` 또는 `gemini`) |
| `claude-api-key` | - | - | Claude API 키 (Claude 사용 시 필수) |
| `gemini-api-key` | - | - | Gemini API 키 (Gemini 사용 시 필수) |
| `language` | - | `ko` | 리뷰 언어 (`ko`: 한국어, `en`: 영어) |
| `model` | - | 아래 참고 | AI 모델 지정 (지정하지 않으면 기본 모델 사용) |
| `exclude-patterns` | - | `*.lock,*.md,...` | 리뷰 제외 파일 패턴 (쉼표 구분) |

### 지원 모델

#### Claude
| 모델 | 설명 |
|-----|------|
| `claude-sonnet-4-20250514` | 기본값. 균형 잡힌 성능 |
| `claude-opus-4-20250514` | 최고 성능, 복잡한 코드 분석에 적합 |

#### Gemini
| 모델 | 무료 티어 | 설명 |
|-----|----------|------|
| `gemini-1.5-flash` | O (분당 15회) | 기본값. 빠른 속도 |
| `gemini-1.5-pro` | O (분당 2회) | 더 정교한 분석 |
| `gemini-2.0-flash` | O (분당 10회) | 최신 모델 |

---

## 리뷰 결과 예시

PR에 다음과 같은 코멘트가 자동으로 작성됩니다:

```markdown
## 🤖 AI 코드 리뷰

### 📋 총평
전반적으로 깔끔한 코드 구조를 유지하고 있습니다.
몇 가지 개선점이 있습니다.

### ⚠️ 개선 필요 사항
1. **src/utils.ts:42** - null 체크가 누락되어 있습니다.
   ```suggestion
   if (value !== null && value !== undefined) {
     // ...
   }
   ```

### 💡 더 나은 방법 제안
1. 반복되는 로직을 유틸 함수로 추출하면 코드 재사용성이 높아집니다.

### ✅ 잘된 점
1. 일관된 네이밍 컨벤션을 사용하고 있습니다.

---
📊 검토된 파일: 5 | 제공: CLAUDE
```

---

## 전체 워크플로우 예시

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

# PR 대상 브랜치 제한 (선택사항)
# on:
#   pull_request:
#     branches: [main, develop]

jobs:
  review:
    runs-on: ubuntu-latest

    # 봇이 생성한 PR 제외 (선택사항)
    if: github.actor != 'dependabot[bot]'

    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: AI Code Review
        uses: k1my3ch4n/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ai-provider: 'claude'
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
          language: 'ko'
          exclude-patterns: '*.lock,*.md,*.json,*.yml,*.yaml'
```

---

## API 키 발급

### Claude API 키
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 회원가입 및 로그인
3. API Keys 메뉴에서 키 생성

### Gemini API 키
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. Google 계정으로 로그인
3. "Get API Key" 클릭하여 키 생성

---

## 문서

- [기술 문서](docs/TECHNICAL.md) - 기술 스택 선택 이유, 프로젝트 구조, 개발 가이드
- [패치 노트](patch.md) - 버전별 수정 내역, 수정 이유 및 기대 효과

## License

MIT
