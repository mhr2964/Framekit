const COMMENT_ROUTE = '/api/v1/comment';

export interface CommentPosition {
  x: number;
  y: number;
}

export interface ReviewComment {
  id: string;
  roomId: string;
  body: string;
  createdAt: string;
  author?: {
    name: string;
  };
  position?: CommentPosition;
}

export interface ListCommentsResponse {
  comments: ReviewComment[];
}

export interface CreateCommentRequest {
  roomId: string;
  body: string;
  author?: {
    name: string;
  };
  position?: CommentPosition;
}

export interface CreateCommentResponse {
  comment: ReviewComment;
}

export interface CreateCommentApiError {
  message: string;
  code?: string;
  fieldErrors?: {
    roomId?: string;
    body?: string;
    author?: string;
    position?: string;
  };
}

function normalizeCommentPosition(value: unknown): CommentPosition | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const position = value as { x?: unknown; y?: unknown };

  if (typeof position.x !== 'number' || typeof position.y !== 'number') {
    return undefined;
  }

  return {
    x: position.x,
    y: position.y,
  };
}

function normalizeAuthor(value: unknown): { name: string } | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const author = value as { name?: unknown };

  if (typeof author.name !== 'string') {
    return undefined;
  }

  return { name: author.name };
}

function normalizeComment(data: unknown): ReviewComment {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Comment payload was not an object.');
  }

  const comment = data as {
    id?: unknown;
    roomId?: unknown;
    body?: unknown;
    createdAt?: unknown;
    author?: unknown;
    position?: unknown;
  };

  if (
    typeof comment.id !== 'string' ||
    typeof comment.roomId !== 'string' ||
    typeof comment.body !== 'string' ||
    typeof comment.createdAt !== 'string'
  ) {
    throw new Error('Comment payload is missing expected fields.');
  }

  return {
    id: comment.id,
    roomId: comment.roomId,
    body: comment.body,
    createdAt: comment.createdAt,
    author: normalizeAuthor(comment.author),
    position: normalizeCommentPosition(comment.position),
  };
}

function normalizeListCommentsResponse(data: unknown): ListCommentsResponse {
  if (typeof data !== 'object' || data === null || !('comments' in data)) {
    throw new Error('List comments response is missing the comments payload.');
  }

  const comments = (data as { comments?: unknown }).comments;

  if (!Array.isArray(comments)) {
    throw new Error('Comments payload was not an array.');
  }

  return {
    comments: comments.map(normalizeComment),
  };
}

function normalizeCreateCommentResponse(data: unknown): CreateCommentResponse {
  if (typeof data !== 'object' || data === null || !('comment' in data)) {
    throw new Error('Create comment response is missing the comment payload.');
  }

  return {
    comment: normalizeComment((data as { comment: unknown }).comment),
  };
}

function mapErrorCodeToFieldErrors(code?: string): CreateCommentApiError['fieldErrors'] {
  switch (code) {
    case 'INVALID_ROOM_ID':
    case 'ROOM_NOT_FOUND':
      return { roomId: 'We could not find that review room.' };
    case 'INVALID_BODY':
      return { body: 'Add a comment before sending.' };
    case 'INVALID_AUTHOR':
      return { author: 'Author name must be 1 to 80 characters.' };
    case 'INVALID_POSITION':
      return { position: 'Comment position must include numeric x and y coordinates.' };
    default:
      return undefined;
  }
}

function normalizeCreateCommentError(
  data: unknown,
  fallbackMessage: string,
): CreateCommentApiError {
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

export async function listComments(
  roomId: string,
  signal?: AbortSignal,
): Promise<ListCommentsResponse> {
  const url = new URL(COMMENT_ROUTE, window.location.origin);
  url.searchParams.set('roomId', roomId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    let message = 'We could not load comments right now.';

    try {
      const data = await response.json();
      if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof data.error === 'object' &&
        data.error !== null &&
        typeof (data.error as { message?: unknown }).message === 'string'
      ) {
        message = (data.error as { message: string }).message;
      }
    } catch {
      // awaiting sync: backend HTTP handler may still return non-JSON errors
    }

    throw new Error(message);
  }

  const data: unknown = await response.json();
  return normalizeListCommentsResponse(data);
}

export async function createComment(
  input: CreateCommentRequest,
): Promise<CreateCommentResponse> {
  const response = await fetch(COMMENT_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      // awaiting sync: backend HTTP handler may still return non-JSON errors
    }

    throw normalizeCreateCommentError(data, 'We could not save your comment right now.');
  }

  const data: unknown = await response.json();
  return normalizeCreateCommentResponse(data);
}