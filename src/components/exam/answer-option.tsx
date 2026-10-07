import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** 'correct' and 'incorrect' are shown once the question has been answered. */
export type AnswerState = 'default' | 'correct' | 'incorrect';

const stateClasses: Record<AnswerState, string> = {
  default: 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800',
  correct: 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900',
  incorrect: 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900'
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
        'w-full rounded-lg border px-4 py-2 text-left transition-colors duration-200',
        stateClasses[state]
      )}
    >
      {children}
    </button>
  );
}
