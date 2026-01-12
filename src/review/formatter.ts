import { ReviewResult, ReviewItem } from '../types';

interface FormatConfig {
  language: 'ko' | 'en';
  filesReviewed: number;
  aiProvider: string;
}

const LABELS = {
  ko: {
    title: 'AI 코드 리뷰',
    summary: '총평',
    improvements: '개선 필요 사항',
    suggestions: '더 나은 방법 제안',
    positives: '잘된 점',
    noIssues: '특별히 개선이 필요한 사항이 없습니다.',
    filesReviewed: '검토된 파일',
    poweredBy: '제공',
  },
  en: {
    title: 'AI Code Review',
    summary: 'Summary',
    improvements: 'Improvements Needed',
    suggestions: 'Suggestions',
    positives: 'What\'s Good',
    noIssues: 'No specific improvements needed.',
    filesReviewed: 'Files Reviewed',
    poweredBy: 'Powered by',
  },
};

export function formatReviewComment(
  result: ReviewResult,
  config: FormatConfig
): string {
  const labels = LABELS[config.language];
  const lines: string[] = [];

  lines.push(`## 🤖 ${labels.title}`);
  lines.push('');

  // Summary
  lines.push(`### 📋 ${labels.summary}`);
  lines.push(result.summary);
  lines.push('');

  // Improvements
  if (result.improvements.length > 0) {
    lines.push(`### ⚠️ ${labels.improvements}`);
    result.improvements.forEach((item, index) => {
      lines.push(formatItem(item, index + 1));
    });
    lines.push('');
  }

  // Suggestions
  if (result.suggestions.length > 0) {
    lines.push(`### 💡 ${labels.suggestions}`);
    result.suggestions.forEach((item, index) => {
      lines.push(formatItem(item, index + 1));
    });
    lines.push('');
  }

  // Positives
  if (result.positives.length > 0) {
    lines.push(`### ✅ ${labels.positives}`);
    result.positives.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.content}`);
    });
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push(
    `📊 ${labels.filesReviewed}: ${config.filesReviewed} | ${labels.poweredBy}: ${config.aiProvider.toUpperCase()}`
  );

  return lines.join('\n');
}

function formatItem(item: ReviewItem, index: number): string {
  const parts: string[] = [];

  let header = `${index}. `;
  if (item.file) {
    header += `**${item.file}`;
    if (item.line) {
      header += `:${item.line}`;
    }
    header += '** - ';
  }
  header += item.content;
  parts.push(header);

  if (item.code) {
    parts.push('');
    parts.push('```suggestion');
    parts.push(item.code);
    parts.push('```');
  }

  return parts.join('\n');
}
