'use client';

import { useRouter } from 'next/navigation';
import DecisionBar from '@/components/DecisionBar';
import { startSession } from '@/lib/db';

export default function Home() {
  const router = useRouter();

  const handleStart = async (value: string) => {
    const role = value.toLowerCase().includes('pitch') ? 'pitch' : 'interview';
    try {
      const { session_id } = await startSession(role);
      router.push(`/rehearsal/${session_id}`);
    } catch {
      alert('Could not start session. Make sure the backend is running.');
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
            placeholder="Type interview or pitch..."
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
        <h2 style={{ textAlign: 'center' }}>How it works</h2>
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
              Strengths, gaps, and one key improvement to work on before the real thing.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
