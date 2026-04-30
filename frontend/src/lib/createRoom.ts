const CREATE_ROOM_ROUTE = '/api/v1/room';

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

export interface CreateRoomRequest {
  name: string;
  frameUrl: string;
  createdBy?: ReviewRoomCreatedBy;
}

export interface CreateRoomResponse {
  room: ReviewRoom;
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

function normalizeCreateRoomResponse(data: unknown): CreateRoomResponse {
  if (typeof data !== 'object' || data === null || !('room' in data)) {
    throw new Error('Create room response is missing the room payload.');
  }

  return {
    room: normalizeRoom((data as { room: unknown }).room),
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
  const response = await fetch(CREATE_ROOM_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      // TODO: awaiting sync; backend HTTP handlers may still emit non-JSON error bodies.
    }

    throw normalizeCreateRoomError(data, 'We could not create your review room right now.');
  }

  const data: unknown = await response.json();
  return normalizeCreateRoomResponse(data);
}