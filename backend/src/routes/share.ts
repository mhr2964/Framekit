import { Router, Request, Response } from "express";
import { GetShareLinkResponse } from "../contracts";

const router = Router({ mergeParams: true });

/**
 * POST /api/v1/rooms/:id/share
 * Create a public share link for a review room.
 */
router.post("/", (req: Request, res: Response) => {
  const { id: roomId } = req.params;

  if (!roomId || typeof roomId !== "string" || !roomId.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROOM_ID",
        message: "Room ID is required",
      },
    });
  }

  const shareLinkId = `share-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  const response: GetShareLinkResponse = {
    shareLink: {
      id: shareLinkId,
      room: {
        id: roomId,
        name: `Review Room ${roomId}`,
        frameUrl: "https://example.com/frame.html",
      },
      createdAt: now,
    },
  };

  res.status(201).json(response);
});

export default router;