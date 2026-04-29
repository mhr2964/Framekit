const GET_ROOM_ENDPOINT_BASE = '/api/v1/room';

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
  const response = await fetch(`${GET_ROOM_ENDPOINT_BASE}/${encodeURIComponent(roomId)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorPayload: unknown = null;

    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = null;
    }

    throw normalizeGetRoomError(errorPayload, 'We could not load this room right now.');
  }

  const data: unknown = await response.json();
  return normalizeGetRoomResponse(data);
}