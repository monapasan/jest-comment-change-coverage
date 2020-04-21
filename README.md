# jest-comment-changed-coverage

This action comments a pull request with the changed jest code coverage.

## Example usage

```yml
uses: monapasan/jest-comment-changed-coverage@v1
with:
  github-token: \${{ secrets.GITHUB_TOKEN }}
  test-command: "yarn test:changed:coverage"
  coverage-folder-path: "./packages/components/coverage"
```
