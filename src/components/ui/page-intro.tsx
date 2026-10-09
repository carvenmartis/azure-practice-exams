import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageIntroProps {
  title: ReactNode;
  /** One or two sentences under the title. */
  lede?: ReactNode;
  /** Links or buttons shown under the lede. */
  actions?: ReactNode;
  /** Link above the title, e.g. back to the parent page. */
  back?: ReactNode;
  className?: string;
}

/**
 * Page heading: optional back link, title, lede and actions. No label above
 * the title; the header already names the section.
 */
export function PageIntro({ title, lede, actions, back, className }: PageIntroProps) {
  return (
    <header className={cn('mb-10 sm:mb-12', className)}>
      {back && <div className="mb-6 text-sm">{back}</div>}
      <h1 className="max-w-3xl font-display text-3xl leading-[1.1] font-semibold tracking-tighter sm:text-4xl">
        {title}
      </h1>
      {lede && <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-muted sm:text-lg">{lede}</p>}
      {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
