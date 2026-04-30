import { Router, Request, Response } from "express";
import { CreateRoomRequest, CreateRoomResponse, GetRoomResponse, Room } from "../contracts";

const router = Router();

// In-memory mock storage for this round
const mockRooms: Map<string, Room> = new Map();

/**
 * POST /api/v1/rooms
 * Create a new review room.
 */
router.post("/", (req: Request, res: Response) => {
  const { name, frameUrl, createdBy } = req.body as CreateRoomRequest;

  // Validate required fields
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_NAME",
        message: "name is required and must be a non-empty string",
      },
    });
  }

  if (!frameUrl || typeof frameUrl !== "string" || !frameUrl.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_FRAME_URL",
        message: "frameUrl is required and must be a non-empty string",
      },
    });
  }

  // Validate createdBy if present
  if (createdBy && (!createdBy.name || typeof createdBy.name !== "string" || !createdBy.name.trim())) {
    return res.status(400).json({
      error: {
        code: "INVALID_CREATED_BY",
        message: "createdBy.name must be a non-empty string if provided",
      },
    });
  }

  // Mock response
  const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  const room: Room = {
    id: roomId,
    name: name.trim(),
    frameUrl: frameUrl.trim(),
    createdAt: now,
    commentCount: 0,
    ...(createdBy && { createdBy }),
  };

  mockRooms.set(roomId, room);

  const response: CreateRoomResponse = { room };
  res.status(201).json(response);
});

/**
 * GET /api/v1/rooms/:id
 * Retrieve a review room by ID.
 */
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROOM_ID",
        message: "Room ID is required and must be a non-empty string",
      },
    });
  }

  // For this stub, return a mock room
  const room: Room = {
    id,
    name: `Review Room ${id}`,
    frameUrl: "https://example.com/frame.html",
    createdAt: new Date().toISOString(),
    commentCount: 0,
  };

  const response: GetRoomResponse = { room };
  res.status(200).json(response);
});

export default router;