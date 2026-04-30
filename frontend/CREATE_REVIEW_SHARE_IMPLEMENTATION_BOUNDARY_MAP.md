# Create → Review → Share Implementation Boundary Map

## Current Frontend State / Modules

- `src/lib/createReviewShareAdapter.ts`
  - Acts as the stable UI-facing facade for the create→review→share flow.
  - Exposes:
    - `submitCreateRoomFlow(input)`
    - `loadReviewRoomFlow(roomId)`
    - `loadRoomCommentsFlow(roomId, signal?)`
    - `submitRoomCommentFlow(input)`
    - `getReviewSharePath(roomId)`
    - `getReviewShareOrigin()`
    - `getReviewShareUrl(roomId, shareUrl?)`
    - `isShareUrlFallback(roomId, shareUrl?)`
    - `getReviewShareOriginCaveat()`
  - Re-exports `FlowCreateCommentRequest` and `FlowCreateRoomRequest` types for consumers.
  - Primary seam to preserve: UI components should continue talking to this adapter instead of importing lower-level transport logic directly.

- `src/lib/createReviewShareFlow.ts`
  - Owns flow-level data access switching.
  - Current behavior:
    - branches on `CREATE_REVIEW_SHARE_DATA_MODE`
    - in `mock` mode, delegates to `mockCreateReviewShare`
    - in non-mock mode, intentionally throws because canonical backend wiring is not landed
  - Current exported surface:
    - `getRoomForFlow(roomId)`
    - `listCommentsForFlow(roomId, signal?)`
    - `createCommentForFlow(input)`
  - Stable seam to preserve:
    - keep mocked-first return envelopes unchanged while backend integration is swapped in later.

- Existing type dependency chain
  - `createReviewShareFlow.ts` imports response/request contracts from `src/lib/comments.ts`:
    - `CreateCommentRequest`
    - `CreateCommentResponse`
    - `GetRoomResponse`
    - `ListCommentsResponse`
  - This means current review/share consumers are shaped around existing room/comment UI contracts, not yet around a backend-native share-link contract.

- Related local modules implicated by the facade/flow boundary
  - `src/lib/comments.ts`
    - defines current frontend-facing room/comment request and response shapes used by review UI
  - `src/lib/getRoom.ts`
    - likely remains the room-fetch precedent for non-share-specific room loading
  - `src/lib/createRoom.ts`
    - currently the creation-side dependency referenced indirectly by adapter type exports/imports
  - `src/lib/mockCreateReviewShare.ts`
    - current implementation source of truth for mock review/share data behavior
  - `src/lib/createReviewShareConstants.ts`
    - governs data mode and share-link copy/origin caveat messaging
  - `app/review/[roomId]/page.tsx`
    - likely current route consumer of adapter outputs and fallback URL behavior
  - `src/components/ReviewInteractionPanel.tsx`
    - likely downstream consumer of `{ room }`, `{ comments }`, and `{ comment }` envelopes

## Backend-Owned Shape Touchpoints

These are the places where frontend code already acknowledges backend ownership or future backend substitution:

- `createReviewShareFlow.ts#getRoomForFlow`
  - TODO references canonical backend:
    - `GET /api/v1/share-links/:shareId`
  - Current requirement stated in code:
    - project canonical response back into current mocked-first `{ room }` shape
  - Boundary implication:
    - backend may return a share-link-centric resource, but frontend currently expects a room-centric envelope.

- `createReviewShareFlow.ts#listCommentsForFlow`
  - TODO also references:
    - `GET /api/v1/share-links/:shareId`
  - Current requirement stated in code:
    - project payload into current `{ comments }` shape
  - Boundary implication:
    - comment list may be nested or joined inside backend share-link payload; frontend must not depend on backend nesting yet.

- `createReviewShareFlow.ts#createCommentForFlow`
  - TODO references:
    - `POST /api/v1/share-links/:shareId/comments`
  - Current requirement stated in code:
    - preserve current `{ comment }` response envelope
  - Boundary implication:
    - UI submit flows should remain insulated from backend request/response naming differences.

