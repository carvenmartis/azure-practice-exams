import type { Metadata } from 'next';
import Link from 'next/link';
import { StartExamLink } from '@/components/exam/start-exam-link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
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
      <PageContainer width="reading">
        <PageIntro
          back={<Badge>{code}</Badge>}
          title={title}
          lede={exam.description || undefined}
        />
        {guide.note && (
          <p className="-mt-4 mb-8 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4 text-sm leading-relaxed text-ink">
            {guide.note}
          </p>
        )}

        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses({ variant: 'secondary', size: 'sm' })}
              >
                {link.label} <span aria-hidden="true">↗</span>
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

        <h2 className="mt-14 font-display text-xl font-semibold tracking-tight sm:text-2xl">Skills measured</h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {guide.areas.map((area) => (
            <li key={area.name} className="py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-lg leading-snug font-semibold tracking-tight">{area.name}</h3>
                <p className="tabular text-sm font-semibold text-accent-strong">{area.weight}</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.min(100, weightMidpoint(area.weight) * 2)}%` }}
                />
              </div>
              <ul className="mt-5 max-w-[65ch] list-disc space-y-1.5 pl-5 text-ink-muted marker:text-accent">
                {area.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <a href={trainingSearchUrl(area)} target="_blank" rel="noreferrer" className={linkClass}>
                  Find training on Microsoft Learn
                </a>
                <Link href={{ pathname: `/study/${slug}`, query: { topic: area.name } }} className={linkClass}>
                  Study these questions
                </Link>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-[65ch] text-sm text-ink-subtle">
          Weights are Microsoft&apos;s share of the exam for each area. The bars show the middle of each range, where a
          full bar would be half the exam.
        </p>
      </PageContainer>
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
