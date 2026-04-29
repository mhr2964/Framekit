# Repository Workflow Guidance

## Current Remote Status
- Push / `### Push Request` workflow guidance is suspended until the repository URL is corrected.
- Do not treat repo access as an active workstream unless it is materially blocking current engineering execution.

## Local Working Pattern
- Managers should continue work on their existing local feature branches when already in progress.
- If no local branch is already in use, managers may continue as a local workspace increment scoped to the current task.
- Intended branch shape remains `feat/<dept>/<short-slice-task>`.
- Intended target branch remains `main`.

## Status Update Notes
- Until the repository URL is corrected, capture intended branch and PR target notes in manager status updates instead of issuing `### Push Request`.
- Keep those notes concrete and minimal, for example:
  - intended branch: `feat/frontend/review-room-shell`
  - intended target: `main`

## Scope Control
- Surface repo-access facts only when they materially affect active engineering execution on the current increment.
- Do not expand this into release, develop, or broader repo-process workflow for this phase.