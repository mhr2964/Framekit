'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  CREATE_REVIEW_SHARE_LIMITS,
  CREATE_REVIEW_SHARE_STATUS,
  CREATE_REVIEW_SHARE_STRINGS,
} from '../lib/createReviewShareConstants';
import { createComment, listComments, type ReviewComment } from '../lib/comments';

const COMMENT_BODY_CHARACTER_LIMIT = CREATE_REVIEW_SHARE_LIMITS.commentBodyMaxLength;
const COMMENT_AUTHOR_CHARACTER_LIMIT = CREATE_REVIEW_SHARE_LIMITS.commentAuthorMaxLength;

type ReviewInteractionPanelProps = {
  roomId: string;
  roomName: string;
  commentCount: number;
};

type CommentLoadStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.comments)[keyof typeof CREATE_REVIEW_SHARE_STATUS.comments];
type CommentSubmitStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.comments)[keyof typeof CREATE_REVIEW_SHARE_STATUS.comments];

function formatCommentTimestamp(createdAt: string) {
  const timestamp = Date.parse(createdAt);

  if (Number.isNaN(timestamp)) {
    return 'Shared just now';
  }

  const now = Date.now();
  const differenceInMinutes = Math.round((now - timestamp) / 60000);

  if (differenceInMinutes < 1) {
    return 'Shared just now';
  }

  if (differenceInMinutes < 60) {
    return `Shared ${differenceInMinutes} minute${differenceInMinutes === 1 ? '' : 's'} ago`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `Shared ${differenceInHours} hour${differenceInHours === 1 ? '' : 's'} ago`;
  }

  return `Shared ${new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp)}`;
}

function getCommentAuthorLabel(authorName?: string) {
  if (!authorName) {
    return 'Guest note';
  }

  return `From ${authorName}`;
}

function getCommentAuthorMeta(authorName?: string) {
  if (!authorName) {
    return 'No name added';
  }

  return authorName;
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallbackMessage;
}

