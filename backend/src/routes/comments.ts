import { Router, Request, Response } from "express";
import { CreateCommentRequest, CreateCommentResponse, Comment } from "../contracts";

const router = Router({ mergeParams: true });

/**
 * POST /api/v1/rooms/:id/comments
 * Create a comment on a review room.
 */
router.post("/", (req: Request, res: Response) => {
  const { id: roomId } = req.params;
  const { body, author, position } = req.body as CreateCommentRequest;

  if (!roomId || typeof roomId !== "string" || !roomId.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_ROOM_ID",
        message: "Room ID is required",
      },
    });
  }

  if (!body || typeof body !== "string" || !body.trim()) {
    return res.status(400).json({
      error: {
        code: "INVALID_BODY",
        message: "body is required and must be a non-empty string",
      },
    });
  }

  // Validate author if present
  if (author && (!author.name || typeof author.name !== "string" || !author.name.trim())) {
    return res.status(400).json({
      error: {
        code: "INVALID_AUTHOR",
        message: "author.name must be a non-empty string if provided",
      },
    });
  }

  // Validate position if present
  if (position) {
    if (typeof position.x !== "number" || typeof position.y !== "number") {
      return res.status(400).json({
        error: {
          code: "INVALID_POSITION",
          message: "position must have numeric x and y values",
        },
      });
    }
  }

  const commentId = `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  const comment: Comment = {
    id: commentId,
    roomId,
    body: body.trim(),
    createdAt: now,
    ...(author && { author }),
    ...(position && { position }),
  };

  const response: CreateCommentResponse = { comment };
  res.status(201).json(response);
});

export default router;