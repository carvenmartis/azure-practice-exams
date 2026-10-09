import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { exams, splitExamName } from '@/lib/exams';
import { getExamNotes, noteCount } from '@/lib/notes';
import { cn, focusRing } from '@/lib/utils';

export const metadata: Metadata = { title: 'Study notes' };

/** Study notes: pick an exam to read its key terms, abbreviations and facts. */
export default function NotesIndex() {
  const withNotes = exams.filter((exam) => getExamNotes(exam.slug));
  return (
    <PageLayout headerTitle="Study notes">
      <PageContainer>
        <PageIntro
          title="Study notes"
          lede="The good-to-knows of each exam: key terms with what they mean, important limits and defaults, and every abbreviation used in the questions. Read them before a practice round, then quiz yourself."
        />
        <ul className="divide-y divide-line border-y border-line">
          {withNotes.map((exam, index) => {
            const { code, title } = splitExamName(exam);
            return (
              <li key={exam.slug} className={index < 8 ? 'reveal-item' : undefined} style={{ '--i': index } as CSSProperties}>
                <Link
                  href={`/notes/${exam.slug}`}
                  className={cn(
                    'group flex flex-wrap items-center gap-x-4 gap-y-2 py-5 transition-colors duration-150 ease-out sm:py-6',
                    focusRing
                  )}
                >
                  <Badge>{code}</Badge>
                  <span className="min-w-0 flex-1 basis-60">
                    <span className="block font-display text-lg leading-snug font-semibold tracking-tight">{title}</span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      <span className="tabular">{noteCount(exam.slug)}</span> key terms plus abbreviations
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-accent-strong transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    Read the notes <span aria-hidden="true">→</span>
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
