'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

const MAX_DURATION_S = 180;

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_S);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>();

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
    cancelAnimationFrame(animFrameRef.current!);
    setAudioLevel(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        onRecordingComplete(blob);
      };

      recorder.start(100);
      setRecording(true);
      setTimeLeft(MAX_DURATION_S);

      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            stopRecording();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch {
      alert('Please allow microphone access to rehearse.');
    }
  }, [onRecordingComplete, stopRecording]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animFrameRef.current!);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const bars = Array.from({ length: 5 }, (_, i) => {
    const active = recording && audioLevel > (i + 1) * 0.15;
    return { active, delay: i * 0.1 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-md) 0' }}>
      {recording && (
        <div style={{ fontSize: 'clamp(48px, 10vw, 72px)', fontWeight: 900, fontFamily: 'var(--font)', color: 'var(--blue)', letterSpacing: '-0.02em', fontVariationSettings: '"wght" 900' }}>
          {formatTime(timeLeft)}
        </div>
      )}

      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled && !recording}
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          border: 'none',
          cursor: disabled && !recording ? 'not-allowed' : 'pointer',
          display: 'grid',
          placeItems: 'center',
          background: recording ? '#FF3B30' : 'var(--blue)',
          color: '#fff',
          boxShadow: recording
            ? '0 0 0 8px rgba(255, 59, 48, 0.2)'
            : '0 8px 32px rgba(0, 0, 254, 0.25)',
          transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
          transform: recording ? 'scale(0.95)' : 'scale(1)',
          opacity: disabled && !recording ? 0.5 : 1,
          minWidth: 44,
          minHeight: 44,
        }}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 36 }}>
          {recording ? 'stop' : 'mic'}
        </span>
      </button>

      {recording && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 32 }}>
          {bars.map((bar, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: bar.active ? 24 + audioLevel * 20 : 8,
                borderRadius: 4,
                background: 'var(--blue)',
                opacity: bar.active ? 0.8 : 0.2,
                transition: 'height 0.1s ease, opacity 0.1s ease',
              }}
            />
          ))}
        </div>
      )}

      {!recording && (
        <span className="caption" style={{ textAlign: 'center' }}>
          Tap to record<br />
          <span style={{ color: 'var(--slate)' }}>max 3 minutes</span>
        </span>
      )}
    </div>
  );
}
