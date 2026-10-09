import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { Badge } from '@/components/ui/badge';
import { cardClasses } from '@/components/ui/card';
import { getExamGuide } from '@/lib/exam-guides';
import { exams, splitExamName } from '@/lib/exams';
import { cn, focusRing } from '@/lib/utils';

export const metadata: Metadata = { title: 'Study mode' };

/** Study mode: pick an exam to go through its questions without a score. */
export default function StudyIndex() {
  return (
    <PageLayout headerTitle="Study mode">
      <PageContainer width="wide">
        <PageIntro
          title="Study mode"
          lede="Learn at your pace. Go through every question of an exam, or just one skill area. There is no timer and no score: the answer and explanation show as soon as you pick an option, or tap Show answer to skip ahead. Study rounds don't change your progress or mistakes."
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, i) => {
            const { code, title } = splitExamName(exam);
            const areas = getExamGuide(exam.slug)?.areas.length ?? 0;
            return (
              <li key={exam.slug} className={i < 8 ? 'reveal-item' : undefined} style={{ '--i': i } as React.CSSProperties}>
                <Link
                  href={`/study/${exam.slug}`}
                  className={cardClasses(
                    cn('flex h-full flex-col p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-accent/60 hover:shadow-lifted active:scale-[0.98] motion-reduce:active:scale-100', focusRing)
                  )}
                >
                  <Badge className="self-start">{code}</Badge>
                  <span className="mt-4 font-display text-lg font-semibold leading-snug">{title}</span>
                  {areas > 0 && <span className="mt-2 text-sm text-ink-muted"><span className="tabular">{areas}</span> skill areas</span>}
                  <span className="mt-auto pt-5 text-sm font-semibold text-accent-strong">Start studying &rarr;</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </PageLayout>
  );
}
