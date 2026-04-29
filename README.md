# Framekit

Framekit helps freelancers and small teams collect polished, timestamped website feedback in elegant review rooms that clients actually enjoy using.

## Workspace layout

- `workspace/frontend/` — frontend implementation owned by frontend
- `workspace/backend/` — backend implementation owned by backend
- `workspace/platform/` — platform-owned workspace conventions, handoff notes, and repo coordination docs
- `workspace/shared/` — shared contracts, types, utilities, and cross-team reference material
- `workspace/docs/` — product, architecture, and contract documentation
- `workspace/brand/` — brand team workspace
- `workspace/prototype/` — prototype artifacts and clickable explorations

## Setup and run conventions

This repository currently contains approved frontend and backend baselines plus shared scaffolding for parallel engineering.

### Frontend
- Primary app lives in `workspace/frontend/`
- Expected local workflow is managed from that directory by the frontend team
- Frontend should document any required commands or environment variables in `workspace/frontend/README.md`

### Backend
- Primary API implementation lives in `workspace/backend/`
- Backend-specific setup, API notes, and implementation details belong in `workspace/backend/README.md` and `workspace/backend/docs/`

### Shared
- Cross-team contracts, shared types, and common utilities belong under `workspace/shared/`
- Platform maintains structure and placeholders in `workspace/shared/`; co-owned artifacts should be coordinated explicitly

### Contracts
- Canonical contract documentation should be added under `workspace/docs/contracts/`
- Team-specific implementation notes may exist inside dept folders, but shared API/interface expectations should be mirrored here for handoff clarity

## Ownership notes

- Platform owns this root README, workspace conventions, and the default structure under `workspace/shared/` and `workspace/docs/`
- Frontend owns implementation inside `workspace/frontend/`
- Backend owns implementation inside `workspace/backend/`
- Platform does not modify frontend/backend implementation code without explicit routing; README-level handoff notes are acceptable for coordination

## Current handoff expectation

- Frontend and backend should align implementation against shared contract documentation in `workspace/docs/contracts/`
- Shared types or request/response interfaces that need to be consumed by multiple teams should be promoted into `workspace/shared/`
- If a contract changes, update both the canonical docs and the owning team documentation in the same round when possible