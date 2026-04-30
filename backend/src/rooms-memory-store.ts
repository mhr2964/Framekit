import {
  Comment,
  CreateCommentRequest,
  CreateRoomRequest,
  Room,
  ShareLink,
} from "./contracts";
import { CommentRepository, ShareLinkCommentRepository } from "./endpoints/comment";
import { RoomRepository, ShareLinkRepository } from "./endpoints/room";

const ROOM_ID_PREFIX = "room_";
const SHARE_ID_PREFIX = "share_";
const COMMENT_ID_PREFIX = "comment_";

function buildEntityId(prefix: string, sequence: number): string {
  return `${prefix}${sequence}`;
}

function normalizeCreateRoomInput(input: CreateRoomRequest): CreateRoomRequest {
  const normalizedName = input.name.trim();
  const normalizedFrameUrl = input.frameUrl.trim();
  const normalizedCreatedByName = input.createdBy?.name.trim();

  return {
    name: normalizedName,
    frameUrl: normalizedFrameUrl,
    ...(normalizedCreatedByName
      ? {
          createdBy: {
            name: normalizedCreatedByName,
          },
        }
      : {}),
  };
}

class InMemoryRoomRepository implements RoomRepository, ShareLinkRepository, ShareLinkCommentRepository, CommentRepository {
  private roomsById = new Map<string, Room>();

  private shareLinksById = new Map<string, ShareLink>();

  private commentsByRoomId = new Map<string, Comment[]>();

  private nextRoomSequence = 1;

  private nextShareSequence = 1;

  private nextCommentSequence = 1;

  async createRoom(input: CreateRoomRequest): Promise<Room> {
    const normalizedInput = normalizeCreateRoomInput(input);
    const roomId = buildEntityId(ROOM_ID_PREFIX, this.nextRoomSequence);
    const room: Room = {
      id: roomId,
      name: normalizedInput.name,
      frameUrl: normalizedInput.frameUrl,
      createdAt: new Date().toISOString(),
      commentCount: 0,
      ...(normalizedInput.createdBy ? { createdBy: normalizedInput.createdBy } : {}),
    };

    const shareId = buildEntityId(SHARE_ID_PREFIX, this.nextShareSequence);
    const shareLink: ShareLink = {
      id: shareId,
      room: {
        id: room.id,
        name: room.name,
        frameUrl: room.frameUrl,
      },
      createdAt: room.createdAt,
    };

    this.roomsById.set(roomId, room);
    this.shareLinksById.set(shareId, shareLink);
    this.commentsByRoomId.set(roomId, []);
    this.nextRoomSequence += 1;
    this.nextShareSequence += 1;

    return room;
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    return this.roomsById.get(roomId) ?? null;
  }

  async getShareLinkById(shareId: string): Promise<ShareLink | null> {
    return this.shareLinksById.get(shareId) ?? null;
  }

  async roomExists(roomId: string): Promise<boolean> {
    return this.roomsById.has(roomId);
  }

  async listCommentsByRoomId(roomId: string): Promise<Comment[]> {
    const comments = this.commentsByRoomId.get(roomId) ?? [];
    return [...comments];
  }

  async createComment(input: CreateCommentRequest): Promise<Comment> {
    const room = this.roomsById.get(input.roomId);

    if (!room) {
      throw new Error("Cannot create comment for missing room");
    }

    const normalizedBody = input.body.trim();
    const normalizedAuthorName = input.author?.name.trim();
    const comment: Comment = {
      id: buildEntityId(COMMENT_ID_PREFIX, this.nextCommentSequence),
      roomId: room.id,
      body: normalizedBody,
      createdAt: new Date().toISOString(),
      ...(normalizedAuthorName ? { author: { name: normalizedAuthorName } } : {}),
      ...(input.position ? { position: input.position } : {}),
    };

    const existingComments = this.commentsByRoomId.get(room.id) ?? [];
    this.commentsByRoomId.set(room.id, [...existingComments, comment]);
    this.roomsById.set(room.id, {
      ...room,
      commentCount: room.commentCount + 1,
    });
    this.nextCommentSequence += 1;

    return comment;
  }

  async createCommentForShareLink(shareId: string, input: CreateCommentRequest): Promise<Comment | null> {
    const shareLink = this.shareLinksById.get(shareId);

    if (!shareLink) {
      return null;
    }

    const room = this.roomsById.get(shareLink.room.id);

    if (!room) {
      return null;
    }

    const comment: Comment = {
      id: buildEntityId(COMMENT_ID_PREFIX, this.nextCommentSequence),
      roomId: room.id,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
      ...(input.author ? { author: { name: input.author.name.trim() } } : {}),
      ...(input.position ? { position: input.position } : {}),
    };

    const existingComments = this.commentsByRoomId.get(room.id) ?? [];
    this.commentsByRoomId.set(room.id, [...existingComments, comment]);
    this.roomsById.set(room.id, {
      ...room,
      commentCount: room.commentCount + 1,
    });
    this.nextCommentSequence += 1;

    return comment;
  }
}

let repositoryInstance: InMemoryRoomRepository | null = null;

function getRepositoryInstance(): InMemoryRoomRepository {
  if (!repositoryInstance) {
    repositoryInstance = new InMemoryRoomRepository();
  }

  return repositoryInstance;
}

export function getRoomRepository(): RoomRepository {
  return getRepositoryInstance();
}

export function getShareLinkRepository(): ShareLinkRepository {
  return getRepositoryInstance();
}

export function getShareLinkCommentRepository(): ShareLinkCommentRepository {
  return getRepositoryInstance();
}

export function getCommentRepository(): CommentRepository {
  return getRepositoryInstance();
}