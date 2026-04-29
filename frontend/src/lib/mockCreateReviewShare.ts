export interface FlowRoomRecord {
  id: string;
  name: string;
  frameUrl: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  commentCount: number;
}

export interface FlowCommentRecord {
  id: string;
  roomId: string;
  body: string;
  createdAt: string;
  author?: {
    name: string;
  };
}

export interface FlowCreateRoomRequest {
  name: string;
  frameUrl: string;
  createdBy?: {
    name: string;
  };
}

export interface FlowCreateRoomResponse {
  room: FlowRoomRecord;
}

export interface FlowGetRoomResponse {
  room: FlowRoomRecord;
}

export interface FlowListCommentsResponse {
  comments: FlowCommentRecord[];
}

export interface FlowCreateCommentRequest {
  roomId: string;
  body: string;
  author?: {
    name: string;
  };
}

export interface FlowCreateCommentResponse {
  comment: FlowCommentRecord;
}

type MockStore = {
  rooms: Map<string, FlowRoomRecord>;
  commentsByRoomId: Map<string, FlowCommentRecord[]>;
};

const ROOM_ID_PREFIX = 'room_';
const COMMENT_ID_PREFIX = 'comment_';

function createOpaqueId(prefix: string) {
  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `${prefix}${timePart}${randomPart}`;
}

function cloneRoom(room: FlowRoomRecord): FlowRoomRecord {
  return {
    ...room,
    createdBy: room.createdBy ? { ...room.createdBy } : undefined,
  };
}

function cloneComment(comment: FlowCommentRecord): FlowCommentRecord {
  return {
    ...comment,
    author: comment.author ? { ...comment.author } : undefined,
  };
}

function createSeedStore(): MockStore {
  const seededRoomId = `${ROOM_ID_PREFIX}demoalpha01`;
  const seededRoom: FlowRoomRecord = {
    id: seededRoomId,
    name: 'Homepage concept review',
    frameUrl: 'https://example.com/prototype/homepage-v1',
    createdAt: new Date('2026-04-28T15:30:00.000Z').toISOString(),
    createdBy: { name: 'Avery from Framekit' },
    commentCount: 2,
  };

  const seededComments: FlowCommentRecord[] = [
    {
      id: `${COMMENT_ID_PREFIX}demo001`,
      roomId: seededRoomId,
      body: 'The opening section feels calm and clear. Could we make the primary action a little more obvious for first-time viewers?',
      createdAt: new Date('2026-04-28T15:45:00.000Z').toISOString(),
      author: { name: 'Mina' },
    },
    {
      id: `${COMMENT_ID_PREFIX}demo002`,
      roomId: seededRoomId,
      body: 'The overall direction feels strong. I would love a bit more reassurance near the share handoff.',
      createdAt: new Date('2026-04-28T16:10:00.000Z').toISOString(),
      author: { name: 'Jordan' },
    },
  ];

  return {
    rooms: new Map([[seededRoomId, seededRoom]]),
    commentsByRoomId: new Map([[seededRoomId, seededComments]]),
  };
}

const mockStore = createSeedStore();

function syncRoomCommentCount(roomId: string) {
  const room = mockStore.rooms.get(roomId);

  if (!room) {
    return;
  }

  const comments = mockStore.commentsByRoomId.get(roomId) ?? [];
  room.commentCount = comments.length;
}

function assertRoomExists(roomId: string) {
  if (!mockStore.rooms.has(roomId)) {
    const error = new Error('We could not find that review room.');
    Object.assign(error, { code: 'ROOM_NOT_FOUND' });
    throw error;
  }
}

function delay(durationMs = 120) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

export async function mockCreateRoom(
  input: FlowCreateRoomRequest,
): Promise<FlowCreateRoomResponse> {
  await delay();

  const roomId = createOpaqueId(ROOM_ID_PREFIX);
  const createdAt = new Date().toISOString();

  const room: FlowRoomRecord = {
    id: roomId,
    name: input.name.trim(),
    frameUrl: input.frameUrl.trim(),
    createdAt,
    createdBy: input.createdBy?.name?.trim()
      ? { name: input.createdBy.name.trim() }
      : undefined,
    commentCount: 0,
  };

  mockStore.rooms.set(roomId, room);
  mockStore.commentsByRoomId.set(roomId, []);

  return {
    room: cloneRoom(room),
  };
}

export async function mockGetRoom(roomId: string): Promise<FlowGetRoomResponse> {
  await delay();
  assertRoomExists(roomId);

  const room = mockStore.rooms.get(roomId);

  if (!room) {
    throw new Error('We could not load this room right now.');
  }

  syncRoomCommentCount(roomId);

  return {
    room: cloneRoom(room),
  };
}

export async function mockListComments(
  roomId: string,
  signal?: AbortSignal,
): Promise<FlowListCommentsResponse> {
  await delay();

  if (signal?.aborted) {
    const abortError = new Error('The request was aborted.');
    abortError.name = 'AbortError';
    throw abortError;
  }

  assertRoomExists(roomId);

  const comments = mockStore.commentsByRoomId.get(roomId) ?? [];

  return {
    comments: comments.map((comment) => cloneComment(comment)),
  };
}

export async function mockCreateComment(
  input: FlowCreateCommentRequest,
): Promise<FlowCreateCommentResponse> {
  await delay();
  assertRoomExists(input.roomId);

  const nextComment: FlowCommentRecord = {
    id: createOpaqueId(COMMENT_ID_PREFIX),
    roomId: input.roomId,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    author: input.author?.name?.trim() ? { name: input.author.name.trim() } : undefined,
  };

  const currentComments = mockStore.commentsByRoomId.get(input.roomId) ?? [];
  mockStore.commentsByRoomId.set(input.roomId, [nextComment, ...currentComments]);
  syncRoomCommentCount(input.roomId);

  return {
    comment: cloneComment(nextComment),
  };
}

export function getMockSharePath(roomId: string) {
  return `/review/${roomId}`;
}