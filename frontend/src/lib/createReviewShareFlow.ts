import {
  type CreateCommentRequest as FlowCreateCommentRequest,
  type CreateCommentResponse as FlowCreateCommentResponse,
  type GetRoomResponse as FlowGetRoomResponse,
  type ListCommentsResponse as FlowListCommentsResponse,
} from './comments';
import { CREATE_REVIEW_SHARE_DATA_MODE } from './createReviewShareConstants';
import {
  createComment as mockCreateComment,
  getRoom as mockGetRoom,
  listComments as mockListComments,
} from './mockCreateReviewShare';

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockGetRoom(roomId);
  }

  // TODO: stitch to canonical backend GET /api/v1/share-links/:shareId here,
  // while preserving the current mocked-first `{ room }` return shape.
  throw new Error('Get room flow is not configured.');
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockListComments(roomId, signal);
  }

  // TODO: stitch to canonical backend GET /api/v1/share-links/:shareId here,
  // projecting that payload back to the current `{ comments }` shape.
  throw new Error('List comments flow is not configured.');
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockCreateComment(input);
  }

  // TODO: stitch to canonical backend
  // POST /api/v1/share-links/:shareId/comments here, preserving the current
  // `{ comment }` response shape expected by the mocked-first UI.
  throw new Error('Create comment flow is not configured.');
}