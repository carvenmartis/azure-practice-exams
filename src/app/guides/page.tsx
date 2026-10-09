import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { getExamGuide } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

export const metadata: Metadata = { title: 'Exam guides' };

/** Exam guides: one row per exam, linking to its skills outline. */
export default function GuidesIndex() {
  return (
    <PageLayout headerTitle="Exam guides">
      <PageContainer>
        <PageIntro
          title="Exam guides"
          lede="What each exam measures, according to Microsoft's official study guide, with links to the training on Microsoft Learn."
        />
        <ul className="divide-y divide-line border-y border-line">
          {exams.map((exam, index) => {
            const { code, title } = splitExamName(exam);
            const guide = getExamGuide(exam.slug);
            return (
              <li key={exam.slug} className={index < 8 ? 'reveal-item' : undefined} style={{ '--i': index } as CSSProperties}>
                <Link
                  href={`/guides/${exam.slug}`}
                  className={cn(
                    'group flex flex-wrap items-center gap-x-4 gap-y-2 py-5 transition-colors duration-150 ease-out sm:py-6',
                    focusRing
                  )}
                >
                  <Badge>{code}</Badge>
                  <span className="min-w-0 flex-1 basis-60">
                    <span className="block font-display text-lg leading-snug font-semibold tracking-tight">{title}</span>
                    {guide?.note && <span className="mt-1 block text-sm text-ink-muted">Retired exam</span>}
                  </span>
                  <span className="text-sm font-semibold text-accent-strong transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    Read the guide <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </PageLayout>
  );
}
