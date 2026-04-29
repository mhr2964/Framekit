# Mock Create → Review → Share Handoff

## Canonical backend seam
The mocked-first package is aligned to the accepted contract routes:

- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:roomId`
- `POST /api/v1/rooms/:roomId/comments`

Room payloads should preserve:
- `id`
- `name`
- `frameUrl`
- `createdAt`
- `shareUrl`
- `createdBy?`
- `commentCount`

## Explicit visible states now wired
The package now carries these explicit UI-facing states end-to-end through constants, state guidance, and consuming surfaces:

- Create invalid / blocked submit
- Create failure with retry
- Review first-load vs loaded-empty
- Comment sending
- Comment success
- Comment failure
- Share fallback explanation
- Share success reset

## Create surface behavior
`src/RoomCreate.tsx` now distinguishes:
- blocked client-side invalid submit before request
- recoverable create failure after request
- submit-in-flight messaging
- success routing output

Blocked submit behavior:
- inline field guidance remains visible
- a disabled-submit rationale is available from shared constants copy
- no request is sent until required fields validate

Create failure behavior:
- entered values stay in place
- retry uses the primary action without losing form context

## Review and discussion behavior
`src/components/ReviewInteractionPanel.tsx` now distinguishes:
- first comment load
- loaded-empty thread
- comment posting in flight
- comment success acknowledgement with reset
- comment failure with visible retry path

## Share behavior
The preferred share value remains `room.shareUrl`.

If that payload value is absent, UI artifacts should explain that the displayed link is being derived locally using the documented fallback order:
1. `room.shareUrl`
2. `NEXT_PUBLIC_APP_URL + /review/{roomId}`
3. `window.location.origin + /review/{roomId}`
4. relative path `/review/{roomId}`

Any copy/share success treatment must reset after a short interval or on later interaction so the state does not remain stuck.