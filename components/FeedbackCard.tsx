import type { FeedbackData } from '../lib/types';
import { exportSession } from '../lib/db';

interface FeedbackCardProps {
  feedback: string | null;
  scores?: Record<string, number> | null;
  sessionId?: string;
}

function parseFeedback(raw: string): FeedbackData {
  const strengths: string[] = [];
  const gaps: string[] = [];
  let improvement = '';

  const lines = raw.split('\n');
  let section: 'strengths' | 'gaps' | 'improvement' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    if (/^strengths?|^what (you )?did well|^what worked|^clear|^compelling/i.test(trimmed) && trimmed.length < 50) {
      section = 'strengths';
      continue;
    }
    if (/^gaps?|^missing|^what was missing|^weak/i.test(trimmed) && trimmed.length < 50) {
      section = 'gaps';
      continue;
    }
    if (/^action|^improvement|^work on|^one (key )?improvement|^try/i.test(trimmed) && trimmed.length < 50) {
      section = 'improvement';
      continue;
    }

    const cleaned = trimmed.replace(/^[-*•]\s*/, '');
    if (section === 'strengths' && cleaned) strengths.push(cleaned);
    if (section === 'gaps' && cleaned) gaps.push(cleaned);
    if (section === 'improvement' && cleaned) improvement += (improvement ? ' ' : '') + cleaned;
  }

  return { strengths, gaps, improvement, raw };
}

export default function FeedbackCard({ feedback, scores, sessionId }: FeedbackCardProps) {
  if (!feedback) return null;

  const data = parseFeedback(feedback);

  const handleExport = async () => {
    if (!sessionId) return;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {scores && Object.keys(scores).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Performance scores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)' }}>
            {Object.entries(scores).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                  <span className="caption" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                  <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)' }}>{val.toFixed(1)}/10</span>
                </div>
                <div style={{ background: 'var(--line)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(val / 10) * 100}%`, background: 'var(--blue)', height: '100%', borderRadius: 999, transition: 'width 0.6s var(--ease)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              Gap
            </span>
            <ul style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {data.gaps.map((g, i) => (
                <li key={i} style={{ font: 'var(--text-body)' }}>{g}</li>
              ))}
            </ul>
          </div>
        )}

        {data.improvement && (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Action
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

      {sessionId && (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>download</span>
            Export as Markdown
          </button>
        </div>
      )}
    </div>
  );
}
