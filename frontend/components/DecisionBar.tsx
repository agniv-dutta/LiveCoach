'use client';

import { useEffect, useRef } from 'react';

declare global {
  function liquidGlass(el: Element, opts?: Record<string, unknown>): {
    supported: boolean;
    refresh: () => void;
    destroy: () => void;
  };
}

interface DecisionBarProps {
  placeholder?: string;
  onAction?: (value: string) => void;
}

export default function DecisionBar({ placeholder = 'Ask anything...', onAction }: DecisionBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const glassRef = useRef<ReturnType<typeof liquidGlass> | null>(null);

  useEffect(() => {
    if (barRef.current && typeof liquidGlass === 'function') {
      glassRef.current = liquidGlass(barRef.current, { scale: -80, chroma: 4, blur: 4 });
    }
    return () => {
      glassRef.current?.destroy();
    };
  }, []);

  const handleAction = () => {
    if (inputRef.current && onAction) {
      onAction(inputRef.current.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAction();
  };

  return (
    <div className="glass-light decision-bar fade-up" ref={barRef} style={{ animationDelay: '160ms' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        onKeyDown={handleKeyDown}
      />
      <button className="go" type="button" aria-label="Send" onClick={handleAction}>
        <span className="material-symbols-rounded">arrow_upward</span>
      </button>
    </div>
  );
}
