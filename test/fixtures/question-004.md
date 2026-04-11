---
question: "Given the following workflow, which statements are correct?"
difficulty: hard
tags:
  - actions
  - yaml
source: "https://example.com/quiz-bank"
---

> https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
> https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions

```yaml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test
```

- [X] It runs tests across three Node.js versions in parallel
- [x] It triggers on pull requests targeting the `main` branch
- [ ] It deploys to production after tests pass
- [ ] It uses a self-hosted runner
> This is wrong because `runs-on: ubuntu-latest` uses a GitHub-hosted runner
- [ ] The workflow file must be named `ci.yml`
  ```yaml
  # Any valid filename works in .github/workflows/
  name: CI
  ```
