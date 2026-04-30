// SCAFFOLD STUB: Flow-layer transport is blocked pending canonical contract.
// BLOCKED ON: Endpoint definitions in shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
// Adapter seam: preserves mock vs. live routing; live calls currently throw.
// Once contract is visible, replace live endpoint calls in comments.ts, createRoom.ts,
// and getRoom.ts; this file's routing logic requires no changes.

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

  // TODO: Live createRoom wiring blocked on contract.
  // BLOCKED: endpoint path, method, request body field names in
  // shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
  return createRoom(input);
}

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (isMockMode()) {
    return mockGetRoom(roomId);
  }

  // TODO: Live getRoom wiring blocked on contract.
  // BLOCKED: endpoint path, method, param name (roomId vs shareId?), response shape in
  // shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
  return getRoom(roomId);
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (isMockMode()) {
    return mockListComments(roomId, signal);
  }

  // TODO: Live listComments wiring blocked on contract.
  // BLOCKED: endpoint path, method, query/route params, response shape in
  // shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
  return listComments(roomId, signal);
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (isMockMode()) {
    return mockCreateComment(input);
  }

  // TODO: Live createComment wiring blocked on contract.
  // BLOCKED: endpoint path, method, request body field names, response shape in
  // shared/contracts/CREATE_REVIEW_SHARE_CONTRACT.md
  // Note: input.shareId must be clarified as roomId or share-link ID in contract.
  return createComment(input);
}