---
question: "What does this workflow configuration do?"
difficulty: medium
---

> https://docs.github.com/en/actions/using-workflows

```yaml
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
```

- [x] Triggers a build job on pushes to main
- [ ] Triggers on all branches
- [ ] Runs on Windows
