import type { Session, StartSessionResponse, UploadResponse, HistoryResponse, ExportResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  let id = localStorage.getItem('coach_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('coach_user_id', id);
  }
  return id;
}

export async function startSession(role: string): Promise<StartSessionResponse> {
  const userId = getUserId();
  const res = await fetch(`${API_BASE}/api/sessions/start?role=${role}&user_id=${userId}`, {
    method: 'POST',
  });
  if (res.status === 429) throw new Error('Daily session limit reached');
  if (!res.ok) throw new Error('Failed to start session');
  return res.json();
}

export async function uploadAudio(sessionId: string, blob: Blob): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', blob, `${sessionId}_audio.wav`);
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload audio');
  return res.json();
}

export async function getSession(sessionId: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function getHistory(limit = 10): Promise<HistoryResponse> {
  const userId = getUserId();
  const res = await fetch(`${API_BASE}/api/sessions/user/${userId}/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

export async function exportSession(sessionId: string, format: 'markdown' | 'pdf' = 'markdown'): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/export?format=${format}`);
  if (!res.ok) throw new Error('Failed to export');
  return res.json();
}
