# Repository Workflow Guidance

## Branches
- Default target branch: `main`.
- Managers should do active work on a department-scoped branch named `feat/<dept>/<short-slice-task>`.
- Example: `feat/frontend/review-room-shell`.

## Push Requests
- Only managers should issue a `### Push Request`.
- A manager should emit `### Push Request` against `main` as soon as a coherent, reviewable increment is ready.
- Do not wait for a larger release batch or extra workflow stage.

## Current Phase Scope
- Use only the minimal feature-branch workflow above for this create→review→share phase.
- Do not introduce `develop`, release branches, or other extra branch workflow for this phase.
- Remote setup should only be handled if it is blocking active work on the current increment.