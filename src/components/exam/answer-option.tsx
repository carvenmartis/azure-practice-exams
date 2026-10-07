import type { ReactNode } from 'react';
import { cn, focusRing } from '@/lib/utils';

/** 'correct' and 'incorrect' are shown once the question has been answered. */
export type AnswerState = 'default' | 'correct' | 'incorrect';

const stateClasses: Record<AnswerState, string> = {
  default: 'border-line bg-surface enabled:hover:border-accent/60 enabled:hover:shadow-card',
  correct: 'border-success bg-success-soft',
  incorrect: 'border-danger bg-danger-soft'
};

interface AnswerOptionProps {
  state: AnswerState;
  disabled: boolean;
  onSelect: () => void;
  children: ReactNode;
}

/** One answer choice in the quiz. */
export function AnswerOption({ state, disabled, onSelect, children }: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full rounded-xl border px-5 py-3.5 text-left leading-relaxed transition-all duration-200 disabled:cursor-default',
        focusRing,
        stateClasses[state]
      )}
    >
      {children}
    </button>
  );
}
