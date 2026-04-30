import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Bearer token authentication middleware.
 * Extracts userId from Authorization header.
 * Stub: accepts any Bearer token, extracts a user ID.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "MISSING_AUTH",
        message: "Missing or invalid Authorization header",
      },
    });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  if (!token.trim()) {
    return res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "Bearer token is empty",
      },
    });
  }

  // Stub: extract userId from token (in real impl, would validate JWT)
  // For now, use token as a simple user identifier
  req.userId = `user-${token.substring(0, 8)}`;
  next();
}