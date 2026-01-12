import { FileChange, PullRequestInfo } from '../types';
interface PromptConfig {
    language: 'ko' | 'en';
    prInfo: PullRequestInfo;
    files: FileChange[];
}
export declare function createReviewPrompt(config: PromptConfig): string;
export {};
//# sourceMappingURL=prompts.d.ts.map