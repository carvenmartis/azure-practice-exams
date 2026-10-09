import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Small monospaced label, e.g. an exam code. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs font-medium text-accent-strong',
        className
      )}
    >
      {children}
    </span>
  );
}
