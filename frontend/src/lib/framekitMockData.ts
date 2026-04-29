import type { ReviewRoomData } from './framekitTypes';

export const mockReviewRoom: ReviewRoomData = {
  roomId: 'room-q2-website-review',
  roomName: 'Q2 website review',
  clientName: 'Northwind Studio',
  summary:
    'Review the current landing page pass, leave precise comments in context, and keep approvals easy to follow.',
  shareLink: 'framekit.app/r/q2-website-review',
  decisionLabel: 'Feedback requested by Friday, May 10',
  roomStatus: 'in-review',
  versions: [
    { id: 'v3', label: 'Version 3 · Current', state: 'current' },
    { id: 'v2', label: 'Version 2', state: 'previous' },
    { id: 'v1', label: 'Version 1', state: 'previous' },
  ],
  assets: [
    {
      id: 'a1',
      name: 'Homepage concept',
      kind: 'Figma frame',
      updatedLabel: 'Updated 2 hours ago',
      sizeLabel: '1440 × 3200',
    },
    {
      id: 'a2',
      name: 'Mobile hero refinement',
      kind: 'Image export',
      updatedLabel: 'Updated yesterday',
      sizeLabel: '1179 × 2556',
    },
  ],
  comments: [
    {
      id: 'c1',
      authorName: 'Maya Chen',
      authorRole: 'Client lead',
      timestampLabel: 'Today at 10:14',
      anchorLabel: 'Hero headline',
      body:
        'The direction feels much calmer now. Could we try one version where the first line speaks more directly to operations teams?',
      status: 'open',
    },
    {
      id: 'c2',
      authorName: 'Noah Patel',
      authorRole: 'Designer',
      timestampLabel: 'Today at 11:02',
      anchorLabel: 'Pricing comparison',
      body:
        'I can tighten the table spacing here and bring the highlighted plan slightly forward so the recommendation reads more clearly.',
      status: 'open',
    },
    {
      id: 'c3',
      authorName: 'Ava Brooks',
      authorRole: 'Marketing',
      timestampLabel: 'Yesterday at 16:40',
      anchorLabel: 'Footer CTA',
      body:
        'This update answers the earlier concern well. Happy with the revised language and we can mark this as resolved.',
      status: 'resolved',
    },
  ],
};