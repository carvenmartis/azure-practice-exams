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
 * It is position: fixed (with a spacer holding its place) rather than sticky
 * because iOS 26 Safari ignores theme-color and only paints the status bar
 * solid when a fixed bar sits at the top; otherwise page content shows through
 * it. Its solid background matches the colours in src/lib/theme.ts.
 */
export function CourseHeader({ title = siteName, eyebrow }: CourseHeaderProps) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            aria-label={`${siteName} home`}
            onClick={(event) => {
              if (!canLeave()) event.preventDefault();
            }}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700',
              focusRing
            )}
          >
            Az
          </Link>
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {eyebrow}
              </p>
            )}
            <p className="truncate text-sm font-semibold sm:text-base" title={title}>
              {title}
            </p>
          </div>
          <NavMenu />
        </div>
      </header>
      {/* Same height as the header (h-16 plus its 1px border) */}
      <div aria-hidden className="h-16 border-b border-transparent" />
    </>
  );
}
