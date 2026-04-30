// SCAFFOLD STUB: Canonical create-room transport contract is not yet visible.
// BLOCKED ON: Endpoint definitions in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
// Required contract elements:
//   - createRoom endpoint path, method, request body field names, auth
//   - response envelope shape (e.g., { room } vs { data } vs bare object)
//   - field-level error codes (INVALID_NAME, INVALID_FRAME_URL, etc.)
//   - error response shape and code mappings
// Current file preserves types and field-error mapping; live endpoint throws.

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
  // TODO: Wire to canonical create-room endpoint.
  // BLOCKED: endpoint path, method, and request body field names not yet visible.
  // Once contract is published in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md,
  // replace this with actual fetch call to the defined endpoint.
  throw new Error(
    'createRoom: endpoint wiring blocked. Unblock with endpoint definition in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md',
  );
}