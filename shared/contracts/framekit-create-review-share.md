# Framekit Create → Review → Share API Contract

Status: current backend source-of-truth for sprint create/review/share integration  
Version: v1  
Base path: `/api/v1`

This contract is grounded only in the current backend routes and store implementation in:

- `backend/src/endpoints/room.ts`
- `backend/src/endpoints/comment.ts`
- `backend/src/rooms-memory-store.ts`
- `backend/src/contracts.ts`

## Storage and deployment caveat

Current backend state is **memory-backed only**. Rooms and comments are not durable and are lost when the process restarts. There is no database requirement in the current backend slice, but there is also no persistence guarantee.

## Canonical resources

### Room