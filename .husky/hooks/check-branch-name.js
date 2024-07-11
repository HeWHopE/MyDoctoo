import fs from 'fs';
import path from 'path';

const branchName = getCurrentBranchName();

const isValidBranchName = /^((chore|style|fix|hot-fix|main|development|feat|refactor|ci)\/[a-zA-Z0-9\-]+)$/gm.test(branchName);

if (!isValidBranchName) {
  console.error('Error: Branch name should start with "fix/", "hot-fix/", "main/", "development/", "feat/", "refactor/", "ci/", "style/", "chore/".');
  process.exit(1);
}

function getCurrentBranchName() {
  const headPath = path.resolve('.git', 'HEAD');
  const headContent = fs.readFileSync(headPath, 'utf-8').trim();

  const branchMatch = headContent.match(/^ref: refs\/heads\/(.+)$/);

  if (branchMatch && branchMatch[1]) {
    return branchMatch[1];
  } else {
    console.error('Error: Unable to determine the current branch.');
    process.exit(1);
  }
}