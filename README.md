# AI Code Reviewer

GitHub Actions를 이용한 AI 기반 자동 코드 리뷰어입니다. Pull Request가 생성되면 자동으로 코드를 분석하고 리뷰 코멘트를 작성합니다.

## 주요 기능

- **AI 기반 코드 리뷰**: Claude 또는 Gemini API를 활용한 지능적인 코드 분석
- **전체 총평**: 변경사항에 대한 종합적인 평가
- **개선점 제시**: 버그, 보안 취약점, 성능 이슈 등 개선이 필요한 부분 식별
- **대안 제안**: 더 나은 구현 방법이나 베스트 프랙티스 제안
- **다국어 지원**: 한국어(ko), 영어(en) 리뷰 출력 지원

## 사용 방법

### 1. 워크플로우 파일 생성

프로젝트의 `.github/workflows/code-review.yml` 파일을 생성합니다:

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
        uses: your-username/ai-code-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ai-provider: 'claude'  # 또는 'gemini'
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
          language: 'ko'
```

### 2. API 키 설정

Repository Settings > Secrets and variables > Actions에서 API 키를 추가합니다:
- Claude 사용 시: `CLAUDE_API_KEY`
- Gemini 사용 시: `GEMINI_API_KEY`

## 입력 파라미터

| 파라미터 | 필수 | 기본값 | 설명 |
|---------|------|--------|------|
| `github-token` | O | - | GitHub API 접근용 토큰 |
| `ai-provider` | O | `claude` | AI 제공자 (`claude` 또는 `gemini`) |
| `claude-api-key` | - | - | Claude API 키 (Claude 사용 시 필수) |
| `gemini-api-key` | - | - | Gemini API 키 (Gemini 사용 시 필수) |
| `language` | - | `ko` | 리뷰 출력 언어 (`ko` 또는 `en`) |
| `model` | - | - | 사용할 AI 모델 (기본: claude-sonnet-4-20250514, gemini-1.5-flash) |
| `exclude-patterns` | - | `*.lock,*.md,...` | 리뷰에서 제외할 파일 패턴 |

## 출력 예시

```markdown
## AI 코드 리뷰

### 총평
전반적으로 깔끔한 코드 구조를 유지하고 있습니다. 몇 가지 개선점이 있습니다.

### 개선 필요 사항
1. **src/utils.ts:42** - null 체크가 누락되어 있습니다.
   ```suggestion
   if (value !== null && value !== undefined) {
     // ...
   }
   ```

### 더 나은 방법 제안
1. 반복되는 로직을 유틸 함수로 추출하면 코드 재사용성이 높아집니다.

### 잘된 점
1. 일관된 네이밍 컨벤션을 사용하고 있습니다.
```

---

## 기술 스택 및 선택 이유

### TypeScript

**선택 이유:**
- 정적 타입 검사로 런타임 에러 사전 방지
- IDE 자동완성 및 리팩토링 지원으로 개발 생산성 향상
- 대규모 코드베이스에서의 유지보수성 확보

**대안 비교:**
| 언어 | 장점 | 단점 |
|-----|------|------|
| **TypeScript** | 타입 안정성, IDE 지원 우수 | 빌드 단계 필요 |
| JavaScript | 빌드 불필요, 빠른 개발 | 런타임 에러 가능성 |
| Python | 간결한 문법 | GitHub Actions Node 런타임 미지원 |

### @vercel/ncc

**선택 이유:**
- 모든 의존성을 단일 파일로 번들링하여 Actions 실행 속도 최적화
- `node_modules` 없이 배포 가능
- Zero-config로 간편한 설정

**대안 비교:**
| 도구 | 장점 | 단점 |
|-----|------|------|
| **@vercel/ncc** | 단일 파일 출력, 간편함 | 대용량 번들 가능 |
| webpack | 유연한 설정 | 복잡한 설정 필요 |
| esbuild | 매우 빠른 빌드 | 일부 Node.js 호환성 이슈 |

### Claude API (Anthropic)

**선택 이유:**
- 코드 분석에 탁월한 성능
- 200K 토큰의 긴 컨텍스트 윈도우로 대규모 PR 처리 가능
- 안전하고 신뢰할 수 있는 응답

### Gemini API (Google)

**선택 이유:**
- 무료 티어 제공으로 비용 효율적
- 빠른 응답 속도
- 다양한 모델 선택 가능

**AI 모델 비교:**
| 모델 | 장점 | 단점 | 추천 용도 |
|-----|------|------|----------|
| **Claude** | 코드 분석 우수, 긴 컨텍스트 | 유료 | 정밀한 코드 리뷰 |
| **Gemini** | 무료 티어, 빠른 속도 | 컨텍스트 제한 | 간단한 PR 리뷰 |

---

## 기대 효과

1. **코드 품질 향상**: 일관된 기준으로 모든 PR에 대해 자동 리뷰 수행
2. **리뷰 시간 단축**: 기본적인 코드 이슈를 AI가 사전 검토하여 인적 리뷰 부담 감소
3. **학습 효과**: 개발자에게 베스트 프랙티스와 개선 방향 제시
4. **보안 강화**: 잠재적 보안 취약점 조기 발견

---

## 프로젝트 구조

```
ai-code-reviewer/
├── .github/workflows/     # GitHub Actions 워크플로우
├── src/
│   ├── index.ts          # 메인 엔트리포인트
│   ├── github.ts         # GitHub API 연동
│   ├── types.ts          # 타입 정의
│   ├── ai/
│   │   ├── claude.ts     # Claude API 클라이언트
│   │   ├── gemini.ts     # Gemini API 클라이언트
│   │   └── types.ts      # AI 관련 타입
│   └── review/
│       ├── prompts.ts    # AI 프롬프트 템플릿
│       ├── analyzer.ts   # 코드 분석 로직
│       └── formatter.ts  # 리뷰 결과 포맷팅
├── dist/                 # 빌드 결과물
├── action.yml            # GitHub Action 메타데이터
└── package.json
```

---

## 개발

```bash
# 의존성 설치
npm install

# 린트
npm run lint

# 타입 체크
npm run typecheck

# 빌드
npm run build
```

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Creating a JavaScript Action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [@actions/core](https://github.com/actions/toolkit/tree/main/packages/core)
- [@actions/github](https://github.com/actions/toolkit/tree/main/packages/github)
- [Anthropic Claude API](https://docs.anthropic.com/en/api/getting-started)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [@vercel/ncc](https://github.com/vercel/ncc)
- [TypeScript](https://www.typescriptlang.org/)

---

## License

MIT
