// TODO: Canonical comment endpoints and request/response shapes are not yet
// visible in the published contract. This file is a scaffold stub.
// See: workspace/docs/contracts/ for the contract publication target.
// Blocked on: canonical binding spec in workspace/docs/contracts/create-review-share-binding-spec.md

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
  // TODO: Replace with canonical list-comments endpoint path once the binding
  // spec defines the list endpoint (method, path, query params, auth).
  throw new Error(
    'listComments: endpoint not yet wired. Awaiting canonical contract in workspace/docs/contracts/create-review-share-binding-spec.md',
  );
}

export async function createComment(input: CreateCommentRequest): Promise<CreateCommentResponse> {
  // TODO: Replace with canonical create-comment endpoint path once the binding
  // spec defines the create endpoint (method, path, request body shape, auth).
  throw new Error(
    'createComment: endpoint not yet wired. Awaiting canonical contract in workspace/docs/contracts/create-review-share-binding-spec.md',
  );
}