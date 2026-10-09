'use client';

/**
 * "Skip to content" link, visible only when tabbed to. It moves focus to
 * <main> without changing the URL: a #hash would add a history entry, which
 * the exam's Back guard treats as leaving the exam.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      onClick={(event) => {
        event.preventDefault();
        document.getElementById('main-content')?.focus();
      }}
      className="sr-only rounded-lg bg-primary text-sm font-semibold text-on-primary shadow-lifted focus:not-sr-only focus:fixed focus:px-4 focus:py-2 focus:top-3 focus:left-4 focus:z-[60]"
    >
      Skip to content
    </a>
  );
}
