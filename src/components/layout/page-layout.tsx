import Head from 'next/head';
import type { ReactNode } from 'react';
import { siteName } from '@/lib/exams';
import { cn } from '@/lib/utils';
import { CourseHeader } from './course-header';

interface PageLayoutProps {
  /** Browser tab title; the site name is appended. Defaults to the site name. */
  pageTitle?: string;
  /** Course name in the header; defaults to the site name. */
  headerTitle?: string;
  /** Small label above the header title. */
  eyebrow?: string;
  /** Classes for <main>, e.g. its background and padding. */
  className?: string;
  children: ReactNode;
}

/**
 * Page shell: tab title, course header and <main>. <main> is the scroll area
 * and fills the screen below the header, so the header never moves.
 */
export function PageLayout({ pageTitle, headerTitle, eyebrow, className, children }: PageLayoutProps) {
  return (
    <>
      <Head>
        <title>{pageTitle ? `${pageTitle} | ${siteName}` : siteName}</title>
      </Head>
      <CourseHeader title={headerTitle} eyebrow={eyebrow} />
      <main className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', className)}>{children}</main>
    </>
  );
}
