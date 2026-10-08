import { useCallback, useEffect, useRef, useState } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnswerFeedback } from '@/components/exam/answer-feedback';
import { BookmarkButton } from '@/components/exam/bookmark-button';
import { AnswerOption } from '@/components/exam/answer-option';
import type { AnswerState } from '@/components/exam/answer-option';
import { ExamResults } from '@/components/exam/exam-results';
import { ExamTimer } from '@/components/exam/exam-timer';
import { QuestionNavigator } from '@/components/exam/question-navigator';
import { PageLayout } from '@/components/layout/page-layout';
import { Button, buttonClasses } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { fetchExamQuestions } from '@/lib/exam-data';
import type { ExamQuestion } from '@/lib/exam-data';
import { exams } from '@/lib/exams';
import { setLeaveGuard } from '@/lib/leave-guard';
import { getProgress, recordAnswers, recordAttempt, reviewQueue } from '@/lib/progress-store';
import type { TopicTally } from '@/lib/progress-store';
import { shuffleAllOptions } from '@/lib/shuffle-options';
import { topicFor } from '@/lib/topics';

interface ExamPageProps {
  slug: string;
}

/**
 * 'exam': 60 random questions, scored and saved to My progress.
 * 'review': missed questions that are due again (?mode=review), or every
 *   question on the review list (?mode=review&scope=all).
 * 'bookmarks': only bookmarked questions (?mode=bookmarks).
 * Every mode updates the mistakes list; only 'exam' adds an attempt.
 */
export type PracticeMode = 'exam' | 'review' | 'bookmarks';

const questionsPerAttempt = 60;

/**
 * The ExamPage component displays a quiz for a given exam. It
 * downloads the questions from public/exam-data/<slug>.json (generated
 * by scripts/build-exam-data.mjs), randomly selects up to 60 of them
 * and walks the user through them one at a time. After each answer
 * selection the correct answer, explanation and documentation link
 * are revealed. When all questions have been answered a score out
 * of 1000 points is calculated and shown. Leaving mid-exam (Exit button,
 * header or menu links, Back) asks first and then shows the results so far.
 * With ?mode=review the questions come from the missed questions that are due
 * for spaced repetition review instead.
 * A clock shows the time taken, which is saved with the attempt. Questions
 * can be skipped and answered later from the question overview.
 */
