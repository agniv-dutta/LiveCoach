interface ScoreCardProps {
  scores: Record<string, number>;
}

export default function ScoreCard({ scores }: ScoreCardProps) {
  if (!scores || Object.keys(scores).length === 0) return null;

  return (
    <div className="card">
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Performance scores</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-lg)' }}>
        {Object.entries(scores).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
              <span className="caption" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
              <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)' }}>{val.toFixed(1)}/10</span>
            </div>
            <div style={{ background: 'var(--line)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(val / 10) * 100}%`,
                  background: val >= 7 ? 'var(--blue)' : val >= 4 ? 'var(--blue-bright)' : '#FF6B6B',
                  height: '100%',
                  borderRadius: 999,
                  transition: 'width 0.6s var(--ease)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