- `createReviewShareAdapter.ts#getReviewShareOrigin`
  - Reads `process.env.NEXT_PUBLIC_APP_URL`
  - This is a deployment/runtime boundary rather than a business-logic boundary.
  - Backend does not own this, but infra/environment does.
  - Stable implication:
    - absolute share URL assembly should remain isolated here so backend contract changes do not leak into UI string generation.

- `createReviewShareAdapter.ts#getReviewShareUrl`
  - Accepts optional backend-provided `shareUrl`
  - Falls back to locally derived origin + path when absent
  - Boundary implication:
    - backend may eventually return canonical absolute URLs, but UI already supports absence of that field.

## Stable Seams to Preserve Until Canonical Contract Lands

1. **Adapter as the only UI entry point**
   - Preserve `createReviewShareAdapter.ts` as the import surface for pages/components.
   - Do not make UI components call `comments.ts`, `getRoom.ts`, or backend fetches directly for this flow.
   - Reason: contract churn can be absorbed underneath the adapter without UI rewrites.

2. **Current response envelopes**
   - Preserve:
     - room loaders returning `{ room }`
     - comment list loaders returning `{ comments }`
     - comment create returning `{ comment }`
   - Reason: these are already baked into mocked-first UI code and acceptance scaffolding.

3. **Current input aliases**
   - Preserve exported adapter types:
     - `FlowCreateCommentRequest`
     - `FlowCreateRoomRequest`
   - Reason: keeps component-level forms detached from future backend-native request names/fields.

4. **Data-mode branching in flow layer**
   - Preserve the mock/live switch in `createReviewShareFlow.ts`.
   - Reason: enables contract-alignment work without forcing UI call-site changes.

5. **Share URL fallback policy**
   - Preserve adapter behavior:
     - use backend `shareUrl` when present
     - otherwise derive from `getReviewSharePath(roomId)` + `NEXT_PUBLIC_APP_URL`/browser origin
   - Reason: this supports local and partial-contract environments safely.

6. **Origin caveat copy isolation**
   - Preserve `getReviewShareOriginCaveat()` as the single source for environment-dependent messaging.
   - Reason: product copy around fallback URLs should not be duplicated across screens.

7. **AbortSignal pass-through on comment loading**
   - Preserve `loadRoomCommentsFlow(roomId, signal?)` → `listCommentsForFlow(roomId, signal?)`.
   - Reason: route/page effects can remain cancellation-safe while transport implementation changes.

## What the Canonical Backend Swap Can Change Safely

These can change behind the seam without forcing UI surface churn:

- actual endpoint paths and fetch implementation details inside `createReviewShareFlow.ts`
- mapping from backend `shareId` resource shape to frontend `roomId`-oriented display model
- extraction of comments from a combined share-link payload
- translation of backend absolute URL fields into adapter `shareUrl` handling
- auth/headers/error normalization at the flow layer

## What Should Not Change Yet

- adapter function names
- adapter return expectations used by review UI
- fallback share URL semantics
- the distinction between adapter layer and flow/transport layer
- mocked-first compatibility behavior while canonical contract is still pending

## Risk Notes

- Current code exposes naming tension between `roomId` in frontend routes and `shareId` in backend TODO notes.
  - Until canonical contract lands, treat this as a mapping concern hidden in the flow layer.
- `submitCreateRoomFlow` is adapter-exposed, but the reviewed flow file shown here only implements review/share retrieval and comment creation.
  - Creation remains a separate seam and should stay adapter-mediated rather than collapsed into page code.
- Non-mock mode currently throws for all review/share data operations.
  - Any partial live wiring should be added inside `createReviewShareFlow.ts`, not at call sites.

## Recommended Preservation Rule for Follow-on Work

When wiring the canonical backend, only change internals below this line of responsibility:

- Pages/components → `createReviewShareAdapter.ts` → `createReviewShareFlow.ts` → backend/mock source

Do not invert this dependency direction, and do not let route components become responsible for contract translation.