import { CategoryCard } from '@/components/dashboard/category-card';
import { DailyGoal } from '@/components/dashboard/daily-goal';
import { ReviewDueBanner } from '@/components/dashboard/review-due-banner';
import { PageLayout } from '@/components/layout/page-layout';
import { StatCard } from '@/components/ui/stat-card';
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
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <section className="mb-14 sm:mb-16">
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tighter sm:text-5xl">
            Prepare for your Microsoft Azure certification
          </h1>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            Pick a category, then an exam to start an untimed practice run. Each question shows the correct
            answer, an explanation and a link to the Microsoft documentation.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
            {facts.map((fact) => (
              <StatCard key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>
          <DailyGoal />
          <ReviewDueBanner />
        </section>

        <section aria-labelledby="categories-heading">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="categories-heading" className="font-display text-2xl font-semibold tracking-tight">
              Categories
            </h2>
            <p className="text-sm text-ink-subtle">{categories.length} categories</p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
