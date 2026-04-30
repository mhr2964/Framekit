// TODO: Canonical get-room endpoint and response shape are not yet visible in
// the published contract. This file is a scaffold stub.
// See: workspace/docs/contracts/ for the contract publication target.
// Blocked on: canonical binding spec in workspace/docs/contracts/create-review-share-binding-spec.md

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
  // TODO: Replace with canonical get-room endpoint path once the binding spec
  // defines the endpoint (method, path, route params, auth).
  // Current placeholder: GET /api/v1/room/{roomId}
  throw new Error(
    'getRoom: endpoint not yet wired. Awaiting canonical contract in workspace/docs/contracts/create-review-share-binding-spec.md',
  );
}