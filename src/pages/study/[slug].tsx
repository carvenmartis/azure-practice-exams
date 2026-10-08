import { useEffect, useMemo, useState } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnswerFeedback } from '@/components/exam/answer-feedback';
import { AnswerOption } from '@/components/exam/answer-option';
import type { AnswerState } from '@/components/exam/answer-option';
import { BookmarkButton } from '@/components/exam/bookmark-button';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { fetchExamQuestions } from '@/lib/exam-data';
import type { ExamQuestion } from '@/lib/exam-data';
import { getExamGuide } from '@/lib/exam-guides';
import { exams } from '@/lib/exams';
import { shuffleAllOptions } from '@/lib/shuffle-options';
import { otherTopic, topicFor } from '@/lib/topics';
import { cn, focusRing } from '@/lib/utils';

interface StudyQuestion extends ExamQuestion {
  topic: string;
}

interface StudyPageProps {
  slug: string;
}

const allTopics = '';

/** <main> (from PageLayout) is the scroll area, not the window. */
function scrollToTop() {
  document.querySelector('main')?.scrollTo({ top: 0 });
}

/**
 * Study mode for one exam: every question in a random order, optionally
 * narrowed to one skill area. No timer and no score; picking an option (or
 * Show answer) reveals the answer and explanation straight away, and you
 * can step back and forth. Nothing is saved except bookmarks.
 */
export default function StudyPage({ slug }: StudyPageProps) {
  const [questions, setQuestions] = useState<StudyQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();
  // Exam guides link here with ?topic=<skill area>; picking another area overrides it.
  const [topicChoice, setTopicChoice] = useState<string | null>(null);
  const topic = topicChoice ?? (typeof router.query.topic === 'string' ? router.query.topic : allTopics);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Keyed by question id: the option picked, or -1 when the answer was just revealed.
  const [selections, setSelections] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    fetchExamQuestions(slug)
      .then((exam) => {
        if (cancelled) return;
        const shuffled = [...exam];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuestions(shuffleAllOptions(shuffled).map((question) => ({ ...question, topic: topicFor(slug, question) })));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const question of questions ?? []) counts[question.topic] = (counts[question.topic] ?? 0) + 1;
    return counts;
  }, [questions]);

  const topicOptions = [
    ...(getExamGuide(slug)?.areas.map((area) => area.name) ?? []),
    otherTopic
  ].filter((name) => topicCounts[name]);

  const visible = (questions ?? []).filter((question) => topic === allTopics || question.topic === topic);
  const courseName = exams.find((exam) => exam.slug === slug)?.name ?? slug.toUpperCase();
  const layoutProps = {
    pageTitle: `Study ${courseName}`,
    headerTitle: courseName,
    className: 'flex flex-col items-center px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:px-8'
  };

  if (!questions) {
    return (
      <PageLayout {...layoutProps} eyebrow="Study mode">
        <p className="text-lg text-ink-muted">
          {loadError
            ? `Could not load the ${slug.toUpperCase()} questions. Please refresh the page.`
            : `Loading ${slug.toUpperCase()} questions...`}
        </p>
      </PageLayout>
    );
  }

  const handleTopicChange = (value: string) => {
    setTopicChoice(value);
    setCurrentIndex(0);
  };

  if (!visible.length) {
    return (
      <PageLayout {...layoutProps} eyebrow="Study mode">
        <div className="flex max-w-xl flex-col items-center text-center">
          <p className="text-lg text-ink-muted">There are no {slug.toUpperCase()} questions for this skill area yet.</p>
          <Button className="mt-8" onClick={() => handleTopicChange(allTopics)}>
            Study all skill areas
          </Button>
        </div>
      </PageLayout>
    );
  }

  const index = Math.min(currentIndex, visible.length - 1);
  const current = visible[index];
  const selection = selections[current.id];
  const revealed = selection !== undefined;
  const isLast = index === visible.length - 1;

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    scrollToTop();
  };

  const handleSelect = (optionIndex: number) => {
    if (revealed) return;
    setSelections({ ...selections, [current.id]: optionIndex });
  };

  const handleNext = () => {
    goTo(isLast ? 0 : index + 1);
  };

  const answerState = (optionIndex: number): AnswerState => {
    if (!revealed) return 'default';
    if (optionIndex === current.answerIndex) return 'correct';
    return optionIndex === selection ? 'incorrect' : 'default';
  };

  return (
    <PageLayout {...layoutProps} eyebrow={`Study mode · ${index + 1} of ${visible.length}`}>
      <div className="flex w-full max-w-3xl flex-col">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Skill area
            <select
              value={topic}
              onChange={(event) => handleTopicChange(event.target.value)}
              className={cn(
                'w-full max-w-md rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm font-medium tracking-normal text-ink normal-case',
                focusRing
              )}
            >
              <option value={allTopics}>All skill areas ({questions.length})</option>
              {topicOptions.map((name) => (
                <option key={name} value={name}>
                  {name} ({topicCounts[name]})
                </option>
              ))}
            </select>
          </label>
          <Link
            href="/study"
            className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            Other exams
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-ink-subtle">
            Question {index + 1} <span className="text-ink-subtle/70">of {visible.length}</span>
            {topic === allTopics && <span className="hidden sm:inline"> · {current.topic}</span>}
          </p>
          <BookmarkButton slug={slug} questionId={current.id} />
        </div>
        <h1 className="mt-3 mb-8 text-lg leading-relaxed font-semibold sm:text-xl">{current.question}</h1>

        <div className="flex w-full flex-col space-y-3">
          {current.options.map((option, idx) => (
            <AnswerOption key={idx} state={answerState(idx)} disabled={revealed} onSelect={() => handleSelect(idx)}>
              {option}
            </AnswerOption>
          ))}
        </div>

        {revealed ? (
          <AnswerFeedback
            correctAnswer={current.options[current.answerIndex]}
            explanation={current.explanation}
            link={current.link}
            isLastQuestion={isLast}
            onNext={handleNext}
            nextLabel={isLast ? 'Back to the first question' : 'Next Question'}
          />
        ) : (
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setSelections({ ...selections, [current.id]: -1 })}>
              Show answer
            </Button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => goTo(index - 1)}>
            ← Previous
          </Button>
          <Button variant="ghost" size="sm" disabled={isLast} onClick={() => goTo(index + 1)}>
            Skip →
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

/** One study page per exam in src/lib/exams.ts. */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: exams.map((exam) => ({ params: { slug: exam.slug } })),
    fallback: false
  };
};

/** Only the slug is passed; the questions are downloaded in the browser. */
export const getStaticProps: GetStaticProps<StudyPageProps> = async ({ params }) => {
  return {
    props: {
      slug: params?.slug as string
    }
  };
};
