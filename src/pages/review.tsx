import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { Card, cardClasses } from '@/components/ui/card';
import { exams, splitExamName } from '@/lib/exams';
import { useProgress } from '@/lib/progress-store';

/**
 * Review mistakes: per exam, how many questions were answered wrong and not
 * answered right since, with a button to practise just those.
 */
export default function Review() {
  const { mistakes } = useProgress();
  const withMistakes = exams
    .map((exam) => ({ exam, count: mistakes[exam.slug]?.length ?? 0 }))
    .filter((item) => item.count > 0);

  return (
    <PageLayout pageTitle="Review mistakes" headerTitle="Review mistakes">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Practice</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Review mistakes</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          A practice round built only from questions you got wrong. Answer one right and it leaves the list; miss it
          again and it stays.
        </p>

        {withMistakes.length ? (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {withMistakes.map(({ exam, count }) => {
              const { code, title } = splitExamName(exam);
              return (
                <li key={exam.slug} className={cardClasses('flex h-full flex-col p-6')}>
                  <Badge className="self-start">{code}</Badge>
                  <h2 className="mt-4 font-display text-xl font-semibold leading-snug">{title}</h2>
                  <p className="mt-2 mb-6 text-sm text-ink-muted">
                    {count} question{count === 1 ? '' : 's'} to review
                    {count > 60 ? ', 60 at random per round' : ''}
                  </p>
                  <Link
                    href={`/exams/${exam.slug}?mode=review`}
                    className={buttonClasses({ className: 'mt-auto self-start' })}
                  >
                    Start review
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Card className="mt-10 px-6 py-10 text-center">
            <p className="font-display text-2xl font-semibold">Nothing to review</p>
            <p className="mt-3 text-ink-muted">Questions you get wrong in a practice exam show up here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
