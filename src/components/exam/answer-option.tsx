import type { ReactNode } from 'react';
import { cn, focusRing } from '@/lib/utils';

/** 'correct' and 'incorrect' are shown once the question has been answered. */
export type AnswerState = 'default' | 'correct' | 'incorrect';

const stateClasses: Record<AnswerState, string> = {
  default: 'border-line bg-surface enabled:hover:border-accent/60 enabled:hover:bg-accent-soft/50 enabled:active:scale-[0.99] motion-reduce:enabled:active:scale-100',
  correct: 'border-success bg-success-soft',
  incorrect: 'border-danger bg-danger-soft'
};

interface AnswerOptionProps {
  state: AnswerState;
  disabled: boolean;
  onSelect: () => void;
  /** Key that picks this option, shown as a key cap (e.g. 'A'). */
  shortcut?: string;
  children: ReactNode;
}

/** One answer choice in the quiz, with its keyboard letter on larger screens. */
export function AnswerOption({ state, disabled, onSelect, shortcut, children }: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-keyshortcuts={shortcut}
      className={cn(
        'flex w-full items-start gap-3.5 rounded-xl border px-5 py-4 text-left leading-relaxed transition-[border-color,background-color,transform] duration-150 ease-out disabled:cursor-default',
        focusRing,
        stateClasses[state]
      )}
    >
      {shortcut && (
        <kbd
          aria-hidden="true"
          className="mt-0.5 hidden h-6 min-w-6 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface-muted px-1.5 font-mono text-xs font-medium text-ink-muted sm:inline-flex"
        >
          {shortcut}
        </kbd>
      )}
      <span className="min-w-0 flex-1">{children}</span>
      {state !== 'default' && (
        <span
          aria-hidden="true"
          className={cn('mt-0.5 shrink-0 font-semibold', state === 'correct' ? 'text-success' : 'text-danger')}
        >
          {state === 'correct' ? '✓' : '✕'}
        </span>
      )}
    </button>
  );
}
