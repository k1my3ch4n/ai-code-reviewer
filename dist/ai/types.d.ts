import { ReviewResult } from '../types';
export interface AIClient {
    review(prompt: string): Promise<ReviewResult>;
}
export interface AIConfig {
    apiKey: string;
    model?: string;
}
//# sourceMappingURL=types.d.ts.map