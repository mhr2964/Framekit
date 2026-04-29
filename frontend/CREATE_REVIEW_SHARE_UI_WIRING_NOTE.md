# Create → Review → Share UI Wiring Note

## Purpose
This note shows exactly how existing frontend UI should call the mock-first flow boundary while staying aligned to the accepted backend contract and required visible states.

## Canonical stitch points
The flow boundary should be the only place that later switches from mocks to live backend calls:

- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:roomId`
- `POST /api/v1/rooms/:roomId/comments`

Room create/get responses should be treated as the source of truth for:
- `id`
- `name`
- `frameUrl`
- `createdAt`
- `shareUrl`
- `createdBy?`
- `commentCount`

## Stable imports for UI
Use the adapter and constants layers in UI files:

- `src/lib/createReviewShareAdapter.ts`
- `src/lib/createReviewShareConstants.ts`

This keeps components away from low-level mock/live mode switching and from share URL fallback rules.

---

## 1) Create screen wiring

### Replace direct create API usage
Import:
