# Backend Contract Stubs

This directory contains the backend source-of-truth docs and code skeletons for Framekit API v1.

## Files

- `docs/api-v1.md` — public contract for explicit `/api/v1/room` and `/api/v1/comment` endpoints
- `docs/schema.md` — minimal storage notes aligned to the v1 contract
- `src/contracts.ts` — shared request/response and domain types
- `src/endpoints/room.ts` — stub handlers and route constants for `POST /api/v1/room` and `GET /api/v1/room/{roomId}`
- `src/endpoints/comment.ts` — stub handlers and route constants for `GET /api/v1/comment?roomId=...` and `POST /api/v1/comment`

## Contract-to-Stub Mapping

- `POST /api/v1/room` -> `createRoom`
- `GET /api/v1/room/{roomId}` -> `getRoomById`
- `GET /api/v1/comment?roomId=...` -> `listComments`
- `POST /api/v1/comment` -> `createComment`

These stubs are transport-agnostic and define endpoint shapes, validation entry points, explicit versioned paths, and response envelopes without choosing an HTTP framework.