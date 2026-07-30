'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FeedbackCard from '@/components/FeedbackCard';
import { getSession, exportSession } from '@/lib/db';
import type { Session } from '@/lib/types';

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleExport = async () => {
    try {
      const result = await exportSession(sessionId, 'markdown');
      const blob = new Blob([result.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed.');
    }
  };

  useEffect(() => {
    getSession(sessionId)
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <section
        style={{
          padding: 'var(--space-2xl) var(--space-lg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p className="caption">Loading session...</p>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section
        style={{
          padding: 'var(--space-2xl) var(--space-lg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <div className="card" style={{ textAlign: 'center', maxWidth: 480 }}>
          <div className="icon-chip" style={{ margin: '0 auto' }}>
            <span className="material-symbols-rounded">search_off</span>
          </div>
          <h3 style={{ marginTop: 'var(--space-md)' }}>Session not found</h3>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--slate)' }}>
            This session does not exist or has not been completed yet.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--space-lg)' }}
            onClick={() => router.push('/')}
          >
            Start a new session
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--space-2xl) var(--space-lg)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="aurora" aria-hidden="true">
        <div className="blob" />
        <div className="blob" />
        <div className="blob" />
        <div className="blob" />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 680,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}
      >
        <a
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--slate)', fontSize: 14, marginBottom: 'var(--space-xs)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span>
          Back home
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
          }}
        >
          <div>
            <span
              className="caption"
              style={{
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--blue)',
              }}
            >
              Session complete
            </span>
            <h2 style={{ marginTop: 'var(--space-xs)' }}>Your feedback</h2>
          </div>

          <div className="card" style={{ padding: 'var(--space-sm) var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--blue)' }}>check_circle</span>
            <span className="caption" style={{ fontWeight: 500, textTransform: 'capitalize' }}>{session.role}</span>
          </div>
        </div>

        <FeedbackCard
          feedback={session.feedback}
          scores={session.scores}
          sessionId={session.id}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%', maxWidth: 400, margin: '0 auto' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}
            onClick={() => router.push('/')}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>refresh</span>
            Try another round
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleExport}>
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>download</span>
              Export
            </button>
            <a href="/history" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>history</span>
              History
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
