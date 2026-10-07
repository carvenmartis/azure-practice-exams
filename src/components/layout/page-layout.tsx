import Head from 'next/head';
import type { ReactNode } from 'react';
import { siteName } from '@/lib/exams';
import { cn } from '@/lib/utils';
import { CourseHeader } from './course-header';

interface PageLayoutProps {
  /** Browser tab title; the site name is appended. Defaults to the site name. */
  pageTitle?: string;
  /** Course name in the sticky header; defaults to the site name. */
  headerTitle?: string;
  /** Small label above the header title. */
  eyebrow?: string;
  /** Classes for <main>, e.g. its background and padding. */
  className?: string;
  children: ReactNode;
}

/** Page shell: tab title, sticky course header and a full-height <main>. */
export function PageLayout({ pageTitle, headerTitle, eyebrow, className, children }: PageLayoutProps) {
  return (
    <>
      <Head>
        <title>{pageTitle ? `${pageTitle} | ${siteName}` : siteName}</title>
      </Head>
      <CourseHeader title={headerTitle} eyebrow={eyebrow} />
      <main className={cn('min-h-[calc(100dvh-4rem)]', className)}>{children}</main>
    </>
  );
}
