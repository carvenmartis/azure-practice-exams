import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { splitExamName } from '@/lib/exams';
import type { Exam } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

interface ExamCardProps {
  exam: Exam;
}

/** Dashboard card that links to an exam: code badge, title and summary. */
export function ExamCard({ exam }: ExamCardProps) {
  const { code, title } = splitExamName(exam);

  return (
    <Link
      href={`/exams/${exam.slug}`}
      className={cardClasses(
        cn(
          'group flex h-full flex-col p-6 shadow-sm transition-colors hover:border-blue-600 dark:hover:border-blue-500',
          focusRing
        )
      )}
    >
      <Badge className="self-start">{code}</Badge>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{title}</h3>
      {exam.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{exam.description}</p>
      )}
      <span className="mt-auto pt-6 text-sm font-semibold text-blue-700 group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
        Start practice exam <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
