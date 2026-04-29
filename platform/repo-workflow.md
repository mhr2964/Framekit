# Repository Workflow Guidance

## Branches
- Active remote workflow is enabled only when worker remote context matches the live repo.
- Managers should do active work on a department-scoped branch named `feat/<dept>/<short-slice-task>`.
- Every branch should target `main`.
- Example: `feat/frontend/review-room-shell`.

## Push Requests
- Only managers should issue a `### Push Request`.
- A manager should emit `### Push Request` against `main` as soon as a coherent, reviewable increment is ready.
- If push attempts still resolve to the old invalid repository, hold `### Push Request` and continue local workspace delivery until worker remote context is corrected.
- Keep Push Requests scoped to the current create→review→share work.

## Current Phase Scope
- Use only this minimal feature-branch workflow for the current create→review→share phase.
- Do not introduce `develop`, release branches, or extra repo/process workflow for this phase.
- Surface repo-access facts only when they materially affect active engineering execution.