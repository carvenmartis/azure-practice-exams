'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnswerFeedback } from '@/components/exam/answer-feedback';
import { BookmarkButton } from '@/components/exam/bookmark-button';
import { LearnSearchLink, openLearnSearch } from '@/components/exam/learn-search-link';
import { AnswerOption } from '@/components/exam/answer-option';
import type { AnswerState } from '@/components/exam/answer-option';
import { ExamResults } from '@/components/exam/exam-results';
import { ExamTimer } from '@/components/exam/exam-timer';
import { QuestionNavigator } from '@/components/exam/question-navigator';
import { PageLayout } from '@/components/layout/page-layout';
import { ShortcutHelp } from '@/components/layout/shortcut-help';
import { Button, buttonClasses } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { fetchExamQuestions } from '@/lib/exam-data';
import type { ExamQuestion } from '@/lib/exam-data';
import { recordDailyAnswer } from '@/lib/daily-goal';
import { exams } from '@/lib/exams';
import { cycleFocus, optionLetters, optionShortcuts, revealFeedback, scrollToTop } from '@/lib/keyboard';
import { setLeaveGuard } from '@/lib/leave-guard';
import { getProgress, recordAnswers, recordAttempt, reviewQueue, toggleBookmark } from '@/lib/progress-store';
import type { TopicTally } from '@/lib/progress-store';
import { selectVariedQuestions } from '@/lib/question-selection';
import { shuffleAllOptions } from '@/lib/shuffle-options';
import { drillHref, drillSize, topicFor } from '@/lib/topics';

interface ExamSessionProps {
  slug: string;
}

/**
 * 'exam': 60 random questions, scored and saved to My progress.
 * 'review': missed questions that are due again (?mode=review), or every
 *   question on the review list (?mode=review&scope=all).
 * 'bookmarks': only bookmarked questions (?mode=bookmarks).
 * 'drill': a short round from one skill area (?mode=drill&topic=<name>),
 *   started from the weakest topics on My progress.
 * Every mode updates the mistakes list; only 'exam' adds an attempt.
 */
export type PracticeMode = 'exam' | 'review' | 'bookmarks' | 'drill';

const questionsPerAttempt = 60;

/** Where the 'nothing to practise' message links back to. */
const emptyBack: Record<PracticeMode, { href: string; label: string }> = {
  exam: { href: '/', label: 'Dashboard' },
  review: { href: '/review', label: 'Review mistakes' },
  bookmarks: { href: '/bookmarks', label: 'Bookmarks' },
  drill: { href: '/progress', label: 'My progress' }
};

/**
 * What Tab and the up/down arrows move between during the exam: the answers,
 * then Next once answered or Skip before. The header and menu are left out.
 */
const examFocusSelector = '#exam-answers button:not(:disabled), #answer-feedback button, #exam-skip';

/** Marks the extra history entry that catches Back during an exam. */
const backGuardKey = 'examBackGuard';

/**
 * The ExamSession component displays a quiz for a given exam. It
 * downloads the questions from public/exam-data/<slug>.json (generated
 * by scripts/build-exam-data.mjs), randomly selects up to 60 of them while
 * spreading out repeated questions, and walks the user through them one at a
 * time. After each answer selection the correct answer, explanation and documentation link
 * are revealed. When all questions have been answered a score out
 * of 1000 points is calculated and shown. Leaving mid-exam (Exit button,
 * header or menu links, Back) asks first and then shows the results so far.
 * With ?mode=review the questions come from the missed questions that are due
 * for spaced repetition review instead, and ?mode=drill&topic=<skill area>
 * gives a short round from one skill area.
 * A clock shows the time taken, which is saved with the attempt. Questions
 * can be skipped and answered later from the question overview.
 * Keyboard: focus starts on the first answer (or on Next once answered); Tab
 * and the up/down arrows move between the answers, Enter or Space picks one.
 * A-D or 1-4 answer directly, S skips, left/right step through the
 * questions, M bookmarks, Escape asks to exit and ? lists the shortcuts.
 */
