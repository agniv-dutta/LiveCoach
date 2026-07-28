import type { FeedbackData } from '@/lib/types';

interface FeedbackCardProps {
  feedback: string | null;
}

function parseFeedback(raw: string): FeedbackData {
  const strengths: string[] = [];
  const gaps: string[] = [];
  let improvement = '';

  const lines = raw.split('\n');
  let section: 'strengths' | 'gaps' | 'improvement' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/strengths?|what worked|clear|compelling/i.test(trimmed) && trimmed.length < 40) {
      section = 'strengths';
      continue;
    }
    if (/gaps?|missing|weak/i.test(trimmed) && trimmed.length < 40) {
      section = 'gaps';
      continue;
    }
    if (/improvement|work on|try/i.test(trimmed) && trimmed.length < 40) {
      section = 'improvement';
      continue;
    }

    if (section === 'strengths' && trimmed) strengths.push(trimmed.replace(/^[-*]\s*/, ''));
    if (section === 'gaps' && trimmed) gaps.push(trimmed.replace(/^[-*]\s*/, ''));
    if (section === 'improvement' && trimmed) improvement += (improvement ? ' ' : '') + trimmed;
  }

  return { strengths, gaps, improvement, raw };
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  if (!feedback) return null;

  const data = parseFeedback(feedback);

  return (
    <div className="card">
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Coach feedback</h3>

      {data.strengths.length > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Strengths
          </span>
          <ul style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {data.strengths.map((s, i) => (
              <li key={i} style={{ font: 'var(--text-body)' }}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {data.gaps.length > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <span className="caption" style={{ fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Gaps
          </span>
          <ul style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {data.gaps.map((g, i) => (
              <li key={i} style={{ font: 'var(--text-body)' }}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {data.improvement && (
        <div>
          <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            One improvement
          </span>
          <p style={{ marginTop: 'var(--space-sm)', font: 'var(--text-body)' }}>{data.improvement}</p>
        </div>
      )}

      <details style={{ marginTop: 'var(--space-md)' }}>
        <summary className="caption" style={{ cursor: 'pointer' }}>Raw transcript</summary>
        <p style={{ marginTop: 'var(--space-sm)', whiteSpace: 'pre-wrap', font: 'var(--text-caption)', color: 'var(--slate)' }}>
          {data.raw}
        </p>
      </details>
    </div>
  );
}
