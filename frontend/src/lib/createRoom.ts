const CREATE_ROOM_ENDPOINT = '/api/rooms';

export interface CreateRoomRequest {
  name: string;
  url: string;
  note?: string;
}

export interface CreateRoomResponse {
  roomId: string;
  shareUrl: string;
  reviewPath: string;
}

export interface CreateRoomFieldErrors {
  name?: string;
  url?: string;
  note?: string;
}

export interface CreateRoomApiError {
  message: string;
  fieldErrors?: CreateRoomFieldErrors;
}

function normalizeCreateRoomResponse(data: unknown): CreateRoomResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Create room response was not an object.');
  }

  const candidate = data as Partial<CreateRoomResponse>;

  if (
    typeof candidate.roomId !== 'string' ||
    typeof candidate.shareUrl !== 'string' ||
    typeof candidate.reviewPath !== 'string'
  ) {
    throw new Error('Create room response is missing expected fields.');
  }

  return {
    roomId: candidate.roomId,
    shareUrl: candidate.shareUrl,
    reviewPath: candidate.reviewPath,
  };
}

function normalizeCreateRoomError(data: unknown, fallbackMessage: string): CreateRoomApiError {
  if (typeof data !== 'object' || data === null) {
    return { message: fallbackMessage };
  }

  const candidate = data as Partial<CreateRoomApiError>;

  return {
    message: typeof candidate.message === 'string' ? candidate.message : fallbackMessage,
    fieldErrors:
      typeof candidate.fieldErrors === 'object' && candidate.fieldErrors !== null
        ? candidate.fieldErrors
        : undefined,
  };
}

export async function createRoom(payload: CreateRoomRequest): Promise<CreateRoomResponse> {
  const response = await fetch(CREATE_ROOM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorPayload: unknown = null;

    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = null;
    }

    throw normalizeCreateRoomError(errorPayload, 'Unable to create room right now.');
  }

  const data: unknown = await response.json();
  return normalizeCreateRoomResponse(data);
}