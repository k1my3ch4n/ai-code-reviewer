import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIClient, AIConfig } from './types';
import { ReviewResult } from '../types';

export class GeminiClient implements AIClient {
  private model;

  constructor(config: AIConfig) {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const modelName = config.model || 'gemini-1.5-flash';
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async review(prompt: string): Promise<ReviewResult> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return this.parseResponse(text);
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
