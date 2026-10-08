import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExamSession } from '@/components/exam/exam-session';
import { PageLayout } from '@/components/layout/page-layout';
import { exams } from '@/lib/exams';

interface ExamPageProps {
  params: Promise<{ slug: string }>;
}

/** The exam's full name, falling back to the slug. */
function courseName(slug: string) {
  return exams.find((exam) => exam.slug === slug)?.name ?? slug.toUpperCase();
}

/**
 * Practice exam for one exam in src/lib/exams.ts. Only the slug comes from
 * the server; ExamSession downloads the questions in the browser and reads
 * ?mode=review|bookmarks, so it renders inside Suspense and the page itself
 * stays static.
 */
export default async function ExamPage({ params }: ExamPageProps) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <PageLayout
          headerTitle={courseName(slug)}
          className="flex flex-col items-center px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:px-8"
        >
          <p className="text-lg text-ink-muted">Loading {slug.toUpperCase()} questions...</p>
        </PageLayout>
      }
    >
      <ExamSession slug={slug} />
    </Suspense>
  );
}

/**
 * One static page per exam in src/lib/exams.ts; other slugs are a 404. If you
 * add new exam JSON files to the `data` directory, add them there too.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return exams.map((exam) => ({ slug: exam.slug }));
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: courseName(slug) };
}
