import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { buttonClasses } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';

export const metadata: Metadata = { title: 'Page not found' };

/** Shown for any URL without a page, including unknown exam slugs. */
export default function NotFound() {
  return (
    <PageLayout>
      <PageContainer width="reading">
        <PageIntro
          title="Page not found"
          lede="This page doesn't exist or has moved."
          actions={
            <Link href="/" className={buttonClasses()}>
              Back to the course
            </Link>
          }
        />
      </PageContainer>
    </PageLayout>
  );
}
