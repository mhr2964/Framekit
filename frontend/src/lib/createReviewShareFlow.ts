import {
  createComment,
  type CreateCommentRequest as FlowCreateCommentRequest,
  type CreateCommentResponse as FlowCreateCommentResponse,
  listComments,
  type ListCommentsResponse as FlowListCommentsResponse,
} from './comments';
import { CREATE_REVIEW_SHARE_DATA_MODE } from './createReviewShareConstants';
import {
  createRoom,
  type CreateRoomRequest as FlowCreateRoomRequest,
  type CreateRoomResponse as FlowCreateRoomResponse,
} from './createRoom';
import { getRoom, type GetRoomResponse as FlowGetRoomResponse } from './getRoom';
import {
  createComment as mockCreateComment,
  createRoom as mockCreateRoom,
  getRoom as mockGetRoom,
  listComments as mockListComments,
} from './mockCreateReviewShare';

export type { FlowCreateCommentRequest, FlowCreateRoomRequest };

function isMockMode() {
  return CREATE_REVIEW_SHARE_DATA_MODE === 'mock';
}

export async function createRoomForFlow(
  input: FlowCreateRoomRequest,
): Promise<FlowCreateRoomResponse> {
  if (isMockMode()) {
    return mockCreateRoom(input);
  }

  // TODO: awaiting sync confirmation from backend HTTP handlers; locked route is POST /api/v1/room.
  return createRoom(input);
}

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (isMockMode()) {
    return mockGetRoom(roomId);
  }

  // TODO: awaiting sync confirmation from backend HTTP handlers; locked route is GET /api/v1/room/{roomId}.
  return getRoom(roomId);
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (isMockMode()) {
    return mockListComments(roomId, signal);
  }

  // TODO: awaiting sync confirmation from backend HTTP handlers; locked route is GET /api/v1/comment?roomId={roomId}.
  return listComments(roomId, signal);
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (isMockMode()) {
    return mockCreateComment(input);
  }

  // TODO: awaiting sync confirmation from backend HTTP handlers; locked route is POST /api/v1/comment.
  return createComment(input);
}