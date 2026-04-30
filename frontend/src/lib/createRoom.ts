// TODO: Canonical create-room endpoint and request/response shapes are not yet
// visible in the published contract. This file is a scaffold stub.
// See: workspace/docs/contracts/ for the contract publication target.
// Blocked on: canonical binding spec in workspace/docs/contracts/create-review-share-binding-spec.md

export interface CreateRoomRequest {
  name: string;
  frameUrl: string;
  createdBy?: {
    name: string;
  };
}

export interface CreateRoomResponse {
  room: {
    id: string;
    name: string;
    frameUrl: string;
    createdAt: string;
    createdBy?: {
      name: string;
    };
    commentCount: number;
  };
}

export interface CreateRoomFieldErrors {
  name?: string;
  frameUrl?: string;
  createdBy?: string;
}

export interface CreateRoomApiError {
  message: string;
  code?: string;
  fieldErrors?: CreateRoomFieldErrors;
}

function normalizeCreateRoomResponse(data: unknown): CreateRoomResponse {
  if (typeof data !== 'object' || data === null || !('room' in data)) {
    throw new Error('Create room response is missing the room payload.');
  }

  const room = (data as { room?: Record<string, unknown> }).room;

  if (
    !room ||
    typeof room.id !== 'string' ||
    typeof room.name !== 'string' ||
    typeof room.frameUrl !== 'string' ||
    typeof room.createdAt !== 'string' ||
    typeof room.commentCount !== 'number'
  ) {
    throw new Error('Create room response is missing expected room fields.');
  }

  return {
    room: {
      id: room.id,
      name: room.name,
      frameUrl: room.frameUrl,
      createdAt: room.createdAt,
      commentCount: room.commentCount,
      createdBy:
        typeof room.createdBy === 'object' &&
        room.createdBy !== null &&
        typeof (room.createdBy as { name?: unknown }).name === 'string'
          ? { name: (room.createdBy as { name: string }).name }
          : undefined,
    },
  };
}

function mapErrorCodeToFieldErrors(code?: string): CreateRoomFieldErrors | undefined {
  switch (code) {
    case 'INVALID_NAME':
      return { name: 'Add a room name using 1 to 120 characters.' };
    case 'INVALID_FRAME_URL':
      return { frameUrl: 'Enter a valid link starting with http:// or https://.' };
    case 'INVALID_CREATED_BY':
      return { createdBy: 'Creator name must be 1 to 80 characters.' };
    default:
      return undefined;
  }
}

function normalizeCreateRoomError(data: unknown, fallbackMessage: string): CreateRoomApiError {
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'object' &&
    data.error !== null
  ) {
    const error = data.error as { code?: unknown; message?: unknown };
    const code = typeof error.code === 'string' ? error.code : undefined;
    const message = typeof error.message === 'string' ? error.message : fallbackMessage;

    return {
      message,
      code,
      fieldErrors: mapErrorCodeToFieldErrors(code),
    };
  }

  return { message: fallbackMessage };
}

export async function createRoom(payload: CreateRoomRequest): Promise<CreateRoomResponse> {
  // TODO: Replace with canonical create-room endpoint path once the binding
  // spec defines the endpoint (method, path, request body, auth).
  // Current placeholder: POST /api/v1/room
  throw new Error(
    'createRoom: endpoint not yet wired. Awaiting canonical contract in workspace/docs/contracts/create-review-share-binding-spec.md',
  );
}