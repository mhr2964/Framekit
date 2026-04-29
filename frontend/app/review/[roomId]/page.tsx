'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ReviewInteractionPanel } from '../../../src/components/ReviewInteractionPanel';
import {
  getReviewShareFallbackExplanation,
  getReviewShareUrl,
  isShareUrlFallback,
} from '../../../src/lib/createReviewShareAdapter';
import {
  CREATE_REVIEW_SHARE_STATUS,
  CREATE_REVIEW_SHARE_STRINGS,
} from '../../../src/lib/createReviewShareConstants';
import { getRoom, type GetRoomResponse } from '../../../src/lib/getRoom';

type ReviewPageProps = {
  params: {
    roomId: string;
  };
};

type ReviewPageStatus = 'loading' | 'ready' | 'not-found' | 'error';
type ShareStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.share)[keyof typeof CREATE_REVIEW_SHARE_STATUS.share];

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'status' in error && error.status === 404) {
    return 'not-found';
  }

  return 'error';
}

export default function ReviewRoomPage({ params }: ReviewPageProps) {
  const { roomId } = params;
  const [status, setStatus] = useState<ReviewPageStatus>('loading');
  const [roomResponse, setRoomResponse] = useState<GetRoomResponse | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>(CREATE_REVIEW_SHARE_STATUS.share.idle);

  useEffect(() => {
    let isActive = true;

    async function loadRoom() {
      try {
        const response = await getRoom(roomId);

        if (!isActive) {
          return;
        }

        setRoomResponse(response);
        setStatus('ready');
      } catch (error) {
        if (!isActive) {
          return;
        }

        const nextStatus = getErrorMessage(error);
        setStatus(nextStatus);
      }
    }

    void loadRoom();

    return () => {
      isActive = false;
    };
  }, [roomId]);

  const room = roomResponse?.room ?? null;
  const shareUrl = useMemo(() => getReviewShareUrl(roomId, room?.shareUrl), [roomId, room?.shareUrl]);
  const shareFallbackExplanation = getReviewShareFallbackExplanation();
  const hasFallbackShareUrl = room !== null && isShareUrlFallback(roomId, room.shareUrl);
  const shouldShowShareFallbackExplanation =
    hasFallbackShareUrl || status !== 'ready' || room === null;

  useEffect(() => {
    if (hasFallbackShareUrl) {
      setShareStatus(CREATE_REVIEW_SHARE_STATUS.share.fallback);
      return;
    }

    setShareStatus(CREATE_REVIEW_SHARE_STATUS.share.idle);
  }, [hasFallbackShareUrl]);

  useEffect(() => {
    if (shareStatus !== CREATE_REVIEW_SHARE_STATUS.share.copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareStatus(
        hasFallbackShareUrl
          ? CREATE_REVIEW_SHARE_STATUS.share.fallback
          : CREATE_REVIEW_SHARE_STATUS.share.idle,
      );
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasFallbackShareUrl, shareStatus]);

  function handleShareReady() {
    setShareStatus(CREATE_REVIEW_SHARE_STATUS.share.copied);
  }

  if (status === 'loading') {
    return (
      <main className="create-layout">
        <section className="create-card">
          <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.review.eyebrow}</span>
          <h1>{CREATE_REVIEW_SHARE_STRINGS.review.arrivalTitle}</h1>
          <div className="form-message form-message-info" role="status" aria-live="polite">
            Loading this review room…
          </div>
          {shouldShowShareFallbackExplanation ? (
            <div className="form-message form-message-info" role="status" aria-live="polite">
              <strong>{shareFallbackExplanation.title}</strong>
              <div>{shareFallbackExplanation.body}</div>
              <small>{shareFallbackExplanation.originCaveat}</small>
              <small>{shareFallbackExplanation.restartCaveat}</small>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  if (status === 'not-found') {
    return (
      <main className="create-layout">
        <section className="create-card">
          <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.review.eyebrow}</span>
          <h1>{CREATE_REVIEW_SHARE_STRINGS.review.notFoundTitle}</h1>
          <p className="section-copy">{CREATE_REVIEW_SHARE_STRINGS.review.notFoundBody}</p>
          {shouldShowShareFallbackExplanation ? (
            <div className="form-message form-message-info" role="status" aria-live="polite">
              <strong>{shareFallbackExplanation.title}</strong>
              <div>{shareFallbackExplanation.body}</div>
              <small>{shareFallbackExplanation.originCaveat}</small>
              <small>{shareFallbackExplanation.restartCaveat}</small>
            </div>
          ) : null}
          <div className="hero-actions">
            <Link className="primary-link-button" href="/create">
              Create a new review room
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (status === 'error' || !room) {
    return (
      <main className="create-layout">
        <section className="create-card">
          <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.review.eyebrow}</span>
          <h1>{CREATE_REVIEW_SHARE_STRINGS.review.arrivalTitle}</h1>
          <div className="form-message form-message-error" role="alert">
            {CREATE_REVIEW_SHARE_STRINGS.review.loadErrorFallback}
          </div>
          {shouldShowShareFallbackExplanation ? (
            <div className="form-message form-message-info" role="status" aria-live="polite">
              <strong>{shareFallbackExplanation.title}</strong>
              <div>{shareFallbackExplanation.body}</div>
              <small>{shareFallbackExplanation.originCaveat}</small>
              <small>{shareFallbackExplanation.restartCaveat}</small>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="create-layout">
      <section className="create-card">
        <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.review.eyebrow}</span>
        <h1>{CREATE_REVIEW_SHARE_STRINGS.review.arrivalTitle}</h1>
        <p className="section-copy">{room.name}</p>

        <div className="info-card">
          <span className="section-label">{CREATE_REVIEW_SHARE_STRINGS.review.shareLabel}</span>
          <p className="share-url">{shareUrl}</p>
          <small className="field-hint">{CREATE_REVIEW_SHARE_STRINGS.review.shareHint}</small>
        </div>

        {shareStatus === CREATE_REVIEW_SHARE_STATUS.share.fallback ? (
          <div className="form-message form-message-info" role="status" aria-live="polite">
            <strong>{shareFallbackExplanation.title}</strong>
            <div>{shareFallbackExplanation.body}</div>
            <small>{shareFallbackExplanation.originCaveat}</small>
            <small>{shareFallbackExplanation.restartCaveat}</small>
          </div>
        ) : null}

        {shareStatus === CREATE_REVIEW_SHARE_STATUS.share.copied ? (
          <div className="form-message form-message-info" role="status" aria-live="polite">
            <strong>{CREATE_REVIEW_SHARE_STRINGS.share.successTitle}</strong>
            <div>{CREATE_REVIEW_SHARE_STRINGS.share.successBody}</div>
          </div>
        ) : null}

        <div className="hero-actions">
          <button className="primary-button" onClick={handleShareReady} type="button">
            Mark share link ready
          </button>
          <a className="secondary-link" href={room.frameUrl} rel="noreferrer" target="_blank">
            {CREATE_REVIEW_SHARE_STRINGS.review.openWorkLabel}
          </a>
        </div>
      </section>

      <ReviewInteractionPanel
        commentCount={room.commentCount}
        roomId={room.id}
        roomName={room.name}
      />
    </main>
  );
}