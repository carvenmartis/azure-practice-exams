import { StartExamLink } from '@/components/exam/start-exam-link';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { splitExamName } from '@/lib/exams';
import type { Exam } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

interface ExamCardProps {
  exam: Exam;
}

/** Dashboard card that starts an exam (after a confirm dialog): code badge, title and summary. */
export function ExamCard({ exam }: ExamCardProps) {
  const { code, title } = splitExamName(exam);

  return (
    <StartExamLink
      slug={exam.slug}
      className={cardClasses(
        cn(
          'group relative flex h-full flex-col overflow-hidden p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lifted motion-reduce:transform-none',
          focusRing
        )
      )}
    >
      {/* Gold rule that draws in along the top edge on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
      />
      <Badge className="self-start">{code}</Badge>
      <h3 className="mt-5 font-display text-xl font-semibold leading-snug">{title}</h3>
      {exam.description && (
        <p className="mt-3 mb-6 text-sm leading-relaxed text-ink-muted">{exam.description}</p>
      )}
      <span className="mt-auto flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-ink transition-colors group-hover:text-accent-strong">
        Start practice exam
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </StartExamLink>
  );
}
