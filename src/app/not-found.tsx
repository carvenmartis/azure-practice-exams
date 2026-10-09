import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { buttonClasses } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

/** Shown for any URL without a page, including unknown exam slugs. */
export default function NotFound() {
  return (
    <PageLayout className="flex flex-col items-center px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
      <p className="text-sm font-medium text-ink-subtle">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tighter sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-muted">This page doesn&apos;t exist or has moved.</p>
      <Link href="/" className={buttonClasses({ className: 'mt-8' })}>
        Back to the course
      </Link>
    </PageLayout>
  );
}
