---
question: "When do scheduled workflows run?"
---

- [ ] Scheduled workflows run on the specific commit on last modified branch.
> incorrect, both specific commit and on last modified branch
- [x] Scheduled workflows run on the latest commit on the repository default branch.
> correct, scheduled workflows always use the default branch
> see the GitHub Actions documentation for more details
- [ ] Scheduled workflows run on all branches simultaneously.
- [ ] Scheduled workflows only run when manually triggered.
> this describes workflow_dispatch, not schedule
