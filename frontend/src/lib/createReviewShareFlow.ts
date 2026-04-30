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

  return createRoom(input);
}

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (isMockMode()) {
    return mockGetRoom(roomId);
  }

  return getRoom(roomId);
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (isMockMode()) {
    return mockListComments(roomId, signal);
  }

  // Adapter note: the comment lib still accepts `shareId` in its public request
  // shape for compatibility, but live create/review now treats that value as the
  // canonical room ID from the visible v1 backend contract.
  return listComments(roomId, signal);
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (isMockMode()) {
    return mockCreateComment(input);
  }

  // Adapter note: `input.shareId` is preserved for current consumers. In live
  // create/review mode it is forwarded as the room identifier because only
  // room-scoped comment endpoints are contract-visible today.
  return createComment(input);
}