import Anthropic from '@anthropic-ai/sdk';
import { AIClient, AIConfig } from './types';
import { ReviewResult } from '../types';
import { withRetry } from './retry';

export class ClaudeClient implements AIClient {
  private client: Anthropic;
  private model: string;

  constructor(config: AIConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'claude-sonnet-4-20250514';
  }

  async review(prompt: string): Promise<ReviewResult> {
    const response = await withRetry(() =>
      this.client.messages.create(
        {
          model: this.model,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        },
        { signal: AbortSignal.timeout(60_000) }
      )
    );

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return this.parseResponse(content.text);
  }

  private parseResponse(text: string): ReviewResult {
    try {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return JSON.parse(text);
    } catch {
      return {
        summary: text,
        improvements: [],
        suggestions: [],
        positives: [],
      };
    }
  }
}
