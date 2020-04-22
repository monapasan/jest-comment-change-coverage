const core = require("@actions/core");
const { execSync } = require("child_process");
const { GitHub, context } = require("@actions/github");

const main = async () => {
  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const githubToken = core.getInput("github-token");
  const testCommand = core.getInput("jest-command");
  const coverageFolderPath = core.getInput("coverage-folder-path");

  const githubClient = new GitHub(githubToken);
  const commitPRs = await githubClient.repos.listPullRequestsAssociatedWithCommit(
    {
      repo: repoName,
      owner: repoOwner,
      commit_sha: context.sha,
    }
  );
  const prNumber = commitPRs.data[0].number;

  const codeCoverage = execSync(testCommand).toString();
  let coveragePercentage;
  try {
    coveragePercentage = execSync(
      `npx coverage-percentage ${coverageFolderPath}/lcov.info --lcov`
    ).toString();
    coveragePercentage = 100 - parseFloat(coveragePercentage).toFixed(2);
  } catch (e) {
    core.error(
      `Coverage folder doesn't exist. It seems like no changes in the coverage.`
    );
    coveragePercentage = 0;
  }

  const commentBody = `<p>Change in coverage after changes: <code>${coveragePercentage}</code></p>
        <details><summary>Coverage report</summary>
        <p>
        <pre>${codeCoverage}</pre>
        </p>
        </details>`;

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
};

main().catch((err) => core.setFailed(err.message));
