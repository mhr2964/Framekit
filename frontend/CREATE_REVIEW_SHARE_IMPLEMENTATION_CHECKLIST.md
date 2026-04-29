# Create → Review → Share Implementation Checklist

## Goal
Ship a mocked local-data create→review→share slice inside `workspace/frontend/` that feels calm, client-friendly, and is ready to stitch to the backend v1 contract later without reworking the UI structure.

## Current Frontend Audit

### Existing files already aligned enough to reuse
- `src/RoomCreate.tsx`
  - Already contains the core create-room form UX, local validation, success state, and explicit button types.
  - Uses a backend-shaped API client (`createRoom`) that can be swapped behind a mock/live toggle.
  - Main gap: it is monolithic and currently assumes live network submission instead of a mocked local flow by default.

- `src/components/ReviewInteractionPanel.tsx`
  - Already covers room-scoped comment loading, empty state, posting, retry, and calm copy.
  - Includes `AbortController` cleanup for comment loading.
  - Main gap: it currently depends directly on live comment API helpers instead of mock-first room-scoped local data.

- `src/lib/createRoom.ts`
  - Good contract-shaped boundary for `POST /api/v1/room`.
  - Already guards `res.ok` and normalizes error payloads.
  - Good candidate to remain as the later live adapter, but should not be the default path for mocked sprint flow.

- `src/lib/getRoom.ts`
  - Good contract-shaped boundary for `GET /api/v1/room/{roomId}`.
  - Good later-stitch live adapter.

- `src/lib/comments.ts`
  - Good contract-shaped boundary for `GET /api/v1/comment?roomId=...` and `POST /api/v1/comment`.
  - Already supports room-scoped fetch and post semantics.

### Existing files likely needing replacement/refactor for this slice
- `app/create/page.tsx`
  - Should stay a thin route wrapper only.
  - Needs to point to the create feature entry that uses mocked local data.

- `app/review/[roomId]/page.tsx`
  - Review route exists but needs audit-driven cleanup so the page is driven by the same mock room record created in the create flow.
  - Should expose clear share affordances and handle not-found/mock-missing states calmly.

- `src/lib/framekitMockData.ts`
  - Best existing home for the first mocked room/review/share records.
  - Needs to become the canonical mock source for created rooms and room-scoped comments, or be replaced by more focused mock modules.

### Existing file-plan mismatch to resolve
The file plan says “no review-thread interaction expansion beyond preserving the existing placeholder route,” but the tree already contains a substantial review/comment surface. For this slice, the implementation should **stabilize and connect** the existing review/comment UI to mocked local data rather than expanding scope further.

---

## Recommended File Plan for This Slice

### Route wrappers
- `app/create/page.tsx`
  - Keep tiny.
  - Render the create screen/container only.

- `app/review/[roomId]/page.tsx`
  - Keep page-level composition only.
  - Resolve room by route param through a mock-backed service layer.
  - Render review details, share affordance, and comment panel.

### Create feature
- `src/RoomCreate.tsx`
  - Keep for this round if speed matters.
  - Convert from direct live submission to using a stitched service function that can run mocked local mode now and live API mode later.

### Review feature
- `src/components/ReviewInteractionPanel.tsx`
  - Keep and retarget to mock-backed comment helpers.
  - Preserve current UI behavior and retry/error handling.

### Mock/local data and service boundaries
- `src/lib/framekitMockData.ts`
  - Store seeded room and comment fixtures plus helpers for generating new room/comment records.

- `src/lib/framekitService.ts`
  - Become the orchestration boundary that the UI imports.
  - Expose mock-first methods:
    - `createRoomForFlow`
    - `getRoomForFlow`
    - `listCommentsForFlow`
    - `createCommentForFlow`
  - Later can delegate to live adapters without changing component code.

- `src/lib/createRoom.ts`
  - Preserve as the explicit later-stitch live adapter for `POST /api/v1/room`.

