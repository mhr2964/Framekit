import Link from 'next/link';
import { ReviewRoom } from '../../../src/ReviewRoom';

type ReviewRoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function ReviewRoomPage({ params }: ReviewRoomPageProps) {
  return (
    <main>
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '24px 32px 0',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#315067',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← Back to overview
        </Link>
      </div>
      <ReviewRoom roomId={params.roomId} />
    </main>
  );
}