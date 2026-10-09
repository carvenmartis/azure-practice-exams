import type { CSSProperties } from 'react';
import { CategoryCard } from '@/components/dashboard/category-card';
import { DailyGoal } from '@/components/dashboard/daily-goal';
import { ReviewDueBanner } from '@/components/dashboard/review-due-banner';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { examCategories, exams, examsInCategory } from '@/lib/exams';

const categories = examCategories.filter((category) => examsInCategory(category.id).length);

const facts = [
  { label: 'Practice exams', value: exams.length },
  { label: 'Questions per attempt', value: 60 },
  { label: 'Scored out of', value: 1000 }
];

/**
 * Home page renders a dashboard of available practice exams under an always-visible
 * header with the site name. The exams are grouped into category cards; selecting
 * a card opens that category's page (src/app/categories/[id]) with its exams.
 */
export default function Home() {
  return (
    <PageLayout>
      <PageContainer>
        <section className="mb-14 grid gap-10 sm:mb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tighter sm:text-5xl">
              Prepare for your Microsoft Azure certification
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted sm:text-lg">
              Pick a category, then an exam to start an untimed practice run. Each question shows the correct
              answer, an explanation and a link to the Microsoft documentation.
            </p>
            <dl className="mt-8 flex divide-x divide-line">
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

        <section aria-labelledby="categories-heading" className="mt-10">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 id="categories-heading" className="font-display text-2xl font-semibold tracking-tight">
              Categories
            </h2>
            <p className="text-sm text-ink-subtle">{categories.length} categories</p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {categories.map((category, index) => (
              <li key={category.id} className="reveal-item" style={{ '--i': index } as CSSProperties}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
    </PageLayout>
  );
}
