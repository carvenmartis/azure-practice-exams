'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkButton } from '@/components/exam/bookmark-button';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { fetchExamQuestions } from '@/lib/exam-data';
import type { ExamQuestion } from '@/lib/exam-data';
import { exams, splitExamName } from '@/lib/exams';
import { useProgress } from '@/lib/progress-store';

/**
 * Bookmarks: questions flagged during an exam, grouped by exam, with the
 * answer and explanation behind a toggle and a round of just those questions.
 */
export function BookmarkList() {
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
    <PageLayout headerTitle="Bookmarks">
      <PageContainer width="reading">
        <PageIntro
          title="Bookmarks"
          lede="Saved questions. Flag a tricky question with Bookmark during an exam and it waits for you here. Bookmarks are saved in this browser."
        />

        {loadError && (
          <p className="mb-8 text-ink-muted">Could not load some of the questions. Please refresh the page.</p>
        )}

        {slugs.length ? (
          <div className="space-y-12">
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
                      <h2 id={`bookmarks-${slug}`} className="mt-3 font-display text-xl font-semibold tracking-tight leading-snug">
                        {title}
                      </h2>
                    </div>
                    <Link href={`/exams/${slug}?mode=bookmarks`} className={buttonClasses({ size: 'sm' })}>
                      Practice <span className="tabular">{ids.length}</span> bookmark{ids.length === 1 ? '' : 's'}
                    </Link>
                  </div>
                  <ul className="divide-y divide-line">
                    {ids.map((id) => {
                      const question = byId.get(id);
                      if (!questionsBySlug[slug]) {
                        return (
                          <li key={id} className="py-5 text-sm text-ink-muted">
                            Loading question...
                          </li>
                        );
                      }
                      return (
                        <li key={id} className="py-6">
                          <div>
                            {question ? (
                              <>
                                <p className="font-semibold leading-relaxed">{question.question}</p>
                                <details className="group mt-4">
                                  <summary className="cursor-pointer text-sm font-semibold text-accent-strong select-none">
                                    <span className="group-open:hidden">Show answer</span>
                                    <span className="hidden group-open:inline">Hide answer</span>
                                  </summary>
                                  <p className="mt-3 text-xs font-medium text-accent-strong">
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
                            <div className="mt-4 flex justify-end">
                              <BookmarkButton slug={slug} questionId={id} />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="py-8">
            <p className="font-display text-xl font-semibold tracking-tight">No bookmarks yet</p>
            <p className="mt-2 max-w-[60ch] text-ink-muted">During an exam, tap Bookmark above a question to save it here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </div>
        )}
      </PageContainer>
    </PageLayout>
  );
}
