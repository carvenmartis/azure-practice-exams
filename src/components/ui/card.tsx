import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Card surface classes, also for a Link that should look like a card. */
export function cardClasses(className?: string) {
  return cn(
    'rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900',
    className
  );
}

/** Bordered, rounded panel used for tiles and content blocks. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cardClasses(className)} {...props} />;
}
