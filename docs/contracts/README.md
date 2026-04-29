# Contracts

This directory holds canonical cross-team contract documentation for Framekit.

## Purpose

Use this folder for shared API/interface definitions that multiple departments rely on, including:

- HTTP endpoint contracts
- request/response shapes
- domain object definitions
- validation and error conventions
- event or webhook payload shapes if introduced later

## Working agreement

- Backend may originate implementation details, but shared expectations should be captured here for frontend and other consumers
- Frontend should reference these docs when verifying integration behavior
- Platform maintains the scaffold and file layout unless ownership is explicitly expanded

## Initial files

- `api-overview.md` — high-level contract map and status
- `room-feedback-api.md` — placeholder for review-room and comment flow contracts