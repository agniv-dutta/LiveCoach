export interface Session {
  id: string;
  user_id: string;
  role: 'interview' | 'pitch' | 'executive' | 'behavioral';
  created_at: string;
  duration_seconds: number | null;
  transcript: string | null;
  feedback: string | null;
  scores: Record<string, number> | null;
  status: 'active' | 'completed';
}

export interface SessionSummary {
  id: string;
  role: string;
  created_at: string;
  feedback_preview: string | null;
  scores: Record<string, number> | null;
  status: string;
}

export interface StartSessionResponse {
  session_id: string;
  role: string;
  user_id: string;
  message: string;
}

export interface UploadResponse {
  session_id: string;
  transcript: string;
  feedback: string;
  scores: Record<string, number>;
}

export interface HistoryResponse {
  sessions: SessionSummary[];
  user_id: string;
}

export interface ExportResponse {
  content: string;
  filename: string;
}

export interface FeedbackData {
  strengths: string[];
  gaps: string[];
  improvement: string;
  raw: string;
  scores?: Record<string, number>;
}
