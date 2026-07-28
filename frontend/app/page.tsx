'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DecisionBar from '@/components/DecisionBar';
import { startSession } from '@/lib/db';

export default function Home() {
  const router = useRouter();
  const [recentSessions, setRecentSessions] = useState<{ id: string; role: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('coach_recent_sessions');
    if (stored) {
      try {
        setRecentSessions(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleStart = async (value: string) => {
    const lower = value.toLowerCase();
    let role = 'interview';
    if (lower.includes('pitch')) role = 'pitch';
    else if (lower.includes('exec')) role = 'executive';
    else if (lower.includes('behav') || lower.includes('star')) role = 'behavioral';

    try {
      const { session_id } = await startSession(role);
      const entry = { id: session_id, role };
      const updated = [entry, ...recentSessions.filter((s) => s.id !== session_id)].slice(0, 5);
      localStorage.setItem('coach_recent_sessions', JSON.stringify(updated));
      router.push(`/rehearsal/${session_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not start session.';
      alert(msg);
    }
  };

  return (
    <>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'var(--space-2xl) var(--space-lg)',
          minHeight: '78vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 'var(--space-lg)',
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-lg)',
            maxWidth: 'var(--page-max)',
          }}
        >
          <span
            className="fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              font: 'var(--text-caption)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--blue)',
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>record_voice_over</span>
            Interview Coach
          </span>

          <h1 className="fade-up" style={{ animationDelay: '0ms' }}>
            Rehearse your next interview
          </h1>

          <p
            className="fade-up"
            style={{
              font: 'var(--text-light)',
              fontSize: 18,
              color: 'var(--slate)',
              maxWidth: 560,
              animationDelay: '80ms',
            }}
          >
            Practice with an AI coach that listens, interrupts with follow-ups, and
            gives you a structured critique. Ready when you are.
          </p>

          <DecisionBar
            placeholder="Type interview, pitch, executive, or behavioral..."
            onAction={handleStart}
          />

          <span className="caption fade-up" style={{ animationDelay: '240ms', marginTop: 'var(--space-sm)' }}>
            Free tier: ~5 full sessions
          </span>
        </div>
      </section>

      <section
        style={{
          maxWidth: 'var(--page-max)',
          margin: '0 auto',
          padding: 'var(--space-2xl) var(--space-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ textAlign: 'center' }}>How it works</h2>
          <a href="/history" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: 14 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>history</span>
            View history
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-xl)',
          }}
        >
          <div className="card fade-up">
            <div className="icon-chip">
              <span className="material-symbols-rounded">mic</span>
            </div>
            <h3 style={{ marginTop: 'var(--space-md)' }}>Record your answer</h3>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--slate)' }}>
              Speak naturally for up to three minutes. The coach listens to every word.
            </p>
          </div>

          <div className="card fade-up" style={{ animationDelay: '80ms' }}>
            <div className="icon-chip">
              <span className="material-symbols-rounded">psychology</span>
            </div>
            <h3 style={{ marginTop: 'var(--space-md)' }}>AI analyzes in real time</h3>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--slate)' }}>
              Structure, clarity, delivery. The coach flags gaps as they happen.
            </p>
          </div>

          <div className="card fade-up" style={{ animationDelay: '160ms' }}>
            <div className="icon-chip">
              <span className="material-symbols-rounded">bar_chart</span>
            </div>
            <h3 style={{ marginTop: 'var(--space-md)' }}>Get structured feedback</h3>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--slate)' }}>
              Strengths, gaps, one key improvement, and performance scores.
            </p>
          </div>
        </div>

        {recentSessions.length > 0 && (
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Recent sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {recentSessions.map((s) => (
                <a
                  key={s.id}
                  href={`/results/${s.id}`}
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) var(--space-lg)', textDecoration: 'none' }}
                >
                  <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{s.role} rehearsal</span>
                  <span className="material-symbols-rounded" style={{ color: 'var(--slate)', fontSize: 18 }}>arrow_forward</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
