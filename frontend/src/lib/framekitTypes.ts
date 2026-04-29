export type RoomAccessMode = 'invite-only' | 'link';

export type RoomCreateValues = {
  roomName: string;
  clientName: string;
  projectSummary: string;
  dueDate: string;
  accessMode: RoomAccessMode;
};

export type CreateRoomResult = {
  roomId: string;
  shareLink: string;
  createdAt: string;
};

export type ReviewCommentStatus = 'open' | 'resolved';

export type ReviewComment = {
  id: string;
  authorName: string;
  authorRole: string;
  timestampLabel: string;
  anchorLabel: string;
  body: string;
  status: ReviewCommentStatus;
};

export type ReviewVersion = {
  id: string;
  label: string;
  state: 'current' | 'previous';
};

export type ReviewAsset = {
  id: string;
  name: string;
  kind: string;
  updatedLabel: string;
  sizeLabel: string;
};

export type ReviewRoomStatus = 'awaiting-feedback' | 'in-review' | 'approved';

export type ReviewRoomData = {
  roomId: string;
  roomName: string;
  clientName: string;
  summary: string;
  shareLink: string;
  decisionLabel: string;
  roomStatus: ReviewRoomStatus;
  versions: ReviewVersion[];
  assets: ReviewAsset[];
  comments: ReviewComment[];
};

export type AddCommentInput = {
  roomId: string;
  message: string;
};

export type AddCommentResult = {
  comment: ReviewComment;
};