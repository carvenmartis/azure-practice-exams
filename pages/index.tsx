import Head from 'next/head';
import Link from 'next/link';
import { useDarkMode } from './_app';
import { useEffect } from 'react';
import CourseHeader from '../components/CourseHeader';
import { exams, siteName, splitExamName } from '../lib/exams';

/**
 * Home page renders a dashboard of available practice exams under a sticky
 * header with the site name. The exams are presented in a responsive grid.
 * Selecting a card navigates to the corresponding exam page.
 */
export default function Home() {
  const { darkMode, setDarkMode } = useDarkMode();

  useEffect(() => {
    if (typeof window !== 'undefined' && setDarkMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, [setDarkMode]);

  const facts = [
    { label: 'Practice exams', value: exams.length },
    { label: 'Questions per attempt', value: 'Up to 60' },
    { label: 'Scored out of', value: 1000 }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Head>
        <title>{siteName}</title>
      </Head>
      <CourseHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <p className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Prepare for your Microsoft Azure certification
          </h1>
          <p className={`mt-3 max-w-2xl text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Pick an exam to start an untimed practice run. Each question shows the correct
            answer, an explanation and a link to the Microsoft documentation.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className={`rounded-xl border px-5 py-4 ${
                  darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white shadow-xs'
                }`}
              >
                <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fact.label}</dt>
                <dd className="mt-1 text-2xl font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="exams-heading">
          <h2 id="exams-heading" className="mb-4 text-xl font-semibold">
            Available exams
          </h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const { code, title } = splitExamName(exam);
              return (
                <li key={exam.slug}>
                  <Link
                    href={`/exams/${exam.slug}`}
                    className={`group flex h-full flex-col rounded-xl border p-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      darkMode
                        ? 'border-gray-800 bg-gray-900 hover:border-blue-500 focus-visible:outline-blue-400'
                        : 'border-gray-200 bg-white shadow-sm hover:border-blue-600 focus-visible:outline-blue-600'
                    }`}
                  >
                    <span
                      className={`self-start rounded-md px-2 py-1 text-xs font-semibold ${
                        darkMode ? 'bg-blue-950 text-blue-300' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {code}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold leading-snug">{title}</h3>
                    {exam.description && (
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {exam.description}
                      </p>
                    )}
                    <span
                      className={`mt-auto pt-6 text-sm font-semibold ${
                        darkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-700 group-hover:text-blue-800'
                      }`}
                    >
                      Start practice exam <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
