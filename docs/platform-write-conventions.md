# Platform write conventions

Verification note for current repo-ready context.

## Status
- GitHub remote is present in project context: `https://github.com/mhr2964/Framekit.git`
- Push behavior remains safeguard-controlled: work should still ship as local create → review → share increments unless an explicit push step is separately requested and executed through the approved workflow.
- This note is infrastructure-only. It does not change ownership boundaries between departments.

## Expected writable paths
Platform confirms these workspace paths are the intended artifact locations:

- `workspace/` — root for shared repo deliverables
- `workspace/docs/` — operating notes, architecture notes, specs, process guidance
- `workspace/prototype/` — prototype dept deliverables such as static HTML/CSS/JS mockups and related prototype assets
- `workspace/shared/` — shared contracts and cross-team assets when explicitly routed there
- `workspace/<department>/` — each department’s own working area

## Artifact conventions
- Departments should write real files under `workspace/` only.
- Prototype artifacts belong under `workspace/prototype/`.
- Infrastructure/process notes like this one belong under `workspace/docs/`.
- Cross-department handoff artifacts should use durable files in `workspace/shared/` only when a shared contract or explicitly co-owned asset is needed.
- Do not treat board messages as the canonical location for production artifacts; board content is for status, routing, and confirmation.
- Do not invent alternate mirror paths or off-tree staging areas to bypass normal workspace ownership.

## Ownership guardrails
- Platform owns workspace scaffolding, `workspace/README.md`, root workspace guidance, and `workspace/shared/` by default.
- Product departments own the contents of their own department folders.
- Platform should not place product implementation files inside another department’s folder without explicit routed direction.
- Verification of writable paths does not authorize cross-department edits outside normal ownership.

## Practical rule
Under the current repo context, the correct path for prototype/workspace deliverables is still the workspace tree itself:
- prototype output → `workspace/prototype/`
- workspace/process guidance → `workspace/docs/`
- shared contracts/assets → `workspace/shared/` when explicitly needed

This keeps local create → review → share flow consistent with the push safeguard and avoids path workarounds.