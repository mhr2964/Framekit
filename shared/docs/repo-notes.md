# Framekit Repo Notes

Repository URL: https://github.com/mhr2964/Framekit.git

## Current platform setup

This workspace has been scaffolded to give active departments a safe place to work without assuming unconfirmed implementation details.

Created landing zones:

- `workspace/frontend/`
- `workspace/backend/`
- `workspace/brand/`
- `workspace/growth/`

Created shared repo-facing artifacts:

- `workspace/shared/README.md`
- `workspace/shared/.gitignore`
- `workspace/shared/.github/workflows/ci.yml`

## Assumptions intentionally avoided

Platform has **not** chosen:

- frontend framework
- backend framework
- package manager
- monorepo tool
- deployment targets
- test runner
- environment variable conventions beyond generic ignores

## Why CI is a placeholder

A GitHub Actions workflow has been added so the repository has a visible automation entry point, but it only checks out the repo and prints guidance. This avoids inventing commands that could conflict with future CTO or department decisions.

## Recommended next decisions

To evolve this scaffold cleanly, leadership should confirm:

1. Frontend stack
2. Backend stack
3. Whether the repo will be mono- or poly-package
4. Test/lint commands
5. Deployment targets
6. Shared contract format in `workspace/shared/`

## Ownership reminder

- Platform owns the shared scaffold under `workspace/shared/`
- Product departments own implementation within their own directories unless a routed cross-department directive says otherwise