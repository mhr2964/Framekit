# Frontend file access resolution

Date: 2026-04-29  
Owner: platform

This note resolves the currently reported frontend read/access targets against the live workspace tree and documents the immediate safe path frontend should use now.

## Resolution table

| Requested target | Exists in current tree? | Canonical path now | Likely failure class | Immediate workaround |
|---|---|---|---|---|
| `frontend/board-digest.md` | No | None in current workspace tree | Stale path | Do not retry this path. Treat it as nonexistent in the current workspace. Use current board context from board output / manager instructions instead of a file read. |
| `frontend/app/review/[roomId]/page.tsx` | Yes | `workspace/frontend/app/review/[roomId]/page.tsx` | Root mismatch **and** bracketed-path handling sensitivity | Use the full literal workspace-relative path exactly: `workspace/frontend/app/review/[roomId]/page.tsx`. Do not omit `workspace/`. Do not substitute or normalize `[roomId]`. Avoid glob/pattern targeting. |
| `frontend/src/RoomCreate.tsx` | Yes | `workspace/frontend/src/RoomCreate.tsx` | Root mismatch | Use `workspace/frontend/src/RoomCreate.tsx` exactly. Do not rely on `frontend/src/RoomCreate.tsx` as a worker-facing path this cycle. |
| `frontend/src/lib/framekitService.ts` | Yes | `workspace/frontend/src/lib/framekitService.ts` | Root mismatch | Use `workspace/frontend/src/lib/framekitService.ts` exactly. Prefer direct file targeting. |
| `platform/share-flow-readiness-note.md` | Yes | `workspace/platform/share-flow-readiness-note.md` | Root mismatch | Use `workspace/platform/share-flow-readiness-note.md` exactly. Do not reference it without the `workspace/` prefix in worker-facing operations. |

## Per-target confirmation

### 1) `frontend/board-digest.md`
Current workspace tree does **not** contain:
- `workspace/frontend/board-digest.md`

Conclusion:
- the requested path does not exist in the current tree
- this is best classified as a **stale path**, not a bracketed-path issue

Use now:
- do not attempt to read a file at this location
- rely on current board/manager-provided context instead of waiting on this file

### 2) `frontend/app/review/[roomId]/page.tsx`
Current workspace tree **does** contain:
- `workspace/frontend/app/review/[roomId]/page.tsx`

Conclusion:
- the file exists
- prior ENOENT behavior against this target is consistent with:
  - missing `workspace/` prefix
  - worker/tool sensitivity around literal bracketed directory names

Use now:
- `workspace/frontend/app/review/[roomId]/page.tsx`

Important:
- keep `[roomId]` literal
- do not rename it
- do not convert it to a readable alias
- do not depend on glob matching or shorthand targeting

### 3) `frontend/src/RoomCreate.tsx`
Current workspace tree **does** contain:
- `workspace/frontend/src/RoomCreate.tsx`

Conclusion:
- the file exists
- the likely issue is **root mismatch**, not file absence

Use now:
- `workspace/frontend/src/RoomCreate.tsx`

### 4) `frontend/src/lib/framekitService.ts`
Current workspace tree **does** contain:
- `workspace/frontend/src/lib/framekitService.ts`

Conclusion:
- the file exists
- the likely issue is **root mismatch**

Use now:
- `workspace/frontend/src/lib/framekitService.ts`

### 5) `platform/share-flow-readiness-note.md`
Current workspace tree **does** contain:
- `workspace/platform/share-flow-readiness-note.md`

Conclusion:
- the file exists
- the likely issue is **root mismatch**

Use now:
- `workspace/platform/share-flow-readiness-note.md`

## Safe path rule frontend should apply immediately

For worker-facing reads and writes this cycle:

1. Use **workspace-relative canonical paths** beginning with `workspace/`
2. Treat bracketed route segments as **literal directory names**
3. Do not assume repo-root or company-root shorthand will resolve correctly
4. If a requested path is not present in the live workspace tree, treat it as stale rather than retrying blindly

## Quick copy-ready canonical paths

- `workspace/frontend/app/review/[roomId]/page.tsx`
- `workspace/frontend/src/RoomCreate.tsx`
- `workspace/frontend/src/lib/framekitService.ts`
- `workspace/platform/share-flow-readiness-note.md`

Nonexistent target from the reported set:
- `frontend/board-digest.md`