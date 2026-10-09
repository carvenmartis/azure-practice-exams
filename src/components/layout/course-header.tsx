'use client';

import Link from 'next/link';
import { siteName } from '@/lib/exams';
import { canLeave } from '@/lib/leave-guard';
import { cn, focusRing } from '@/lib/utils';
import { NavMenu } from './nav-menu';

interface CourseHeaderProps {
  /** Course name to show; defaults to the site name. */
  title?: string;
  /** Short label above the title, e.g. the exam code or progress. */
  eyebrow?: string;
}

/**
 * Top bar that names the current course, with the site menu on the right.
 * It is neither fixed nor sticky: the page itself never scrolls, only the
 * <main> below it does (see PageLayout). iOS 26 Safari misplaces fixed and
 * sticky bars while scrolling, and lets content show through the status bar,
 * so a bar that never moves is the only reliable way to keep it in view. Its
 * solid background matches the colours in src/lib/theme.ts.
 */
export function CourseHeader({ title = siteName, eyebrow }: CourseHeaderProps) {
  return (
    <header className="relative z-40 shrink-0 border-b border-line bg-header">
      <div className="relative mx-auto flex h-(--header-height) max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${siteName} home`}
          onClick={(event) => {
            if (!canLeave()) event.preventDefault();
          }}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary transition-[background-color,transform] duration-150 ease-out hover:bg-primary-hover active:scale-[0.96]',
            focusRing
          )}
        >
          <GraduationCap />
        </Link>
        <div className="ml-1 min-w-0 flex-1">
          {eyebrow && (
            <p className="text-xs font-medium text-ink-subtle">
              {eyebrow}
            </p>
          )}
          <p className="truncate font-display text-[0.95rem] font-semibold tracking-tight sm:text-base" title={title}>
            {title}
          </p>
        </div>
        <NavMenu />
      </div>
    </header>
  );
}

/**
 * The graduation cap that the app icons (public/icons) are drawn from, in the current
 * text colour so it follows the light and dark themes.
 */
function GraduationCap() {
  return (
    <svg viewBox="48 54 416 416" aria-hidden="true" className="h-6 w-6">
      <path
        d="M150 262 L150 330 C150 362 205 384 256 384 C307 384 362 362 362 330 L362 262 L256 312 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path d="M256 140 L452 226 L256 312 L60 226 Z" fill="currentColor" />
      <path
        d="M256 226 L392 266 L392 340"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path d="M374 336 L410 336 L418 390 L366 390 Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
