# Backend Handoff

## Current Aligned State

**Repository Layer:** `workspace/backend/src/rooms-memory-store.ts`  
✓ Implements `RoomRepository`, `CommentRepository` for locked four routes  
✓ Room creation with optional `createdBy` name omission  
✓ Comment list by `roomId` in ascending `createdAt` order  
✓ Comment creation with room existence check, optional `author`/`position` omission  
✓ Comment count incremented on creation  
✓ Field normalization (trim non-empty strings)  

**Endpoint Layer:** `workspace/backend/src/endpoints/room.ts`, `workspace/backend/src/endpoints/comment.ts`  
✓ Locked validation rules for all fields  
✓ Error envelope with canonical error codes  
✓ Request/response type contracts match canonical shapes  

**HTTP Handler Layer:** `workspace/backend/src/http-room-handlers.ts`  
⚠ **Pending sync:** endpoint exports and handler function names  

---

## Pending Mismatches (Awaiting Full http-room-handlers.ts Sync)

The following handler exports and route bindings require alignment in the next dispatch when full file contents are available:

### 1. Endpoint Exports

Current state: exports include unneeded share-related paths and handlers  
**Required:** export only these four routes:
- `ROOM_COLLECTION_PATH` → `/api/v1/room`
- `ROOM_ITEM_PATH` → `/api/v1/room/{roomId}`
- `COMMENT_COLLECTION_PATH` → `/api/v1/comment`

**Required handlers:**
- `handleCreateRoom(request)` → `POST /api/v1/room`
- `handleGetRoom(request)` → `GET /api/v1/room/{roomId}`
- `handleListComments(request)` → `GET /api/v1/comment?roomId={roomId}`
- `handleCreateComment(request)` → `POST /api/v1/comment`

### 2. Handler Imports

Current state: imports share-link-related endpoints and repositories  
**Required:** import only:
- `createRoom`, `getRoomById` from `endpoints/room`
- `createComment`, `listComments` from `endpoints/comment`
- `getRoomRepository`, `getCommentRepository` from `rooms-memory-store`

### 3. Query Parameter Handling

Current state: HTTP request interface may not support `query` field  
**Required:** `HttpRequest` interface must include optional `query` field for `/api/v1/comment` roomId query param

### 4. Response Shape

All handlers must return `{ status, body }` where `body` is either the success shape (e.g., `{ room }`, `{ comments }`) or the standard error envelope.

---

## Locked Contract Reference

Canonical contract: `workspace/shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md`

Backend slice routes:
- `POST /api/v1/room`
- `GET /api/v1/room/{roomId}`
- `GET /api/v1/comment?roomId={roomId}`
- `POST /api/v1/comment`

No share, invite, auth, update, delete, or thread routes are implemented.

---

## Next Steps

1. ✓ Repository layer is aligned.
2. ✓ Endpoint validation and contracts are aligned.
3. ⏳ HTTP handler layer awaits full file contents and safe sync in next dispatch.
4. Once handlers are synced, the backend will be fully aligned to the locked create→review→share contract.