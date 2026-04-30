# Create → Review → Share: Canonical Backend Contract

**Status:** Locked binding specification for frontend and backend alignment  
**Authority:** `workspace/backend/src/contracts.ts`, `workspace/backend/docs/api-v1.md`, `workspace/backend/docs/schema.md`  
**Board visibility:** `workspace/shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md` (this file)

---

## Accepted `/api/v1` Routes

The current backend slice implements exactly these four routes:

1. `POST /api/v1/room` — create a room
2. `GET /api/v1/room/{roomId}` — fetch room state
3. `GET /api/v1/comment?roomId={roomId}` — list comments for a room
4. `POST /api/v1/comment` — create a top-level comment

No other routes are accepted. Share, invite, auth, room update/delete, and comment edit/delete are **not** implemented.

---

## Request / Response Shapes

### Create Room

**Request:** `POST /api/v1/room`
