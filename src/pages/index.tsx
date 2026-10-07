import { ExamCard } from '@/components/dashboard/exam-card';
import { PageLayout } from '@/components/layout/page-layout';
import { StatCard } from '@/components/ui/stat-card';
import { exams } from '@/lib/exams';

const facts = [
  { label: 'Practice exams', value: exams.length },
  { label: 'Questions per attempt', value: 60 },
  { label: 'Scored out of', value: 1000 }
];

/**
 * Home page renders a dashboard of available practice exams under a sticky
 * header with the site name. The exams are presented in a responsive grid.
 * Selecting a card navigates to the corresponding exam page.
 */
export default function Home() {
  return (
    <PageLayout className="bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Prepare for your Microsoft Azure certification
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
            Pick an exam to start an untimed practice run. Each question shows the correct
            answer, an explanation and a link to the Microsoft documentation.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {facts.map((fact) => (
              <StatCard key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>
        </section>

        <section aria-labelledby="exams-heading">
          <h2 id="exams-heading" className="mb-4 text-xl font-semibold">
            Available exams
          </h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
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
