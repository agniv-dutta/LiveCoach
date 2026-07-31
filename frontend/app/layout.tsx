import '@/styles/globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LiveCoach - Rehearse with AI',
  description: 'Real-time AI coaching for interviews and pitches',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="hive">
        {children}
        <Script src="/liquid-glass.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
