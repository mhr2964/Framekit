import { CreateRoomRequest, Room } from "./contracts";
import { RoomRepository } from "./endpoints/room";

const ROOM_ID_PREFIX = "room_";

function buildRoomId(sequence: number): string {
  return `${ROOM_ID_PREFIX}${sequence}`;
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

class InMemoryRoomRepository implements RoomRepository {
  private roomsById = new Map<string, Room>();

  private nextRoomSequence = 1;

  async createRoom(input: CreateRoomRequest): Promise<Room> {
    const normalizedInput = normalizeCreateRoomInput(input);
    const roomId = buildRoomId(this.nextRoomSequence);
    const room: Room = {
      id: roomId,
      name: normalizedInput.name,
      frameUrl: normalizedInput.frameUrl,
      createdAt: new Date().toISOString(),
      commentCount: 0,
      ...(normalizedInput.createdBy ? { createdBy: normalizedInput.createdBy } : {}),
    };

    this.roomsById.set(roomId, room);
    this.nextRoomSequence += 1;

    return room;
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    return this.roomsById.get(roomId) ?? null;
  }
}

let repositoryInstance: RoomRepository | null = null;

export function getRoomRepository(): RoomRepository {
  if (!repositoryInstance) {
    repositoryInstance = new InMemoryRoomRepository();
  }

  return repositoryInstance;
}