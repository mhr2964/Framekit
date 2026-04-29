# Framekit canonical flow v1 — create → review → share

## Canonical artifact paths
- Primary clickable prototype: `workspace/prototype/index.html`
- Canonical flow spec for this slice: `workspace/prototype/create-review-share-canonical-v1.md`

## Flow name
**Framekit v1 canonical journey: understand → create room → review in context → share room**

## Numbered flow steps

### A. Landing / understanding
1. User lands on Framekit homepage.
2. Hero explains the core value clearly: create a review room for a live page or mock, collect contextual comments, and share one link with collaborators.
3. Primary CTA takes user into room creation.
4. Secondary cues preview the review experience so the user understands what happens next before clicking.

### B. Create room
5. User opens the create flow from the landing page.
6. User enters:
   - room name
   - page URL or mock target
   - optional short description / review focus
7. User submits the create form.
8. System creates a room and returns:
   - `roomId`
   - room metadata
   - initial review target URL / mock source
   - shareable review link
9. User is routed directly into the review room after successful creation.

### C. Review in context
10. Review page shows the target webpage/mock inside the room context.
11. Existing comments are visible as anchored markers on the page/mock.
12. Reviewer can select/click a target area and open a comment composer.
13. Reviewer submits a comment with body text and anchor position metadata.
14. New comment appears immediately in the review UI.
15. Comment list and on-canvas markers stay synchronized.
16. Room header keeps the room name and share action visible without leaving the page.

### D. Share
17. User opens share affordance from the review room header or success state.
18. User copies the review link for collaborators.
19. Shared collaborator lands directly in the same review room and can see the anchored comments in context.

## Key edge / error states
1. **Invalid create input**
   - Missing room name or invalid target URL blocks submission.
   - UI keeps inputs visible and shows inline validation.
2. **Create failure**
   - If room creation fails, stay on create screen and show retry messaging.
3. **Room not found**
   - If review room lookup fails, show a clear missing-room state with a path back to create.
4. **Comment submission failure**
   - Keep draft text if post fails; show retry action.
5. **No comments yet**
   - Empty review state should still explain how to click and leave the first comment.
6. **Unanchored / fallback comment rendering**
   - If precise anchor data is unavailable, show the comment in the sidebar list and mark it as general feedback.
7. **Share unavailable**
   - If share link is not yet copied/generated, keep the review room usable and expose a retry/copy-again state.

## Backend assumptions for this slice
1. Create room contract exists and returns a stable `roomId`.
2. Review room can be fetched by `roomId`.
3. Comments are associated to a room and can be listed for that room.
4. Comment create accepts anchor metadata sufficient for approximate in-context placement.
5. Share uses the review room URL as the v1 share primitive; no separate permission model is required for this prototype slice.
6. Authentication is not required in the prototype slice; flows assume a lightweight guest/session model.
7. Real-time multiplayer presence is out of scope for v1; refresh/local optimistic rendering is acceptable.
8. Prototype may simulate target page content and comment persistence, but the UX should reflect the contract-aligned create → review → share path.

## Interim source-of-truth note
Until replaced by a newer approved artifact, this file plus `workspace/prototype/index.html` are the interim UX source of truth for archivist, frontend, and product coordination on Milestone 1.