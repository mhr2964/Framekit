# Framekit v1 Schema Notes

This document defines the minimal data model aligned with `docs/api-v1.md`. It is intentionally storage-engine agnostic and covers only rooms and comments.

## 1. Entity Overview

v1 requires two persisted entities:

- `rooms`
- `comments`

No user table, membership table, invite table, or comment thread table is required in v1.

---

## 2. Rooms

Suggested logical table name: `rooms`

### Fields

- `id` — string, primary key, required
- `name` — string, required
- `frame_url` — string, required
- `created_at` — timestamp, required
- `updated_at` — timestamp, required
- `created_by_name` — string, nullable

### Constraints

- primary key on `id`
- `name` must be non-empty after trimming
- `name` maximum length: 120 characters
- `frame_url` must store an absolute `http` or `https` URL
- `created_at` must be populated at insert time
- `updated_at` must be populated at insert time
- on initial insert, `updated_at == created_at`
- `created_by_name`, when present, must be non-empty after trimming and at most 80 characters

### Indexes

Minimum indexes:

- primary key index on `id`
- optional secondary index on `created_at` for operational sorting/debugging

### API Mapping

- `rooms.id` -> `room.id`
- `rooms.name` -> `room.name`
- `rooms.frame_url` -> `room.frameUrl`
- `rooms.created_at` -> `room.createdAt`
- `rooms.updated_at` -> `room.updatedAt`
- `rooms.created_by_name` -> `room.createdBy.name`

### Lifecycle Notes

- rooms are created before any comments can exist for them
- v1 does not define room deletion
- v1 does not define room update operations, but `updated_at` is reserved and exposed in the API
- `commentCount` is derived from related comments and does not need to be stored in v1

---

## 3. Comments

Suggested logical table name: `comments`

### Fields

- `id` — string, primary key, required
- `room_id` — string, required, foreign key to `rooms.id`
- `body` — string, required
- `author_name` — string, nullable
- `position_x` — number, nullable
- `position_y` — number, nullable
- `created_at` — timestamp, required

### Constraints

- primary key on `id`
- foreign key `room_id` references `rooms.id`
- `body` must be non-empty after trimming
- `body` maximum length: 2000 characters
- `author_name`, when present, must be non-empty after trimming and at most 80 characters
- `position_x` and `position_y` are nullable together
- if one of `position_x` or `position_y` is present, both must be present
- coordinate values should be stored as numeric values without additional unit conversion
- `created_at` must be populated at insert time

### Indexes

Minimum indexes:

- primary key index on `id`
- composite index on (`room_id`, `created_at`) for ordered room comment reads
- optional supporting index on `room_id`

### API Mapping

- `comments.id` -> `comment.id`
- `comments.room_id` -> `comment.roomId`
- `comments.body` -> `comment.body`
- `comments.author_name` -> `comment.author.name`
- `comments.position_x` -> `comment.position.x`
- `comments.position_y` -> `comment.position.y`
- `comments.created_at` -> `comment.createdAt`

### Lifecycle Notes

- a comment cannot exist without a valid parent room
- comments are listed by `room_id` in ascending `created_at` order
- v1 does not define comment update, resolve, or delete behavior
- v1 does not define threaded replies; each comment is top-level only

---

## 4. Nullability Summary

### Rooms

- nullable: `created_by_name`
- required: `id`, `name`, `frame_url`, `created_at`, `updated_at`

### Comments

- nullable: `author_name`, `position_x`, `position_y`
- required: `id`, `room_id`, `body`, `created_at`

---

## 5. Enum / State Assumptions

No enums or workflow states are required in v1.

Specifically:

- rooms do not have status fields such as `draft`, `active`, or `archived`
- comments do not have status fields such as `open`, `resolved`, or `deleted`

If future versions add workflow behavior, those should be introduced as new fields with explicit migration rules rather than inferred from timestamps or nullability.

---

## 6. Minimal Implementation Guidance

For the smallest reliable implementation:

- generate opaque string IDs for both entities
- enforce parent room existence before inserting a comment
- derive room `commentCount` with a count query on `comments.room_id`
- return room and comment timestamps as ISO 8601 UTC strings at the API boundary
- preserve the API distinction between omitted optional objects and nullable storage fields