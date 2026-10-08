import type { Metadata } from 'next';
import Link from 'next/link';
import { ExamCard } from '@/components/dashboard/exam-card';
import { PageLayout } from '@/components/layout/page-layout';
import { examCategories, examsInCategory } from '@/lib/exams';
import { focusRing } from '@/lib/utils';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

/** All exams of one dashboard category, opened from a category card on the home page. */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = examCategories.find((item) => item.id === id);
  const categoryExams = examsInCategory(category.id);

  return (
    <PageLayout headerTitle={category.title} eyebrow="Category">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <Link
          href="/"
          className={`text-sm font-semibold text-ink-muted transition-colors hover:text-accent-strong ${focusRing}`}
        >
          <span aria-hidden="true">←</span> All categories
        </Link>
        <section className="mt-8 mb-12 sm:mb-14">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Category
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            {category.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{category.description}</p>
        </section>

        <section aria-labelledby="category-exams-heading">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-4">
            <h2 id="category-exams-heading" className="font-display text-2xl font-semibold sm:text-3xl">
              Exams
            </h2>
            <p className="text-sm text-ink-subtle">
              {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'}
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryExams.map((exam) => (
              <li key={exam.slug}>
                <ExamCard exam={exam} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return examCategories
    .filter((category) => examsInCategory(category.id).length)
    .map((category) => ({ id: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: examCategories.find((category) => category.id === id).title };
}
