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
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'}
      </p>
      <h3 className="mt-4 font-display text-2xl font-semibold leading-snug">{category.title}</h3>
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
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
