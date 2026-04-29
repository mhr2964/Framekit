import { mockReviewRoom } from './framekitMockData';
import type {
  AddCommentInput,
  AddCommentResult,
  CreateRoomResult,
  ReviewComment,
  ReviewRoomData,
  RoomCreateValues,
} from './framekitTypes';

const CREATE_DELAY_MS = 700;
const REVIEW_DELAY_MS = 450;
const COMMENT_DELAY_MS = 350;

function wait(delayMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function shouldSimulateError(text: string) {
  return text.toLowerCase().includes('error');
}

function buildRoomId(roomName: string) {
  const slug = roomName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug ? `room-${slug}` : 'room-new-review';
}

function buildTimestampLabel() {
  const now = new Date();
  return `Today at ${now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function cloneRoom(room: ReviewRoomData): ReviewRoomData {
  return {
    ...room,
    versions: room.versions.map((version) => ({ ...version })),
    assets: room.assets.map((asset) => ({ ...asset })),
    comments: room.comments.map((comment) => ({ ...comment })),
  };
}

let reviewRoomStore: ReviewRoomData = cloneRoom(mockReviewRoom);

export async function createRoom(values: RoomCreateValues): Promise<CreateRoomResult> {
  await wait(CREATE_DELAY_MS);

  if (shouldSimulateError(values.roomName) || shouldSimulateError(values.clientName)) {
    throw new Error('We could not create the room right now. Please try again in a moment.');
  }

  const roomId = buildRoomId(values.roomName);

  reviewRoomStore = {
    ...cloneRoom(mockReviewRoom),
    roomId,
    roomName: values.roomName.trim(),
    clientName: values.clientName.trim(),
    summary: values.projectSummary.trim() || mockReviewRoom.summary,
    shareLink: `framekit.app/r/${roomId.replace(/^room-/, '')}`,
    decisionLabel: values.dueDate
      ? `Feedback requested by ${values.dueDate}`
      : 'Share when ready for the first review pass',
  };

  return {
    roomId,
    shareLink: reviewRoomStore.shareLink,
    createdAt: new Date().toISOString(),
  };
}

export async function getReviewRoom(roomId?: string): Promise<ReviewRoomData> {
  await wait(REVIEW_DELAY_MS);

  if (roomId && roomId !== reviewRoomStore.roomId) {
    return {
      ...cloneRoom(reviewRoomStore),
      roomId,
      roomName: 'Client review room',
      shareLink: `framekit.app/r/${roomId.replace(/^room-/, '')}`,
    };
  }

  return cloneRoom(reviewRoomStore);
}

export async function addReviewComment(input: AddCommentInput): Promise<AddCommentResult> {
  await wait(COMMENT_DELAY_MS);

  if (shouldSimulateError(input.message)) {
    throw new Error('Your comment could not be posted. Please try a shorter note.');
  }

  const comment: ReviewComment = {
    id: `c${reviewRoomStore.comments.length + 1}`,
    authorName: 'You',
    authorRole: 'Reviewer',
    timestampLabel: buildTimestampLabel(),
    anchorLabel: 'General feedback',
    body: input.message.trim(),
    status: 'open',
  };

  reviewRoomStore = {
    ...reviewRoomStore,
    roomStatus: 'in-review',
    comments: [comment, ...reviewRoomStore.comments],
  };

  return {
    comment,
  };
}