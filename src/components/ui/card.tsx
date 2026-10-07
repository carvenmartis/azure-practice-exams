import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Card surface classes, also for a Link that should look like a card. */
export function cardClasses(className?: string) {
  return cn(
    'rounded-2xl border border-line bg-surface shadow-card',
    className
  );
}

/** Bordered, rounded panel used for tiles and content blocks. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cardClasses(className)} {...props} />;
}
