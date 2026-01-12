import { AIClient, AIConfig } from './types';
import { ReviewResult } from '../types';
export declare class GeminiClient implements AIClient {
    private model;
    constructor(config: AIConfig);
    review(prompt: string): Promise<ReviewResult>;
    private parseResponse;
}
//# sourceMappingURL=gemini.d.ts.map