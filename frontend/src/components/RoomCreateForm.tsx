import React, { useState } from 'react';

interface RoomCreateFormProps {
  onSubmit?: (data: { name: string; frameUrl: string; createdBy?: { name: string } }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RoomCreateForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: RoomCreateFormProps) {
  const [roomName, setRoomName] = useState('');
  const [frameUrl, setFrameUrl] = useState('');
  const [creatorName, setCreatorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        name: roomName.trim(),
        frameUrl: frameUrl.trim(),
        ...(creatorName.trim() && { createdBy: { name: creatorName.trim() } }),
      });
    }
  };

  const isValid = roomName.trim().length > 0 && frameUrl.trim().length > 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create a room</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Room Name */}
        <div style={styles.formGroup}>
          <label htmlFor="roomName" style={styles.label}>
            Room name
          </label>
          <input
            id="roomName"
            type="text"
            placeholder="Q2 homepage review"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength={120}
            style={styles.input}
            disabled={isLoading}
          />
          <div style={styles.helperText}>
            Use a clear name reviewers will recognize.
          </div>
        </div>

        {/* Frame URL */}
        <div style={styles.formGroup}>
          <label htmlFor="frameUrl" style={styles.label}>
            Frames
          </label>
          <input
            id="frameUrl"
            type="url"
            placeholder="https://example.com/screenshot.png"
            value={frameUrl}
            onChange={(e) => setFrameUrl(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
          <div style={styles.helperText}>
            Add the screens you want feedback on.
          </div>
        </div>

        {/* Creator Name (Optional) */}
        <div style={styles.formGroup}>
          <label htmlFor="creatorName" style={styles.label}>
            Creator name <span style={styles.optional}>(Optional)</span>
          </label>
          <input
            id="creatorName"
            type="text"
            placeholder="Your name"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            maxLength={80}
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: isValid && !isLoading ? 1 : 0.5,
              cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading ? 'Creating room...' : 'Create room'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 24px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,
  header: {
    marginBottom: '32px',
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  optional: {
    fontSize: '12px',
    fontWeight: '400',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  input: {
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-surface)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  helperText: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    lineHeight: '1.4',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  } as React.CSSProperties,
  button: {
    padding: '12px 24px',
    borderRadius: 'var(--radius-lg)',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  buttonPrimary: {
    flex: 1,
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-bg)',
  } as React.CSSProperties,
  buttonSecondary: {
    flex: 1,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
  } as React.CSSProperties,
};