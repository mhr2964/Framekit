export const API_V1_BASE_PATH = "/api/v1";

export type ApiErrorCode =
  | "INVALID_JSON"
  | "INVALID_NAME"
  | "INVALID_FRAME_URL"
  | "INVALID_CREATED_BY"
  | "ROOM_NOT_FOUND"
  | "MISSING_ROOM_ID"
  | "INVALID_ROOM_ID"
  | "MISSING_SHARE_ID"
  | "INVALID_SHARE_ID"
  | "INVALID_BODY"
  | "SHARE_LINK_NOT_FOUND"
  | "INVALID_AUTHOR"
  | "INVALID_POSITION";

export interface ErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface PersonName {
  name: string;
}

export interface CommentPosition {
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  frameUrl: string;
  createdAt: string;
  createdBy?: PersonName;
  commentCount: number;
}

export interface ShareLinkRoom {
  id: string;
  name: string;
  frameUrl: string;
}

export interface ShareLink {
  id: string;
  room: ShareLinkRoom;
  createdAt: string;
}

export interface Comment {
  id: string;
  roomId: string;
  body: string;
  author?: PersonName;
  position?: CommentPosition;
  createdAt: string;
}

export interface CreateRoomRequest {
  name: string;
  frameUrl: string;
  createdBy?: PersonName;
}

export interface CreateRoomResponse {
  room: Room;
}

export interface GetRoomResponse {
  room: Room;
}

export interface GetShareLinkResponse {
  shareLink: ShareLink;
}

export interface ListCommentsQuery {
  roomId: string;
}

export interface ListCommentsResponse {
  comments: Comment[];
}

export interface CreateCommentRequest {
  roomId: string;
  body: string;
  author?: PersonName;
  position?: CommentPosition;
}

export interface CreateCommentResponse {
  comment: Comment;
}

export interface CreateShareLinkCommentRequest {
  body: string;
  author?: PersonName;
  position?: CommentPosition;
}

export interface RequestContext<TBody = undefined, TParams = undefined, TQuery = undefined> {
  body?: TBody;
  params?: TParams;
  query?: TQuery;
}

export interface EndpointResult<TSuccess> {
  status: number;
  body: TSuccess | ErrorResponse;
}