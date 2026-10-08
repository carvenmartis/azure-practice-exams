import { toggleBookmark, useProgress } from '@/lib/progress-store';
import { cn, focusRing } from '@/lib/utils';

interface BookmarkButtonProps {
  slug: string;
  questionId: string;
  className?: string;
}

/** Flags a question for the Bookmarks page, or removes the flag. */
export function BookmarkButton({ slug, questionId, className }: BookmarkButtonProps) {
  const { bookmarks } = useProgress();
  const saved = bookmarks[slug]?.includes(questionId) ?? false;

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleBookmark(slug, questionId)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
        focusRing,
        saved ? 'bg-accent-soft text-accent-strong' : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M6 3.75h12a.75.75 0 0 1 .75.75v16.1a.4.4 0 0 1-.63.33L12 16.7l-6.12 4.23a.4.4 0 0 1-.63-.33V4.5A.75.75 0 0 1 6 3.75Z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinejoin="round"
        />
      </svg>
      {saved ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
