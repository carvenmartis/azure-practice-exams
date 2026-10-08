import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { StudySession } from '@/components/study/study-session';
import { exams } from '@/lib/exams';

interface StudyPageProps {
  params: Promise<{ slug: string }>;
}

/** The exam's full name, falling back to the slug. */
function courseName(slug: string) {
  return exams.find((exam) => exam.slug === slug)?.name ?? slug.toUpperCase();
}

/**
 * Study mode for one exam in src/lib/exams.ts. Only the slug comes from the
 * server; StudySession downloads the questions in the browser and reads
 * ?topic=<skill area>, so it renders inside Suspense and the page itself
 * stays static.
 */
export default async function StudyPage({ params }: StudyPageProps) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <PageLayout
          headerTitle={courseName(slug)}
          eyebrow="Study mode"
          className="flex flex-col items-center px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:px-8"
        >
          <p className="text-lg text-ink-muted">Loading {slug.toUpperCase()} questions...</p>
        </PageLayout>
      }
    >
      <StudySession slug={slug} />
    </Suspense>
  );
}

/** One study page per exam in src/lib/exams.ts; other slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return exams.map((exam) => ({ slug: exam.slug }));
}

export async function generateMetadata({ params }: StudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Study ${courseName(slug)}` };
}
