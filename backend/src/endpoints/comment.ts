import {
  API_V1_BASE_PATH,
  Comment,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateShareLinkCommentRequest,
  EndpointResult,
  ErrorResponse,
  ListCommentsResponse,
} from "../contracts";

export const COMMENT_COLLECTION_PATH = `${API_V1_BASE_PATH}/comment`;
export const SHARE_LINK_COMMENT_COLLECTION_PATH = `${API_V1_BASE_PATH}/share-links/:shareId/comments`;

export interface CommentRepository {
  roomExists(roomId: string): Promise<boolean>;
  listCommentsByRoomId(roomId: string): Promise<Comment[]>;
  createComment(input: CreateCommentRequest): Promise<Comment>;
}

export interface ShareLinkCommentRepository {
  createCommentForShareLink(shareId: string, input: CreateShareLinkCommentRequest): Promise<Comment | null>;
}

export function validateListCommentsRoomId(roomId: unknown): ErrorResponse | null {
  if (roomId === undefined || roomId === null || roomId === "") {
    return buildError("MISSING_ROOM_ID", "roomId is required");
  }

  if (typeof roomId !== "string" || roomId.trim().length < 1) {
    return buildError("INVALID_ROOM_ID", "roomId must be a non-empty string");
  }

  return null;
}

export function validateCreateCommentRequest(input: unknown): ErrorResponse | null {
  if (!input || typeof input !== "object") {
    return buildError("INVALID_JSON", "Request body must be a JSON object");
  }

  const candidate = input as Partial<CreateCommentRequest>;

  const roomIdError = validateListCommentsRoomId(candidate.roomId);
  if (roomIdError) {
    return roomIdError;
  }

  if (typeof candidate.body !== "string" || candidate.body.trim().length < 1 || candidate.body.trim().length > 2000) {
    return buildError("INVALID_BODY", "body must be a non-empty string up to 2000 characters");
  }

  if (candidate.author !== undefined) {
    if (
      typeof candidate.author !== "object" ||
      candidate.author === null ||
      typeof candidate.author.name !== "string" ||
      candidate.author.name.trim().length < 1 ||
      candidate.author.name.trim().length > 80
    ) {
      return buildError("INVALID_AUTHOR", "author.name must be a non-empty string up to 80 characters");
    }
  }

  if (candidate.position !== undefined) {
    if (
      typeof candidate.position !== "object" ||
      candidate.position === null ||
      typeof candidate.position.x !== "number" ||
      Number.isNaN(candidate.position.x) ||
      typeof candidate.position.y !== "number" ||
      Number.isNaN(candidate.position.y)
    ) {
      return buildError("INVALID_POSITION", "position must include numeric x and y values");
    }
  }

  return null;
}

export function validateCreateShareLinkCommentRequest(input: unknown): ErrorResponse | null {
  if (!input || typeof input !== "object") {
    return buildError("INVALID_JSON", "Request body must be a JSON object");
  }

  const candidate = input as Partial<CreateShareLinkCommentRequest>;

  if (typeof candidate.body !== "string" || candidate.body.trim().length < 1 || candidate.body.trim().length > 2000) {
    return buildError("INVALID_BODY", "body must be a non-empty string up to 2000 characters");
  }

  if (candidate.author !== undefined) {
    if (
      typeof candidate.author !== "object" ||
      candidate.author === null ||
      typeof candidate.author.name !== "string" ||
      candidate.author.name.trim().length < 1 ||
      candidate.author.name.trim().length > 80
    ) {
      return buildError("INVALID_AUTHOR", "author.name must be a non-empty string up to 80 characters");
    }
  }

  if (candidate.position !== undefined) {
    if (
      typeof candidate.position !== "object" ||
      candidate.position === null ||
      typeof candidate.position.x !== "number" ||
      Number.isNaN(candidate.position.x) ||
      typeof candidate.position.y !== "number" ||
      Number.isNaN(candidate.position.y)
    ) {
      return buildError("INVALID_POSITION", "position must include numeric x and y values");
    }
  }

  return null;
}

export async function listComments(
  repository: CommentRepository,
  roomId: unknown,
): Promise<EndpointResult<ListCommentsResponse>> {
  const validationError = validateListCommentsRoomId(roomId);

  if (validationError) {
    return {
      status: 400,
      body: validationError,
    };
  }

  const normalizedRoomId = roomId as string;
  const roomExists = await repository.roomExists(normalizedRoomId);

  if (!roomExists) {
    return {
      status: 404,
      body: buildError("ROOM_NOT_FOUND", "Room not found"),
    };
  }

  const comments = await repository.listCommentsByRoomId(normalizedRoomId);

  return {
    status: 200,
    body: { comments },
  };
}

export async function createComment(
  repository: CommentRepository,
  input: unknown,
): Promise<EndpointResult<CreateCommentResponse>> {
  const validationError = validateCreateCommentRequest(input);

  if (validationError) {
    return {
      status: 400,
      body: validationError,
    };
  }

  const request = input as CreateCommentRequest;
  const roomExists = await repository.roomExists(request.roomId);

  if (!roomExists) {
    return {
      status: 404,
      body: buildError("ROOM_NOT_FOUND", "Room not found"),
    };
  }

  const comment = await repository.createComment(request);

  return {
    status: 201,
    body: { comment },
  };
}

export async function createShareLinkComment(
  repository: ShareLinkCommentRepository,
  shareId: string,
  input: unknown,
): Promise<EndpointResult<CreateCommentResponse>> {
  if (typeof shareId !== "string" || shareId.trim().length < 1) {
    return {
      status: 400,
      body: buildError("MISSING_SHARE_ID", "shareId is required"),
    };
  }

  const validationError = validateCreateShareLinkCommentRequest(input);

  if (validationError) {
    return {
      status: 400,
      body: validationError,
    };
  }

  const comment = await repository.createCommentForShareLink(shareId, input as CreateShareLinkCommentRequest);

  if (!comment) {
    return {
      status: 404,
      body: buildError("SHARE_LINK_NOT_FOUND", "Share link not found"),
    };
  }

  return {
    status: 201,
    body: { comment },
  };
}

function buildError(code: ErrorResponse["error"]["code"], message: string): ErrorResponse {
  return {
    error: {
      code,
      message,
    },
  };
}