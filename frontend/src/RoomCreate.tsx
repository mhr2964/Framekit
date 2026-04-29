'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  CREATE_REVIEW_SHARE_LIMITS,
  CREATE_REVIEW_SHARE_STATUS,
  CREATE_REVIEW_SHARE_STRINGS,
} from './lib/createReviewShareConstants';
import {
  createRoom,
  type CreateRoomApiError,
  type CreateRoomFieldErrors,
  type CreateRoomRequest,
  type CreateRoomResponse,
} from './lib/createRoom';

interface CreateRoomFormValues {
  name: string;
  frameUrl: string;
  createdBy: string;
}

type CreateRoomStatus =
  (typeof CREATE_REVIEW_SHARE_STATUS.create)[keyof typeof CREATE_REVIEW_SHARE_STATUS.create];

const INITIAL_VALUES: CreateRoomFormValues = {
  name: '',
  frameUrl: '',
  createdBy: '',
};

const ROOM_NAME_MAX_LENGTH = CREATE_REVIEW_SHARE_LIMITS.roomNameMaxLength;
const CREATOR_NAME_MAX_LENGTH = CREATE_REVIEW_SHARE_LIMITS.creatorNameMaxLength;

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateValues(values: CreateRoomFormValues): CreateRoomFieldErrors {
  const fieldErrors: CreateRoomFieldErrors = {};
  const trimmedName = values.name.trim();
  const trimmedFrameUrl = values.frameUrl.trim();
  const trimmedCreatedBy = values.createdBy.trim();

  if (!trimmedName) {
    fieldErrors.name = 'Add a room name so reviewers know what they are opening.';
  } else if (trimmedName.length > ROOM_NAME_MAX_LENGTH) {
    fieldErrors.name = 'Add a room name using 1 to 120 characters.';
  }

  if (!trimmedFrameUrl) {
    fieldErrors.frameUrl = 'Paste the link you want people to review.';
  } else if (!isValidHttpUrl(trimmedFrameUrl)) {
    fieldErrors.frameUrl = 'Enter a valid link starting with http:// or https://.';
  }

  if (trimmedCreatedBy.length > CREATOR_NAME_MAX_LENGTH) {
    fieldErrors.createdBy = 'Creator name must be 1 to 80 characters.';
  }

  return fieldErrors;
}

function hasFieldErrors(fieldErrors: CreateRoomFieldErrors) {
  return Boolean(fieldErrors.name || fieldErrors.frameUrl || fieldErrors.createdBy);
}

function toRequest(values: CreateRoomFormValues): CreateRoomRequest {
  const trimmedCreatedBy = values.createdBy.trim();

  return {
    name: values.name.trim(),
    frameUrl: values.frameUrl.trim(),
    createdBy: trimmedCreatedBy ? { name: trimmedCreatedBy } : undefined,
  };
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return CREATE_REVIEW_SHARE_STRINGS.create.submitErrorFallback;
}

function getFieldErrors(error: unknown): CreateRoomFieldErrors {
  if (
    typeof error === 'object' &&
    error !== null &&
    'fieldErrors' in error &&
    typeof error.fieldErrors === 'object' &&
    error.fieldErrors !== null
  ) {
    return error.fieldErrors as CreateRoomApiError['fieldErrors'];
  }

  return {};
}

