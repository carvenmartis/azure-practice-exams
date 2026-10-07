import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Small gold-outlined label, e.g. an exam code. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-strong',
        className
      )}
    >
      {children}
    </span>
  );
}
