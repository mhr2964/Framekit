import React, { useState } from 'react';

interface InviteModalProps {
  roomId: string;
  shareLink?: string;
  onClose?: () => void;
  onSendInvites?: (emails: string[]) => void;
  isLoading?: boolean;
}

export function InviteModal({
  roomId,
  shareLink,
  onClose,
  onSendInvites,
  isLoading = false,
}: InviteModalProps) {
  const [inviteEmails, setInviteEmails] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopyLink = () => {
    const link = shareLink || `${window.location.origin}/review/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const handleSendInvites = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = inviteEmails
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (onSendInvites && emails.length > 0) {
      onSendInvites(emails);
      setInviteEmails('');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Invite people to review</h2>
          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {/* Email Invite Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Send invites</h3>
            <form onSubmit={handleSendInvites}>
              <textarea
                placeholder="name@company.com"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                style={styles.textarea}
                disabled={isLoading}
                rows={4}
              />
              <div style={styles.helperText}>
                Enter email addresses, one per line.
              </div>
              <button
                type="submit"
                disabled={isLoading || inviteEmails.trim().length === 0}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  opacity:
                    isLoading || inviteEmails.trim().length === 0 ? 0.5 : 1,
                  cursor:
                    isLoading || inviteEmails.trim().length === 0
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {isLoading ? 'Sending invites...' : 'Send invites'}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div style={styles.divider}>Or</div>

          {/* Share Link Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Share a link</h3>
            <p style={styles.shareHelper}>
              Anyone with the link can review.
            </p>
            <div style={styles.linkContainer}>
              <code style={styles.linkCode}>
                {shareLink || `${window.location.origin}/review/${roomId}`}
              </code>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {copyStatus === 'copied' ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    borderRadius: 'var(--radius-lg)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid var(--color-surface)',
  } as React.CSSProperties,
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  } as React.CSSProperties,
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  content: {
    padding: '24px',
  } as React.CSSProperties,
  section: {
    marginBottom: '24px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 12px 0',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '12px',
    border: '1px solid var(--color-surface)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    marginBottom: '8px',
  } as React.CSSProperties,
  helperText: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    marginBottom: '12px',
  } as React.CSSProperties,
  shareHelper: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  linkContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  } as React.CSSProperties,
  linkCode: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'var(--color-accent)',
    wordBreak: 'break-all' as const,
    fontFamily: 'monospace',
  } as React.CSSProperties,
  divider: {
    textAlign: 'center' as const,
    color: 'var(--color-muted)',
    fontSize: '12px',
    margin: '24px 0',
    position: 'relative' as const,
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
    minWidth: '120px',
  } as React.CSSProperties,
  buttonPrimary: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-bg)',
  } as React.CSSProperties,
  buttonSecondary: {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--color-surface)',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
};