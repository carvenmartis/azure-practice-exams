import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { exams, splitExamName } from '@/lib/exams';
import { getExamNotes, noteCount } from '@/lib/notes';
import { cn, focusRing } from '@/lib/utils';

export const metadata: Metadata = { title: 'Study notes' };

/** Study notes: pick an exam to read its key terms, abbreviations and facts. */
export default function NotesIndex() {
  const withNotes = exams.filter((exam) => getExamNotes(exam.slug));
  return (
    <PageLayout headerTitle="Study notes">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-sm font-medium text-ink-subtle">Know it by heart</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tighter sm:text-4xl">Study notes</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          The good-to-knows of each exam: key terms with what they mean, important limits and defaults, and every
          abbreviation used in the questions. Read them before a practice round, then quiz yourself.
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withNotes.map((exam) => {
            const { code, title } = splitExamName(exam);
            return (
              <li key={exam.slug}>
                <Link
                  href={`/notes/${exam.slug}`}
                  className={cardClasses(
                    cn('flex h-full flex-col p-6 transition-all hover:border-accent/60 hover:shadow-lifted', focusRing)
                  )}
                >
                  <Badge className="self-start">{code}</Badge>
                  <span className="mt-4 font-display text-lg font-semibold leading-snug">{title}</span>
                  <span className="mt-2 text-sm text-ink-muted">{noteCount(exam.slug)} key terms plus abbreviations</span>
                  <span className="mt-auto pt-5 text-sm font-semibold text-accent-strong">Read the notes →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageLayout>
  );
}
