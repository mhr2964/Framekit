# Backend Handoff

## Current slice status
This backend workspace is pinned to the approved current create → review → share slice only. Frontend and review should treat the following routes as the only committed API surface in this increment:

- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:roomId`
- `GET /api/v1/share-links/:shareId`
- `POST /api/v1/share-links/:shareId/comments`

## Behavior notes
- Creating a room returns the room payload and seeds a canonical share link in the in-memory backend store.
- Fetching a room reads the created review room by `roomId`.
- Fetching a share link reads the canonical share object by `shareId`.
- Posting to the share-link comments route creates a comment against the linked room and increments that room's `commentCount`.

## Persistence caveat
Persistence is currently in-memory only. Data resets whenever the backend process restarts, so room ids, share ids, and comments are not durable across restarts.

## Out of scope for this slice
Any routes or persistence guarantees beyond the four routes above should be treated as uncommitted until a later backend increment lands.