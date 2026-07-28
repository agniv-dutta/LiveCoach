export interface Session {
  id: string;
  role: 'interview' | 'pitch';
  created_at: string;
  duration_seconds: number | null;
  transcript: string | null;
  feedback: string | null;
  status: 'active' | 'completed';
}

export interface StartSessionResponse {
  session_id: string;
  role: string;
  message: string;
}

export interface UploadResponse {
  session_id: string;
  transcript: string;
  feedback: string;
}

export interface FeedbackData {
  strengths: string[];
  gaps: string[];
  improvement: string;
  raw: string;
}
