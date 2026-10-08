import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { getExamGuide } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

export const metadata: Metadata = { title: 'Study mode' };

/** Study mode: pick an exam to go through its questions without a score. */
export default function StudyIndex() {
  return (
    <PageLayout headerTitle="Study mode">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Learn at your pace</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Study mode</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          Go through every question of an exam, or just one skill area. There is no timer and no score: the answer and
          explanation show as soon as you pick an option, or tap Show answer to skip ahead. Study rounds don&apos;t
          change your progress or mistakes.
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const { code, title } = splitExamName(exam);
            const areas = getExamGuide(exam.slug)?.areas.length ?? 0;
            return (
              <li key={exam.slug}>
                <Link
                  href={`/study/${exam.slug}`}
                  className={cardClasses(
                    cn('flex h-full flex-col p-6 transition-all hover:border-accent/60 hover:shadow-lifted', focusRing)
                  )}
                >
                  <Badge className="self-start">{code}</Badge>
                  <span className="mt-4 font-display text-lg font-semibold leading-snug">{title}</span>
                  {areas > 0 && <span className="mt-2 text-sm text-ink-muted">{areas} skill areas</span>}
                  <span className="mt-auto pt-5 text-sm font-semibold text-accent-strong">Start studying →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageLayout>
  );
}
