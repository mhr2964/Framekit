import { EndpointResult } from "./contracts";
import {
  GetRoomParams,
  ROOM_COLLECTION_PATH,
  ROOM_ITEM_PATH,
  createRoom,
  getRoomById,
} from "./endpoints/room";
import { getRoomRepository } from "./rooms-memory-store";

export { ROOM_COLLECTION_PATH, ROOM_ITEM_PATH };

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