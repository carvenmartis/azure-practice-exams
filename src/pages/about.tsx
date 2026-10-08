import { PageLayout } from '@/components/layout/page-layout';
import { Card } from '@/components/ui/card';
import { changelog } from '@/lib/changelog';
import { appVersion, commitSha } from '@/lib/version';

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
    <PageLayout pageTitle="About" headerTitle="About">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Azure Practice Exams</h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Untimed practice for Microsoft Azure certification exams. Your progress, mistakes and bookmarks are saved in
          this browser only.
        </p>

        <Card className="mt-10 flex flex-wrap items-end justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">Version</p>
            <p className="mt-1 font-display text-3xl font-semibold lining-nums">{appVersion ? `v${appVersion}` : 'Local build'}</p>
          </div>
          {commitSha && <p className="font-mono text-sm text-ink-subtle">Build {commitSha}</p>}
        </Card>

        <h2 className="mt-14 border-b border-line pb-4 font-display text-2xl font-semibold sm:text-3xl">
          What&apos;s new
        </h2>
        <ol className="mt-8 space-y-10 border-l border-line pl-6">
          {changelog.map((entry) => (
            <li key={entry.date} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-surface bg-accent"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold">{entry.title}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-ink-muted marker:text-accent">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </PageLayout>
  );
}
