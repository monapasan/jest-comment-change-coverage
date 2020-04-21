# jest-comment-change-coverage

This action comments a pull request with the changed jest code coverage.

## Example usage

uses: monapasan/jest-comment-change-coverage@v1
with:
github-token: \${{ secrets.GITHUB_TOKEN }}
test-command: "yarn test:changed:coverage"
coverage-folder-path: "./packages/components/coverage"
