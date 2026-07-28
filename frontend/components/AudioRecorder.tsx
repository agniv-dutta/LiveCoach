'use client';

import { useState, useRef, useCallback } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

const MAX_DURATION_MS = 180_000;

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob);
      };

      recorder.start(100);
      setRecording(true);
      setElapsed(0);

      const start = Date.now();
      timerRef.current = setInterval(() => {
        const diff = Date.now() - start;
        setElapsed(diff);
        if (diff >= MAX_DURATION_MS) stopRecording();
      }, 200);
    } catch {
      console.error('Microphone access denied');
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
      <button
        className={`btn ${recording ? 'btn-ghost' : 'btn-primary'}`}
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          padding: 0,
          background: recording ? '#FF3B30' : undefined,
          color: recording ? '#fff' : undefined,
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
          {recording ? 'stop' : 'mic'}
        </span>
      </button>
      {recording && (
        <span className="caption" style={{ color: '#FF3B30' }}>
          {formatTime(elapsed)} / 3:00
        </span>
      )}
      {!recording && <span className="caption">Tap to record (max 3 min)</span>}
    </div>
  );
}
