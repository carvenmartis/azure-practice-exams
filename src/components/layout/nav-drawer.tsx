'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { shareBackup } from '@/lib/backup';
import { useOnline } from '@/lib/connection';
import { examCategories, exams, examsInCategory, siteName } from '@/lib/exams';
import { canLeave } from '@/lib/leave-guard';
import { dailyStatus, reviewQueue, useProgress } from '@/lib/progress-store';
import { useSyncStatus } from '@/lib/sync';
import type { SyncStatus } from '@/lib/sync';
import { cn, focusRing } from '@/lib/utils';
import { appVersion } from '@/lib/version';

type IconName = 'category' | 'course' | 'progress' | 'review' | 'bookmark' | 'study' | 'guides' | 'notes' | 'settings' | 'about';

interface MenuItem {
  href: string;
  label: string;
  icon: IconName;
}

const groups: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Practice',
    items: [
      { href: '/', label: 'Course', icon: 'course' },
      { href: '/progress', label: 'My progress', icon: 'progress' },
      { href: '/review', label: 'Review mistakes', icon: 'review' },
      { href: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' }
    ]
  },
  {
    label: 'Categories',
    items: examCategories.map((category) => ({
      href: `/categories/${category.id}`,
      label: category.title,
      icon: 'category' as const
    }))
  },
  {
    label: 'Study',
    items: [
      { href: '/study', label: 'Study mode', icon: 'study' },
      { href: '/guides', label: 'Exam guides', icon: 'guides' },
      { href: '/notes', label: 'Study notes', icon: 'notes' }
    ]
  }
];

const appItems: MenuItem[] = [
  { href: '/settings', label: 'Settings', icon: 'settings' },
  { href: '/about', label: 'About', icon: 'about' }
];

/** Small grey heading above a group of rows. */
const groupLabelClass = 'mb-1.5 px-3 text-xs font-medium text-ink-subtle';

/** Whether `href` is the page shown, or a page below it (e.g. one exam's notes). */
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** One line on where progress is kept, from the real sync state (src/lib/sync.ts). */
function syncLine({ state, lastSyncedAt }: SyncStatus, online: boolean) {
  if (state === 'off') return 'Progress is saved on this device';
  if (state === 'syncing') return 'Syncing…';
  if (state === 'error') return 'Could not sync';
  if (state === 'offline' || !online) return 'Offline, syncs when back online';
  if (state === 'synced' && lastSyncedAt) return `Synced at ${formatTime(lastSyncedAt)}`;
  return 'Not synced yet';
}

interface DrawerContentProps {
  pathname: string;
  /** True once the drawer has slid in; drives the row stagger. */
  visible: boolean;
  /** Close button: closes and puts focus back on the burger. */
  onClose: () => void;
  /** Called when a link is followed, so the drawer closes. */
  onNavigate: () => void;
}

/**
 * The inside of the menu drawer (NavMenu in nav-menu.tsx): a top bar with a
 * Close button, a card with the site and sync state, the pages and exam
 * categories in groups with
 * live counts (questions due for review, saved bookmarks), and a footer with today's daily goal, the version and two quick actions.
 * Every count and label comes from what is saved on this device.
 */
