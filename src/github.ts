import * as github from '@actions/github';
import { PullRequestInfo, FileChange } from './types';

type OctokitType = ReturnType<typeof github.getOctokit>;

export class GitHubClient {
  private octokit: OctokitType;
  private context = github.context;

  constructor(token: string) {
    this.octokit = github.getOctokit(token);
  }

  getPullRequestInfo(): PullRequestInfo {
    const { payload } = this.context;
    const pr = payload.pull_request;

    if (!pr) {
      throw new Error('This action can only be run on pull_request events');
    }

    return {
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      pullNumber: pr.number,
      title: pr.title,
      body: pr.body || '',
      baseBranch: pr.base.ref,
      headBranch: pr.head.ref,
    };
  }

  async getChangedFiles(prInfo: PullRequestInfo): Promise<FileChange[]> {
    const files = await this.octokit.paginate(this.octokit.rest.pulls.listFiles, {
      owner: prInfo.owner,
      repo: prInfo.repo,
      pull_number: prInfo.pullNumber,
      per_page: 100,
    });

    return files.map((file) => ({
      filename: file.filename,
      status: file.status as FileChange['status'],
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch,
    }));
  }

  async createReviewComment(
    prInfo: PullRequestInfo,
    body: string
  ): Promise<void> {
    const existingCommentId = await this.findExistingReviewComment(prInfo);

    if (existingCommentId) {
      await this.octokit.rest.issues.updateComment({
        owner: prInfo.owner,
        repo: prInfo.repo,
        comment_id: existingCommentId,
        body,
      });
    } else {
      await this.octokit.rest.issues.createComment({
        owner: prInfo.owner,
        repo: prInfo.repo,
        issue_number: prInfo.pullNumber,
        body,
      });
    }
  }

  private async findExistingReviewComment(prInfo: PullRequestInfo): Promise<number | null> {
    const { data: comments } = await this.octokit.rest.issues.listComments({
      owner: prInfo.owner,
      repo: prInfo.repo,
      issue_number: prInfo.pullNumber,
      per_page: 100,
    });

    const found = comments.find(
      (comment) =>
        comment.user?.type === 'Bot' &&
        comment.body?.includes('<!-- ai-code-reviewer -->')
    );

    return found?.id ?? null;
  }
}
