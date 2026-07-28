import type { Session, StartSessionResponse, UploadResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function startSession(role: 'interview' | 'pitch'): Promise<StartSessionResponse> {
  const res = await fetch(`${API_BASE}/api/sessions/start?role=${role}`, {
    method: 'POST',
  });
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
