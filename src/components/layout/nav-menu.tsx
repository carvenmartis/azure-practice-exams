'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { canLeave } from '@/lib/leave-guard';
import { cn, focusRing } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/progress', label: 'My progress' },
  { href: '/review', label: 'Review mistakes' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/study', label: 'Study mode' },
  { href: '/notes', label: 'Study notes' },
  { href: '/guides', label: 'Exam guides' },
  { href: '/settings', label: 'Settings' },
  { href: '/about', label: 'About' }
];

const lineClass = 'absolute left-0 block h-0.5 w-5 rounded-full bg-ink';
const lineTransition = { duration: 0.25, ease: 'easeInOut' } as const;

const subscribeNever = () => () => {};

/** False during the server render and hydration, true afterwards (document exists). */
function useIsClient() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

/**
 * Burger button that opens a full-height drawer with the site's pages. The
 * drawer slides in from the right edge and closes on navigation, Escape or a
 * click outside it. Opening it moves keyboard focus to the first link, and
 * Escape puts focus back on the button. The drawer is portalled to <body> so it overlays the page
 * rather than the header's stacking context.
 */
export function NavMenu() {
  const pathname = usePathname();
  // The page the menu was opened on, so it closes by itself on any navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (isOpen: boolean) => setOpenOn(isOpen ? pathname : null);
  const isClient = useIsClient();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // The drawer is portalled to the end of <body>, so Tab would not reach it from the button.
    document.querySelector<HTMLElement>('#site-menu a')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenOn(null);
      buttonRef.current?.focus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
        className={cn(
          'relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-surface-muted',
          focusRing
        )}
      >
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <motion.span
            className={cn(lineClass, 'top-0')}
            animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={lineTransition}
          />
          <motion.span
            className={cn(lineClass, 'top-1.5')}
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={lineTransition}
          />
          <motion.span
            className={cn(lineClass, 'top-3')}
            animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={lineTransition}
          />
        </span>
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Dims the page below the header only, so the header keeps matching the status bar */}
                <motion.div
                  key="backdrop"
                  className="fixed inset-x-0 top-(--header-height) bottom-0 z-40 bg-black/45"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />
                <motion.nav
                  key="panel"
                  id="site-menu"
                  aria-label="Site"
                  className="fixed top-(--header-height) right-0 bottom-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-l border-line bg-surface px-4 py-6 shadow-lifted"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mb-3 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                    Menu
                  </p>
                  <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                      const active = pathname === item.href;
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + index * 0.06 }}
                        >
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            onClick={(event) => {
                              if (!canLeave()) event.preventDefault();
                              setOpen(false);
                            }}
                            className={cn(
                              'block rounded-xl border-l-2 px-4 py-3 text-base font-medium transition-colors',
                              focusRing,
                              active
                                ? 'border-accent bg-accent-soft text-accent-strong'
                                : 'border-transparent text-ink-muted hover:bg-surface-muted hover:text-ink'
                            )}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.nav>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </MotionConfig>
  );
}
