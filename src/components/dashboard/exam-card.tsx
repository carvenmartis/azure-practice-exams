import Link from 'next/link';
import { StartExamLink } from '@/components/exam/start-exam-link';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { splitExamName } from '@/lib/exams';
import type { Exam } from '@/lib/exams';
import { getExamNotes } from '@/lib/notes';
import { cn, focusRing } from '@/lib/utils';

interface ExamCardProps {
  exam: Exam;
}

/**
 * Dashboard card that starts an exam (after a confirm dialog): code badge,
 * title and summary. When the exam has study notes, a second link in the
 * bottom-right corner opens them; it sits on top of the start link, which
 * fills the rest of the card.
 */
export function ExamCard({ exam }: ExamCardProps) {
  const { code, title } = splitExamName(exam);
  const hasNotes = Boolean(getExamNotes(exam.slug));

  return (
    <div
      className={cardClasses(
        'group relative h-full overflow-hidden transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-line-strong hover:shadow-lifted active:scale-[0.99] motion-reduce:transform-none'
      )}
    >
      <StartExamLink slug={exam.slug} className={cn('flex h-full flex-col rounded-2xl p-7', focusRing)}>
        <Badge className="self-start">{code}</Badge>
        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight leading-snug">{title}</h3>
        {exam.description && (
          <p className="mt-3 mb-6 text-sm leading-relaxed text-ink-muted">{exam.description}</p>
        )}
        <span className="mt-auto flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-ink transition-colors group-hover:text-accent-strong">
          Start practice exam
          <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </StartExamLink>
      {hasNotes && (
        <Link
          href={`/notes/${exam.slug}`}
          aria-label={`${code} study notes`}
          className={cn(
            'absolute right-7 bottom-7 z-10 text-sm font-semibold text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-strong hover:decoration-accent',
            focusRing
          )}
        >
          Study notes
        </Link>
      )}
    </div>
  );
}
