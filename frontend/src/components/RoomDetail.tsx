import React from 'react';

interface Room {
  id: string;
  name: string;
  frameUrl: string;
  createdAt: string;
  createdBy?: { name: string };
  commentCount: number;
}

interface RoomDetailProps {
  room: Room;
  isLoading?: boolean;
}

export function RoomDetail({ room, isLoading = false }: RoomDetailProps) {
  const createdDate = new Date(room.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.loadingState}>
          <p style={styles.loadingText}>Loading review...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>{room.name}</h1>
            <div style={styles.meta}>
              {room.createdBy && (
                <span style={styles.metaItem}>
                  by <strong>{room.createdBy.name}</strong>
                </span>
              )}
              <span style={styles.metaItem}>{createdDate}</span>
              <span style={styles.metaItem}>
                {room.commentCount} {room.commentCount === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          </div>

          {/* Frame Display */}
          <div style={styles.frameContainer}>
            <img
              src={room.frameUrl}
              alt={room.name}
              style={styles.frame}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback for non-image URLs */}
            <div style={styles.frameInfo}>
              <p style={styles.frameLabel}>Frame URL:</p>
              <p style={styles.frameUrl}>{room.frameUrl}</p>
            </div>
          </div>

          {/* Room Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Room ID</span>
              <code style={styles.infoValue}>{room.id}</code>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 24px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  } as React.CSSProperties,
  loadingText: {
    fontSize: '16px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  header: {
    marginBottom: '32px',
  } as React.CSSProperties,
  title: {
    fontSize: '32px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  meta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '13px',
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  metaItem: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  frameContainer: {
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  frame: {
    maxWidth: '100%',
    maxHeight: '600px',
    borderRadius: '12px',
  } as React.CSSProperties,
  frameInfo: {
    marginTop: '16px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  frameLabel: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  frameUrl: {
    fontSize: '13px',
    color: 'var(--color-accent)',
    margin: '0',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,
  infoCard: {
    padding: '16px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    fontSize: '13px',
  } as React.CSSProperties,
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  } as React.CSSProperties,
  infoLabel: {
    color: 'var(--color-muted)',
  } as React.CSSProperties,
  infoValue: {
    color: 'var(--color-accent)',
    backgroundColor: 'var(--color-bg)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '12px',
  } as React.CSSProperties,
};