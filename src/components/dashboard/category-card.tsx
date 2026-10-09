import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { examsInCategory, splitExamName } from '@/lib/exams';
import type { ExamCategory } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

interface CategoryCardProps {
  category: ExamCategory;
  /** Questions in the category's exams together. */
  questionCount: number;
}

/**
 * Dashboard card that opens a category page (src/app/categories/[id]) with
 * that category's exam cards: title, summary, its exam codes and how many
 * exams and questions it holds.
 */
export function CategoryCard({ category, questionCount }: CategoryCardProps) {
  const categoryExams = examsInCategory(category.id);

  return (
    <Link
      href={`/categories/${category.id}`}
      className={cn(
        cardClasses(
          'group flex h-full flex-col p-6 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-line-strong hover:shadow-lifted active:scale-[0.99] motion-reduce:transform-none sm:p-7'
        ),
        focusRing
      )}
    >
      <h3 className="font-display text-xl leading-snug font-semibold tracking-tight">{category.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{category.description}</p>
      <ul className="mt-5 mb-6 flex flex-wrap gap-2">
        {categoryExams.map((exam) => (
          <li key={exam.slug}>
            <Badge>{splitExamName(exam).code}</Badge>
          </li>
        ))}
      </ul>
      <span className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5 text-sm">
        <span className="text-ink-subtle tabular-nums">
          {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'} · {questionCount.toLocaleString('en-US')}{' '}
          questions
        </span>
        <span className="flex items-center gap-2 font-semibold text-ink transition-colors group-hover:text-accent-strong">
          View exams
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
          >
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
