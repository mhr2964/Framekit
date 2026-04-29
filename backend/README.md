# Backend

This workspace owns the versioned backend contract and server-side implementation for the current Framekit create → review → share slice.

## Approved current-slice routes

The backend is currently pinned to these four routes only:

- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:roomId`
- `GET /api/v1/share-links/:shareId`
- `POST /api/v1/share-links/:shareId/comments`

These are the only routes that frontend should wire against as committed backend surface for the current slice.

## Route intent

- `POST /api/v1/rooms` creates a review room from a frame URL and returns the room record.
- `GET /api/v1/rooms/:roomId` returns the room record for review loading.
- `GET /api/v1/share-links/:shareId` returns the canonical share-link payload that points at the shared room.
- `POST /api/v1/share-links/:shareId/comments` creates a comment through the share link and applies it to the linked room.

## Persistence caveat

The current implementation uses an in-memory repository. All created rooms, share links, and comments are ephemeral and will be lost on process restart.

## Notes

- Keep backend work under `/api/v1`.
- Do not assume unlisted endpoints are stable.
- See `docs/api-v1.md` and `docs/schema.md` for the current contract and schema notes.