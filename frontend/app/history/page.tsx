'use client';

import { useEffect, useState } from 'react';
import { getHistory } from '@/lib/db';
import type { SessionSummary } from '@/lib/types';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((res) => setSessions(res.sessions))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      style={{
        padding: 'var(--space-2xl) var(--space-lg)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, width: '100%' }}>
        <a
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--slate)', fontSize: 14, marginBottom: 'var(--space-md)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span>
          Back home
        </a>

        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Your rehearsals</h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p className="caption">Loading...</p>
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div className="icon-chip" style={{ margin: '0 auto' }}>
              <span className="material-symbols-rounded">history</span>
            </div>
            <h3 style={{ marginTop: 'var(--space-md)' }}>No rehearsals yet</h3>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--slate)' }}>
              Complete your first session to see it here.
            </p>
            <a href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)', display: 'inline-flex', textDecoration: 'none' }}>
              Start rehearsing
            </a>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {sessions.map((s) => {
              const date = new Date(s.created_at);
              const avgScore = s.scores
                ? Object.values(s.scores).reduce((a, b) => a + b, 0) / Object.values(s.scores).length
                : null;

              return (
                <a
                  key={s.id}
                  href={`/results/${s.id}`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none', padding: 'var(--space-md) var(--space-lg)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                    <div>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--ink)' }}>{s.role}</span>
                      <span className="caption" style={{ marginLeft: 'var(--space-sm)' }}>
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {avgScore !== null && (
                      <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)' }}>
                        {avgScore.toFixed(1)}/10 avg
                      </span>
                    )}
                  </div>
                  {s.feedback_preview && (
                    <p style={{ marginTop: 'var(--space-xs)', color: 'var(--slate)', fontSize: 14, lineHeight: 1.4 }}>{s.feedback_preview}</p>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