export default function ExamPage({ slug }: ExamPageProps) {
  // Load the questions in the browser, then shuffle, limit to 60 and shuffle each question's answers.
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  // Wall-clock start (questions shown) and end (results shown) of the attempt.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const router = useRouter();
  const mode: PracticeMode =
    router.query.mode === 'review' || router.query.mode === 'bookmarks' ? router.query.mode : 'exam';
  // Review rounds take only the questions that are due, unless asked for all of them.
  const reviewAll = router.query.scope === 'all';

  useEffect(() => {
    // The query string is only known once the router is ready.
    if (!router.isReady) return;
    let cancelled = false;
    fetchExamQuestions(slug)
      .then((exam) => {
        if (cancelled) return;
        const saved = getProgress();
        const queue = reviewQueue(saved, slug);
        const reviewIds = reviewAll ? [...queue.due, ...queue.later] : queue.due;
        const picked = new Set((mode === 'review' ? reviewIds : saved.bookmarks[slug]) ?? []);
        const pool = mode === 'exam' ? exam : exam.filter((question) => picked.has(question.id));
        const shuffled = [...pool];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Each question's answers are reshuffled too, so the correct one moves around.
        setQuestions(shuffleAllOptions(shuffled.slice(0, questionsPerAttempt)));
        setStartedAt(Date.now());
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, mode, reviewAll, router.isReady]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const inProgress = questions !== null && questions.length > 0 && endedAt === null;
  const finished = questions !== null && questions.length > 0 && endedAt !== null;
  const answeredCount = selectedAnswers.filter((sel) => sel !== undefined).length;
  // Exited, or finished with skipped questions left unanswered.
  const endedEarly = finished && answeredCount < questions.length;
  const durationSeconds = endedAt !== null && startedAt !== null ? Math.round((endedAt - startedAt) / 1000) : 0;

  // Save the attempt and the wrong answers once, when the results appear.
  const saved = useRef(false);
  useEffect(() => {
    if (!finished || saved.current) return;
    saved.current = true;
    const answered = questions
      .map((question, idx) => ({ question, selection: selectedAnswers[idx] }))
      .filter(({ selection }) => selection !== undefined);
    if (!answered.length) return;
    const topics: Record<string, TopicTally> = {};
    for (const { question, selection } of answered) {
      const topic = topicFor(slug, question);
      topics[topic] ??= { correct: 0, total: 0 };
      topics[topic].total += 1;
      if (selection === question.answerIndex) topics[topic].correct += 1;
    }
    const correct = answered.filter(({ question, selection }) => selection === question.answerIndex).length;
    recordAnswers(
      slug,
      answered.map(({ question, selection }) => ({ id: question.id, correct: selection === question.answerIndex }))
    );
    if (mode !== 'exam') return;
    recordAttempt({
      slug,
      finishedAt: new Date().toISOString(),
      total: questions.length,
      answered: answered.length,
      correct,
      score: Math.round((correct / questions.length) * 1000),
      endedEarly,
      durationSeconds,
      topics
    });
  }, [finished, questions, selectedAnswers, slug, endedEarly, durationSeconds, mode]);

  // While the exam is running, ask before leaving: header and menu links go
  // through the leave guard, Back through beforePopState, and closing or
  // reloading the tab gets the browser's own prompt.
  useEffect(() => {
    if (!inProgress) return;
    const removeGuard = setLeaveGuard(() => {
      setConfirmExit(true);
      return false;
    });
    // Back has already moved the URL, so put the exam entry back on top.
    const examEntry = window.history.state;
    router.beforePopState(() => {
      window.history.pushState(examEntry, '', router.asPath);
      setConfirmExit(true);
      return false;
    });
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      removeGuard();
      router.beforePopState(() => true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [inProgress, router]);

  const handleCancelExit = useCallback(() => setConfirmExit(false), []);

  const handleConfirmExit = () => {
    setConfirmExit(false);
    setEndedAt(Date.now());
  };

  const handleConfirmFinish = () => {
    setConfirmFinish(false);
    setEndedAt(Date.now());
  };

  // Go back to the first question that was skipped.
  const handleAnswerSkipped = () => {
    setConfirmFinish(false);
    const firstSkipped = questions?.findIndex((_, idx) => selectedAnswers[idx] === undefined) ?? -1;
    if (firstSkipped >= 0) setCurrentIndex(firstSkipped);
  };

  // The header shows the full course name, falling back to the slug.
  const courseName = exams.find((exam) => exam.slug === slug)?.name ?? slug.toUpperCase();
  const layoutProps = {
    pageTitle: courseName,
    headerTitle: courseName,
    className: 'flex flex-col items-center px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:px-8'
  };

  if (!questions) {
    return (
      <PageLayout {...layoutProps}>
        <p className="text-lg text-ink-muted">
          {loadError
            ? `Could not load the ${slug.toUpperCase()} questions. Please refresh the page.`
            : `Loading ${slug.toUpperCase()} questions...`}
        </p>
      </PageLayout>
    );
  }

  if (!questions.length) {
    return (
      <PageLayout {...layoutProps}>
        <div className="flex max-w-xl flex-col items-center text-center">
          <p className="text-lg text-ink-muted">
            {mode === 'review'
              ? `Nothing to review for ${slug.toUpperCase()} right now. Missed questions come back here when they are due.`
              : `You have no ${slug.toUpperCase()} bookmarks yet.`}
          </p>
          <Link href={mode === 'review' ? '/review' : '/bookmarks'} className={buttonClasses({ className: 'mt-8' })}>
            Back to {mode === 'review' ? 'Review mistakes' : 'Bookmarks'}
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Once the exam is finished or exited, show the result.
  if (finished) {
    const correctCount = selectedAnswers.filter(
      (sel, idx) => sel === questions[idx].answerIndex
    ).length;
    return (
      <PageLayout {...layoutProps} eyebrow="Results">
        <ExamResults
          total={questions.length}
          answeredCount={answeredCount}
          correctCount={correctCount}
          endedEarly={endedEarly}
          durationSeconds={durationSeconds}
          mode={mode}
        />
      </PageLayout>
    );
  }

  const currentQuestion = questions[currentIndex];
  const userSelection = selectedAnswers[currentIndex];
  const showFeedback = userSelection !== undefined;

  const handleSelect = (optionIndex: number) => {
    // Prevent changing an answer once selected
    if (showFeedback) return;
    const newSelections = [...selectedAnswers];
    newSelections[currentIndex] = optionIndex;
    setSelectedAnswers(newSelections);
  };

  const unansweredCount = questions.length - answeredCount;

  // Next and Skip both go to the next unanswered question. When none is left
  // after this one, the exam ends, or with skipped questions still open asks
  // whether to go back to them first.
  const nextUnanswered = questions.findIndex(
    (_, idx) => idx > currentIndex && selectedAnswers[idx] === undefined
  );

  const handleNext = () => {
    if (nextUnanswered >= 0) {
      setCurrentIndex(nextUnanswered);
    } else if (unansweredCount > 0) {
      setConfirmFinish(true);
    } else {
      setEndedAt(Date.now());
    }
  };

  const answerState = (optionIndex: number): AnswerState => {
    if (!showFeedback) return 'default';
    if (optionIndex === currentQuestion.answerIndex) return 'correct';
    return optionIndex === userSelection ? 'incorrect' : 'default';
  };

  return (
    <PageLayout {...layoutProps} eyebrow={`Question ${currentIndex + 1} of ${questions.length}`}>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {slug.toUpperCase()} {{ exam: 'practice exam', review: 'mistake review', bookmarks: 'bookmarks' }[mode]}
            </p>
            <div className="flex items-center gap-3">
              {startedAt !== null && <ExamTimer startedAt={startedAt} />}
              <Button variant="ghost" size="sm" onClick={() => setConfirmExit(true)}>
                Exit exam
              </Button>
            </div>
          </div>
          <div
            className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-muted"
            role="progressbar"
            aria-label="Exam progress"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <QuestionNavigator
            answered={questions.map((_, idx) => selectedAnswers[idx] !== undefined)}
            currentIndex={currentIndex}
            onJump={setCurrentIndex}
          />
        </div>
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-ink-subtle">
              Question {currentIndex + 1} <span className="text-ink-subtle/70">of {questions.length}</span>
            </p>
            <BookmarkButton slug={slug} questionId={currentQuestion.id} />
          </div>
          <h1 className="mt-3 text-lg leading-relaxed font-semibold sm:text-xl">
            {currentQuestion.question}
          </h1>
        </div>
        <div className="flex w-full flex-col space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <AnswerOption
              key={idx}
              state={answerState(idx)}
              disabled={showFeedback}
              onSelect={() => handleSelect(idx)}
            >
              {option}
            </AnswerOption>
          ))}
        </div>
        {showFeedback && (
          <AnswerFeedback
            correctAnswer={currentQuestion.options[currentQuestion.answerIndex]}
            explanation={currentQuestion.explanation}
            link={currentQuestion.link}
            isLastQuestion={nextUnanswered < 0 && unansweredCount === 0}
            onNext={handleNext}
            nextLabel={nextUnanswered < 0 && unansweredCount > 0 ? 'Finish exam' : undefined}
          />
        )}
        {!showFeedback && (
          <div className="mt-6 flex w-full justify-end">
            <Button variant="secondary" onClick={handleNext}>
              Skip for now
            </Button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmExit}
        title="Exit this exam?"
        message={`You've answered ${answeredCount} of ${questions.length} questions. Exiting ends the exam and shows your results so far.`}
        confirmLabel="Exit and see results"
        cancelLabel="Keep practicing"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
      <ConfirmDialog
        open={confirmFinish}
        title={`${unansweredCount} question${unansweredCount === 1 ? '' : 's'} still unanswered`}
        message="You skipped some questions. Go back and answer them, or finish now and count them as wrong."
        confirmLabel="Finish exam"
        cancelLabel="Answer skipped questions"
        onConfirm={handleConfirmFinish}
        onCancel={handleAnswerSkipped}
      />
    </PageLayout>
  );
}

/**
 * Generate static paths for each exam in src/lib/exams.ts. If you add new exam
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
