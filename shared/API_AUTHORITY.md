# Framekit Shared API Authority

## v1 source of truth
`workspace/backend/api-contract.md` is the only authoritative API specification for Framekit v1.

Use that file for:
- route inventory
- request and response shapes
- auth expectations
- implementation alignment across frontend, backend, prototype, and docs

## Locked v1 baseline
The v1 baseline is locked to exactly 4 routes in the backend contract. Shared files must not redefine, extend, or reinterpret that surface area.

## What shared files may do
Files under `workspace/shared/` may:
- point readers to `workspace/backend/api-contract.md`
- document that older placeholders are archived
- hold future shared schemas only when explicitly derived from the locked backend contract

Files under `workspace/shared/` may not:
- introduce alternate v1 route lists
- restore deferred share-link flows
- add token-sharing variants
- act as a competing source of truth for endpoint behavior

## Deferred items
Any share-link flow, token-sharing flow, or similar variant beyond the locked 4-route baseline is deferred to v1.1+ unless the backend contract is formally revised.

## Migration rule
If a shared contract placeholder conflicts with the backend contract:
1. mark the placeholder as archived or deprecated
2. point directly to `workspace/backend/api-contract.md`
3. do not preserve ambiguous v1 wording