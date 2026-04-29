'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  createRoom,
  type CreateRoomApiError,
  type CreateRoomFieldErrors,
  type CreateRoomRequest,
  type CreateRoomResponse,
} from './lib/createRoom';

interface CreateRoomFormValues {
  name: string;
  url: string;
  note: string;
}

type CreateRoomStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_VALUES: CreateRoomFormValues = {
  name: '',
  url: '',
  note: '',
};

const NOTE_CHARACTER_LIMIT = 280;

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

  if (!values.name.trim()) {
    fieldErrors.name = 'Add a room name so reviewers know what they are opening.';
  }

  if (!values.url.trim()) {
    fieldErrors.url = 'Paste the link you want people to review.';
  } else if (!isValidHttpUrl(values.url.trim())) {
    fieldErrors.url = 'Enter a complete URL starting with http:// or https://.';
  }

  if (values.note.length > NOTE_CHARACTER_LIMIT) {
    fieldErrors.note = `Keep the optional note under ${NOTE_CHARACTER_LIMIT} characters.`;
  }

  return fieldErrors;
}

function hasFieldErrors(fieldErrors: CreateRoomFieldErrors) {
  return Boolean(fieldErrors.name || fieldErrors.url || fieldErrors.note);
}

function toRequest(values: CreateRoomFormValues): CreateRoomRequest {
  const trimmedNote = values.note.trim();

  return {
    name: values.name.trim(),
    url: values.url.trim(),
    note: trimmedNote ? trimmedNote : undefined,
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

  return 'We could not create the room right now. Please try again.';
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
  const [status, setStatus] = useState<CreateRoomStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CreateRoomResponse | null>(null);

  const noteCharactersRemaining = useMemo(
    () => NOTE_CHARACTER_LIMIT - values.note.length,
    [values.note],
  );

  function updateValue<K extends keyof CreateRoomFormValues>(key: K, value: CreateRoomFormValues[K]) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));

    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = validateValues(values);

    if (hasFieldErrors(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors);
      setStatus('error');
      setErrorMessage('Please fix the highlighted fields and try again.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const createdRoom = await createRoom(toRequest(values));
      setResult(createdRoom);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(getErrorMessage(error));
      setFieldErrors(getFieldErrors(error));
    }
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setFieldErrors({});
    setStatus('idle');
    setErrorMessage(null);
    setResult(null);
  }

  if (status === 'success' && result) {
    return (
      <section className="create-card create-success-card" aria-labelledby="create-success-title">
        <span className="eyebrow">Room ready</span>
        <h1 id="create-success-title">Your review room is ready to share.</h1>
        <p className="section-copy">
          Send the review path to your client or open the room now to confirm everything looks
          right.
        </p>

        <dl className="result-list">
          <div>
            <dt>Room ID</dt>
            <dd>{result.roomId}</dd>
          </div>
          <div>
            <dt>Review path</dt>
            <dd>{result.reviewPath}</dd>
          </div>
          <div>
            <dt>Share URL</dt>
            <dd className="share-url">{result.shareUrl}</dd>
          </div>
        </dl>

        <div className="hero-actions">
          <Link className="primary-link-button" href={result.reviewPath}>
            Open review room
          </Link>
          <button className="secondary-button" type="button" onClick={handleReset}>
            Create another room
          </button>
        </div>
      </section>
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <section className="create-layout">
      <article className="create-card">
        <span className="eyebrow">Create a room</span>
        <h1>Start a focused client review.</h1>
        <p className="section-copy">
          Add the link you want reviewed, give the room a clear name, and include any short setup
          note that will help your client orient quickly.
        </p>

        <form className="create-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Room name</span>
            <input
              aria-invalid={fieldErrors.name ? 'true' : 'false'}
              autoComplete="off"
              className={fieldErrors.name ? 'field-input field-input-error' : 'field-input'}
              disabled={isSubmitting}
              name="name"
              onChange={(event) => updateValue('name', event.target.value)}
              placeholder="Homepage concept review"
              type="text"
              value={values.name}
            />
            {fieldErrors.name ? <small className="field-error">{fieldErrors.name}</small> : null}
          </label>

          <label className="field">
            <span>Work link</span>
            <input
              aria-invalid={fieldErrors.url ? 'true' : 'false'}
              autoComplete="url"
              className={fieldErrors.url ? 'field-input field-input-error' : 'field-input'}
              disabled={isSubmitting}
              name="url"
              onChange={(event) => updateValue('url', event.target.value)}
              placeholder="https://example.com/prototype"
              type="url"
              value={values.url}
            />
            {fieldErrors.url ? <small className="field-error">{fieldErrors.url}</small> : null}
          </label>

          <label className="field">
            <span>Optional note</span>
            <textarea
              aria-invalid={fieldErrors.note ? 'true' : 'false'}
              className={fieldErrors.note ? 'field-textarea field-input-error' : 'field-textarea'}
              disabled={isSubmitting}
              name="note"
              onChange={(event) => updateValue('note', event.target.value)}
              placeholder="Please focus on clarity, hierarchy, and whether the handoff feels ready."
              rows={5}
              value={values.note}
            />
            <div className="field-meta">
              {fieldErrors.note ? <small className="field-error">{fieldErrors.note}</small> : <span />}
              <small>{noteCharactersRemaining} characters remaining</small>
            </div>
          </label>

          {isSubmitting ? (
            <div className="form-message form-message-info" role="status" aria-live="polite">
              Creating your room and preparing the share link…
            </div>
          ) : null}

          {errorMessage ? (
            <div className="form-message form-message-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div className="hero-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating room…' : 'Create review room'}
            </button>
            <Link className="secondary-link" href="/">
              Back to landing page
            </Link>
          </div>
        </form>
      </article>

      <aside className="create-side-panel" aria-label="Create room guidance">
        <div className="info-card">
          <span className="section-label">What to expect</span>
          <p>
            Framekit will create a room with a shareable path and hand you back the link you can
            send to reviewers immediately.
          </p>
        </div>
        <div className="info-card">
          <span className="section-label">Sprint-one assumptions</span>
          <p>
            This flow uses a provisional create-room contract. The request sends a room name, a
            source URL, and an optional note.
          </p>
        </div>
      </aside>
    </section>
  );
}