# Framekit API Contract

Status: FINAL v1 baseline  
Canonical path: `workspace/backend/api-contract.md`

This document is the sole authoritative API contract for Framekit v1.

## Scope

The v1 API baseline is locked to exactly these 4 routes:

1. `POST /api/v1/rooms`
2. `GET /api/v1/rooms/:roomId`
3. `POST /api/v1/rooms/:roomId/invites`
4. `POST /api/v1/rooms/:roomId/comments`

No other route, share-link flow, token-sharing flow, or alternate contract variant is in scope for v1.

## Conventions

### Auth
All routes require authenticated creator-side product usage. Backend stub auth is acceptable during implementation, but route behavior and payloads must match this contract.

### IDs
All resource IDs are opaque strings.

### Timestamps
All timestamps are ISO 8601 UTC strings.

### Error shape
All non-2xx responses should use:
