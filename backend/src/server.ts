import express, { Request, Response } from "express";
import { authMiddleware } from "./middleware/auth";
import roomsRouter from "./routes/rooms";
import invitesRouter from "./routes/invites";
import commentsRouter from "./routes/comments";
import shareRouter from "./routes/share";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Apply Bearer token auth to all /api/v1 routes
app.use("/api/v1", authMiddleware);

// Route handlers
app.use("/api/v1/rooms", roomsRouter);
app.use("/api/v1/rooms/:id/invites", invitesRouter);
app.use("/api/v1/rooms/:id/comments", commentsRouter);
app.use("/api/v1/rooms/:id/share", shareRouter);

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[backend] Server listening on port ${PORT}`);
});

export default app;