'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AudioRecorder from '@/components/AudioRecorder';
import TranscriptFeed from '@/components/TranscriptFeed';
import { uploadAudio } from '@/lib/db';

export default function RehearsalPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecordingComplete = useCallback(async (blob: Blob) => {
    setLoading(true);
    try {
      const result = await uploadAudio(sessionId, blob);
      setTranscript(result.transcript);
      setFeedback(result.feedback);
    } catch {
      alert('Upload failed. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--space-2xl) var(--space-md)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-xl)',
      }}
    >
      <div className="aurora" aria-hidden="true">
        <div className="blob" />
        <div className="blob" />
        <div className="blob" />
        <div className="blob" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, width: '100%' }}>
        <a
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', color: 'var(--slate)', fontSize: 14 }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span>
          Back home
        </a>

        <span
          className="caption"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--blue)',
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>fiber_manual_record</span>
          Live session
        </span>

        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Record your answer</h2>

        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-lg)',
            padding: 'var(--space-xl) var(--space-md)',
          }}
        >
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            disabled={loading || !!feedback}
          />

          {loading && (
            <div style={{ textAlign: 'center' }}>
              <p className="caption">Processing with AI coach...</p>
              <div
                style={{
                  marginTop: 'var(--space-sm)',
                  display: 'flex',
                  gap: 6,
                  justifyContent: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--blue)',
                      opacity: 0.4,
                      animation: `pulse 1.2s infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <TranscriptFeed transcript={transcript} loading={loading} />

        {feedback && (
          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/results/${sessionId}`)}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>insights</span>
              View full feedback
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
