import { useEffect, useState } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useDarkMode } from '../_app';
import CourseHeader from '../../components/CourseHeader';
import { exams, siteName } from '../../lib/exams';

interface ProcessedQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  link?: string;
}

interface ExamPageProps {
  slug: string;
}

/**
 * The ExamPage component displays a quiz for a given exam. It
 * downloads the questions from public/exam-data/<slug>.json (generated
 * by scripts/build-exam-data.mjs), randomly selects up to 60 of them
 * and walks the user through them one at a time. After each answer
 * selection the correct answer, explanation and documentation link
 * are revealed. When all questions have been answered a score out
 * of 1000 points is calculated and shown.
 */
export default function ExamPage({ slug }: ExamPageProps) {
  // Load the questions in the browser, then shuffle and limit to 60.
  const [questions, setQuestions] = useState<ProcessedQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/exam-data/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ProcessedQuestion[]>;
      })
      .then((exam) => {
        if (cancelled) return;
        const shuffled = [...exam];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuestions(shuffled.slice(0, 60));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const { darkMode } = useDarkMode();

  // The sticky header shows the full course name, falling back to the slug.
  const courseName = exams.find((exam) => exam.slug === slug)?.name ?? slug.toUpperCase();
  const pageHead = (
    <Head>
      <title>{`${courseName} | ${siteName}`}</title>
    </Head>
  );

  if (!questions) {
    return (
      <>
        {pageHead}
        <CourseHeader title={courseName} />
        <div className={`min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
          <p className="text-lg">
            {loadError
              ? `Could not load the ${slug.toUpperCase()} questions. Please refresh the page.`
              : `Loading ${slug.toUpperCase()} questions...`}
          </p>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    // Prevent changing an answer once selected
    if (selectedAnswers[currentIndex] !== undefined) return;
    const newSelections = [...selectedAnswers];
    newSelections[currentIndex] = optionIndex;
    setSelectedAnswers(newSelections);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  // Once we have answered all questions, calculate the result
  if (currentIndex >= questions.length) {
    const total = questions.length;
    const correctCount = selectedAnswers.filter(
      (sel, idx) => sel === questions[idx].answerIndex
    ).length;
    const score = Math.round((correctCount / total) * 1000);
    return (
      <>
        {pageHead}
        <CourseHeader title={courseName} eyebrow="Results" />
        <div className={`min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
          <h1 className="text-3xl font-bold mb-4">Exam Complete</h1>
          <p className="text-lg mb-2">
            You answered {correctCount} out of {total} questions correctly.
          </p>
          <p className="text-2xl font-semibold mb-6">Score: {score} / 1000</p>
          <Link href="/">
            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Back to Dashboard
            </div>
          </Link>
        </div>
      </>
    );
  }

  const userSelection = selectedAnswers[currentIndex];
  const showFeedback = userSelection !== undefined;

  return (
    <>
      {pageHead}
      <CourseHeader title={courseName} eyebrow={`Question ${currentIndex + 1} of ${questions.length}`} />
      <div className={`min-h-[calc(100dvh-4rem)] py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-3xl w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {slug.toUpperCase()} Practice Exam
          </h1>
          <div className="mb-6 w-full flex flex-col items-center">
            <p className="text-lg font-medium text-center">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className={`mt-2 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}> 
              {currentQuestion.question}
            </p>
          </div>
          <div className="space-y-3 w-full flex flex-col items-center">
            {currentQuestion.options.map((opt, idx) => {
              let style = darkMode
                ? 'border-gray-600 hover:bg-gray-800'
                : 'border-gray-300 hover:bg-gray-100';
              if (showFeedback && userSelection === idx) {
                style = idx === currentQuestion.answerIndex
                  ? (darkMode ? 'border-green-400 bg-green-900' : 'border-green-500 bg-green-50')
                  : (darkMode ? 'border-red-400 bg-red-900' : 'border-red-500 bg-red-50');
              } else if (showFeedback && idx === currentQuestion.answerIndex) {
                style = darkMode
                  ? 'border-green-400 bg-green-900'
                  : 'border-green-500 bg-green-50';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={showFeedback}
                  className={`answer-button ${style} w-full`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className={`mt-6 p-4 border rounded-lg flex flex-col items-center w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="font-semibold text-center">
                Correct answer: {currentQuestion.options[currentQuestion.answerIndex]}
              </p>
              <p className={`mt-2 text-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {currentQuestion.explanation}
              </p>
              {currentQuestion.link && (
                <a
                  href={currentQuestion.link}
                  className={`mt-2 inline-block underline text-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn more
                </a>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Generate static paths for each exam in lib/exams.ts. If you add new exam
 * JSON files to the `data` directory you should also add them there.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exams.map((exam) => ({ params: { slug: exam.slug } })),
    fallback: false
  };
};

/**
 * Only the slug is passed to the page. The questions are downloaded in the
 * browser so they don't bloat the page data.
 */
export const getStaticProps: GetStaticProps<ExamPageProps> = async ({ params }) => {
  return {
    props: {
      slug: params?.slug as string
    }
  };
};
