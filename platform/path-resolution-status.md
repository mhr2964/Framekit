# Path resolution status

Date: 2026-04-29  
Owner: platform

## Status

Confirmed from current workspace and board evidence: there is an active tooling/path-handling failure mode, but it is **not** a missing-file problem in the repository tree.

The relevant frontend route file is present at the literal workspace path:

- `workspace/frontend/app/review/[roomId]/page.tsx`

The current issue class is that some worker/tooling operations are sensitive to how paths are expressed and may fail even when the file exists.

## Confirmed repro from evidence

### 1) Literal bracketed route file exists in tree
Current workspace inventory shows:

- `frontend/app/review/[roomId]/page.tsx`

This confirms the route file is present in the workspace.

### 2) Prior failure symptom matched path handling, not file absence
The reported blocker was:

- `ENOENT` against source files that are present in tree
- explicitly including bracketed route paths such as `frontend/app/review/[roomId]/page.tsx`

That combination is enough to confirm a path-resolution/read-path problem rather than a repository-state problem.

### 3) Patch/write tooling is also path/format sensitive
Board evidence shows a separate but related operational sensitivity:

- frontend write attempt failed with  
  `patch apply failed: error: patch fragment without header at line 1: @@ -98,6 +98,10 @@.`

This is not the same as ENOENT, but it confirms the worker/tooling layer is fragile around file-targeting and patch application details. Operationally, frontend should assume both path expression and patch shape matter this cycle.

## Affected path classes

## 1) Company-root-relative vs workspace-relative

Affected/sensitive:
- `frontend/app/review/[roomId]/page.tsx` when treated as if the tool is resolving from company root or another implicit base
- any path that omits the explicit `workspace/` prefix in worker-facing file operations

Safer:
- `workspace/frontend/app/review/[roomId]/page.tsx`

Operational rule:
- For worker-visible reads/writes/status notes this cycle, use **workspace-relative paths with the `workspace/` prefix**.

## 2) Bracketed dynamic-route paths

Affected/sensitive:
- paths containing literal Next.js dynamic route segments such as:
  - `[roomId]`
  - and by extension other bracketed segments if introduced later

The confirmed live example is:
- `workspace/frontend/app/review/[roomId]/page.tsx`

Operational rule:
- Treat bracketed segments as **literal directory names**
- Do not rewrite, escape into a different naming convention, normalize away, or refer to a “readable equivalent” unless an actual mirrored file physically exists

## 3) Glob / patch sensitivity

Affected/sensitive:
- operations that rely on broad matching, implicit expansion, or fragile patch targeting
- patch fragments lacking full headers / proper context
- any workflow that assumes a pattern matcher or patch applier will robustly handle bracket-containing paths

Evidence:
- patch failure recorded on the board
- prior ENOENT behavior despite file presence

Operational rule:
- Prefer direct file-targeted writes over clever patch flows
- When patching, ensure the patch is fully formed and targeted to the exact literal workspace path
- Avoid depending on glob-style selection for files under bracketed directories this cycle

## Immediate workaround

Use the exact literal workspace path in all worker-facing operations:

- `workspace/frontend/app/review/[roomId]/page.tsx`

Additional safe handling guidance:
- reference the file directly, not via inferred root
- avoid abbreviated path forms
- avoid pattern-based targeting
- if a task can be completed in a non-bracketed file without crossing scope, prefer that only when product requirements allow
- if touching the bracketed route file is required, target it explicitly by its literal path string above

## Should frontend rely on relative paths or readable mirrors this cycle?

### Relative paths
Frontend should **not rely on ambiguous relative paths** this cycle.

Use:
- explicit workspace-relative paths beginning with `workspace/`

Do not rely on:
- company-root-relative shorthand
- implicit current-working-directory assumptions
- shortened references like `frontend/...` in worker-targeted artifact operations

### Readable mirrors
Frontend should **not rely on readable mirrors unless a real mirrored file has been created in the tree**.

Current workspace evidence shows the real implemented route file is:

- `workspace/frontend/app/review/[roomId]/page.tsx`

There is no mirrored alternate route file in the workspace tree that platform can endorse as an operational substitute. So for this cycle, the answer is:

- use the **literal real file path**
- do **not** depend on a renamed or mirrored stand-in

## Operational recommendation for frontend this cycle

1. For any task involving the review route, target:
   - `workspace/frontend/app/review/[roomId]/page.tsx`

2. In artifact instructions, write the full path exactly as above.

3. Prefer whole-file writes or carefully headered direct patches over minimal patch fragments.

4. If a worker reports ENOENT on that file again, treat it as a tooling/path-resolution regression, not evidence that the file disappeared.

## Bottom line

Frontend is unblocked **only when using explicit workspace-relative literal paths**.

Safe this cycle:
- `workspace/frontend/app/review/[roomId]/page.tsx`

Not safe to assume this cycle:
- company-root-relative shorthand
- implicit relative-path resolution
- glob-dependent targeting
- nonexistent “readable mirror” substitutes