import { createShareLinkComment, SHARE_LINK_COMMENT_COLLECTION_PATH } from "./endpoints/comment";
import {
  GetRoomParams,
  ROOM_COLLECTION_PATH,
  ROOM_ITEM_PATH,
  SHARE_LINK_ITEM_PATH,
  createRoom,
  getRoomById,
  getShareLinkById,
} from "./endpoints/room";
import {
  getRoomRepository,
  getShareLinkCommentRepository,
  getShareLinkRepository,
} from "./rooms-memory-store";
import { EndpointResult } from "./contracts";

export { ROOM_COLLECTION_PATH, ROOM_ITEM_PATH, SHARE_LINK_ITEM_PATH, SHARE_LINK_COMMENT_COLLECTION_PATH };

export interface HttpRequest {
  body?: unknown;
  params?: Record<string, string | undefined>;
}

export interface HttpResponse {
  status: number;
  body: EndpointResult<unknown>["body"];
}

function toHttpResponse(result: EndpointResult<unknown>): HttpResponse {
  return {
    status: result.status,
    body: result.body,
  };
}

export async function handleCreateRoom(request: HttpRequest): Promise<HttpResponse> {
  const repository = getRoomRepository();
  const result = await createRoom(repository, request.body);

  return toHttpResponse(result);
}

function getRoomParamsFromRequest(request: HttpRequest): GetRoomParams {
  return {
    roomId: request.params?.roomId ?? "",
  };
}

export async function handleGetRoom(request: HttpRequest): Promise<HttpResponse> {
  const repository = getRoomRepository();
  const { roomId } = getRoomParamsFromRequest(request);
  const result = await getRoomById(repository, roomId);

  return toHttpResponse(result);
}

function getShareIdFromRequest(request: HttpRequest): string {
  return request.params?.shareId ?? "";
}

export async function handleGetShareLink(request: HttpRequest): Promise<HttpResponse> {
  const repository = getShareLinkRepository();
  const shareId = getShareIdFromRequest(request);
  const result = await getShareLinkById(repository, shareId);

  return toHttpResponse(result);
}

export async function handleCreateShareLinkComment(request: HttpRequest): Promise<HttpResponse> {
  const repository = getShareLinkCommentRepository();
  const shareId = getShareIdFromRequest(request);
  const result = await createShareLinkComment(repository, shareId, request.body);

  return toHttpResponse(result);
}