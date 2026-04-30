const ROOM_ROUTE = '/api/v1/room';

export interface ReviewRoomCreatedBy {
  name: string;
}

export interface ReviewRoom {
  id: string;
  name: string;
  frameUrl: string;
  createdAt: string;
  commentCount: number;
  createdBy?: ReviewRoomCreatedBy;
}

export interface GetRoomResponse {
  room: ReviewRoom;
}

export interface GetRoomApiError {
  message: string;
  code?: string;
}

function normalizeCreatedBy(value: unknown): ReviewRoomCreatedBy | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const createdBy = value as { name?: unknown };

  if (typeof createdBy.name !== 'string') {
    return undefined;
  }

  return {
    name: createdBy.name,
  };
}

function normalizeRoom(data: unknown): ReviewRoom {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Room payload was not an object.');
  }

  const room = data as {
    id?: unknown;
    name?: unknown;
    frameUrl?: unknown;
    createdAt?: unknown;
    commentCount?: unknown;
    createdBy?: unknown;
  };

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
    createdBy: normalizeCreatedBy(room.createdBy),
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
  const response = await fetch(`${ROOM_ROUTE}/${encodeURIComponent(roomId)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      // TODO: awaiting sync; backend HTTP handlers may still emit non-JSON error bodies.
    }

    const error = normalizeGetRoomError(data, 'We could not load this review room.');
    throw new Error(error.message);
  }

  const data: unknown = await response.json();
  return normalizeGetRoomResponse(data);
}