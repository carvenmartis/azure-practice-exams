import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Small blue label, e.g. an exam code. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        className
      )}
    >
      {children}
    </span>
  );
}