export function DrawerContent({ pathname, visible, onClose, onNavigate }: DrawerContentProps) {
  const progress = useProgress();
  const sync = useSyncStatus();
  const online = useOnline();
  const [backupNote, setBackupNote] = useState<string | null>(null);

  const dueCount = exams.reduce((sum, exam) => sum + reviewQueue(progress, exam.slug).due.length, 0);
  const bookmarkCount = Object.values(progress.bookmarks).reduce((sum, ids) => sum + ids.length, 0);
  const daily = dailyStatus(progress);

  const trailing: Partial<Record<string, ReactNode>> = {
    '/review': dueCount > 0 && (
      <span className="tabular rounded-md bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger">{dueCount} due</span>
    ),
    ...Object.fromEntries(
      examCategories.map((category) => [
        `/categories/${category.id}`,
        <span key={category.id} className="tabular text-xs text-ink-subtle">
          {examsInCategory(category.id).length} exams
        </span>
      ])
    ),
    '/bookmarks': bookmarkCount > 0 && (
      <span className="tabular text-xs text-ink-subtle">{bookmarkCount} saved</span>
    )
  };

  const follow = (event: MouseEvent) => {
    if (!canLeave()) event.preventDefault();
    onNavigate();
  };

  // Groups fade and slide in one after another once the drawer is open.
  const stagger = (index: number) => ({
    className: cn(
      'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
      visible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
    ),
    style: { transitionDelay: visible ? `${60 + index * 40}ms` : '0ms' }
  });

  const row = (item: MenuItem) => {
    const active = isActive(pathname, item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          onClick={follow}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
            focusRing,
            active ? 'bg-surface-muted text-ink' : 'text-ink-muted hover:bg-surface-muted/70 hover:text-ink'
          )}
        >
          <span
            aria-hidden="true"
            className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-accent' : 'bg-transparent')}
          />
          <Icon name={item.icon} className={active ? 'text-accent' : 'text-ink-subtle group-hover:text-ink'} />
          <span className={cn('min-w-0 flex-1 truncate text-[0.95rem]', active && 'font-medium')}>{item.label}</span>
          {trailing[item.href] || null}
        </Link>
      </li>
    );
  };

  const exportBackup = async () => {
    const result = await shareBackup();
    if (result === 'downloaded') setBackupNote('Backup downloaded');
    else if (result === 'shared') setBackupNote('Backup shared');
  };

  const nextStep =
    dueCount > 0
      ? { href: '/review', label: `Review ${dueCount} due` }
      : { href: '/study', label: 'Start studying' };

  return (
    <>
      <div className="flex shrink-0 flex-col gap-4 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium text-ink-subtle">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex items-center gap-1.5 rounded-md bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink active:scale-[0.97] motion-reduce:active:scale-100',
              focusRing
            )}
          >
            Close
            <Kbd className="hidden [@media(hover:hover)]:inline-block">Esc</Kbd>
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Icon name="study" className="text-on-primary" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[0.95rem] font-semibold tracking-tight">{siteName}</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted" role="status">
              <span
                aria-hidden="true"
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  sync.state === 'synced' && online ? 'bg-success' : sync.state === 'error' ? 'bg-danger' : 'bg-ink-subtle'
                )}
              />
              <span className="truncate">{syncLine(sync, online)}</span>
            </span>
          </span>
          {!online && (
            <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-accent-strong">Offline</span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-2">
        {groups.map((group, index) => (
          <div key={group.label} {...stagger(index)}>
            <p className={groupLabelClass}>{group.label}</p>
            <ul className="space-y-0.5">{group.items.map(row)}</ul>
          </div>
        ))}

        <div {...stagger(groups.length)}>
          <p className={groupLabelClass}>App</p>
          <ul className="space-y-0.5">{appItems.map(row)}</ul>
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-surface-muted px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex items-center justify-between text-xs text-ink-subtle">
          <span className="tabular">
            Today {daily.today} of {daily.goal}
            {daily.streak > 0 && ` · ${daily.streak} day streak`}
          </span>
          <span className="tabular" aria-live="polite">
            {backupNote ?? (appVersion && `v${appVersion}`)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => void exportBackup()}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-medium text-ink shadow-card transition-[background-color,transform] hover:bg-canvas active:scale-[0.97] motion-reduce:active:scale-100',
              focusRing
            )}
          >
            <Icon name="download" className="h-4 w-4" />
            Export backup
          </button>
          <Link
            href={nextStep.href}
            onClick={follow}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-on-primary shadow-card transition-[background-color,transform] hover:bg-primary-hover active:scale-[0.97] motion-reduce:active:scale-100',
              focusRing
            )}
          >
            <Icon name="play" className="h-4 w-4" />
            <span className="truncate">{nextStep.label}</span>
          </Link>
        </div>
      </div>
    </>
  );
}

function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'rounded border border-line bg-surface px-1 font-mono text-[0.65rem] leading-4 text-ink-muted',
        className
      )}
    >
      {children}
    </kbd>
  );
}

const iconPaths: Record<IconName | 'download' | 'play', ReactNode> = {
  category: <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />,
  course: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  progress: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  review: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  study: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </>
  ),
  guides: (
    <>
      <path d="M2 5c3-1 6-1 10 1v15c-4-2-7-2-10-1z" />
      <path d="M22 5c-3-1-6-1-10 1v15c4-2 7-2 10-1z" />
    </>
  ),
  notes: (
    <>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  play: <path d="M7 4l13 8-13 8z" />
};

/** Line icons in the current text colour, drawn for this menu. */
function Icon({ name, className }: { name: keyof typeof iconPaths; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-[1.15rem] w-[1.15rem] shrink-0 transition-colors', className)}
    >
      {iconPaths[name]}
    </svg>
  );
}
