import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ExamCard } from '@/components/dashboard/exam-card';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
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
      <PageContainer>
        <PageIntro
          back={
            <Link
              href="/"
              className={`font-semibold text-ink-muted transition-colors hover:text-accent-strong ${focusRing}`}
            >
              <span aria-hidden="true">←</span> All categories
            </Link>
          }
          title={category.title}
          lede={category.description}
        />

        <section aria-labelledby="category-exams-heading">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="category-exams-heading" className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Exams
            </h2>
            <p className="text-sm text-ink-subtle">
              {categoryExams.length} {categoryExams.length === 1 ? 'exam' : 'exams'}
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryExams.map((exam, index) => (
              <li key={exam.slug} className="reveal-item" style={{ '--i': index } as CSSProperties}>
                <ExamCard exam={exam} />
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
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
