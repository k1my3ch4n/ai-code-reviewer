import { FileChange } from '../types';
import { minimatch } from 'minimatch';

export function filterFiles(
  files: FileChange[],
  excludePatterns: string[]
): FileChange[] {
  return files.filter((file) => {
    for (const pattern of excludePatterns) {
      if (minimatch(file.filename, pattern.trim(), { matchBase: true })) {
        return false;
      }
    }
    return true;
  });
}

export function hasReviewableChanges(files: FileChange[]): boolean {
  return files.some((file) => file.patch && file.patch.length > 0);
}
