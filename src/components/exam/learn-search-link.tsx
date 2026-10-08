import { cn, focusRing } from '@/lib/utils';

/** Longest search text sent to Microsoft Learn; long scenarios are cut at a word. */
const maxQueryLength = 200;

/** Microsoft Learn search results for a question's text. */
export function learnSearchUrl(question: string) {
  let terms = question.replace(/\s+/g, ' ').trim();
  if (terms.length > maxQueryLength) terms = terms.slice(0, terms.lastIndexOf(' ', maxQueryLength));
  return `https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(terms)}`;
}

/** Opens a Microsoft Learn search for the question in a new tab, so the exam keeps its place. */
export function openLearnSearch(question: string) {
  window.open(learnSearchUrl(question), '_blank', 'noopener');
}

interface LearnSearchLinkProps {
  question: string;
  className?: string;
}

/** Link next to Bookmark that looks the current question up on Microsoft Learn (new tab). */
export function LearnSearchLink({ question, className }: LearnSearchLinkProps) {
  return (
    <a
      href={learnSearchUrl(question)}
      target="_blank"
      rel="noreferrer"
      aria-label="Search this question on Microsoft Learn (opens a new tab)"
      aria-keyshortcuts="L"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink',
        focusRing,
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.75} />
        <path d="m15.75 15.75 4.5 4.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      </svg>
      <span className="sm:hidden">Learn</span>
      <span className="hidden sm:inline">Search on Microsoft Learn</span>
    </a>
  );
}
