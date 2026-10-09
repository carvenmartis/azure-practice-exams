'use client';

import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/utils';

interface ExamTimerProps {
  /** Date.now() when the exam started. */
  startedAt: number;
}

/** Time spent on the exam so far, counting up every second. */
export function ExamTimer({ startedAt }: ExamTimerProps) {
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));

  return (
    <p className="flex items-center gap-1.5 text-sm font-medium text-ink-muted tabular-nums tabular-nums">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
        <path d="M12 9v4l2.5 2M10 2.75h4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      </svg>
      <span className="sr-only">Time taken </span>
      <time dateTime={`PT${elapsed}S`}>{formatDuration(elapsed)}</time>
    </p>
  );
}
