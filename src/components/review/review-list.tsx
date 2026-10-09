'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { exams, splitExamName } from '@/lib/exams';
import { daysUntil, reviewIntervals, reviewQueue, useProgress } from '@/lib/progress-store';

/**
 * Review mistakes: per exam, the missed questions due again under spaced
 * repetition, with a button to practise just those. A missed question comes
 * back after a few days, then less often each time it's answered right.
 */
export function ReviewList() {
  const progress = useProgress();
  const withMistakes = exams
    .map((exam) => ({ exam, ...reviewQueue(progress, exam.slug) }))
    .filter((item) => item.due.length + item.later.length > 0);
  const [first, ...rest] = reviewIntervals;
  const last = rest.pop();

  return (
    <PageLayout headerTitle="Review mistakes">
      <PageContainer width="reading">
        <PageIntro
          title="Review mistakes"
          lede={
            <>
              Questions you get wrong come back for review {first} days later. Each time you answer one right it comes
              back less often ({rest.join(', ')} and {last} days), and after that it leaves the list. Miss it again and
              it starts over.
            </>
          }
        />

        {withMistakes.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {withMistakes.map(({ exam, due, later, nextDue }, i) => {
              const { code, title } = splitExamName(exam);
              const total = due.length + later.length;
              return (
                <li
                  key={exam.slug}
                  className={`flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between${i < 8 ? ' reveal-item' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <div className="min-w-0">
                  <Badge className="self-start">{code}</Badge>
                  <h2 className="mt-3 font-display text-lg font-semibold tracking-tight leading-snug">{title}</h2>
                  <p className="mt-2 text-sm font-semibold text-ink tabular">
                    {due.length
                      ? `${due.length} question${due.length === 1 ? '' : 's'} due now`
                      : 'Nothing due today'}
                    {due.length > 60 ? ', 60 at random per round' : ''}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted tabular">
                    {later.length && nextDue
                      ? `${later.length} coming back later, the next in ${daysUntil(nextDue)} day${daysUntil(nextDue) === 1 ? '' : 's'}`
                      : 'None waiting for later'}
                  </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {due.length > 0 && (
                      <Link href={`/exams/${exam.slug}?mode=review`} className={buttonClasses()}>
                        Start review
                      </Link>
                    )}
                    {later.length > 0 && (
                      <Link
                        href={`/exams/${exam.slug}?mode=review&scope=all`}
                        className={buttonClasses({ variant: due.length ? 'ghost' : 'secondary' })}
                      >
                        Practise all {total} early
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-8">
            <p className="font-display text-xl font-semibold tracking-tight">Nothing to review</p>
            <p className="mt-2 max-w-[60ch] text-ink-muted">Questions you get wrong in a practice exam show up here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </div>
        )}
        {withMistakes.some((item) => item.later.length > 0) && (
          <p className="mt-6 text-sm text-ink-subtle">
            Practising early doesn&apos;t move questions along the schedule, but a wrong answer still starts it over.
          </p>
        )}
      </PageContainer>
    </PageLayout>
  );
}
