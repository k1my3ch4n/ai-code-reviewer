import { PullRequestInfo, FileChange } from './types';
export declare class GitHubClient {
    private octokit;
    private context;
    constructor(token: string);
    getPullRequestInfo(): PullRequestInfo;
    getChangedFiles(prInfo: PullRequestInfo): Promise<FileChange[]>;
    createReviewComment(prInfo: PullRequestInfo, body: string): Promise<void>;
    private findExistingReviewComment;
}
