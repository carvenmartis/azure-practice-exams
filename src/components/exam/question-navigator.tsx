'use client';

import { useState } from 'react';
import { cn, focusRing } from '@/lib/utils';

interface QuestionNavigatorProps {
  /** One entry per question: true once it has an answer. */
  answered: boolean[];
  currentIndex: number;
  onJump: (index: number) => void;
}

/**
 * Collapsible overview of every question in the exam. Skipped questions are
 * outlined in gold so you can jump back and answer them; answered ones can
 * be reopened to read their explanation again.
 */
export function QuestionNavigator({ answered, currentIndex, onJump }: QuestionNavigatorProps) {
  const [open, setOpen] = useState(false);
  const unanswered = answered.filter((isAnswered, idx) => !isAnswered && idx !== currentIndex).length;
  // Only questions already passed count as skipped; later ones just haven't come up yet.
  const skipped = answered.filter((isAnswered, idx) => !isAnswered && idx < currentIndex).length;

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="question-overview"
        onClick={() => setOpen(!open)}
        className={cn('text-sm font-semibold text-ink-muted transition-colors hover:text-ink', focusRing)}
      >
        {open ? 'Hide questions' : 'All questions'}
        {skipped > 0 && <span className="text-accent-strong"> · {skipped} skipped</span>}
        <span aria-hidden="true"> {open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div id="question-overview" className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
          <ol className="grid grid-cols-8 gap-2 sm:grid-cols-12">
            {answered.map((isAnswered, idx) => {
              const current = idx === currentIndex;
              const isSkipped = !isAnswered && idx < currentIndex;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    aria-label={`Question ${idx + 1}, ${isAnswered ? 'answered' : isSkipped ? 'skipped' : 'not answered'}`}
                    aria-current={current ? 'step' : undefined}
                    onClick={() => {
                      onJump(idx);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex h-9 w-full items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-colors',
                      focusRing,
                      current
                        ? 'border-primary bg-primary text-on-primary'
                        : isAnswered
                          ? 'border-transparent bg-surface-muted text-ink-subtle hover:text-ink'
                          : isSkipped
                            ? 'border-accent bg-accent-soft text-accent-strong hover:border-accent-strong'
                            : 'border-line text-ink-muted hover:border-accent/60'
                    )}
                  >
                    {idx + 1}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-ink-subtle">
            {unanswered} unanswered. Gold questions were skipped; grey ones are answered.
          </p>
        </div>
      )}
    </div>
  );
}
