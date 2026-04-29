import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Framekit',
  description:
    'Polished, timestamped website feedback in elegant review rooms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}