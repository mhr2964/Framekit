export const CREATE_REVIEW_SHARE_STRINGS = {
  create: {
    eyebrow: 'Create a room',
    title: 'Start a focused client review.',
    intro:
      'Add the link you want reviewed and Framekit will move you straight into a calm review space that is ready to share.',
    submittingLabel: 'Preparing your review room…',
    submitButtonIdle: 'Create review room',
    submitButtonBusy: 'Creating room…',
    backToHomeLabel: 'Back to landing page',
    roomNameLabel: 'Room name',
    roomNamePlaceholder: 'Homepage concept review',
    workLinkLabel: 'Work link',
    workLinkPlaceholder: 'https://example.com/prototype',
    creatorNameLabel: 'Your name (optional)',
    creatorNamePlaceholder: 'Avery from Framekit',
    creatorNameHint: 'Optional, for a more personal share handoff.',
    guidanceTitle: 'What to expect',
    guidanceBody:
      'Framekit creates a review room and moves you directly into the share-ready review space.',
    setupTitle: 'Included in setup',
    setupBody:
      'This room stores the room name, the frame URL, and an optional creator name for a clean handoff.',
    submitErrorFallback: 'We could not create the room right now. Please try again.',
    validationSummary: 'Please fix the highlighted fields and try again.',
    invalidTitle: 'Please review the highlighted fields.',
    invalidHint: 'Complete the required details before creating the room.',
    failureTitle: 'We could not create this room just yet.',
    retryLabel: 'Try creating again',
  },
  review: {
    eyebrow: 'Review room',
    arrivalTitle: 'This review room is ready to share.',
    shareLabel: 'Share link',
    shareHint:
      'Send this link to your client when you are ready for calm, focused feedback.',
    openWorkLabel: 'Open shared work',
    notFoundTitle: 'We could not find that review room.',
    notFoundBody:
      'Please check the link or create a new room if this review was just getting started.',
    loadErrorFallback: 'We could not load this room right now.',
  },
  comments: {
    sectionEyebrow: 'Discussion',
    emptyTitle: 'Ready for the first note',
    emptyBody:
      'There are no comments yet. Add a calm, specific note to help this review get started.',
    loadingTitle: 'Loading comments',
    loadingBody: 'Pulling in the latest feedback for this room.',
    retryLabel: 'Retry comments',
    draftLabel: 'Draft comment',
    draftPlaceholder: 'Share a clear note for this frame.',
    authorLabel: 'Your name (optional)',
    authorPlaceholder: 'Avery from Framekit',
    submitIdle: 'Add comment',
    submitBusy: 'Sending…',
    submitPendingLabel: 'Sending your comment…',
    submitErrorFallback: 'We could not send that comment right now.',
    loadErrorFallback: 'We could not load comments right now.',
    emptyValidation: 'Add a comment before sending.',
    failureTitle: 'Your comment did not send.',
  },
  share: {
    relativePathPrefix: '/review/',
    copyUnavailableHint:
      'Use the link below for now; clipboard support can be added later without changing the share path.',
    absoluteOriginEnvName: 'NEXT_PUBLIC_APP_URL',
    absoluteOriginEnvCaveat:
      'Set NEXT_PUBLIC_APP_URL in production so share links resolve to the public app origin instead of a browser-derived fallback.',
    fallbackTitle: 'Share link fallback',
    fallbackBody:
      'This share link is being assembled from the current app origin because a room shareUrl was not provided.',
    successTitle: 'Share link ready',
    successBody: 'The share link is ready to send.',
  },
} as const;

export const CREATE_REVIEW_SHARE_LIMITS = {
  roomNameMaxLength: 120,
  creatorNameMaxLength: 80,
  commentBodyMaxLength: 2000,
  commentAuthorMaxLength: 80,
} as const;

export const CREATE_REVIEW_SHARE_STATUS = {
  create: {
    idle: 'idle',
    submitting: 'submitting',
    success: 'success',
    error: 'error',
    invalid: 'invalid',
  },
  comments: {
    idle: 'idle',
    loading: 'loading',
    ready: 'ready',
    error: 'error',
    submitting: 'submitting',
  },
  share: {
    idle: 'idle',
    fallback: 'fallback',
    copied: 'copied',
  },
} as const;

export type CreateReviewShareCreateStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.create)[keyof typeof CREATE_REVIEW_SHARE_STATUS.create];

export type CreateReviewShareCommentStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.comments)[keyof typeof CREATE_REVIEW_SHARE_STATUS.comments];

export type CreateReviewShareShareStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.share)[keyof typeof CREATE_REVIEW_SHARE_STATUS.share];

export function getCreateReviewSharePath(roomId: string) {
  return `${CREATE_REVIEW_SHARE_STRINGS.share.relativePathPrefix}${roomId}`;
}