# Repo Workflow Summary

- Remote workflow is active only when worker remote context matches the live repo.
- Working branch pattern: `feat/<dept>/<short-slice-task>`.
- Target branch: `main`.
- `### Push Request` is manager-only and should be issued against `main` as soon as a coherent reviewable increment is ready.
- If push attempts still resolve to the old invalid repository, hold `### Push Request` and continue local workspace delivery until the remote context is corrected.
- No `develop`, release, or extra repo/process workflow for this phase.