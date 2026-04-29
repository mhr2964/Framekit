# Create → Review → Share UI State Matrix

## Canonical contract alignment
Mock-first implementation artifacts are aligned to these accepted backend routes:

- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:roomId`
- `POST /api/v1/rooms/:roomId/comments`

Room create/get payloads should include:
- `id`
- `name`
- `frameUrl`
- `createdAt`
- `shareUrl`
- `createdBy?`
- `commentCount`

`shareUrl` from the room payload is the preferred share value in UI.

---

## 1) Create flow visible states

### `idle`
Default form-editing state before validation or submit.

### `blocked`
Use when client validation prevents submit and no request is sent.

Visible requirements:
- show inline guidance near the fields that need attention
- keep the primary action disabled until required fields are valid
- include a short rationale under or beside the disabled primary action so the form does not feel stalled

Recommended copy:
- title: `A few details still need attention`
- body: `Check the highlighted fields, then try creating the room again.`
- disabled-primary rationale: `Add a room name and a valid work link to continue.`

### `submitting`
Use while `submitCreateRoomFlow(...)` is pending.

Recommended live-region copy:
- `Preparing your review room…`

### `error`
Use when room creation fails and the form remains on screen.

Visible requirements:
- keep the entered values in place
- show a clear retry path with the same primary action
- pair the failure message with a calm explanation that nothing was lost

Recommended copy:
- title: `Room creation did not go through`
- body: `Nothing was lost. You can review the details below and try again when you are ready.`
- retry label: `Try creating the room again`

### `success`
Transition-only state after successful create.

Behavior:
- route immediately to `/review/{roomId}`
- do not stop on a success card, toast-only completion, or branching modal

---

## 2) Review flow visible states

### `first-load`
Use before any room content is available.

Recommended copy:
- title: `Preparing the review room`
- body: `Bringing in the latest room details now.`

### `ready`
Use when room content is available and at least one comment exists.

### `empty`
Use when room content is available and there are zero comments.

Recommended copy:
- title: `This review room is ready for its first note.`
- body: `Everything is set up. Share the link when you are ready to invite calm, focused feedback.`

### `error`
Use when room loading fails for a recoverable reason.

### `not-found`
Use when the requested room cannot be resolved from the contract-backed lookup.

### Loaded-empty vs loading rule
These states must be visually distinct:
- `first-load` means content is still arriving
- `empty` means the room loaded successfully and has no comments yet

---

## 3) Comment flow visible states

### `first-load`
Use while the initial comment thread fetch is pending and no comment content has rendered yet.

### `ready`
Use when the comment thread is loaded and interactive.

### `posting`
Use while a comment submission is in flight.

Visible requirements:
- keep the draft visible until the request completes
- disable duplicate-submit actions while posting
- show explicit sending feedback in the thread or composer area

Recommended copy:
- title: `Posting your note`
- body: `Adding your comment to this room now.`

### `success`
Use for brief explicit confirmation after successful comment post, if the UI presents one.

Visible requirements:
- acknowledge the successful post
- reset the transient success state after the thread refreshes or after a short confirmation interval
- clear the composer only after the post succeeds

Recommended copy:
- title: `Comment added`
- body: `Your note is now part of this review thread.`

### `error`
Use when comment submission fails or when comment loading fails.

Visible requirements:
- preserve the draft when submission fails
- show a clear retry path
- keep the failure message separate from generic empty-state copy

Recommended copy:
- title: `Comment could not be posted`
- body: `Please check your note and try again.`
- retry label: `Try sending again`

### Sending vs success vs failure rule
These states must remain separate:
- `posting`: request in flight
- `success`: request completed and UI acknowledges it
- `error`: request failed and retry/help text is shown

---

## 4) Share URL presentation rule

Use this order when displaying a shareable review link:
1. `room.shareUrl`
2. `NEXT_PUBLIC_APP_URL + /review/{roomId}`
3. `window.location.origin + /review/{roomId}`
4. relative path `/review/{roomId}`

Visible requirement:
- if the UI is showing a fallback-generated link instead of `room.shareUrl`, include a short explanation that the link is being derived locally and production should set `NEXT_PUBLIC_APP_URL`

Production note:
- set `NEXT_PUBLIC_APP_URL` to the public app origin
- fallback construction is acceptable for local and mock-first development
- the payload `shareUrl` remains the primary contract value

---

## 5) Share action transient success state

If the review screen offers a copy/share action, include a transient success state after the action completes.

Visible requirements:
- confirm that the link was copied or prepared successfully
- reset the transient success state after a short interval or when the user edits/interacts again
- do not leave the success treatment stuck indefinitely

Recommended copy:
- title: `Share link ready`
- body: `You can paste this link into your client message now.`

---

## 6) Wiring summary

### Create UI
- import status/copy from `src/lib/createReviewShareConstants.ts`
- call `submitCreateRoomFlow(payload)`
- on success, route with `getReviewSharePath(result.room.id)`

### Review route
- call `loadReviewRoomFlow(roomId)`
- use `getRoomShareUrl(room)` so contract `shareUrl` wins and adapter fallback remains available

### Comment UI
- call `loadRoomCommentsFlow(roomId, signal)`
- call `submitRoomCommentFlow({ roomId, body, author })`
- keep comment scope aligned to `POST /api/v1/rooms/:roomId/comments`