- `src/lib/getRoom.ts`
  - Preserve as the explicit later-stitch live adapter for `GET /api/v1/room/{roomId}`.

- `src/lib/comments.ts`
  - Preserve as the explicit later-stitch live adapter for room-scoped comments.

---

## Concrete Implementation Checklist

## 1) Mock data foundation
- [ ] Audit `src/lib/framekitMockData.ts` and reshape it around room-centric records:
  - room summary
  - room review/share URL path
  - comment list keyed by `roomId`
- [ ] Add helper for generating new mock room IDs using backend-like opaque shape (`room_...`), without implying sorting semantics.
- [ ] Add helper for generating mock comment IDs using `comment_...`.
- [ ] Ensure timestamps are stored as ISO 8601 UTC strings.
- [ ] Seed at least one believable demo room and a few comments for review-page empty/non-empty coverage.

## 2) Mock-first orchestration layer
- [ ] Refactor `src/lib/framekitService.ts` into the main UI-facing boundary for this slice.
- [ ] Add a single local mode constant, e.g. `const FLOW_DATA_MODE = 'mock'`.
- [ ] Expose UI-facing methods:
  - [ ] `createRoomForFlow(input)`
  - [ ] `getRoomForFlow(roomId)`
  - [ ] `listCommentsForFlow(roomId, signal?)`
  - [ ] `createCommentForFlow(input)`
- [ ] Keep method return shapes aligned with backend adapters:
  - create returns `{ room }`
  - get returns `{ room }`
  - list comments returns `{ comments }`
  - create comment returns `{ comment }`
- [ ] Add inline `TODO` notes above each live stitch point naming the exact backend endpoint:
  - `POST /api/v1/room`
  - `GET /api/v1/room/{roomId}`
  - `GET /api/v1/comment?roomId={roomId}`
  - `POST /api/v1/comment`

## 3) Create route
- [ ] Make `app/create/page.tsx` a thin wrapper that renders `RoomCreate` or a create screen component only.
- [ ] Update `src/RoomCreate.tsx` so submit uses `createRoomForFlow(...)` from `framekitService`, not direct `createRoom(...)`.
- [ ] Preserve current validation rules and success state.
- [ ] Keep success state CTA targets:
  - open the new review route
  - create another room
- [ ] Add/share copy that makes the created room feel immediately client-ready.

## 4) Review route
- [ ] Audit `app/review/[roomId]/page.tsx` and rewire it to `getRoomForFlow(roomId)`.
- [ ] Render calm states for:
  - [ ] loading
  - [ ] room found
  - [ ] room not found
  - [ ] recoverable load failure
- [ ] Ensure the page shows:
  - [ ] room name
  - [ ] frame URL or preview-link affordance
  - [ ] optional creator attribution
  - [ ] created time or “ready to share” framing
  - [ ] share path/copy affordance
- [ ] Keep the page compatible with `ReviewInteractionPanel`.

## 5) Room-scoped comments
- [ ] Update `ReviewInteractionPanel` imports to use `listCommentsForFlow` and `createCommentForFlow` from `framekitService`.
- [ ] Keep comments strictly room-scoped by `roomId`.
- [ ] Preserve existing behavior:
  - [ ] load on mount
  - [ ] abort on unmount
  - [ ] empty state
  - [ ] retry button
  - [ ] optimistic-enough append after successful post
- [ ] Ensure local mock comment creation inserts only into the active room’s thread.

## 6) Share-surface readiness
- [ ] Add or preserve a visible review link on create success and review page.
- [ ] Prefer relative internal share path for now, e.g. `/review/{roomId}`.
- [ ] Add a single calm explanation line about sending the link to clients.
- [ ] If a copy interaction is added later, keep it isolated and optional; do not block this slice on clipboard behavior.

