import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { examsInCategory, splitExamName } from '@/lib/exams';
import type { ExamCategory } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

interface CategoryCardProps {
  category: ExamCategory;
}

/** Dashboard card that links to a category page: title, summary and its exam codes. */
export function CategoryCard({ category }: CategoryCardProps) {
  const categoryExams = examsInCategory(category.id);

  return (
    <Link
      href={`/categories/${category.id}`}
      className={cardClasses(
        cn(
          'group relative flex h-full flex-col overflow-hidden p-7 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-line-strong hover:shadow-lifted active:scale-[0.99] motion-reduce:transform-none',
          focusRing
        )
      )}
    >
      <p className="text-sm font-medium text-ink-subtle">
        {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'}
      </p>
      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight leading-snug">{category.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{category.description}</p>
      <ul className="mt-5 mb-6 flex flex-wrap gap-2">
        {categoryExams.map((exam) => (
          <li key={exam.slug}>
            <Badge>{splitExamName(exam).code}</Badge>
          </li>
        ))}
      </ul>
      <span className="mt-auto flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-ink transition-colors group-hover:text-accent-strong">
        View exams
        <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
