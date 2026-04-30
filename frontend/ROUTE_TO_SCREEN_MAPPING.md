# Route-to-Screen Mapping: Create → Review → Share v1

**Contract Authority:** `workspace/backend/contracts/create-review-share-v1.json`  
**Status:** Locked  
**Date:** 2026-04-29

---

## Contract Routes Summary

The backend v1 surface defines exactly **4 endpoints** across the Create → Review → Share flow:

| # | Method | Path | Endpoint Name | Purpose |
|---|--------|------|---------------|---------|
| 1 | POST | `/api/v1/room` | `createRoom` | Create a new review room with name and frame URL |
| 2 | GET | `/api/v1/room/{roomId}` | `getRoom` | Fetch room metadata (name, frame URL, comment count, timestamps) |
| 3 | GET | `/api/v1/comment?roomId={roomId}` | `listComments` | Retrieve all comments for a room, ordered by createdAt ascending |
| 4 | POST | `/api/v1/comment` | `createComment` | Submit a top-level comment on a room (with optional author name and x/y position) |

---

## Frontend Screen → Route Binding

### Screen 1: Room Creation Form
**Route:** `POST /api/v1/room`  
**UI Path:** `/create`  
**Purpose:** Capture room name, frame URL, and optional creator name; post to backend.

**Request Payload:**