const RETRYABLE_PATTERNS = ['429', '503', 'rate limit', 'too many requests', 'overloaded', 'service unavailable'];

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return RETRYABLE_PATTERNS.some((p) => msg.includes(p));
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries || !isRetryable(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError;
}
