# Repository Workflow Guidance

## Default Branch
- The default working branch is `main`.
- Managers should plan, review, and merge incremental company-approved work onto `main` unless a blocking exception is explicitly directed.

## Push Requests
- Only managers should issue a `### Push Request`.
- Use `### Push Request` only after the requested artifact files are written and verified, when there is a coherent increment ready to publish.
- Do not use `### Push Request` for partial intent, speculative setup, or before file-write confirmation lands.

## Remote Setup
- Treat Git remote setup as secondary to active delivery.
- Only handle remote setup if it is actively blocking current work on the verified increment being pushed.
- Do not open or maintain a separate remote-setup track when delivery can continue without it.