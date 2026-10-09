'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { Card, cardClasses } from '@/components/ui/card';
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
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-sm font-medium text-ink-subtle">Practice</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tighter sm:text-4xl">Review mistakes</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          Questions you get wrong come back for review {first} days later. Each time you answer one right it comes
          back less often ({rest.join(', ')} and {last} days), and after that it leaves the list. Miss it again and it
          starts over.
        </p>

        {withMistakes.length ? (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {withMistakes.map(({ exam, due, later, nextDue }) => {
              const { code, title } = splitExamName(exam);
              const total = due.length + later.length;
              return (
                <li key={exam.slug} className={cardClasses('flex h-full flex-col p-6')}>
                  <Badge className="self-start">{code}</Badge>
                  <h2 className="mt-4 font-display text-lg font-semibold tracking-tight leading-snug">{title}</h2>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {due.length
                      ? `${due.length} question${due.length === 1 ? '' : 's'} due now`
                      : 'Nothing due today'}
                    {due.length > 60 ? ', 60 at random per round' : ''}
                  </p>
                  <p className="mt-1 mb-6 text-sm text-ink-muted">
                    {later.length && nextDue
                      ? `${later.length} coming back later, the next in ${daysUntil(nextDue)} day${daysUntil(nextDue) === 1 ? '' : 's'}`
                      : 'None waiting for later'}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-3">
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
          <Card className="mt-10 px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold tracking-tight">Nothing to review</p>
            <p className="mt-3 text-ink-muted">Questions you get wrong in a practice exam show up here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </Card>
        )}
        {withMistakes.some((item) => item.later.length > 0) && (
          <p className="mt-6 text-sm text-ink-subtle">
            Practising early doesn&apos;t move questions along the schedule, but a wrong answer still starts it over.
          </p>
        )}
      </div>
    </PageLayout>
  );
}
