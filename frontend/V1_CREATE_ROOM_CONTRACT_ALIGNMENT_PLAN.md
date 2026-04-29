# V1 Create-Room Contract Alignment Plan

## Goal
Once the v1 create-room fields are confirmed from `docs/` and backend contract sources, update the sprint-one scaffold with the smallest reliable set of frontend edits across:
- `src/lib/createRoom.ts`
- `src/RoomCreate.tsx`
- post-create handoff behavior into the review route

This plan assumes the current scaffold is intentionally provisional and that route structure should remain stable unless v1 explicitly requires a different review destination.

---

## 1) `src/lib/createRoom.ts` — exact edit targets

### A. Request type
Current provisional type: