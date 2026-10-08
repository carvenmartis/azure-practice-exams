import { ExamCard } from '@/components/dashboard/exam-card';
import { PageLayout } from '@/components/layout/page-layout';
import { StatCard } from '@/components/ui/stat-card';
import Link from 'next/link';
import { exams } from '@/lib/exams';
import { reviewQueue, useProgress } from '@/lib/progress-store';
import { cn, focusRing } from '@/lib/utils';

const facts = [
  { label: 'Practice exams', value: exams.length },
  { label: 'Questions per attempt', value: 60 },
  { label: 'Scored out of', value: 1000 }
];

/**
 * Home page renders a dashboard of available practice exams under an always-visible
 * header with the site name. The exams are presented in a responsive grid.
 * Selecting a card navigates to the corresponding exam page.
 */
export default function Home() {
  const progress = useProgress();
  const dueCount = exams.reduce((sum, exam) => sum + reviewQueue(progress, exam.slug).due.length, 0);

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <section className="mb-14 sm:mb-16">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Dashboard
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] font-semibold tracking-tight sm:text-6xl">
            Prepare for your Microsoft Azure <span className="text-accent italic">certification</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Pick an exam to start an untimed practice run. Each question shows the correct
            answer, an explanation and a link to the Microsoft documentation.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
            {facts.map((fact) => (
              <StatCard key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>
          {dueCount > 0 && (
            <Link
              href="/review"
              className={cn(
                'mt-6 flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-surface px-5 py-4 shadow-card transition-colors hover:border-accent',
                focusRing
              )}
            >
              <span>
                <span className="block font-semibold">
                  {dueCount} missed question{dueCount === 1 ? ' is' : 's are'} due for review
                </span>
                <span className="block text-sm text-ink-muted">They come back less often each time you get them right.</span>
              </span>
              <span aria-hidden="true" className="text-xl text-accent">→</span>
            </Link>
          )}
        </section>

        <section aria-labelledby="exams-heading">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-4">
            <h2 id="exams-heading" className="font-display text-2xl font-semibold sm:text-3xl">
              Available exams
            </h2>
            <p className="text-sm text-ink-subtle">{exams.length} exams</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <li key={exam.slug}>
                <ExamCard exam={exam} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
