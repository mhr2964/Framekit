import {
  API_V1_BASE_PATH,
  EndpointResult,
  ErrorResponse,
  GetShareLinkResponse,
  GetRoomResponse,
  ShareLink,
  CreateRoomRequest,
  CreateRoomResponse,
  Room,
} from "../contracts";

export const ROOM_COLLECTION_PATH = `${API_V1_BASE_PATH}/room`;
export const ROOM_ITEM_PATH = `${API_V1_BASE_PATH}/room/:roomId`;
export const SHARE_LINK_ITEM_PATH = `${API_V1_BASE_PATH}/share-links/:shareId`;

export interface GetRoomParams {
  roomId: string;
}

export interface RoomRepository {
  createRoom(input: CreateRoomRequest): Promise<Room>;
  getRoomById(roomId: string): Promise<Room | null>;
}

export interface ShareLinkRepository {
  getShareLinkById(shareId: string): Promise<ShareLink | null>;
}

export function validateCreateRoomRequest(input: unknown): ErrorResponse | null {
  if (!input || typeof input !== "object") {
    return buildError("INVALID_JSON", "Request body must be a JSON object");
  }

  const candidate = input as Partial<CreateRoomRequest>;

  if (typeof candidate.name !== "string" || candidate.name.trim().length < 1 || candidate.name.trim().length > 120) {
    return buildError("INVALID_NAME", "name must be a non-empty string up to 120 characters");
  }

  if (!isValidAbsoluteUrl(candidate.frameUrl)) {
    return buildError("INVALID_FRAME_URL", "frameUrl must be a valid absolute URL");
  }

  if (candidate.createdBy !== undefined) {
    if (
      typeof candidate.createdBy !== "object" ||
      candidate.createdBy === null ||
      typeof candidate.createdBy.name !== "string" ||
      candidate.createdBy.name.trim().length < 1 ||
      candidate.createdBy.name.trim().length > 80
    ) {
      return buildError("INVALID_CREATED_BY", "createdBy.name must be a non-empty string up to 80 characters");
    }
  }

  return null;
}

export async function createRoom(
  repository: RoomRepository,
  input: unknown,
): Promise<EndpointResult<CreateRoomResponse>> {
  const validationError = validateCreateRoomRequest(input);

  if (validationError) {
    return {
      status: 400,
      body: validationError,
    };
  }

  const room = await repository.createRoom(input as CreateRoomRequest);

  return {
    status: 201,
    body: { room },
  };
}

export async function getRoomById(
  repository: RoomRepository,
  roomId: string,
): Promise<EndpointResult<GetRoomResponse>> {
  if (typeof roomId !== "string" || roomId.trim().length < 1) {
    return {
      status: 404,
      body: buildError("ROOM_NOT_FOUND", "Room not found"),
    };
  }

  const room = await repository.getRoomById(roomId);

  if (!room) {
    return {
      status: 404,
      body: buildError("ROOM_NOT_FOUND", "Room not found"),
    };
  }

  return {
    status: 200,
    body: { room },
  };
}

export async function getShareLinkById(
  repository: ShareLinkRepository,
  shareId: string,
): Promise<EndpointResult<GetShareLinkResponse>> {
  if (typeof shareId !== "string" || shareId.trim().length < 1) {
    return {
      status: 400,
      body: buildError("MISSING_SHARE_ID", "shareId is required"),
    };
  }

  const shareLink = await repository.getShareLinkById(shareId);

  if (!shareLink) {
    return {
      status: 404,
      body: buildError("SHARE_LINK_NOT_FOUND", "Share link not found"),
    };
  }

  return {
    status: 200,
    body: { shareLink },
  };
}

function isValidAbsoluteUrl(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function buildError(code: ErrorResponse["error"]["code"], message: string): ErrorResponse {
  return {
    error: {
      code,
      message,
    },
  };
}