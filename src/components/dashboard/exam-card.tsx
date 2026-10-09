'use client';

import Link from 'next/link';
import { StartExamLink } from '@/components/exam/start-exam-link';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { cardClasses } from '@/components/ui/card';
import { splitExamName } from '@/lib/exams';
import type { Exam } from '@/lib/exams';
import { useProgress } from '@/lib/progress-store';
import { cn } from '@/lib/utils';

/** Microsoft certification exams are passed with 700 out of 1000. */
const passingScore = 700;

interface ExamCardProps {
  exam: Exam;
  /** Questions in the exam's bank (src/lib/server/exam-stats.ts). */
  questionCount: number;
  hasNotes: boolean;
}

/**
 * One exam on a category page: code, title, summary, the size of the question
 * bank and this device's attempts and best score, then Start exam (after the
 * confirm dialog of StartExamLink) and Study notes (Study mode without notes).
 */
export function ExamCard({ exam, questionCount, hasNotes }: ExamCardProps) {
  const { code, title } = splitExamName(exam);
  const attempts = useProgress().attempts.filter((attempt) => attempt.slug === exam.slug);
  const best = attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : null;

  return (
    <article className={cardClasses('flex h-full flex-col p-6 sm:p-7')}>
      <Badge className="self-start">{code}</Badge>
      <h3 className="mt-4 font-display text-lg leading-snug font-semibold tracking-tight">{title}</h3>
      {exam.description && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{exam.description}</p>}

      <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-xl bg-surface-muted/60 py-3">
        <div className="px-3 sm:px-4">
          <dt className="text-xs text-ink-subtle">Questions</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums">{questionCount}</dd>
        </div>
        <div className="px-3 sm:px-4">
          <dt className="text-xs text-ink-subtle">Attempts</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums">{attempts.length}</dd>
        </div>
        <div className="px-3 sm:px-4">
          <dt className="text-xs text-ink-subtle">Best score</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums">
            {best === null ? (
              <span className="font-normal text-ink-subtle">None yet</span>
            ) : (
              <>
                {best}
                <span className={cn('ml-1.5 text-xs font-medium', best >= passingScore ? 'text-success' : 'text-ink-subtle')}>
                  {best >= passingScore ? 'Pass' : `of ${passingScore}`}
                </span>
              </>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex gap-3 pt-6">
        <StartExamLink slug={exam.slug} className={buttonClasses({ className: 'flex-1' })}>
          Start exam<span className="sr-only"> {code}</span>
        </StartExamLink>
        <Link
          href={hasNotes ? `/notes/${exam.slug}` : `/study/${exam.slug}`}
          aria-label={`${code} ${hasNotes ? 'study notes' : 'study mode'}`}
          className={buttonClasses({ variant: 'secondary' })}
        >
          {hasNotes ? 'Study notes' : 'Study mode'}
        </Link>
      </div>
    </article>
  );
}
