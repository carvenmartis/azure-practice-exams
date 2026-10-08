import { useState } from 'react';
import type { Attempt } from '@/lib/progress-store';

interface ScoreTrendProps {
  attempts: Attempt[];
}

const width = 320;
const height = 96;
const padX = 8;
const padY = 10;
/** Microsoft certification exams are passed with 700 out of 1000. */
const passingScore = 700;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/**
 * Line of scores (0 to 1000) for an exam's attempts, oldest on the left, with
 * the passing score as a dashed rule. Hovering or focusing a point shows its
 * score and date in the caption; the caption shows the latest attempt otherwise.
 */
export function ScoreTrend({ attempts }: ScoreTrendProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const last = attempts.length - 1;
  const x = (idx: number) => (last === 0 ? width / 2 : padX + (idx / last) * (width - 2 * padX));
  const y = (score: number) => padY + (1 - score / 1000) * (height - 2 * padY);
  const points = attempts.map((attempt, idx) => `${x(idx)},${y(attempt.score)}`).join(' ');
  const shown = attempts[activeIndex ?? last];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Scores of the last ${attempts.length} attempts: ${attempts.map((a) => a.score).join(', ')}`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <line
          x1={0}
          x2={width}
          y1={y(passingScore)}
          y2={y(passingScore)}
          className="stroke-line-strong"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={width} y={y(passingScore) - 4} textAnchor="end" className="fill-ink-subtle text-[9px]">
          Pass {passingScore}
        </text>
        {attempts.length > 1 && (
          <polyline
            points={points}
            fill="none"
            className="stroke-accent"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {attempts.map((attempt, idx) => (
          <g key={attempt.finishedAt} onMouseEnter={() => setActiveIndex(idx)}>
            {/* Larger invisible circle so the point is easy to hover */}
            <circle cx={x(idx)} cy={y(attempt.score)} r={12} fill="transparent" />
            <circle
              cx={x(idx)}
              cy={y(attempt.score)}
              r={idx === (activeIndex ?? last) ? 5 : 4}
              className={attempt.score >= passingScore ? 'fill-accent stroke-surface' : 'fill-surface stroke-accent'}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>
      {shown && (
        <figcaption className="mt-2 text-xs text-ink-subtle" aria-live="polite">
          {activeIndex === null ? 'Latest' : `Attempt ${activeIndex + 1}`}: <span className="font-semibold text-ink lining-nums">{shown.score}</span> on{' '}
          {formatDate(shown.finishedAt)}
          {shown.endedEarly ? ' (ended early)' : ''}
        </figcaption>
      )}
    </figure>
  );
}
