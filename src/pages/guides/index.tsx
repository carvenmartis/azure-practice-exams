import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { getExamGuide } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

/** Exam guides: one card per exam, linking to its skills outline. */
export default function GuidesIndex() {
  return (
    <PageLayout pageTitle="Exam guides" headerTitle="Exam guides">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Know the exam</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Exam guides</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          What each exam measures, according to Microsoft&apos;s official study guide, with links to the training on
          Microsoft Learn.
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const { code, title } = splitExamName(exam);
            const guide = getExamGuide(exam.slug);
            return (
              <li key={exam.slug}>
                <Link
                  href={`/guides/${exam.slug}`}
                  className={cardClasses(
                    cn('flex h-full flex-col p-6 transition-all hover:border-accent/60 hover:shadow-lifted', focusRing)
                  )}
                >
                  <Badge className="self-start">{code}</Badge>
                  <span className="mt-4 font-display text-lg font-semibold leading-snug">{title}</span>
                  {guide?.note && <span className="mt-2 text-sm text-ink-muted">Retired exam</span>}
                  <span className="mt-auto pt-5 text-sm font-semibold text-accent-strong">Read the guide →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageLayout>
  );
}