export function ExamSession({ slug }: ExamSessionProps) {
  // Load the questions in the browser, then shuffle, limit to 60 and shuffle each question's answers.
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  // Wall-clock start (questions shown) and end (results shown) of the attempt.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const mode: PracticeMode =
    modeParam === 'review' || modeParam === 'bookmarks' || modeParam === 'drill' ? modeParam : 'exam';
  const topic = searchParams.get('topic') ?? '';
  // Review rounds take only the questions that are due, unless asked for all of them.
  const reviewAll = searchParams.get('scope') === 'all';

  useEffect(() => {
    let cancelled = false;
    fetchExamQuestions(slug)
      .then((exam) => {
        if (cancelled) return;
        const saved = getProgress();
        const queue = reviewQueue(saved, slug);
        const reviewIds = reviewAll ? [...queue.due, ...queue.later] : queue.due;
        const picked = new Set((mode === 'review' ? reviewIds : saved.bookmarks[slug]) ?? []);
        const pool =
          mode === 'exam'
            ? exam
            : mode === 'drill'
              ? exam.filter((question) => topicFor(slug, question) === topic)
              : exam.filter((question) => picked.has(question.id));
        const selected = selectVariedQuestions(pool, mode === 'drill' ? drillSize : questionsPerAttempt);
        // Each question's answers are reshuffled too, so the correct one moves around.
        setQuestions(shuffleAllOptions(selected));
        setStartedAt(Date.now());
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, mode, reviewAll, topic]);

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
  // through the leave guard, and closing or reloading the tab gets the
  // browser's own prompt. For Back, a copy of this page's history entry goes
  // on top; Back then only removes the copy, which is put back while the
  // exit prompt shows.
  useEffect(() => {
    if (!inProgress) return;
    const removeGuard = setLeaveGuard(() => {
      setConfirmExit(true);
      return false;
    });
    const pushBackGuard = () => {
      if (window.history.state?.[backGuardKey]) return;
      window.history.pushState({ ...window.history.state, [backGuardKey]: true }, '', window.location.href);
    };
    pushBackGuard();
    const handlePopState = () => {
      pushBackGuard();
      setConfirmExit(true);
    };
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      removeGuard();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [inProgress]);

  // Put keyboard focus on the first answer of each question, or on Next once
  // it is answered; also when a prompt is dismissed and the exam goes on.
  const currentAnswered = selectedAnswers[currentIndex] !== undefined;
  useEffect(() => {
    if (!inProgress || confirmExit || confirmFinish) return;
    const target = currentAnswered ? '#answer-feedback button' : '#exam-answers button';
    document.querySelector<HTMLElement>(target)?.focus({ preventScroll: true });
  }, [inProgress, currentIndex, currentAnswered, confirmExit, confirmFinish]);

  // Once the results show, drop the Back copy so one Back leaves the page again.
  const backGuardDropped = useRef(false);
  useEffect(() => {
    if (!finished || backGuardDropped.current) return;
    backGuardDropped.current = true;
    if (window.history.state?.[backGuardKey]) window.history.back();
  }, [finished]);

  const handleCancelExit = useCallback(() => setConfirmExit(false), [setConfirmExit]);

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
            {
              {
                exam: '',
                review: `Nothing to review for ${slug.toUpperCase()} right now. Missed questions come back here when they are due.`,
                bookmarks: `You have no ${slug.toUpperCase()} bookmarks yet.`,
                drill: `No ${slug.toUpperCase()} questions found for ${topic || 'this skill area'}.`
              }[mode]
            }
          </p>
          <Link href={emptyBack[mode].href} className={buttonClasses({ className: 'mt-8' })}>
            Back to {emptyBack[mode].label}
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
          topic={topic}
          drillHref={drillHref(slug, topic)}
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
    recordDailyAnswer();
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

  const goTo = (index: number) => {
    setCurrentIndex(index);
    scrollToTop();
  };

  const shortcutHandlers = {
    ...optionShortcuts(currentQuestion.options.length, (idx) => {
      if (showFeedback) return;
      handleSelect(idx);
      revealFeedback();
    }),
    Enter: () => {
      if (!showFeedback) return;
      handleNext();
      scrollToTop();
    },
    s: () => {
      if (showFeedback) return;
      handleNext();
      scrollToTop();
    },
    ArrowLeft: () => {
      if (currentIndex > 0) goTo(currentIndex - 1);
    },
    ArrowRight: () => {
      if (currentIndex < questions.length - 1) goTo(currentIndex + 1);
    },
    m: () => toggleBookmark(slug, currentQuestion.id),
    l: () => openLearnSearch(currentQuestion.question),
    Tab: (event: KeyboardEvent) => cycleFocus(examFocusSelector, event.shiftKey),
    ArrowDown: () => cycleFocus(examFocusSelector),
    ArrowUp: () => cycleFocus(examFocusSelector, true),
    Escape: () => {
      // Escape closes the menu drawer first, if it is open.
      if (!document.getElementById('site-menu')) setConfirmExit(true);
    }
  };

  return (
    <PageLayout {...layoutProps} eyebrow={`Question ${currentIndex + 1} of ${questions.length}`}>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-ink-subtle">
              {slug.toUpperCase()}{' '}
              {{ exam: 'practice exam', review: 'mistake review', bookmarks: 'bookmarks', drill: `drill: ${topic}` }[mode]}
            </p>
            <div className="flex items-center gap-3">
              <ShortcutHelp
                handlers={shortcutHandlers}
                shortcuts={[
                  { keys: ['Tab', '↑ ↓'], label: 'Move between the answers' },
                  { keys: ['Enter', 'Space'], label: 'Choose the answer in focus, then go on' },
                  { keys: ['A–D', '1–4'], label: 'Pick an answer directly' },
                  { keys: ['S'], label: 'Skip for now' },
                  { keys: ['←', '→'], label: 'Previous or next question' },
                  { keys: ['M'], label: 'Bookmark the question' },
                  { keys: ['L'], label: 'Search the question on Microsoft Learn' },
                  { keys: ['Esc'], label: 'Exit the exam' }
                ]}
              />
              {startedAt !== null && <ExamTimer startedAt={startedAt} />}
              <Button variant="ghost" size="sm" onClick={() => setConfirmExit(true)} aria-keyshortcuts="Escape">
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
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
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
            <div className="flex flex-wrap items-center justify-end gap-1">
              <LearnSearchLink question={currentQuestion.question} />
              <BookmarkButton slug={slug} questionId={currentQuestion.id} />
            </div>
          </div>
          <h1 className="mt-3 text-lg leading-relaxed font-semibold sm:text-xl">
            {currentQuestion.question}
          </h1>
        </div>
        <div id="exam-answers" className="flex w-full flex-col space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <AnswerOption
              key={idx}
              state={answerState(idx)}
              disabled={showFeedback}
              onSelect={() => handleSelect(idx)}
              shortcut={optionLetters[idx]}
            >
              {option}
            </AnswerOption>
          ))}
        </div>
        {showFeedback && (
          <AnswerFeedback
            question={currentQuestion}
            selectedIndex={userSelection}
            isLastQuestion={nextUnanswered < 0 && unansweredCount === 0}
            onNext={handleNext}
            nextLabel={nextUnanswered < 0 && unansweredCount > 0 ? 'Finish exam' : undefined}
          />
        )}
        {!showFeedback && (
          <div className="mt-6 flex w-full justify-end">
            <Button id="exam-skip" variant="secondary" onClick={handleNext} aria-keyshortcuts="S">
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
