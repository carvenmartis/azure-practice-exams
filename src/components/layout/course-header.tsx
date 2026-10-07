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
 *
 * transform-gpu gives the bar its own compositing layer; without it iOS Safari
 * can stop painting a fixed bar while the page is scrolling, so it seems to
 * vanish. The transform also makes the header the containing block for fixed
 * children, which is why NavMenu portals its drawer to <body>.
 */
export function CourseHeader({ title = siteName, eyebrow }: CourseHeaderProps) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 transform-gpu border-b border-line bg-header">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
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
      {/* Same height as the header (h-16 plus its 1px border) */}
      <div aria-hidden className="h-16 border-b border-transparent" />
    </>
  );
}
