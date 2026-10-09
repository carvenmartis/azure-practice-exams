import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CourseHeader } from './course-header';
import { SkipLink } from './skip-link';

interface PageLayoutProps {
  /** Course name in the header; defaults to the site name. */
  headerTitle?: string;
  /** Small label above the header title. */
  eyebrow?: string;
  /** Classes for <main>, e.g. its background and padding. */
  className?: string;
  children: ReactNode;
}

/**
 * Page shell: course header and <main>. <main> is the scroll area and fills
 * the screen below the header, so the header never moves. The tab title
 * comes from each page's `metadata` (see src/app/layout.tsx). A "Skip to
 * content" link (SkipLink) jumps past the header. Every page renders its own
 * PageLayout, so <main> mounts again on each navigation and `page-enter`
 * (globals.css) plays the page transition; the header doesn't animate.
 */
export function PageLayout({ headerTitle, eyebrow, className, children }: PageLayoutProps) {
  return (
    <>
      <SkipLink />
      <CourseHeader title={headerTitle} eyebrow={eyebrow} />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn('page-enter min-h-0 flex-1 overflow-y-auto overscroll-contain focus:outline-none', className)}
      >
        {children}
      </main>
    </>
  );
}
