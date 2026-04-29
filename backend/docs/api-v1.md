# Framekit API v1

Base path: `/api/v1`

This document is the source-of-truth public API contract for Framekit v1 review rooms. The v1 surface is intentionally limited to four endpoints:

- `POST /api/v1/room`
- `GET /api/v1/room/{roomId}`
- `GET /api/v1/comment?roomId={roomId}`
- `POST /api/v1/comment`

## 1. Common Conventions

### 1.1 Content Type

All requests and responses use JSON.

- Request header: `Content-Type: application/json`
- Response header: `Content-Type: application/json`

### 1.2 IDs

All resource IDs are opaque server-generated strings.

Current ID prefixes:

- room IDs begin with `room_`
- comment IDs begin with `comment_`

Clients must treat IDs as opaque and must not infer sort order or creation time from them.

Examples:

- `room_01hxyzabc123`
- `comment_01hxyzdef456`

### 1.3 Timestamps

All timestamps are ISO 8601 UTC strings.

Example:
