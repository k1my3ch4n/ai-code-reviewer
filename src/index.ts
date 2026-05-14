import * as core from '@actions/core';
import { GitHubClient } from './github';
import { createAIClient } from './ai';
import {
  createReviewPrompt,
  splitFilesIntoBatches,
  filterFiles,
  hasReviewableChanges,
  formatReviewComment,
} from './review';
import { ActionInputs, ReviewResult } from './types';

async function run(): Promise<void> {
  try {
    const inputs = getInputs();
    core.info(`Starting AI Code Review with ${inputs.aiProvider}...`);

    const githubClient = new GitHubClient(inputs.githubToken);
    const aiClient = createAIClient(inputs);

    const prInfo = githubClient.getPullRequestInfo();
    core.info(`Reviewing PR #${prInfo.pullNumber}: ${prInfo.title}`);

    const allFiles = await githubClient.getChangedFiles(prInfo);
    core.info(`Found ${allFiles.length} changed files`);

    const files = filterFiles(allFiles, inputs.excludePatterns);
    core.info(`${files.length} files after filtering`);

    if (!hasReviewableChanges(files)) {
      core.info('No reviewable changes found. Skipping review.');
      core.setOutput('review-comment', '');
      core.setOutput('files-reviewed', 0);
      return;
    }

    core.info('Requesting AI review...');
    const batches = splitFilesIntoBatches(files);
    core.info(`Processing ${batches.length} batch(es)...`);

    const batchResults = await Promise.all(
      batches.map((batchFiles) => {
        const prompt = createReviewPrompt({ language: inputs.language, prInfo, files: batchFiles });
        return aiClient.review(prompt);
      })
    );

    const reviewResult: ReviewResult = batchResults.reduce(
      (merged, result, index) => ({
        summary: index === 0 ? result.summary : `${merged.summary}\n${result.summary}`,
        improvements: [...merged.improvements, ...result.improvements],
        suggestions: [...merged.suggestions, ...result.suggestions],
        positives: [...merged.positives, ...result.positives],
      }),
      { summary: '', improvements: [], suggestions: [], positives: [] } as ReviewResult
    );

    const comment = formatReviewComment(reviewResult, {
      language: inputs.language,
      filesReviewed: files.length,
      aiProvider: inputs.aiProvider,
    });

    await githubClient.createReviewComment(prInfo, comment);
    core.info('Review comment posted successfully!');

    core.setOutput('review-comment', comment);
    core.setOutput('files-reviewed', files.length);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

function getInputs(): ActionInputs {
  const aiProvider = core.getInput('ai-provider', { required: true });
  if (aiProvider !== 'claude' && aiProvider !== 'gemini') {
    throw new Error(`Invalid AI provider: ${aiProvider}. Must be 'claude' or 'gemini'`);
  }

  const language = core.getInput('language') || 'ko';
  if (language !== 'ko' && language !== 'en') {
    throw new Error(`Invalid language: ${language}. Must be 'ko' or 'en'`);
  }

  const excludePatternsInput = core.getInput('exclude-patterns') || '*.lock,*.md,*.json,*.yml,*.yaml';
  const excludePatterns = excludePatternsInput.split(',').map((p) => p.trim());

  return {
    githubToken: core.getInput('github-token', { required: true }),
    aiProvider,
    claudeApiKey: core.getInput('claude-api-key'),
    geminiApiKey: core.getInput('gemini-api-key'),
    language,
    model: core.getInput('model') || undefined,
    excludePatterns,
  };
}

run();
