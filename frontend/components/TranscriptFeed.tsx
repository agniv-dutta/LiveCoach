interface TranscriptFeedProps {
  transcript: string | null;
  loading?: boolean;
}

export default function TranscriptFeed({ transcript, loading }: TranscriptFeedProps) {
  if (loading) {
    return (
      <div className="card" style={{ maxHeight: 360, overflowY: 'auto' }}>
        <p className="caption" style={{ color: 'var(--slate)' }}>
          Waiting for the coach...
        </p>
        <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', opacity: 0.4, animation: 'pulse 1.2s infinite' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', opacity: 0.4, animation: 'pulse 1.2s infinite 0.2s' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', opacity: 0.4, animation: 'pulse 1.2s infinite 0.4s' }} />
        </div>
      </div>
    );
  }

  if (!transcript) return null;

  return (
    <div className="card" style={{ maxHeight: 360, overflowY: 'auto' }}>
      <p style={{ whiteSpace: 'pre-wrap', font: 'var(--text-body)' }}>{transcript}</p>
    </div>
  );
}
