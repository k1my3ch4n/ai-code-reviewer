import { AIClient, AIConfig } from './types';
import { ReviewResult } from '../types';
export declare class ClaudeClient implements AIClient {
    private client;
    private model;
    constructor(config: AIConfig);
    review(prompt: string): Promise<ReviewResult>;
    private parseResponse;
}
//# sourceMappingURL=claude.d.ts.map