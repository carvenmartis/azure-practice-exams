import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { examsInCategory, splitExamName } from '@/lib/exams';
import type { ExamCategory } from '@/lib/exams';
import { focusRing } from '@/lib/utils';

interface CategoryCardProps {
  category: ExamCategory;
}

/**
 * Dashboard row that links to a category page: title, summary and its exam
 * codes. The rows sit in a divided list, so a category reads as a line to
 * scan, not a tile to compare.
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const categoryExams = examsInCategory(category.id);

  return (
    <Link
      href={`/categories/${category.id}`}
      className={`group -mx-4 grid gap-x-8 gap-y-3 rounded-xl px-4 py-7 transition-colors duration-150 hover:bg-surface-muted/60 sm:-mx-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:px-6 ${focusRing}`}
    >
      <span>
        <span className="block font-display text-xl font-semibold tracking-tight">{category.title}</span>
        <span className="mt-1.5 block max-w-[52ch] text-sm leading-relaxed text-ink-muted">{category.description}</span>
      </span>
      <ul className="flex flex-wrap gap-2">
        {categoryExams.map((exam) => (
          <li key={exam.slug}>
            <Badge>{splitExamName(exam).code}</Badge>
          </li>
        ))}
      </ul>
      <span className="flex items-center gap-2 text-sm font-semibold text-ink transition-colors group-hover:text-accent-strong">
        {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
        >
          →
        </span>
      </span>
    </Link>
  );
}
