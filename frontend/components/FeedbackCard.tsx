import { useState } from 'react';
import type { FeedbackData } from '@/lib/types';

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

function TranscriptSection({ raw }: { raw: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = raw.split('\n').filter(Boolean);

  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          border: 'none', background: 'none', cursor: 'pointer', padding: 0,
          font: 'var(--text-caption)', fontWeight: 700, color: 'var(--slate)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}
      >
        <span>Transcript</span>
        <svg
          style={{
            width: 14, height: 14,
            transition: 'transform 0.3s var(--ease)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {expanded && (
        <div style={{ marginTop: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {lines.map((line, i) => {
            const isCoach = /coach|interruption|question|clarify/i.test(line) && line.length < 100;
            return (
              <div
                key={i}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `4px solid ${isCoach ? 'var(--blue)' : 'var(--line)'}`,
                  background: isCoach ? 'var(--blue-soft)' : 'var(--bg-alt)',
                }}
              >
                {isCoach && (
                  <p style={{ font: 'var(--text-caption)', fontWeight: 700, color: 'var(--blue)', marginBottom: 2 }}>Coach</p>
                )}
                <p style={{ font: 'var(--text-caption)', color: 'var(--slate)', whiteSpace: 'pre-wrap' }}>{line}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SCORE_INTERPRETATIONS: Record<string, (v: number) => string> = {
  clarity: (v) => v >= 8 ? 'Clear pacing, easy to follow' : v >= 5 ? 'Adequate, but could be more focused' : 'Needs work on articulation',
  structure: (v) => v >= 8 ? 'Strong narrative arc' : v >= 5 ? 'Some structure, but meanders' : 'Lacks clear beginning, middle, end',
  impact: (v) => v >= 8 ? 'Demonstrated real business value' : v >= 5 ? 'Mentioned results but not quantified' : 'Needs specific examples of impact',
  confidence: (v) => v >= 8 ? 'Clear voice, good pacing' : v >= 5 ? 'Occasional hesitation' : 'Sounds unsure, needs practice',
};

export default function FeedbackCard({ feedback, scores, sessionId }: FeedbackCardProps) {
  if (!feedback) return null;

  const data = parseFeedback(feedback);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {scores && Object.keys(scores).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Performance scores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)' }}>
            {Object.entries(scores).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                  <span className="caption" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                  <span className="caption" style={{ fontWeight: 700, color: 'var(--blue)' }}>{val.toFixed(1)}/10</span>
                </div>
                <div style={{ background: 'var(--line)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(val / 10) * 100}%`, background: 'var(--blue)', height: '100%', borderRadius: 999, transition: 'width 0.6s var(--ease)' }} />
                </div>
                <p style={{ marginTop: 'var(--space-xs)', font: 'var(--text-caption)', color: 'var(--slate)' }}>
                  {(SCORE_INTERPRETATIONS[key] || (() => ''))(val)}
                </p>
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

        <TranscriptSection raw={data.raw} />
      </div>

    </div>
  );
}
