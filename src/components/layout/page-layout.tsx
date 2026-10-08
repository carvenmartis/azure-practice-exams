import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CourseHeader } from './course-header';

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
 * comes from each page's `metadata` (see src/app/layout.tsx).
 */
export function PageLayout({ headerTitle, eyebrow, className, children }: PageLayoutProps) {
  return (
    <>
      <CourseHeader title={headerTitle} eyebrow={eyebrow} />
      <main className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', className)}>{children}</main>
    </>
  );
}
