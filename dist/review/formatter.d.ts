import { ReviewResult } from '../types';
interface FormatConfig {
    language: 'ko' | 'en';
    filesReviewed: number;
    aiProvider: string;
    skippedFiles?: string[];
}
export declare function formatReviewComment(result: ReviewResult, config: FormatConfig): string;
export {};
//# sourceMappingURL=formatter.d.ts.map