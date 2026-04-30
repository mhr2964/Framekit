import React, { useState } from 'react';

interface Comment {
  id: string;
  roomId: string;
  body: string;
  author?: { name: string };
  position?: { x: number; y: number };
  createdAt: string;
}

interface CommentThreadProps {
  roomId: string;
  comments?: Comment[];
  onAddComment?: (data: {
    body: string;
    author?: { name: string };
    position?: { x: number; y: number };
  }) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export function CommentThread({
  roomId,
  comments = [],
  onAddComment,
  isLoading = false,
  isSubmitting = false,
}: CommentThreadProps) {
  const [commentBody, setCommentBody] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddComment && commentBody.trim().length > 0) {
      onAddComment({
        body: commentBody.trim(),
        ...(authorName.trim() && { author: { name: authorName.trim() } }),
      });
      setCommentBody('');
      setAuthorName('');
    }
  };

  const isValid = commentBody.trim().length > 0;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Feedback</h2>
        <span style={styles.count}>
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {isLoading ? (
        <div style={styles.loadingState}>
          <p style={styles.loadingText}>Loading feedback...</p>
        </div>
      ) : (
        <>
          {/* Comments List */}
          <div style={styles.commentsList}>
            {comments.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No feedback yet.</p>
                <p style={styles.emptySubtext}>
                  Be the first to add a comment.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <strong style={styles.authorName}>
                      {comment.author?.name || 'Anonymous'}
                    </strong>
                    <span style={styles.timestamp}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {comment.position && (
                    <div style={styles.position}>
                      Position: ({comment.position.x}, {comment.position.y})
                    </div>
                  )}
                  <p style={styles.commentBody}>{comment.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div style={styles.inputSection}>
            <h3 style={styles.inputLabel}>Add feedback</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <textarea
                placeholder="What stands out here?"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                maxLength={2000}
                style={styles.textarea}
                disabled={isSubmitting}
                rows={4}
              />
              <div style={styles.inputFooter}>
                <span style={styles.charCount}>
                  {commentBody.length} / 2000
                </span>
              </div>

              <div style={styles.authorField}>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={80}
                  style={styles.authorInput}
                  disabled={isSubmitting}
                />
              </div>

              <div style={styles.actions}>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  style={{
                    ...styles.button,
                    ...styles.buttonPrimary,
                    opacity: isValid && !isSubmitting ? 1 : 0.5,
                    cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
                  }}
                >
                  {isSubmitting ? 'Posting comment...' : 'Post comment'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px 24px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-surface)',
  } as React.CSSProperties,
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  } as React.CSSProperties,
  count: {
    fontSize: '13px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  } as React.CSSProperties,
  loadingText: {
    fontSize: '14px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  commentsList: {
    marginBottom: '32px',
  } as React.CSSProperties,
  emptyState: {
    padding: '32px 24px',
    textAlign: 'center' as const,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
  } as React.CSSProperties,
  emptyText: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  emptySubtext: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    margin: 0,
  } as React.CSSProperties,
  commentItem: {
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '12px',
    borderLeft: '3px solid var(--color-accent)',
  } as React.CSSProperties,
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  } as React.CSSProperties,
  authorName: {
    fontSize: '13px',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  timestamp: {
    fontSize: '12px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  position: {
    fontSize: '11px',
    color: 'var(--color-muted)',
    marginBottom: '8px',
    fontStyle: 'italic',
  } as React.CSSProperties,
  commentBody: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--color-text)',
    margin: 0,
  } as React.CSSProperties,
  inputSection: {
    padding: '24px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
  } as React.CSSProperties,
  inputLabel: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 16px 0',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } as React.CSSProperties,
  textarea: {
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '12px',
    border: '1px solid var(--color-bg)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    lineHeight: '1.5',
  } as React.CSSProperties,
  inputFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  charCount: {
    fontSize: '12px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  authorField: {
    display: 'flex',
  } as React.CSSProperties,
  authorInput: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '13px',
    borderRadius: '12px',
    border: '1px solid var(--color-bg)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: '12px',
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
};