export function ReviewInteractionPanel({
  roomId,
  roomName,
  commentCount,
}: ReviewInteractionPanelProps) {
  const [draftBody, setDraftBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loadStatus, setLoadStatus] = useState<CommentLoadStatus>(
    CREATE_REVIEW_SHARE_STATUS.comments.idle,
  );
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<CommentSubmitStatus>(
    CREATE_REVIEW_SHARE_STATUS.comments.idle,
  );
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const loadCommentsForRoom = useCallback(
    async (signal?: AbortSignal) => {
      setLoadStatus(CREATE_REVIEW_SHARE_STATUS.comments.loading);

      try {
        const response = await listComments(roomId, signal);

        if (signal?.aborted) {
          return;
        }

        setComments(response.comments);
        setLoadStatus(CREATE_REVIEW_SHARE_STATUS.comments.ready);
        setLoadErrorMessage(null);
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        setLoadStatus(CREATE_REVIEW_SHARE_STATUS.comments.error);
        setLoadErrorMessage(
          getErrorMessage(error, CREATE_REVIEW_SHARE_STRINGS.comments.loadErrorFallback),
        );
      }
    },
    [roomId],
  );

  useEffect(() => {
    const abortController = new AbortController();

    void loadCommentsForRoom(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadCommentsForRoom]);

  const visibleCommentCount = comments.length > 0 ? comments.length : commentCount;
  const isSubmitting = submitStatus === CREATE_REVIEW_SHARE_STATUS.comments.submitting;
  const trimmedBody = draftBody.trim();
  const trimmedAuthor = authorName.trim();
  const hasComments = comments.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedBody) {
      setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.error);
      setSubmitErrorMessage(CREATE_REVIEW_SHARE_STRINGS.comments.emptyValidation);
      return;
    }

    setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.submitting);
    setSubmitErrorMessage(null);

    try {
      const response = await createComment({
        roomId,
        body: trimmedBody,
        author: trimmedAuthor ? { name: trimmedAuthor } : undefined,
      });

      setComments((currentComments) => [response.comment, ...currentComments]);
      setDraftBody('');
      setAuthorName('');
      setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.idle);
      setLoadStatus(CREATE_REVIEW_SHARE_STATUS.comments.ready);
      setLoadErrorMessage(null);
    } catch (error) {
      setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.error);
      setSubmitErrorMessage(
        getErrorMessage(error, CREATE_REVIEW_SHARE_STRINGS.comments.submitErrorFallback),
      );
    }
  }

  function handleDraftBodyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraftBody(event.target.value);
    setSubmitErrorMessage(null);

    if (submitStatus === CREATE_REVIEW_SHARE_STATUS.comments.error) {
      setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.idle);
    }
  }

  function handleAuthorNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAuthorName(event.target.value);
    setSubmitErrorMessage(null);

    if (submitStatus === CREATE_REVIEW_SHARE_STATUS.comments.error) {
      setSubmitStatus(CREATE_REVIEW_SHARE_STATUS.comments.idle);
    }
  }

  function handleRetryLoad() {
    void loadCommentsForRoom();
  }

  return (
    <section className="create-card" aria-labelledby="discussion-title">
      <div className="hero-actions">
        <div>
          <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.comments.sectionEyebrow}</span>
          <h2 id="discussion-title">Keep feedback clear and calm for {roomName}.</h2>
        </div>
        <div className="info-card">
          <span className="section-label">Comment count</span>
          <p>
            {visibleCommentCount} comment{visibleCommentCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {!hasComments && loadStatus !== CREATE_REVIEW_SHARE_STATUS.comments.error ? (
        <div className="info-card">
          <span className="section-label">
            {loadStatus === CREATE_REVIEW_SHARE_STATUS.comments.loading
              ? CREATE_REVIEW_SHARE_STRINGS.comments.loadingTitle
              : CREATE_REVIEW_SHARE_STRINGS.comments.emptyTitle}
          </span>
          <p>
            {loadStatus === CREATE_REVIEW_SHARE_STATUS.comments.loading
              ? CREATE_REVIEW_SHARE_STRINGS.comments.loadingBody
              : CREATE_REVIEW_SHARE_STRINGS.comments.emptyBody}
          </p>
        </div>
      ) : null}

      {loadStatus === CREATE_REVIEW_SHARE_STATUS.comments.error && loadErrorMessage ? (
        <div className="form-message form-message-error" role="alert">
          {loadErrorMessage}
          <div className="hero-actions">
            <button className="primary-button" onClick={handleRetryLoad} type="button">
              {CREATE_REVIEW_SHARE_STRINGS.comments.retryLabel}
            </button>
          </div>
        </div>
      ) : null}

      {loadStatus === CREATE_REVIEW_SHARE_STATUS.comments.ready && hasComments ? (
        <div className="create-form" aria-label="Comment thread">
          {comments.map((comment) => (
            <article className="info-card" key={comment.id}>
              <div className="hero-actions">
                <div>
                  <span className="section-label">
                    {getCommentAuthorLabel(comment.author?.name)}
                  </span>
                  <small className="field-meta">
                    {getCommentAuthorMeta(comment.author?.name)}
                  </small>
                </div>
                <small className="field-meta">{formatCommentTimestamp(comment.createdAt)}</small>
              </div>
              <p>{comment.body}</p>
            </article>
          ))}
        </div>
      ) : null}

      <form className="create-form" onSubmit={handleSubmit} noValidate>
        <label className="field" htmlFor="review-comment-body">
          <span>{CREATE_REVIEW_SHARE_STRINGS.comments.draftLabel}</span>
          <textarea
            className="field-input field-textarea"
            id="review-comment-body"
            maxLength={COMMENT_BODY_CHARACTER_LIMIT}
            name="body"
            onChange={handleDraftBodyChange}
            placeholder={CREATE_REVIEW_SHARE_STRINGS.comments.draftPlaceholder}
            rows={6}
            value={draftBody}
          />
          <small className="field-meta">
            {draftBody.length}/{COMMENT_BODY_CHARACTER_LIMIT}
          </small>
        </label>

        <label className="field" htmlFor="review-comment-author">
          <span>{CREATE_REVIEW_SHARE_STRINGS.comments.authorLabel}</span>
          <input
            className="field-input"
            id="review-comment-author"
            maxLength={COMMENT_AUTHOR_CHARACTER_LIMIT}
            name="author"
            onChange={handleAuthorNameChange}
            placeholder={CREATE_REVIEW_SHARE_STRINGS.comments.authorPlaceholder}
            type="text"
            value={authorName}
          />
          <small className="field-meta">
            {authorName.length}/{COMMENT_AUTHOR_CHARACTER_LIMIT}
          </small>
        </label>

        {isSubmitting ? (
          <div className="form-message form-message-info" role="status" aria-live="polite">
            {CREATE_REVIEW_SHARE_STRINGS.comments.submitPendingLabel}
          </div>
        ) : null}

        {submitStatus === CREATE_REVIEW_SHARE_STATUS.comments.error && submitErrorMessage ? (
          <div className="form-message form-message-error" role="alert">
            <strong>{CREATE_REVIEW_SHARE_STRINGS.comments.failureTitle}</strong>
            <div>{submitErrorMessage}</div>
          </div>
        ) : null}

        <div className="hero-actions">
          <button className="primary-button" disabled={isSubmitting || !trimmedBody} type="submit">
            {isSubmitting
              ? CREATE_REVIEW_SHARE_STRINGS.comments.submitBusy
              : CREATE_REVIEW_SHARE_STRINGS.comments.submitIdle}
          </button>
        </div>
      </form>
    </section>
  );
}