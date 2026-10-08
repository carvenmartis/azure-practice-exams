import type { Metadata } from 'next';
import Link from 'next/link';
import { StartExamLink } from '@/components/exam/start-exam-link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getExamGuide, trainingSearchUrl } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { getExamNotes } from '@/lib/notes';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

const linkClass =
  'text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent';

/** Average of a weight like '20–25%', used to size its bar. */
function weightMidpoint(weight: string) {
  const numbers = weight.match(/\d+/g)?.map(Number) ?? [0];
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

/**
 * Guide for one exam: the official skills outline with each area's weight,
 * links to the study guide, training and practice assessment, and a shortcut
 * to study the app's questions for each area.
 */
export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const exam = exams.find((item) => item.slug === slug);
  const guide = getExamGuide(slug);
  const { code, title } = splitExamName(exam);
  const links = [
    { href: guide.studyGuide, label: 'Official study guide' },
    { href: guide.examPage, label: 'Exam page and training' },
    ...(guide.practiceAssessment ? [{ href: guide.practiceAssessment, label: 'Free practice assessment' }] : [])
  ];

  return (
    <PageLayout headerTitle={exam.name} eyebrow="Exam guide">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <Badge>{code}</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {exam.description && <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">{exam.description}</p>}
        {guide.note && (
          <p className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">
            {guide.note}
          </p>
        )}

        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses({ variant: 'secondary', size: 'sm' })}
              >
                {link.label} ↗
              </a>
            </li>
          ))}
          {getExamNotes(slug) && (
            <li>
              <Link href={`/notes/${slug}`} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                Study notes
              </Link>
            </li>
          )}
          <li>
            <StartExamLink slug={slug} className={buttonClasses({ size: 'sm' })}>
              Start a practice exam
            </StartExamLink>
          </li>
        </ul>

        <h2 className="mt-14 border-b border-line pb-4 font-display text-2xl font-semibold sm:text-3xl">
          Skills measured
        </h2>
        <ol className="mt-6 space-y-5">
          {guide.areas.map((area) => (
            <li key={area.name}>
              <Card className="p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl font-semibold leading-snug">{area.name}</h3>
                  <p className="text-sm font-semibold text-accent-strong lining-nums">{area.weight}</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(100, weightMidpoint(area.weight) * 2)}%` }}
                  />
                </div>
                <ul className="mt-5 list-disc space-y-1.5 pl-5 text-ink-muted marker:text-accent">
                  {area.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
                  <a href={trainingSearchUrl(area)} target="_blank" rel="noreferrer" className={linkClass}>
                    Find training on Microsoft Learn
                  </a>
                  <Link href={{ pathname: `/study/${slug}`, query: { topic: area.name } }} className={linkClass}>
                    Study these questions
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink-subtle">
          Weights are Microsoft&apos;s share of the exam for each area. The bars show the middle of each range, where a
          full bar would be half the exam.
        </p>
      </div>
    </PageLayout>
  );
}

/** One guide page per exam in src/lib/exams.ts that has a guide; other slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return exams.filter((exam) => getExamGuide(exam.slug)).map((exam) => ({ slug: exam.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { code } = splitExamName(exams.find((exam) => exam.slug === slug));
  return { title: `${code} exam guide` };
}
