import {
  COMMENT_COLLECTION_PATH,
  createComment,
  listComments,
} from "./endpoints/comment";
import {
  GetRoomParams,
  ROOM_COLLECTION_PATH,
  ROOM_ITEM_PATH,
  createRoom,
  getRoomById,
} from "./endpoints/room";
import {
  getCommentRepository,
  getRoomRepository,
} from "./rooms-memory-store";
import { EndpointResult } from "./contracts";

export { ROOM_COLLECTION_PATH, ROOM_ITEM_PATH, COMMENT_COLLECTION_PATH };

export interface HttpRequest {
  body?: unknown;
  params?: Record<string, string | undefined>;
  query?: Record<string, string | undefined>;
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

function getCommentQueryFromRequest(request: HttpRequest): string {
  return request.query?.roomId ?? "";
}

export async function handleGetRoom(request: HttpRequest): Promise<HttpResponse> {
  const repository = getRoomRepository();
  const { roomId } = getRoomParamsFromRequest(request);
  const result = await getRoomById(repository, roomId);

  return toHttpResponse(result);
}

export async function handleListComments(request: HttpRequest): Promise<HttpResponse> {
  const repository = getCommentRepository();
  const roomId = getCommentQueryFromRequest(request);
  const result = await listComments(repository, roomId);

  return toHttpResponse(result);
}

export async function handleCreateComment(request: HttpRequest): Promise<HttpResponse> {
  const repository = getCommentRepository();
  const result = await createComment(repository, request.body);

  return toHttpResponse(result);
}