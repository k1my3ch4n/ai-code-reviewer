export interface ActionInputs {
  githubToken: string;
  aiProvider: 'claude' | 'gemini';
  claudeApiKey?: string;
  geminiApiKey?: string;
  language: 'ko' | 'en';
  model?: string;
  excludePatterns: string[];
}

export interface PullRequestInfo {
  owner: string;
  repo: string;
  pullNumber: number;
  title: string;
  body: string;
  baseBranch: string;
  headBranch: string;
}

export interface FileChange {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  patch?: string;
}

export interface ReviewResult {
  summary: string;
  improvements: ReviewItem[];
  suggestions: ReviewItem[];
  positives: ReviewItem[];
}

export interface ReviewItem {
  file?: string;
  line?: number;
  content: string;
  code?: string;
}