## 7) UX consistency cleanup
- [ ] Keep all form buttons inside forms explicitly typed.
- [ ] Preserve client-friendly, low-anxiety copy.
- [ ] Avoid duplicating validation constants across files.
- [ ] If `RoomCreate.tsx` or review page exceeds maintainable size, split only after the mock flow works end-to-end.

---

## Explicit Later-Stitch Integration Points

### POST room
**Current local seam**
- UI should call `createRoomForFlow(input)` from `src/lib/framekitService.ts`.

**Later live stitch**
- `createRoomForFlow` delegates to `createRoom(input)` from `src/lib/createRoom.ts`.
- Endpoint: `POST /api/v1/room`

**Expected response shape already reflected in UI**
- `{ room: { id, name, frameUrl, createdAt, createdBy?, commentCount } }`

### GET room
**Current local seam**
- Review page should call `getRoomForFlow(roomId)` from `src/lib/framekitService.ts`.

**Later live stitch**
- `getRoomForFlow` delegates to `getRoom(roomId)` from `src/lib/getRoom.ts`.
- Endpoint: `GET /api/v1/room/{roomId}`

**Expected response shape already reflected in UI**
- `{ room: { id, name, frameUrl, createdAt, createdBy?, commentCount } }`

### Room-scoped comments
**Current local seam**
- `ReviewInteractionPanel` should call:
  - `listCommentsForFlow(roomId, signal?)`
  - `createCommentForFlow(input)`

**Later live stitch**
- `listCommentsForFlow` delegates to `listComments(roomId, signal)` from `src/lib/comments.ts`.
- `createCommentForFlow` delegates to `createComment(input)` from `src/lib/comments.ts`.
- Endpoints:
  - `GET /api/v1/comment?roomId={roomId}`
  - `POST /api/v1/comment`

**Expected response shapes already reflected in UI**
- list: `{ comments: ReviewComment[] }`
- create: `{ comment: ReviewComment }`

---

## Suggested Order of Work
1. `src/lib/framekitService.ts`
2. `src/lib/framekitMockData.ts`
3. `src/RoomCreate.tsx`
4. `app/review/[roomId]/page.tsx`
5. `src/components/ReviewInteractionPanel.tsx`
6. `app/create/page.tsx`

---

## Reviewer Focus
- Verify the full slice works with mocked local data and no backend dependency.
- Verify create success links into a review page for the created room.
- Verify comments remain scoped to the room in the route.
- Verify the code still has clean seams for swapping in:
  - `POST /api/v1/room`
  - `GET /api/v1/room/{roomId}`
  - `GET /api/v1/comment?roomId={roomId}`
  - `POST /api/v1/comment`

## Implementation Report

**Files Changed:**
- `workspace/frontend/CREATE_REVIEW_SHARE_IMPLEMENTATION_CHECKLIST.md` — added concrete audit and implementation checklist for mocked create→review→share flow with explicit backend stitch points

**Key Changes:** Audited the current frontend structure against the file plan and identified which files can be reused, which need retargeting, and where the current plan no longer matches the actual codebase. Produced a concrete checklist focused on mock-first local data, a UI-facing orchestration layer, create/review route responsibilities, room-scoped comments, and share-surface readiness. Named explicit later-stitch seams for POST room, GET room, and room-scoped comments so implementation can proceed without backend coupling. Kept the plan constrained to `workspace/frontend/` and aligned with the published v1 API contract.

**Plan Deviations:** Added a new checklist document instead of editing existing implementation files because the assignment requested an audit plus concrete implementation checklist, not code changes to the flow itself.

**Open Issues:** `app/review/[roomId]/page.tsx` content could not be directly audited from the provided read due to path read failure; checklist assumes it exists and should be rewired around the mock-backed service layer during implementation.

**Checks Performed:** Cross-checked the workspace tree, sprint frontend file plan, existing create component, review interaction panel, current API helper files, and backend v1 API doc for endpoint alignment and later-stitch consistency.