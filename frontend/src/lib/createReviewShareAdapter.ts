import {
  createCommentForFlow,
  createRoomForFlow,
  getRoomForFlow,
  getSharePathForFlow,
  listCommentsForFlow,
  type FlowCreateCommentRequest,
  type FlowCreateRoomRequest,
} from './createReviewShareFlow';
import { CREATE_REVIEW_SHARE_STRINGS } from './createReviewShareConstants';

export type { FlowCreateCommentRequest, FlowCreateRoomRequest };

export async function submitCreateRoomFlow(input: FlowCreateRoomRequest) {
  return createRoomForFlow(input);
}

export async function loadReviewRoomFlow(roomId: string) {
  return getRoomForFlow(roomId);
}

export async function loadRoomCommentsFlow(roomId: string, signal?: AbortSignal) {
  return listCommentsForFlow(roomId, signal);
}

export async function submitRoomCommentFlow(input: FlowCreateCommentRequest) {
  return createCommentForFlow(input);
}

export function getReviewSharePath(roomId: string) {
  return getSharePathForFlow(roomId);
}

export function getReviewShareOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return '';
}

export function getReviewShareUrl(roomId: string, shareUrl?: string | null) {
  const trimmedShareUrl = shareUrl?.trim();

  if (trimmedShareUrl) {
    return trimmedShareUrl;
  }

  const sharePath = getReviewSharePath(roomId);
  const origin = getReviewShareOrigin();

  if (!origin) {
    return sharePath;
  }

  return `${origin}${sharePath}`;
}

export function isShareUrlFallback(roomId: string, shareUrl?: string | null) {
  const trimmedShareUrl = shareUrl?.trim();

  if (trimmedShareUrl) {
    return false;
  }

  return getReviewShareUrl(roomId, shareUrl) === getReviewShareUrl(roomId);
}

export function getReviewShareOriginCaveat() {
  return CREATE_REVIEW_SHARE_STRINGS.share.absoluteOriginEnvCaveat;
}