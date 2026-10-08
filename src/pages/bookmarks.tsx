import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkButton } from '@/components/exam/bookmark-button';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchExamQuestions } from '@/lib/exam-data';
import type { ExamQuestion } from '@/lib/exam-data';
import { exams, splitExamName } from '@/lib/exams';
import { useProgress } from '@/lib/progress-store';

/**
 * Bookmarks: questions flagged during an exam, grouped by exam, with the
 * answer and explanation behind a toggle and a round of just those questions.
 */
export default function Bookmarks() {
  const { bookmarks } = useProgress();
  const [questionsBySlug, setQuestionsBySlug] = useState<Record<string, ExamQuestion[]>>({});
  const [loadError, setLoadError] = useState(false);

  const slugs = exams.map((exam) => exam.slug).filter((slug) => bookmarks[slug]?.length);
  const missing = slugs.filter((slug) => !questionsBySlug[slug]).join(',');

  // Download the question files of exams with bookmarks that aren't loaded yet.
  useEffect(() => {
    if (!missing) return;
    let cancelled = false;
    const toLoad = missing.split(',');
    Promise.all(toLoad.map((slug) => fetchExamQuestions(slug)))
      .then((files) => {
        if (cancelled) return;
        setQuestionsBySlug((loaded) => {
          const next = { ...loaded };
          toLoad.forEach((slug, idx) => {
            next[slug] = files[idx];
          });
          return next;
        });
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [missing]);

  return (
    <PageLayout pageTitle="Bookmarks" headerTitle="Bookmarks">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Saved questions</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Bookmarks</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          Flag a tricky question with Bookmark during an exam and it waits for you here. Bookmarks are saved in this
          browser.
        </p>

        {loadError && (
          <p className="mt-8 text-ink-muted">Could not load some of the questions. Please refresh the page.</p>
        )}

        {slugs.length ? (
          <div className="mt-10 space-y-10">
            {slugs.map((slug) => {
              const exam = exams.find((item) => item.slug === slug);
              const { code, title } = splitExamName(exam);
              const ids = bookmarks[slug];
              const byId = new Map((questionsBySlug[slug] ?? []).map((question) => [question.id, question]));
              return (
                <section key={slug} aria-labelledby={`bookmarks-${slug}`}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <Badge>{code}</Badge>
                      <h2 id={`bookmarks-${slug}`} className="mt-3 font-display text-2xl font-semibold leading-snug">
                        {title}
                      </h2>
                    </div>
                    <Link href={`/exams/${slug}?mode=bookmarks`} className={buttonClasses({ size: 'sm' })}>
                      Practice {ids.length} bookmark{ids.length === 1 ? '' : 's'}
                    </Link>
                  </div>
                  <ul className="mt-5 space-y-4">
                    {ids.map((id) => {
                      const question = byId.get(id);
                      if (!questionsBySlug[slug]) {
                        return (
                          <li key={id} className="text-sm text-ink-muted">
                            Loading question...
                          </li>
                        );
                      }
                      return (
                        <li key={id}>
                          <Card className="p-5 sm:p-6">
                            {question ? (
                              <>
                                <p className="font-semibold leading-relaxed">{question.question}</p>
                                <details className="group mt-4">
                                  <summary className="cursor-pointer text-sm font-semibold text-accent-strong select-none">
                                    <span className="group-open:hidden">Show answer</span>
                                    <span className="hidden group-open:inline">Hide answer</span>
                                  </summary>
                                  <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                                    Correct answer
                                  </p>
                                  <p className="mt-1 font-semibold">{question.options[question.answerIndex]}</p>
                                  <p className="mt-3 leading-relaxed text-ink-muted">{question.explanation}</p>
                                  {question.link && (
                                    <a
                                      href={question.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-3 inline-block text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                                    >
                                      Read the Microsoft documentation
                                    </a>
                                  )}
                                </details>
                              </>
                            ) : (
                              <p className="text-ink-muted">This question was changed or removed from the exam.</p>
                            )}
                            <div className="mt-4 flex justify-end border-t border-line pt-3">
                              <BookmarkButton slug={slug} questionId={id} />
                            </div>
                          </Card>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <Card className="mt-10 px-6 py-10 text-center">
            <p className="font-display text-2xl font-semibold">No bookmarks yet</p>
            <p className="mt-3 text-ink-muted">During an exam, tap Bookmark above a question to save it here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
