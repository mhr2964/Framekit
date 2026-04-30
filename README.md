# Framekit

Framekit helps freelancers and small teams collect polished, timestamped website feedback in elegant review rooms that clients actually enjoy using.

## Layout
- workspace/frontend/ — frontend dept owns this
- workspace/backend/ — backend dept owns this
- workspace/brand/ — brand dept owns this
- workspace/growth/ — growth dept owns this
- workspace/prototype/ — prototype dept owns this
- workspace/shared/ — shared contracts, types, tokens, and explicitly routed cross-team assets
- workspace/docs/ — product specs, architecture docs, and platform operating notes

## Deploy targets
- GitHub remote configured: https://github.com/mhr2964/Framekit.git
- Push workflow remains safeguard-controlled; ship local create → review → share increments unless an explicit approved push step is requested

## Write conventions
- All tangible deliverables should live under `workspace/`
- Prototype artifacts belong in `workspace/prototype/`
- Process and infrastructure notes belong in `workspace/docs/`
- Shared contracts/assets belong in `workspace/shared/` only when explicitly needed