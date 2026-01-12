import { AIClient } from './types';
import { ClaudeClient } from './claude';
import { GeminiClient } from './gemini';
import { ActionInputs } from '../types';

export function createAIClient(inputs: ActionInputs): AIClient {
  if (inputs.aiProvider === 'claude') {
    if (!inputs.claudeApiKey) {
      throw new Error('Claude API key is required when using Claude provider');
    }
    return new ClaudeClient({
      apiKey: inputs.claudeApiKey,
      model: inputs.model,
    });
  }

  if (inputs.aiProvider === 'gemini') {
    if (!inputs.geminiApiKey) {
      throw new Error('Gemini API key is required when using Gemini provider');
    }
    return new GeminiClient({
      apiKey: inputs.geminiApiKey,
      model: inputs.model,
    });
  }

  throw new Error(`Unsupported AI provider: ${inputs.aiProvider}`);
}

export { AIClient } from './types';
export { ClaudeClient } from './claude';
export { GeminiClient } from './gemini';
