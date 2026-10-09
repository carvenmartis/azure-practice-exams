import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout/page-layout';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { changelog } from '@/lib/changelog';
import { appVersion, commitSha } from '@/lib/version';

export const metadata: Metadata = { title: 'About' };

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** About: the running version and what changed in each update. */
export default function About() {
  return (
    <PageLayout headerTitle="About">
      <PageContainer width="reading">
        <PageIntro
          title="Azure Practice Exams"
          lede="Untimed practice for Microsoft Azure certification exams. Your progress, mistakes and bookmarks are saved in this browser only."
        />

        <Card className="flex flex-wrap items-end justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-medium text-ink-subtle">Version</p>
            <p className="tabular mt-1 font-display text-3xl font-semibold">{appVersion ? `v${appVersion}` : 'Local build'}</p>
          </div>
          {commitSha && <p className="font-mono text-sm text-ink-subtle">Build {commitSha}</p>}
        </Card>

        <h2 className="mt-14 font-display text-xl font-semibold tracking-tight sm:text-2xl">What&apos;s new</h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {changelog.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="py-8">
              <p className="tabular text-sm font-medium text-ink-subtle">
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{entry.title}</h3>
              <ul className="mt-3 max-w-[65ch] list-disc space-y-1.5 pl-5 leading-relaxed text-ink-muted marker:text-accent">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </PageContainer>
    </PageLayout>
  );
}
