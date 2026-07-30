interface TranscriptFeedProps {
  transcript: string | null;
  loading?: boolean;
}

export default function TranscriptFeed({ transcript, loading }: TranscriptFeedProps) {
  if (loading) {
    return (
      <div className="card" style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ width: 32, height: 32, border: '4px solid var(--line)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ textAlign: 'center' }}>
          <p className="caption" style={{ fontWeight: 600, color: 'var(--ink)' }}>Coach is analyzing your answer...</p>
          <p style={{ marginTop: 4, font: 'var(--text-caption)', color: 'var(--slate)' }}>This usually takes 3-5 seconds</p>
        </div>
      </div>
    );
  }

  if (!transcript) return null;

  const lines = transcript.split('\n').filter(Boolean);

  return (
    <div className="card" style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {lines.map((line, i) => {
        const isCoach = /coach|interruption|question|clarify/i.test(line) && line.length < 100;
        return (
          <div
            key={i}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `4px solid ${isCoach ? 'var(--blue)' : 'var(--line)'}`,
              background: isCoach ? 'var(--blue-soft)' : 'transparent',
            }}
          >
            {isCoach && (
              <p style={{ font: 'var(--text-caption)', fontWeight: 700, color: 'var(--blue)', marginBottom: 2 }}>Coach</p>
            )}
            <p style={{ font: 'var(--text-body)', whiteSpace: 'pre-wrap' }}>{line}</p>
          </div>
        );
      })}
    </div>
  );
}
