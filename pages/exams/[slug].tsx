import { useMemo, useState } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import { useDarkMode } from '../_app';

interface Question {
  question?: string;
  options?: string[];
  answer?: string;
  answerIndex?: number;
  explanation?: string;
  link?: string;
}

interface ProcessedQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  link?: string;
}

interface ExamPageProps {
  slug: string;
  exam: ProcessedQuestion[];
}

/**
 * The ExamPage component displays a quiz for a given exam. It
 * randomly selects up to 60 questions from the loaded JSON file
 * and walks the user through them one at a time. After each answer
 * selection the correct answer, explanation and documentation link
 * are revealed. When all questions have been answered a score out
 * of 1000 points is calculated and shown.
 */
export default function ExamPage({ slug, exam }: ExamPageProps) {
  // Shuffle the questions and limit to 60.
  const questions = useMemo(() => {
    const shuffled = [...exam].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 60);
  }, [exam]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const { darkMode } = useDarkMode();

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
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
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
    );
  }

  const userSelection = selectedAnswers[currentIndex];
  const showFeedback = userSelection !== undefined;
  const isCorrect = showFeedback && userSelection === currentQuestion.answerIndex;

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
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
  );
}

/**
 * Generate static paths for each predefined exam. If you add new exam JSON
 * files to the `data` directory you should also include their slug here.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = ['az-104', 'az-204', 'az-400', 'az-304'];
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false
  };
};

/**
 * Load the exam data from disk at build time. The slug corresponds to
 * the file name under the `data` directory. JSON imports are enabled
 * via the TypeScript configuration.
 */
export const getStaticProps: GetStaticProps<ExamPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const dataPath = path.join(process.cwd(), 'data', `${slug}.json`);
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const rawData = JSON.parse(raw) as Question[];
  
  // Filter out incomplete entries and convert answer text to answerIndex
  const exam = rawData
    .filter(item => {
      // Keep only entries that have all required fields
      return item.question && item.options && item.answer && item.explanation;
    })
    .map(item => {
      // Convert "answer" to "answerIndex"
      const answerIndex = item.options!.findIndex(option => option === item.answer);
      
      return {
        question: item.question!,
        options: item.options!,
        answerIndex: answerIndex >= 0 ? answerIndex : 0, // Default to 0 if not found
        explanation: item.explanation!,
        ...(item.link && { link: item.link })
      } as ProcessedQuestion;
    });
    
  return {
    props: {
      slug,
      exam
    }
  };
};