'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import type { StudyNote } from '@/lib/notes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn, focusRing } from '@/lib/utils';

export interface NoteSection {
  /** Skill area name, or 'Abbreviations' for the generated list. */
  title: string;
  /** Link to study this area's questions; absent for the abbreviation list. */
  studyHref?: string;
  notes: StudyNote[];
}

interface StudyNotesProps {
  sections: NoteSection[];
}

const linkClass =
  'text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent';

/** Lowercase text without accents and with plain hyphens, for matching the search box. */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‐-―]/g, '-');
}

/**
 * The study notes of one exam: each skill area's terms with their meaning,
 * plus the abbreviations. A search box narrows the list, area buttons jump
 * to a section, and Quiz me hides every meaning until you tap the term, so
 * you can test yourself before reading the answer.
 */
export function StudyNotes({ sections }: StudyNotesProps) {
  const [query, setQuery] = useState('');
  const [quiz, setQuiz] = useState(false);
  // Keys ('section/term') of notes shown during a quiz.
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const idPrefix = useId();

  const words = normalize(query).split(/\s+/).filter(Boolean);
  const visible = sections
    .map((section) => ({
      ...section,
      notes: words.length
        ? section.notes.filter(([term, definition]) => {
            const text = normalize(`${term} ${definition}`);
            return words.every((word) => text.includes(word));
          })
        : section.notes
    }))
    .filter((section) => section.notes.length);
  const total = sections.reduce((sum, section) => sum + section.notes.length, 0);
  const shown = visible.reduce((sum, section) => sum + section.notes.length, 0);
  const sectionId = (index: number) => `${idPrefix}-section-${index}`;

  const toggle = (key: string) =>
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const startQuiz = () => {
    setRevealed(new Set());
    setQuiz(true);
  };

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search the notes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms and meanings"
            className={cn(
              'w-full rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-base text-ink placeholder:text-ink-subtle',
              focusRing
            )}
          />
        </label>
        {quiz ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setRevealed(new Set(allKeys(visible)))}>
              Show all
            </Button>
            <Button onClick={() => setQuiz(false)}>Stop quiz</Button>
          </div>
        ) : (
          <Button onClick={startQuiz}>Quiz me</Button>
        )}
      </div>
      <p className="mt-3 text-sm text-ink-subtle" aria-live="polite">
        {words.length ? `${shown} of ${total} notes match` : `${total} notes`}
        {quiz && ' · Tap a term to check what it means.'}
      </p>

      {visible.length > 1 && (
        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
          {visible.map((section) => {
            const index = sections.findIndex((item) => item.title === section.title);
            return (
              <button
                key={section.title}
                type="button"
                onClick={() => document.getElementById(sectionId(index))?.scrollIntoView({ behavior: 'smooth' })}
                className={cn(
                  'rounded-lg border border-line bg-surface px-3 py-1 text-sm text-ink-muted transition-colors hover:border-accent hover:text-accent-strong',
                  focusRing
                )}
              >
                {section.title} <span className="text-ink-subtle">{section.notes.length}</span>
              </button>
            );
          })}
        </nav>
      )}

      {visible.length === 0 && (
        <p className="mt-10 text-ink-muted">No notes match &ldquo;{query}&rdquo;.</p>
      )}

      {visible.map((section) => {
        const index = sections.findIndex((item) => item.title === section.title);
        return (
          <section key={section.title} id={sectionId(index)} className="mt-12 scroll-mt-6">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
              <h2 className="font-display text-xl font-semibold tracking-tight">{section.title}</h2>
              {section.studyHref && (
                <Link href={section.studyHref} className={linkClass}>
                  Practice these questions
                </Link>
              )}
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {section.notes.map(([term, definition]) => {
                const key = `${section.title}/${term}`;
                const hidden = quiz && !revealed.has(key);
                return (
                  <Card key={key} className="p-5">
                    <dt className="font-display text-lg font-semibold leading-snug text-ink">
                      {quiz ? (
                        <button
                          type="button"
                          aria-expanded={!hidden}
                          onClick={() => toggle(key)}
                          className={cn('w-full text-left', focusRing)}
                        >
                          {term}
                          <span className="ml-2 align-middle text-xs font-sans font-medium text-accent-strong">
                            {hidden ? 'Show' : 'Hide'}
                          </span>
                        </button>
                      ) : (
                        term
                      )}
                    </dt>
                    <dd
                      className={cn(
                        'mt-2 text-sm leading-relaxed text-ink-muted',
                        hidden && 'cursor-pointer select-none rounded-md bg-surface-muted text-transparent'
                      )}
                      aria-hidden={hidden || undefined}
                      // The term button is the keyboard control; this only makes the grey block tappable too.
                      onClick={hidden ? () => toggle(key) : undefined}
                    >
                      {definition}
                    </dd>
                  </Card>
                );
              })}
            </dl>
          </section>
        );
      })}
    </>
  );
}

function allKeys(sections: NoteSection[]) {
  return sections.flatMap((section) => section.notes.map(([term]) => `${section.title}/${term}`));
}
