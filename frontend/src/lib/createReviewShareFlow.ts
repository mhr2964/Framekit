// TODO: Flow-layer transport wiring is blocked pending canonical contract
// visibility in workspace/docs/contracts/create-review-share-binding-spec.md
// This file preserves the adapter seam but does not invoke live endpoints.

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

  // TODO: Live mode blocked on canonical create-room contract.
  // Unblock with endpoint definition in create-review-share-binding-spec.md
  return createRoom(input);
}

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (isMockMode()) {
    return mockGetRoom(roomId);
  }

  // TODO: Live mode blocked on canonical get-room contract.
  // Unblock with endpoint definition in create-review-share-binding-spec.md
  return getRoom(roomId);
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (isMockMode()) {
    return mockListComments(roomId, signal);
  }

  // TODO: Live mode blocked on canonical list-comments contract.
  // Unblock with endpoint definition in create-review-share-binding-spec.md
  return listComments(roomId, signal);
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (isMockMode()) {
    return mockCreateComment(input);
  }

  // TODO: Live mode blocked on canonical create-comment contract.
  // Unblock with endpoint definition in create-review-share-binding-spec.md
  return createComment(input);
}