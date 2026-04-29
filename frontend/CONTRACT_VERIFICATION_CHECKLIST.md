# Framekit Contract Verification Checklist

Use this checklist to compare the current frontend boundary against the backend contract source once file contents are available.

## Files To Compare

### Frontend
- `src/lib/framekitTypes.ts`
- `src/lib/framekitService.ts`

### Backend
- `../backend/src/contracts.ts`
- `../backend/src/endpoints/room.ts`
- `../backend/src/endpoints/comment.ts`

---

## 1) Entity Field Mapping

### Room entity
- [ ] Confirm backend room identifier field name matches frontend usage
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm room title/name field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm client/display name field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm room summary/description field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm room status enum values match exactly
  - Frontend values:
  - Backend values:
  - Notes:
- [ ] Confirm access/share mode enum values match exactly
  - Frontend values:
  - Backend values:
  - Notes:
- [ ] Confirm decision label / approval state field exists and matches semantics
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm created/updated timestamp fields and formats match
  - Frontend field(s):
  - Backend field(s):
  - Notes:

### Version entity
- [ ] Confirm version identifier field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm version label/name field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm current/active version flag field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm preview/file URL fields match
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm upload/created timestamp fields and formats match
  - Frontend field(s):
  - Backend field(s):
  - Notes:

### Asset entity
- [ ] Confirm asset identifier field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm asset type/kind enum values match
  - Frontend values:
  - Backend values:
  - Notes:
- [ ] Confirm asset URL/thumbnail fields match
  - Frontend field(s):
  - Backend field(s):
  - Notes:
- [ ] Confirm asset dimensions/metadata fields match
  - Frontend field(s):
  - Backend field(s):
  - Notes:

### Comment entity
- [ ] Confirm comment identifier field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm comment room reference field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm author name field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm author type/role enum values match
  - Frontend values:
  - Backend values:
  - Notes:
- [ ] Confirm message/body field matches
  - Frontend field:
  - Backend field:
  - Notes:
- [ ] Confirm comment status enum values match
  - Frontend values:
  - Backend values:
  - Notes:
- [ ] Confirm created timestamp label/raw timestamp expectations match
  - Frontend field(s):
  - Backend field(s):
  - Notes:
- [ ] Confirm target/location metadata fields match, if present
  - Frontend field(s):
  - Backend field(s):
  - Notes:
- [ ] Confirm resolved-by / resolved-at fields exist if frontend depends on them
  - Frontend field(s):
  - Backend field(s):
  - Notes:

---

## 2) Request Shape Verification

### Create room request
Compare `frontend/src/lib/framekitService.ts` create-room payload with backend room endpoint contract.

- [ ] HTTP method matches
- [ ] Endpoint path matches
- [ ] Required fields match exactly
- [ ] Optional fields match exactly
- [ ] Field names/casing match
- [ ] Enum values match
- [ ] Validation constraints are compatible
- [ ] Frontend does not send unsupported fields
- [ ] Backend-required fields are not missing

Template:
- Frontend method/function:
- Backend endpoint:
- Request body fields:
- Query params:
- Headers:
- Notes:

### Get review room request
Compare frontend room-fetch call with backend room retrieval endpoint.

- [ ] HTTP method matches
- [ ] Endpoint path matches
- [ ] Dynamic route param name matches (`roomId` vs alternate)
- [ ] Query params match
- [ ] Auth requirements match
- [ ] Frontend path construction matches backend expectation

Template:
- Frontend method/function:
- Backend endpoint:
- Path params:
- Query params:
- Headers:
- Notes:

### Add comment request
Compare frontend add-comment call with backend comment endpoint.

- [ ] HTTP method matches
- [ ] Endpoint path matches
- [ ] Room reference is passed in the correct location
- [ ] Message/body field name matches
- [ ] Optional metadata fields match
- [ ] Frontend does not omit required fields
- [ ] Frontend does not send unsupported fields

Template:
- Frontend method/function:
- Backend endpoint:
- Request body fields:
- Query params:
- Headers:
- Notes:

---

