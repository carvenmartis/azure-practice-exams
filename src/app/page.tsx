import type { CSSProperties } from 'react';
import { CategoryCard } from '@/components/dashboard/category-card';
import { DailyGoal } from '@/components/dashboard/daily-goal';
import { ReviewDueBanner } from '@/components/dashboard/review-due-banner';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { examCategories, exams, examsInCategory } from '@/lib/exams';
import { questionCounts } from '@/lib/server/exam-stats';

const categories = examCategories.filter((category) => examsInCategory(category.id).length);
const totalQuestions = Object.values(questionCounts).reduce((sum, count) => sum + count, 0);

const facts = [
  { label: 'Practice exams', value: exams.length },
  { label: 'Questions in the bank', value: totalQuestions.toLocaleString('en-US') },
  { label: 'Questions per attempt', value: 60 }
];

/**
 * Home page (Course): intro with the daily goal beside it, a banner while
 * missed questions are due for review, then a card per category. A category
 * card opens its page (src/app/categories/[id]) with the exam cards.
 */
export default function Home() {
  return (
    <PageLayout>
      <PageContainer>
        <section className="mb-12 grid gap-10 lg:mb-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-10 2xl:gap-16">
          <div>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tighter sm:text-5xl lg:text-4xl 2xl:text-5xl">
              Prepare for your Microsoft Azure certification
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted sm:text-lg lg:mt-4 lg:text-base">
              Untimed practice exams where every question shows the correct answer, an explanation and a link to the
              Microsoft documentation. Missed questions come back for review, and everything works offline.
            </p>
            <dl className="mt-8 flex divide-x divide-line lg:mt-6">
              {facts.map((fact) => (
                <div key={fact.label} className="px-4 first:pl-0 sm:px-6">
                  <dd className="font-display text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                    {fact.value}
                  </dd>
                  <dt className="mt-1 text-xs text-ink-subtle sm:text-sm">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <DailyGoal />
        </section>

        <ReviewDueBanner />

        <section aria-labelledby="categories-heading" className="mt-12 lg:mt-8">
          <div className="mb-6 flex items-baseline justify-between gap-4 lg:mb-4">
            <h2 id="categories-heading" className="font-display text-2xl font-semibold tracking-tight">
              Categories
            </h2>
            <p className="text-sm text-ink-subtle">{categories.length} categories</p>
          </div>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <li key={category.id} className="reveal-item" style={{ '--i': index } as CSSProperties}>
                <CategoryCard
                  category={category}
                  questionCount={examsInCategory(category.id).reduce((sum, exam) => sum + questionCounts[exam.slug], 0)}
                />
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
    </PageLayout>
  );
}
