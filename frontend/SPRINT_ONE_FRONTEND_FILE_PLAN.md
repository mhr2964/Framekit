# Sprint One Frontend File Plan

## Scope
Sprint one should establish:
- landing-page shell aligned to the calm Framekit baseline
- primary CTA path into room creation
- provisional typed API boundary for create-room
- isolated create-room state handling that can survive backend contract refinement
- no review-thread interaction expansion beyond preserving the existing placeholder route

This plan assumes implementation stays inside `workspace/frontend/` and consumes backend contracts provisionally without requiring backend changes in this sprint.

---

## Replace vs Extend: Existing Files

### Replace

#### `app/page.tsx`
Replace the current file rather than incrementally patching it.
Reason:
- landing-page shell is a sprint-one surface, not a minor tweak
- existing content is likely prototype-heavy and should be simplified into a stable routed entrypoint
- replacement reduces risk of mixing marketing layout, room-create CTA wiring, and future review-specific concerns

Planned responsibility after replacement:
- compose the landing hero / reassurance copy / primary CTA
- route users into `/create`
- render only page-level layout and section composition, not business logic

#### `app/create/page.tsx`
Replace the current file.
Reason:
- create flow needs to become a thin route wrapper around new dedicated create-room modules
- current page should not own fetch logic, validation logic, submission state, and view composition directly

Planned responsibility after replacement:
- render the create-room screen container
- wire page metadata if needed
- delegate all state and submission behavior to new `src/` modules

---

### Extend

#### `app/layout.tsx`
Extend, not replace.
Reason:
- existing app shell likely already contains root HTML/body structure
- sprint-one only needs small shell refinements such as shared page background, max-width container, or font/token hooks

Planned changes:
- preserve root layout contract
- optionally add app-wide wrapper classes and calmer base structure
- avoid page-specific content here

#### `app/globals.css`
Extend, not replace.
Reason:
- global reset/base styles should remain intact
- sprint-one needs additional layout, spacing, and semantic utility rules for landing + create surfaces

Planned changes:
- add calm background/surface/spacing primitives
- add shared section/container/button/input utility classes only if they are truly app-wide
- keep component-specific styles out of globals where possible

#### `README.md`
Extend only if implementation introduces notable frontend structure that future contributors need explained.
For planning purposes this is optional, not required in sprint one.

#### `src/lib/framekitService.ts`
Extend or partially refactor rather than delete immediately.
Reason:
- may already contain patterns useful for provisional API calls
- but sprint-one should avoid coupling create-room submission to older review/mock service responsibilities

Planned use:
- either leave untouched for legacy/prototype compatibility
- or narrow usage and introduce a separate create-room API client so room creation does not inherit unrelated service concerns

#### `src/lib/framekitTypes.ts`
Extend only if it is already the established home for app-level shared UI types.
Otherwise prefer new create-room-specific type files to avoid overloading a generic bucket.

#### `app/review/[roomId]/page.tsx`
Do not materially change in sprint one unless a compile-time import path adjustment becomes necessary.
Reason:
- review surface is not the active sprint-one build target
- keep the approved baseline stable

#### `src/RoomCreate.tsx`
Do not extend in place unless implementation confirms it is already the intended reusable create feature entry.
Current file size suggests it is likely over-scoped.
Preferred plan: replace usage, then either retire later or reduce it behind smaller modules in a follow-up.

---

## Proposed New Files

### Route-level composition
#### `src/components/create/CreateRoomScreen.tsx`
Purpose:
- top-level presentational screen for the create route
- receives state + handlers from a hook/container
- owns visual composition only

Why:
- keeps `app/create/page.tsx` tiny
- separates route concerns from feature rendering

#### `src/components/create/CreateRoomForm.tsx`
Purpose:
- form markup for room details
- receives typed field values, errors, and event handlers
- contains explicit button types and accessibility labeling

Why:
- isolates the editable form from surrounding explainer/empty/success states

#### `src/components/create/CreateRoomSuccess.tsx`
Purpose:
- show success state after room creation
- display generated room link / review path / copy guidance

Why:
- avoids conditional complexity in form component

### State and feature logic
#### `src/lib/createRoom/contracts.ts`
Purpose:
- minimum TypeScript interfaces for provisional room-create request/response contracts
- runtime-adjacent data shapes only; no UI state in this file

Why:
- clear typed boundary against backend uncertainty
- easy future replacement when backend finalizes contracts

#### `src/lib/createRoom/api.ts`
Purpose:
- small fetch client for create-room submission
- contain endpoint path, request serialization, `res.ok` guard, and response parsing
- no React imports

Why:
- keeps network logic out of components and hooks

#### `src/lib/createRoom/state.ts`
Purpose:
- create-room form defaults
- pure helpers for deriving payloads, validating minimum fields, and mapping API errors to UI-safe strings

Why:
- testable non-React business logic
- prevents component bloat

#### `src/lib/createRoom/useCreateRoom.ts`
Purpose:
- React hook for create-room interaction state
- owns submit lifecycle: idle, validating, submitting, success, error
- coordinates form state + API client

Why:
- dedicated feature state manager instead of embedding logic in page/component files

### Optional shared UI extraction if needed
#### `src/components/layout/AppShell.tsx`
Only add if both landing and create screens need the same wrapper composition.
Purpose:
- reusable calm page shell with width constraints and spacing

#### `src/components/home/LandingHero.tsx`
Only add if `app/page.tsx` grows beyond simple composition.
Purpose:
- isolate landing hero and CTA content from page wiring

---

## Preferred Ownership Split by File

### `app/page.tsx`
Should own:
- page composition
- CTA link to `/create`

Should not own:
- create-room state
- fetch logic
- form schema/types

### `app/create/page.tsx`
Should own:
- page entry composition only

Should not own:
- low-level input state
- payload building
- network requests
- response parsing

### `src/components/create/*`
Should own:
- rendering
- field display
- user interaction callbacks passed in from hook

Should not own:
- endpoint constants
- fetch calls directly
- router-derived business rules unless strictly UI-only

### `src/lib/createRoom/*`
Should own:
- contracts
- fetch API
- validation helpers
- submission state orchestration

Should not own:
- JSX
- route composition

---

## Minimum TypeScript Interfaces for Provisional Create-Room Contracts

These are the minimum interfaces needed to unblock sprint-one implementation without overcommitting to backend details.
