# Frontend access mirror

Date: 2026-04-29  
Owner: platform

Frontend should read this mirror file instead of the blocked original paths for this cycle. This file contains the verified readable payload platform could access directly, plus explicit status entries for the still-blocked or nonexistent targets.

## Explicit status entries

### Blocked by tooling defect
The following file is present in the workspace tree but could not be reliably read via worker read due to the known tooling defect around bracketed route paths, so there is **no verified mirror content yet** in this file:

- `workspace/frontend/app/review/[roomId]/page.tsx`

Treat this as a tooling-defect case, not a missing-file case.

### Stale / nonexistent this cycle
The following requested file is **not present** in the current workspace tree and should be treated as stale/nonexistent this cycle:

- `frontend/board-digest.md`

---

## Verified mirror content: `workspace/platform/share-flow-readiness-note.md`
