// SCAFFOLD STUB: Canonical get-room transport contract is not yet visible.
// BLOCKED ON: Endpoint definitions in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
// Required contract elements:
//   - getRoom endpoint path, method, route/query param names (roomId vs shareId?), auth
//   - response envelope shape (e.g., { room } vs { data } vs bare object)
//   - error response shape and code mappings
// Current file preserves types and normalization logic; live endpoint throws.

export interface ReviewRoom {
  id: string;
  name: string;
  frameUrl: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  commentCount: number;
}

export interface GetRoomResponse {
  room: ReviewRoom;
}

export interface GetRoomApiError {
  message: string;
  code?: string;
}

function normalizeRoom(data: unknown): ReviewRoom {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Room payload was not an object.');
  }

  const room = data as Record<string, unknown>;

  if (
    typeof room.id !== 'string' ||
    typeof room.name !== 'string' ||
    typeof room.frameUrl !== 'string' ||
    typeof room.createdAt !== 'string' ||
    typeof room.commentCount !== 'number'
  ) {
    throw new Error('Room payload is missing expected fields.');
  }

  return {
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
  };
}

function normalizeGetRoomResponse(data: unknown): GetRoomResponse {
  if (typeof data !== 'object' || data === null || !('room' in data)) {
    throw new Error('Get room response is missing the room payload.');
  }

  return {
    room: normalizeRoom((data as { room: unknown }).room),
  };
}

function normalizeGetRoomError(data: unknown, fallbackMessage: string): GetRoomApiError {
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'object' &&
    data.error !== null
  ) {
    const error = data.error as { code?: unknown; message?: unknown };

    return {
      code: typeof error.code === 'string' ? error.code : undefined,
      message: typeof error.message === 'string' ? error.message : fallbackMessage,
    };
  }

  return { message: fallbackMessage };
}

export async function getRoom(roomId: string): Promise<GetRoomResponse> {
  // TODO: Wire to canonical get-room endpoint.
  // BLOCKED: endpoint path, method, and route/query param names not yet visible.
  // Note: contract must clarify whether param is roomId or shareId.
  // Once contract is published in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md,
  // replace this with actual fetch call to the defined endpoint.
  throw new Error(
    'getRoom: endpoint wiring blocked. Unblock with endpoint definition in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md',
  );
}