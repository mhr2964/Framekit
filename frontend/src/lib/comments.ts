// SCAFFOLD STUB: Canonical comment transport contract is not yet visible.
// BLOCKED ON: Endpoint definitions in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
// Required contract elements:
//   - listComments endpoint path, method, query/route params, auth
//   - createComment endpoint path, method, request body shape, auth
//   - response envelope shape (e.g., { comments } vs { data } vs bare array)
//   - error response shape and code mappings
// Current file preserves types and adapter seam; live endpoints throw.

export interface ReviewComment {
  id: string;
  roomId: string;
  body: string;
  createdAt: string;
  author?: {
    name: string;
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface ListCommentsResponse {
  comments: ReviewComment[];
}

export interface CreateCommentRequest {
  shareId: string;
  body: string;
  author?: {
    name: string;
  };
}

export interface CreateCommentResponse {
  comment: ReviewComment;
}

export interface CommentApiError {
  message: string;
  code?: string;
}

function normalizeComment(data: unknown): ReviewComment {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Comment payload was not an object.');
  }

  const comment = data as Record<string, unknown>;

  if (
    typeof comment.id !== 'string' ||
    typeof comment.roomId !== 'string' ||
    typeof comment.body !== 'string' ||
    typeof comment.createdAt !== 'string'
  ) {
    throw new Error('Comment payload is missing expected fields.');
  }

  const normalizedComment: ReviewComment = {
    id: comment.id,
    roomId: comment.roomId,
    body: comment.body,
    createdAt: comment.createdAt,
  };

  if (
    typeof comment.author === 'object' &&
    comment.author !== null &&
    typeof (comment.author as { name?: unknown }).name === 'string'
  ) {
    normalizedComment.author = {
      name: (comment.author as { name: string }).name,
    };
  }

  if (
    typeof comment.position === 'object' &&
    comment.position !== null &&
    typeof (comment.position as { x?: unknown }).x === 'number' &&
    typeof (comment.position as { y?: unknown }).y === 'number'
  ) {
    normalizedComment.position = {
      x: (comment.position as { x: number }).x,
      y: (comment.position as { y: number }).y,
    };
  }

  return normalizedComment;
}

function normalizeListCommentsResponse(data: unknown): ListCommentsResponse {
  if (typeof data !== 'object' || data === null || !('comments' in data)) {
    throw new Error('List comments response is missing the comments payload.');
  }

  const comments = (data as { comments: unknown }).comments;

  if (!Array.isArray(comments)) {
    throw new Error('Comments payload must be an array.');
  }

  return {
    comments: comments.map((comment) => normalizeComment(comment)),
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

function normalizeCommentError(data: unknown, fallbackMessage: string): CommentApiError {
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

export async function listComments(
  shareId: string,
  signal?: AbortSignal,
): Promise<ListCommentsResponse> {
  // TODO: Wire to canonical list-comments endpoint.
  // BLOCKED: endpoint path, method, and query/route param names not yet visible.
  // Once contract is published, replace this with actual fetch call.
  throw new Error(
    'listComments: endpoint wiring blocked. Unblock with endpoint definition in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md',
  );
}

export async function createComment(input: CreateCommentRequest): Promise<CreateCommentResponse> {
  // TODO: Wire to canonical create-comment endpoint.
  // BLOCKED: endpoint path, method, request body field names not yet visible.
  // Once contract is published, replace this with actual fetch call.
  throw new Error(
    'createComment: endpoint wiring blocked. Unblock with endpoint definition in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md',
  );
}