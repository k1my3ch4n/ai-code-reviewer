# 기술 문서

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

## 개발 가이드

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

### dist 폴더 관리
- `dist/` 폴더는 반드시 Git에 포함되어야 합니다
- 코드 수정 후 반드시 `npm run build` 실행
- CI에서 dist 최신 상태를 자동 검증합니다

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