export function RoomCreate() {
  const [values, setValues] = useState<CreateRoomFormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<CreateRoomFieldErrors>({});
  const [status, setStatus] = useState<CreateRoomStatus>(CREATE_REVIEW_SHARE_STATUS.create.idle);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CreateRoomResponse | null>(null);

  function updateValue<K extends keyof CreateRoomFormValues>(key: K, value: CreateRoomFormValues[K]) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));

    if (
      status === CREATE_REVIEW_SHARE_STATUS.create.error ||
      status === CREATE_REVIEW_SHARE_STATUS.create.invalid
    ) {
      setStatus(CREATE_REVIEW_SHARE_STATUS.create.idle);
      setErrorMessage(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = validateValues(values);

    if (hasFieldErrors(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors);
      setStatus(CREATE_REVIEW_SHARE_STATUS.create.invalid);
      setErrorMessage(CREATE_REVIEW_SHARE_STRINGS.create.validationSummary);
      return;
    }

    setStatus(CREATE_REVIEW_SHARE_STATUS.create.submitting);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const createdRoom = await createRoom(toRequest(values));
      setResult(createdRoom);
      setStatus(CREATE_REVIEW_SHARE_STATUS.create.success);
    } catch (error) {
      setStatus(CREATE_REVIEW_SHARE_STATUS.create.error);
      setErrorMessage(getErrorMessage(error));
      setFieldErrors(getFieldErrors(error));
    }
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setFieldErrors({});
    setStatus(CREATE_REVIEW_SHARE_STATUS.create.idle);
    setErrorMessage(null);
    setResult(null);
  }

  if (status === CREATE_REVIEW_SHARE_STATUS.create.success && result) {
    const reviewPath = `/review/${result.room.id}`;

    return (
      <section className="create-card create-success-card" aria-labelledby="create-success-title">
        <span className="eyebrow">Room ready</span>
        <h1 id="create-success-title">Your review room is ready to share.</h1>
        <p className="section-copy">
          Send the review link to your client or open the room now to confirm everything looks
          right.
        </p>

        <dl className="result-list">
          <div>
            <dt>Room ID</dt>
            <dd>{result.room.id}</dd>
          </div>
          <div>
            <dt>Room name</dt>
            <dd>{result.room.name}</dd>
          </div>
          <div>
            <dt>Review link</dt>
            <dd className="share-url">{reviewPath}</dd>
          </div>
        </dl>

        <div className="hero-actions">
          <Link className="primary-link-button" href={reviewPath}>
            Open review room
          </Link>
          <button className="secondary-button" type="button" onClick={handleReset}>
            Create another room
          </button>
        </div>
      </section>
    );
  }

  const isSubmitting = status === CREATE_REVIEW_SHARE_STATUS.create.submitting;
  const isInvalid = status === CREATE_REVIEW_SHARE_STATUS.create.invalid;
  const isFailure = status === CREATE_REVIEW_SHARE_STATUS.create.error;
  const nextFieldErrors = validateValues(values);
  const showInvalidHint = !isSubmitting && hasFieldErrors(nextFieldErrors);

  return (
    <section className="create-layout">
      <article className="create-card">
        <span className="eyebrow">{CREATE_REVIEW_SHARE_STRINGS.create.eyebrow}</span>
        <h1>{CREATE_REVIEW_SHARE_STRINGS.create.title}</h1>
        <p className="section-copy">{CREATE_REVIEW_SHARE_STRINGS.create.intro}</p>

        <form className="create-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>{CREATE_REVIEW_SHARE_STRINGS.create.roomNameLabel}</span>
            <input
              aria-invalid={fieldErrors.name ? 'true' : 'false'}
              autoComplete="off"
              className={fieldErrors.name ? 'field-input field-input-error' : 'field-input'}
              disabled={isSubmitting}
              maxLength={ROOM_NAME_MAX_LENGTH}
              name="name"
              onChange={(event) => updateValue('name', event.target.value)}
              placeholder={CREATE_REVIEW_SHARE_STRINGS.create.roomNamePlaceholder}
              type="text"
              value={values.name}
            />
            {fieldErrors.name ? <small className="field-error">{fieldErrors.name}</small> : null}
          </label>

          <label className="field">
            <span>{CREATE_REVIEW_SHARE_STRINGS.create.workLinkLabel}</span>
            <input
              aria-invalid={fieldErrors.frameUrl ? 'true' : 'false'}
              autoComplete="url"
              className={fieldErrors.frameUrl ? 'field-input field-input-error' : 'field-input'}
              disabled={isSubmitting}
              name="frameUrl"
              onChange={(event) => updateValue('frameUrl', event.target.value)}
              placeholder={CREATE_REVIEW_SHARE_STRINGS.create.workLinkPlaceholder}
              type="url"
              value={values.frameUrl}
            />
            {fieldErrors.frameUrl ? (
              <small className="field-error">{fieldErrors.frameUrl}</small>
            ) : null}
          </label>

          <label className="field">
            <span>{CREATE_REVIEW_SHARE_STRINGS.create.creatorNameLabel}</span>
            <input
              aria-invalid={fieldErrors.createdBy ? 'true' : 'false'}
              autoComplete="name"
              className={fieldErrors.createdBy ? 'field-input field-input-error' : 'field-input'}
              disabled={isSubmitting}
              maxLength={CREATOR_NAME_MAX_LENGTH}
              name="createdBy"
              onChange={(event) => updateValue('createdBy', event.target.value)}
              placeholder={CREATE_REVIEW_SHARE_STRINGS.create.creatorNamePlaceholder}
              type="text"
              value={values.createdBy}
            />
            {fieldErrors.createdBy ? (
              <small className="field-error">{fieldErrors.createdBy}</small>
            ) : (
              <small className="field-hint">{CREATE_REVIEW_SHARE_STRINGS.create.creatorNameHint}</small>
            )}
          </label>

          {isSubmitting ? (
            <div className="form-message form-message-info" role="status" aria-live="polite">
              {CREATE_REVIEW_SHARE_STRINGS.create.submittingLabel}
            </div>
          ) : null}

          {isInvalid && errorMessage ? (
            <div className="form-message form-message-error" role="alert">
              <strong>{CREATE_REVIEW_SHARE_STRINGS.create.invalidTitle}</strong>
              <div>{errorMessage}</div>
            </div>
          ) : null}

          {isFailure && errorMessage ? (
            <div className="form-message form-message-error" role="alert">
              <strong>{CREATE_REVIEW_SHARE_STRINGS.create.failureTitle}</strong>
              <div>{errorMessage}</div>
            </div>
          ) : null}

          <div className="hero-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CREATE_REVIEW_SHARE_STRINGS.create.submitButtonBusy
                : isFailure
                  ? CREATE_REVIEW_SHARE_STRINGS.create.retryLabel
                  : CREATE_REVIEW_SHARE_STRINGS.create.submitButtonIdle}
            </button>
            <Link className="secondary-link" href="/">
              {CREATE_REVIEW_SHARE_STRINGS.create.backToHomeLabel}
            </Link>
          </div>

          {showInvalidHint ? (
            <small className="field-hint">{CREATE_REVIEW_SHARE_STRINGS.create.invalidHint}</small>
          ) : null}
        </form>
      </article>

      <aside className="create-side-panel" aria-label="Create room guidance">
        <div className="info-card">
          <span className="section-label">{CREATE_REVIEW_SHARE_STRINGS.create.guidanceTitle}</span>
          <p>{CREATE_REVIEW_SHARE_STRINGS.create.guidanceBody}</p>
        </div>
        <div className="info-card">
          <span className="section-label">{CREATE_REVIEW_SHARE_STRINGS.create.setupTitle}</span>
          <p>{CREATE_REVIEW_SHARE_STRINGS.create.setupBody}</p>
        </div>
      </aside>
    </section>
  );
}