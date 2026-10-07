import Link from 'next/link';
import { siteName } from '@/lib/exams';
import { canLeave } from '@/lib/leave-guard';
import { cn, focusRing } from '@/lib/utils';
import { NavMenu } from './nav-menu';

interface CourseHeaderProps {
  /** Course name to show; defaults to the site name. */
  title?: string;
  /** Short label above the title, e.g. the exam code or progress. */
  eyebrow?: string;
}

/**
 * Top bar that names the current course, with the site menu on the right.
 * It is neither fixed nor sticky: the page itself never scrolls, only the
 * <main> below it does (see PageLayout). iOS 26 Safari misplaces fixed and
 * sticky bars while scrolling, and lets content show through the status bar,
 * so a bar that never moves is the only reliable way to keep it in view. Its
 * solid background matches the colours in src/lib/theme.ts.
 */
export function CourseHeader({ title = siteName, eyebrow }: CourseHeaderProps) {
  return (
    <header className="relative z-40 shrink-0 border-b border-line bg-header">
      <div className="relative mx-auto flex h-(--header-height) max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${siteName} home`}
          onClick={(event) => {
            if (!canLeave()) event.preventDefault();
          }}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-base font-semibold text-on-primary ring-1 ring-accent/50 ring-offset-2 ring-offset-header transition-colors hover:bg-primary-hover',
            focusRing
          )}
        >
          Az
        </Link>
        <div className="ml-1 min-w-0 flex-1">
          {eyebrow && (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          )}
          <p className="truncate font-display text-base font-semibold sm:text-lg" title={title}>
            {title}
          </p>
        </div>
        <NavMenu />
      </div>
    </header>
  );
}
