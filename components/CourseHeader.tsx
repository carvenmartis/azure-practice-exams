import Link from 'next/link';
import { useDarkMode } from '../pages/_app';
import { siteName } from '../lib/exams';

interface CourseHeaderProps {
  /** Course name to show; defaults to the site name. */
  title?: string;
  /** Short label above the title, e.g. the exam code or progress. */
  eyebrow?: string;
}

/**
 * Sticky top bar that names the current course. The right side is left
 * empty because the app-wide Dark Mode toggle in _app.tsx is fixed there.
 */
export default function CourseHeader({ title = siteName, eyebrow }: CourseHeaderProps) {
  const { darkMode } = useDarkMode();

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        darkMode ? 'bg-black/80 border-gray-800' : 'bg-white/85 border-gray-200'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 pl-4 pr-36 sm:pl-6">
        <Link
          href="/"
          aria-label={`${siteName} home`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            darkMode ? 'focus-visible:outline-blue-400' : 'focus-visible:outline-blue-600'
          }`}
        >
          Az
        </Link>
        <div className="min-w-0">
          {eyebrow && (
            <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {eyebrow}
            </p>
          )}
          <p className="truncate text-sm font-semibold sm:text-base" title={title}>
            {title}
          </p>
        </div>
      </div>
    </header>
  );
}
