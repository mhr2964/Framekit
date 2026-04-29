# Shared

This directory contains cross-team artifacts intended for reuse across departments.

## Structure

- `types/` — shared domain and API type definitions
- `contracts/` — machine-readable or source-of-truth contract artifacts
- `utils/` — small shared utilities that are explicitly approved for reuse
- `docs/` — shared repo notes and coordination docs

## Ownership

Platform owns the default structure and placeholders here.
Artifacts inside this folder should only be added or promoted when they are intentionally shared across teams.

## Usage guidance

- Prefer keeping implementation-local code in the owning dept until reuse is real
- Promote stable, reused definitions into `shared/`
- Keep canonical human-readable contract docs in `workspace/docs/contracts/`