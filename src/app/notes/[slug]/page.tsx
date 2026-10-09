import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { StudyNotes } from '@/components/notes/study-notes';
import type { NoteSection } from '@/components/notes/study-notes';
import { Badge } from '@/components/ui/badge';
import { findAbbreviations } from '@/lib/abbreviations';
import { getExamGuide } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { getExamNotes } from '@/lib/notes';
import { focusRing } from '@/lib/utils';

interface NotesPageProps {
  params: Promise<{ slug: string }>;
}

/** Every abbreviation the exam's questions, answers and explanations use, A to Z. */
function examAbbreviations(slug: string) {
  const file = path.join(process.cwd(), 'data', `${slug}.json`);
  const questions = JSON.parse(readFileSync(file, 'utf8')) as { question: string; options: string[]; explanation: string }[];
  return findAbbreviations(questions.flatMap((question) => [question.question, ...question.options, question.explanation]))
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }))
    .map(({ term, meaning }) => [term, meaning] as const);
}

/**
 * Study notes for one exam: the key terms and facts of each skill area of
 * the official outline (src/lib/notes), then the abbreviations its questions
 * use. Built at build time; StudyNotes adds search and a quiz mode.
 */
export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const exam = exams.find((item) => item.slug === slug);
  const { code, title } = splitExamName(exam);
  const notes = getExamNotes(slug) ?? [];
  // Follow the order of the official outline.
  const areas = getExamGuide(slug)?.areas.map((area) => area.name) ?? [];
  const groups = [...notes].sort((a, b) => areas.indexOf(a.area) - areas.indexOf(b.area));

  const sections: NoteSection[] = [
    ...groups.map((group) => ({
      title: group.area,
      studyHref: `/study/${slug}?topic=${encodeURIComponent(group.area)}`,
      notes: group.notes
    })),
    { title: 'Abbreviations', notes: examAbbreviations(slug) }
  ];

  return (
    <PageLayout headerTitle={exam.name} eyebrow="Study notes">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <Link
          href="/notes"
          className={`text-sm font-semibold text-ink-muted transition-colors hover:text-accent-strong ${focusRing}`}
        >
          <span aria-hidden="true">←</span> All study notes
        </Link>
        <div className="mt-8">
          <Badge>{code}</Badge>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tighter sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          The terms, abbreviations and facts worth knowing by heart for {code}, grouped by the skill areas of the
          official outline. Read them through, then use Quiz me to hide the meanings and test yourself.
        </p>
        <StudyNotes sections={sections} />
      </div>
    </PageLayout>
  );
}

/** One notes page per exam in src/lib/exams.ts that has notes; other slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return exams.filter((exam) => getExamNotes(exam.slug)).map((exam) => ({ slug: exam.slug }));
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { code } = splitExamName(exams.find((exam) => exam.slug === slug));
  return { title: `${code} study notes` };
}
