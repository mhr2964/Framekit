import {
  getMockSharePath,
  mockCreateComment,
  mockCreateRoom,
  mockGetRoom,
  mockListComments,
  type FlowCreateCommentRequest,
  type FlowCreateCommentResponse,
  type FlowCreateRoomRequest,
  type FlowCreateRoomResponse,
  type FlowGetRoomResponse,
  type FlowListCommentsResponse,
} from './mockCreateReviewShare';

export type CreateReviewShareDataMode = 'mock';

const CREATE_REVIEW_SHARE_DATA_MODE: CreateReviewShareDataMode = 'mock';

export type { FlowCreateCommentRequest, FlowCreateRoomRequest };

export async function createRoomForFlow(
  input: FlowCreateRoomRequest,
): Promise<FlowCreateRoomResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockCreateRoom(input);
  }

  // TODO: stitch to backend POST /api/v1/rooms here.
  throw new Error('Create room flow is not configured.');
}

export async function getRoomForFlow(roomId: string): Promise<FlowGetRoomResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockGetRoom(roomId);
  }

  // TODO: stitch to backend GET /api/v1/rooms/:roomId here.
  throw new Error('Get room flow is not configured.');
}

export async function listCommentsForFlow(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockListComments(roomId, signal);
  }

  // TODO: stitch to backend GET room-scoped comments here.
  // Suggested target: GET /api/v1/comments?roomId=:roomId
  throw new Error('List comments flow is not configured.');
}

export async function createCommentForFlow(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  if (CREATE_REVIEW_SHARE_DATA_MODE === 'mock') {
    return mockCreateComment(input);
  }

  // TODO: stitch to backend POST room-scoped comments here.
  // Suggested target: POST /api/v1/comments
  throw new Error('Create comment flow is not configured.');
}

export function getSharePathForFlow(roomId: string) {
  return getMockSharePath(roomId);
}