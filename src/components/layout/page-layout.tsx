import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CourseHeader } from './course-header';
import { PageTransitionMain } from './page-transition';
import { SideNav } from './side-nav';
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
 * Page shell: course header, the desktop side navigation (SideNav, lg and
 * up) and <main>. <main> is the scroll area and fills the screen below the
 * header and left of the side navigation, so neither ever moves. The tab title
 * comes from each page's `metadata` (see src/app/layout.tsx). A "Skip to
 * content" link (SkipLink) jumps past the header. Every page renders its own
 * PageLayout, so <main> mounts again on each navigation and
 * PageTransitionMain plays the Framer Motion page transition; the header
 * and side navigation don't animate.
 */
export function PageLayout({ headerTitle, eyebrow, className, children }: PageLayoutProps) {
  return (
    <>
      <SkipLink />
      <CourseHeader title={headerTitle} eyebrow={eyebrow} />
      <div className="flex min-h-0 flex-1">
        <PageTransitionMain
          className={cn('min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain focus:outline-none', className)}
        >
          {children}
        </PageTransitionMain>
        <SideNav />
      </div>
    </>
  );
}
