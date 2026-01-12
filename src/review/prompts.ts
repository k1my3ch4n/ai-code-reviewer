import { FileChange, PullRequestInfo } from '../types';

interface PromptConfig {
  language: 'ko' | 'en';
  prInfo: PullRequestInfo;
  files: FileChange[];
}

const SYSTEM_PROMPTS = {
  ko: `당신은 시니어 소프트웨어 엔지니어로서 코드 리뷰를 수행합니다.
주어진 Pull Request의 변경사항을 분석하고, 다음 형식의 JSON으로 응답해주세요:

{
  "summary": "전체적인 코드 변경에 대한 총평 (2-3문장)",
  "improvements": [
    {
      "file": "파일 경로",
      "line": 라인번호(선택),
      "content": "개선이 필요한 내용 설명",
      "code": "개선된 코드 예시(선택)"
    }
  ],
  "suggestions": [
    {
      "content": "더 나은 방법이나 대안에 대한 제안",
      "code": "제안 코드(선택)"
    }
  ],
  "positives": [
    {
      "content": "잘된 점이나 긍정적인 피드백"
    }
  ]
}

리뷰 시 다음 사항을 고려해주세요:
- 코드 품질 및 가독성
- 잠재적 버그나 에러
- 성능 이슈
- 보안 취약점
- 베스트 프랙티스 준수 여부
- 테스트 커버리지`,

  en: `You are a senior software engineer performing code review.
Analyze the given Pull Request changes and respond in the following JSON format:

{
  "summary": "Overall assessment of the code changes (2-3 sentences)",
  "improvements": [
    {
      "file": "file path",
      "line": line_number(optional),
      "content": "Description of what needs improvement",
      "code": "Improved code example(optional)"
    }
  ],
  "suggestions": [
    {
      "content": "Suggestions for better approaches or alternatives",
      "code": "Suggested code(optional)"
    }
  ],
  "positives": [
    {
      "content": "Positive feedback or things done well"
    }
  ]
}

Consider the following when reviewing:
- Code quality and readability
- Potential bugs or errors
- Performance issues
- Security vulnerabilities
- Best practices adherence
- Test coverage`,
};

export function createReviewPrompt(config: PromptConfig): string {
  const { language, prInfo, files } = config;
  const systemPrompt = SYSTEM_PROMPTS[language];

  const filesContent = files
    .filter((f) => f.patch)
    .map(
      (f) => `
### ${f.filename} (${f.status})
+${f.additions} -${f.deletions}

\`\`\`diff
${f.patch}
\`\`\`
`
    )
    .join('\n');

  return `${systemPrompt}

## Pull Request 정보
- 제목: ${prInfo.title}
- 설명: ${prInfo.body || '(설명 없음)'}
- Base: ${prInfo.baseBranch} <- Head: ${prInfo.headBranch}

## 변경된 파일들
${filesContent}

위 변경사항을 분석하고 JSON 형식으로 코드 리뷰를 제공해주세요.`;
}
