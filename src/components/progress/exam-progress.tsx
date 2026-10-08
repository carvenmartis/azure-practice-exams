'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StartExamLink } from '@/components/exam/start-exam-link';
import { Badge } from '@/components/ui/badge';
import { Button, buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { splitExamName } from '@/lib/exams';
import type { Exam } from '@/lib/exams';
import { clearExamHistory } from '@/lib/progress-store';
import type { Attempt, TopicTally } from '@/lib/progress-store';
import { drillHref, drillSize, otherTopic } from '@/lib/topics';
import { formatDuration } from '@/lib/utils';
import { ScoreTrend } from './score-trend';

interface ExamProgressProps {
  exam: Exam;
  /** This exam's attempts, oldest first. */
  attempts: Attempt[];
  /** Missed questions due for spaced repetition review now. */
  mistakeCount: number;
}

/** Topics need this many answers before they can be called weak. */
const minAnswersPerTopic = 3;

/** Skill areas sorted from lowest to highest share of right answers over all attempts. */
function weakestTopics(attempts: Attempt[]) {
  const totals: Record<string, TopicTally> = {};
  for (const attempt of attempts) {
    for (const [topic, tally] of Object.entries(attempt.topics)) {
      totals[topic] ??= { correct: 0, total: 0 };
      totals[topic].correct += tally.correct;
      totals[topic].total += tally.total;
    }
  }
  return Object.entries(totals)
    .filter(([topic, tally]) => topic !== otherTopic && tally.total >= minAnswersPerTopic)
    .map(([topic, tally]) => ({ topic, ...tally, share: tally.correct / tally.total }))
    .sort((a, b) => a.share - b.share)
    .slice(0, 3);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * One exam on the My progress page: headline numbers, the score trend, the
 * weakest skill areas and the latest attempts.
 */
export function ExamProgress({ exam, attempts, mistakeCount }: ExamProgressProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const { code, title } = splitExamName(exam);
  const latest = attempts[attempts.length - 1];
  const best = Math.max(...attempts.map((attempt) => attempt.score));
  const weakest = weakestTopics(attempts);
  const recent = attempts.slice(-5).reverse();

  const stats = [
    { label: 'Attempts', value: attempts.length },
    { label: 'Latest', value: latest.score },
    { label: 'Best', value: best }
  ];

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge>{code}</Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-snug">{title}</h2>
        </div>
        <StartExamLink slug={exam.slug} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
          New attempt
        </StartExamLink>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-surface-muted px-4 py-3">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold lining-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section aria-label="Score trend">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Score trend</h3>
          <div className="mt-4 max-w-md">
            <ScoreTrend attempts={attempts.slice(-20)} />
          </div>
        </section>

        <section aria-label="Weakest topics">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Weakest topics</h3>
          {weakest.length > 0 && (
            <p className="mt-2 text-sm text-ink-muted">
              A drill is a short round of {drillSize} questions from just that skill area.
            </p>
          )}
          {weakest.length ? (
            <ul className="mt-4 space-y-4">
              {weakest.map((item) => (
                <li key={item.topic}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{item.topic}</span>
                    <span className="shrink-0 text-ink-muted lining-nums">
                      {item.correct}/{item.total} right
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round(item.share * 100)}%` }} />
                  </div>
                  <Link
                    href={drillHref(exam.slug, item.topic)}
                    className="mt-2 inline-block text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                    aria-label={`Drill ${item.topic}: ${drillSize} questions`}
                  >
                    Drill this topic
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">
              Answer at least {minAnswersPerTopic} questions in a skill area to see how you do in it.
            </p>
          )}
        </section>
      </div>

      <section aria-label="Recent attempts" className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Recent attempts</h3>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="sr-only">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Result</th>
              <th scope="col">Time</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {recent.map((attempt) => (
              <tr key={attempt.finishedAt}>
                <td className="py-2.5 pr-3 text-ink-muted">{formatDate(attempt.finishedAt)}</td>
                <td className="py-2.5 pr-3 text-ink-muted">
                  {attempt.correct} of {attempt.total} right{attempt.endedEarly ? ', ended early' : ''}
                </td>
                <td className="py-2.5 pr-3 text-right text-ink-subtle lining-nums">
                  {attempt.durationSeconds ? formatDuration(attempt.durationSeconds) : ''}
                </td>
                <td className="py-2.5 text-right font-semibold lining-nums">{attempt.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        {mistakeCount ? (
          <Link
            href={`/exams/${exam.slug}?mode=review`}
            className="text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            Review {mistakeCount} mistake{mistakeCount === 1 ? '' : 's'} due now
          </Link>
        ) : (
          <p className="text-sm text-ink-muted">No mistakes due for review</p>
        )}
        <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
          Clear history
        </Button>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title={`Clear your ${code} history?`}
        message="This deletes your attempts and saved mistakes for this exam on this device. Bookmarks stay."
        confirmLabel="Clear history"
        cancelLabel="Keep it"
        onConfirm={() => {
          clearExamHistory(exam.slug);
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </Card>
  );
}