## 3) Response Shape Verification

### Create room response
- [ ] Top-level response envelope matches (plain object vs wrapped data)
- [ ] Created room identifier field matches
- [ ] Share URL/link field matches
- [ ] Status/access fields match
- [ ] Created timestamps match format expectations
- [ ] Frontend success state only depends on confirmed backend fields

Template:
- Frontend expected shape:
- Backend actual shape:
- Mismatches:
- Required frontend changes:
- Required backend changes:

### Get review room response
- [ ] Top-level response envelope matches
- [ ] Room entity shape matches
- [ ] Versions array shape matches
- [ ] Assets array shape matches
- [ ] Comments array shape matches
- [ ] Field nullability matches frontend assumptions
- [ ] Enum values match
- [ ] Timestamp formats match
- [ ] Empty-state responses are handled consistently

Template:
- Frontend expected shape:
- Backend actual shape:
- Mismatches:
- Required frontend changes:
- Required backend changes:

### Add comment response
- [ ] Top-level response envelope matches
- [ ] Returned comment shape matches
- [ ] New comment status/default values match
- [ ] Created timestamp format matches
- [ ] Optimistic/prepended comment behavior is still valid

Template:
- Frontend expected shape:
- Backend actual shape:
- Mismatches:
- Required frontend changes:
- Required backend changes:

---

## 4) Endpoint Semantics

### Room creation semantics
- [ ] Backend creates room immediately on request
- [ ] Backend returns enough data for frontend success state without extra fetch
- [ ] Share link generation timing matches frontend expectation
- [ ] Duplicate submission behavior is defined
- [ ] Validation failure semantics are defined

Notes:

### Review room fetch semantics
- [ ] Missing room behavior is defined (404 vs empty payload)
- [ ] Unauthorized/private room behavior is defined
- [ ] Response includes all data needed for initial render
- [ ] Version ordering semantics are defined
- [ ] Comment ordering semantics are defined

Notes:

### Comment creation semantics
- [ ] New comments are returned in final saved form
- [ ] Comment ordering after creation is defined
- [ ] Empty comment rejection behavior is defined
- [ ] Rate limit or duplicate protection behavior is defined
- [ ] Room-not-found behavior is defined

Notes:

---

## 5) Error Handling Alignment

### Error envelope
- [ ] Backend error response shape is documented
- [ ] Frontend service parsing matches backend error envelope
- [ ] Frontend can surface backend validation messages safely
- [ ] Frontend handles non-JSON or unexpected responses defensively

Template:
- Backend error format:
- Frontend current handling:
- Required changes:

### HTTP status handling
- [ ] 400 handling matches validation failures
- [ ] 401/403 handling matches auth/access failures
- [ ] 404 handling matches missing room/comment targets
- [ ] 409 handling matches conflict semantics, if any
- [ ] 422 handling matches validation semantics, if any
- [ ] 500 handling produces calm generic copy in frontend

Template:
- Status:
- Backend meaning:
- Frontend current behavior:
- Required changes:

---

## 6) Frontend Service-Layer Swap Checklist

Use this section when replacing mock data in `src/lib/framekitService.ts` with real API calls.

- [ ] Replace mock room-create implementation with real fetch call
- [ ] Replace mock room-fetch implementation with real fetch call
- [ ] Replace mock add-comment implementation with real fetch call
- [ ] Add `res.ok` guards before reading JSON on every fetch
- [ ] Normalize backend response envelopes only in the service layer
- [ ] Keep UI components unchanged unless a verified contract mismatch requires it
- [ ] Preserve existing exported function names unless contract alignment requires a coordinated rename
- [ ] Update `framekitTypes.ts` only for confirmed contract differences
- [ ] Remove mock-only assumptions that do not exist in backend contract
- [ ] Document any intentional frontend-to-backend mapping adapters

Notes:

---

## 7) Final Sign-Off

### Confirmed matches
- [ ]

### Confirmed mismatches
- [ ]

### Follow-up actions
- [ ]

### Reviewer sign-off
- Name:
- Date:
- Notes: