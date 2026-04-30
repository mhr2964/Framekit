import { Router, Request, Response } from "express";

const router = Router({ mergeParams: true });

/**
 * POST /api/v1/rooms/:id/invites
 * Create an invite for a review room.
 * Stub: returns mock invite response.
 */
router.post("/", (req: Request, res: Response) => {
  const { id: roomId } = req.params;
  const { email } = req.body;

  if (!roomId || typeof roomId !== "string" || !roomId.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROOM_ID",
        message: "Room ID is required",
      },
    });
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_EMAIL",
        message: "email is required",
      },
    });
  }

  const inviteId = `invite-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const response = {
    invite: {
      id: inviteId,
      roomId,
      email: email.trim(),
      createdAt: new Date().toISOString(),
    },
  };

  res.status(201).json(response);
});

export default router;