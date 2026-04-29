# Share flow platform readiness note

Date: 2026-04-29

Scope audited for create-room → shareable review URL flow:
- frontend routing/base URL assumptions
- backend room/storage assumptions
- runtime/deployment config expectations
- only confirmed facts from current workspace files

## Confirmed readiness

### 1) Review route exists and matches share-link shape
Confirmed frontend route file:
- `workspace/frontend/app/review/[roomId]/page.tsx`

This means the app router supports links of the form:
- `/review/<roomId>`

Relevant files:
- `workspace/frontend/app/review/[roomId]/page.tsx`
- `workspace/frontend/src/lib/getRoom.ts`

### 2) Create flow already constructs a review URL from a runtime base URL
Confirmed in:
- `workspace/frontend/src/lib/createRoom.ts`

Current behavior:
- reads `process.env.NEXT_PUBLIC_APP_URL`
- falls back to `window.location.origin`
- returns `shareUrl` as `${baseUrl}/review/${room.id}`

Platform implication:
- no blocker for local/dev if browser origin is valid
- production should set `NEXT_PUBLIC_APP_URL` so generated share URLs are canonical and not dependent on the current origin

### 3) Frontend review page reads room data by room id
Confirmed in:
- `workspace/frontend/src/lib/getRoom.ts`
- `workspace/frontend/app/review/[roomId]/page.tsx`

Current behavior:
- review page receives `roomId` from route params
- fetches room data through frontend service helpers using that id

Platform implication:
- route parameter wiring for the share flow is present

### 4) Backend contract supports room creation and lookup
Confirmed in:
- `workspace/backend/src/endpoints/room.ts`
- `workspace/backend/src/http-room-handlers.ts`
- `workspace/backend/docs/api-v1.md`
- `workspace/backend/src/contracts.ts`

Current support present:
- create room endpoint/handler exists
- get room by id support exists
- room shape includes id/slug-like room identifier used by frontend review retrieval

Platform implication:
- the create-room → retrieve-room loop is contractually present

### 5) Backend has a functioning in-memory store for current slice
Confirmed in:
- `workspace/backend/src/rooms-memory-store.ts`

Current state:
- room persistence is in-memory only for this slice
- sufficient for local/demo flow validation within one running process

Platform implication:
- no schema migration or DB secret is currently required to exercise the flow in a single runtime session

## Confirmed constraints / missing infra

### A) Production canonical base URL is not yet documented/locked
Confirmed usage exists, but no platform-owned root deployment/env doc currently sets:
- `NEXT_PUBLIC_APP_URL`

Impact:
- not a code blocker for local work
- deployment/runtime readiness is incomplete for reliable share-link generation across environments
- without explicit config, generated links may depend on the browser origin of the session creating the room

Needed:
- set and document `NEXT_PUBLIC_APP_URL` at deploy time

### B) No persistent database/storage layer is present yet
Confirmed current backend store:
- `workspace/backend/src/rooms-memory-store.ts`

Impact:
- hard blocker for durable share links across restarts/redeploys/multi-instance environments
- links created in one process are not guaranteed to survive runtime recycling

Needed:
- persistent datastore before claiming production-ready share links

### C) No deployment/runtime health configuration is documented in workspace root/platform docs
Inspected available workspace docs; no confirmed platform doc yet defines:
- frontend deploy target/base URL source of truth
- backend API base URL/runtime host expectations
- healthcheck/readiness expectations
- persistence/runtime topology

Impact:
- not blocking narrow feature implementation
- blocking a “runtime-ready” or deploy-ready assertion for the share flow

### D) API origin/env assumptions remain implicit
Frontend service files indicate API-backed room create/get behavior, but no platform-level env contract was found documenting expected values for:
- public app origin
- API origin if frontend/backend split across hosts

Impact:
- okay if same-origin deployment is used
- potential deployment blocker if services are split across domains without explicit env wiring/CORS/runtime docs

## Net assessment

For the current slice, the share flow is **functionally scaffolded and locally supportable**:
- route exists
- create flow builds `/review/:roomId` URLs
- review page consumes route params
- backend supports create/get room operations

But it is **not yet production-ready from a platform/runtime perspective** because:
1. canonical public base URL config is not documented/confirmed,
2. room storage is in-memory only,
3. deploy/runtime env expectations are not yet written down.

## Minimal infra requirements to clear next

1. Define deploy-time `NEXT_PUBLIC_APP_URL`.
2. Decide and wire persistent room storage.
3. Document frontend/backend runtime topology and required env vars in platform or root docs.
4. If frontend/backend are split by origin, explicitly document API base URL and CORS expectations.

## Current blockers classification

- **Implementation blocker for current local slice:** none confirmed
- **Production/deploy blocker:** yes
  - missing canonical public app URL config
  - no persistent datastore
  - no documented runtime topology/env contract