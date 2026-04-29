# Surgical patch plan for `workspace/prototype/index.html`

## Goal
Patch the existing clickable prototype so the single-file flow explicitly covers the accepted v1 states already implied by the canonical spec, without introducing new features beyond create → review → share.

## Keep as-is
- Overall three-screen structure: `landing`, `create`, `review`
- Existing messaging that ties create to `POST /api/v1/rooms` and review to `GET /api/v1/rooms/:roomId`
- Existing form fields: room name, page URL, optional brief
- Existing review room scaffold with room header, page stage, comment pins, sidebar thread, and share affordance
- Existing “sample data” / “create room” interaction pattern, assuming `app.js` already drives screen changes

## Exact patches needed in `index.html`

### 1) Landing: sharpen entry into create
Purpose: satisfy “create entry” more explicitly from the first screen.

#### Patch
- Keep hero CTA and journey section.
- Change/create supporting copy so the primary path reads as the single canonical entry.
- Add a short state cue block under hero or inside journey card listing:
  - draft create
  - validation blocked
  - room created
  - review loaded
  - share confirmed

#### Why
The landing screen already gets users into create, but it does not visibly enumerate the full path/expected states. A small state cue makes the entry point clearer without adding a new screen.

---

### 2) Create screen: make active creation state visible
Purpose: satisfy “active creation state” instead of only draft + success copy.

#### Patch
Inside the existing create form area:
- Add a hidden status region for submitting state, e.g.:
  - `id="create-loading-state"`
  - text like “Creating room… Sending room name and page URL to POST /api/v1/rooms.”
- Add a hidden spinner/progress-like indicator using existing surface/status-card patterns.
- Keep it in the form feedback stack so `app.js` can toggle it without structural change.

Also in the summary sidebar:
- Add a hidden “request in progress” status card between neutral and success cards.

#### Why
The current create screen describes the flow but does not show an explicit in-progress state.

---

### 3) Create screen: make validation/error states concrete and inline
Purpose: satisfy “validation/error handling.”

#### Patch
Add inline error containers directly beneath each required input:
- `id="room-name-error"`
- `id="room-url-error"`
- class should default to hidden

Add a form-level failure card below `#form-feedback`:
- `id="create-error-state"`
- hidden by default
- copy: creation failed, values preserved, retry

Add a validation summary note near form actions:
- hidden by default
- `id="validation-summary"`
- copy: fix highlighted fields before creating

#### Why
The current screen mentions validation in prose only. The canonical spec requires visible inline validation and create-failure retry messaging while staying on create.

---

### 4) Create → Review transition: make direct routing state explicit
Purpose: satisfy “transition into review.”

#### Patch
Expand the existing created-state/share card area with:
- room ID row
- review URL row
- short confirmation text: “Next step: open the created room”
- primary button text update from generic “Open” to “Open review room”
- optional secondary ghost button “Stay on setup” only if already supported by current JS; otherwise keep one button

Add a hidden transition note near the success card:
- `id="post-create-transition-note"`
- copy: successful creation routes directly into the room by returned `roomId`

#### Why
Current success state shows link preview, but the transition is not explicit enough as the required handoff moment.

---

### 5) Review screen: support edit/back behavior without adding new routes
Purpose: satisfy “review editing/back behavior.”

#### Patch
In review header:
- Rename “Edit room details” button to “Back to room setup”
- Add helper text under header description or toolbar:
  - “Going back preserves the created room context and lets you revise setup assumptions in this prototype.”

Near share or room meta area:
- Add a small note:
  - “Back returns to create state; share continues to use this room URL.”

#### Why
The current button implies editing, but not the exact back behavior requested. The prototype should clarify that users can return to setup from review.

---

### 6) Review screen: add explicit loading state
Purpose: satisfy “loading states.”

#### Patch
Above the current `review-layout`, add a hidden loading surface:
- `id="review-loading-state"`
- copy:
  - “Loading room by ID…”
  - references `GET /api/v1/rooms/:roomId`
  - skeleton-like placeholders for room title / comment count / page preview

#### Why
The review screen currently only shows the loaded room.

---

### 7) Review screen: add explicit empty state
Purpose: satisfy “empty states.”

#### Patch
Inside comments panel, add a hidden empty-state block:
- `id="comments-empty-state"`
- copy:
  - “No comments yet”
  - “Select an area on the page to leave the first comment”
- include one disabled/example composer hint only if already supported visually; do not add an actual new composer interaction

Optionally in page stage:
- add one helper badge/note for empty review mode:
  - “Pins appear here after the first comment”

#### Why
The canonical spec explicitly requires no-comments-yet handling. Current thread note mentions it, but no dedicated visible state exists.

---

### 8) Review screen: add explicit room-not-found state
Purpose: satisfy missing-room/error state already in scope.

#### Patch
Add a hidden full-width error surface before `review-layout`:
- `id="review-not-found-state"`
- copy:
  - room could not be loaded
  - check room ID or create a new room
- actions:
  - button back to create
  - button back to overview

#### Why
The screen inventory mentions room not found, but the markup does not currently include a dedicated state block.

---

### 9) Share success/confirmation: make copy action visibly confirmed
Purpose: satisfy “share success/confirmation.”

#### Patch
In review header or toolbar:
- Give the existing “Copy share link” button an adjacent hidden confirmation chip/message:
  - `id="share-confirmation"`
  - text: “Share link copied”
- Add a small share URL display block near header/toolbar if not already present in visible review state:
  - `id="review-share-link"`
  - shows canonical room URL

Also in create success card:
- add copy that creation success doubles as share-ready state

#### Why
The prototype currently implies sharing but does not visibly confirm success after copy.

---

## Interaction mapping expected from `app.js`
No new features required; markup should support these toggles only:
- create draft ↔ validating ↔ submitting ↔ failed ↔ created
- review loading ↔ loaded ↔ empty-comments ↔ not-found
- share idle ↔ share-confirmed
- back from review → create while retaining visible room details if already simulated

## Content changes to existing labels/copy
- Landing primary CTA copy can stay, but should be framed as the single canonical start
- Review header secondary button:
  - from `Edit room details`
  - to `Back to room setup`
- Review primary button:
  - from `Copy share link`
  - keep action, but pair with confirmation message
- Create success “Open” button:
  - to `Open review room`

## Explicit non-goals
Do not add:
- authentication
- permissions
- multiplayer presence
- real backend integration
- actual comment composer if it is not already in the prototype
- new screens/routes beyond the current three-screen structure

## Recommended patch order
1. Add hidden create validation/loading/error/success support blocks
2. Add review loading/empty/not-found blocks
3. Add share confirmation block
4. Rename copy/buttons to clarify back/edit and review handoff
5. Tighten landing copy to frame the canonical entry path