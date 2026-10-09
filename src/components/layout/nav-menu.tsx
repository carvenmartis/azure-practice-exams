'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { MotionConfig, motion } from 'framer-motion';
import { cn, focusRing } from '@/lib/utils';
import { DrawerContent } from './nav-drawer';

const lineClass = 'absolute left-0 block h-0.5 w-5 rounded-full bg-ink';
const lineTransition = { duration: 0.25, ease: 'easeInOut' } as const;

const subscribeNever = () => () => {};

/** False during the server render and hydration, true afterwards (document exists). */
function useIsClient() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

/**
 * Burger button that opens a full-height drawer with the site's pages, grouped
 * with counts, plus a backup button (DrawerContent in
 * nav-drawer.tsx). The drawer slides in from the right edge, fills the width
 * on phones, and closes on navigation, Escape, its Close button or a click
 * outside it. Opening it moves keyboard focus to the first link, and
 * Escape puts focus back on the button. The drawer is portalled to the app
 * shell (#app-shell in src/app/layout.tsx) and positioned absolute, not
 * fixed: iOS Safari misplaces fixed elements over the scrolling <main>.
 * It uses plain CSS transitions, so it does not depend on JS animation.
 */
export function NavMenu() {
  const pathname = usePathname();
  // The page the menu was opened on, so it closes by itself on any navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (isOpen: boolean) => setOpenOn(isOpen ? pathname : null);
  const isClient = useIsClient();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // The drawer stays mounted while it slides out; `shown` drives the slide.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  if (open && !mounted) setMounted(true);

  // The Close button and Escape both hand focus back to the burger.
  const closeAndFocusButton = () => {
    setOpenOn(null);
    buttonRef.current?.focus({ preventScroll: true });
  };
  const visible = open && shown;

  useEffect(() => {
    if (open) {
      // Two frames: the drawer must paint off-screen once before it slides in.
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    const timer = window.setTimeout(() => {
      setShown(false);
      setMounted(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    // The drawer is portalled to the app shell, so Tab would not reach it from the button.
    document.querySelector<HTMLElement>('#site-menu a')?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenOn(null);
      buttonRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, mounted]);

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
        mounted &&
        createPortal(
          <div className="pointer-events-none absolute inset-x-0 top-(--header-height) bottom-0 z-50 overflow-clip">
            {/* Dims the page below the header only, so the header keeps matching the status bar. The wrapper
                clips the off-screen drawer so it can never widen or scroll the page. */}
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 bg-black/35 backdrop-blur-[3px] transition-opacity duration-200 ease-out motion-reduce:transition-none',
                visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              )}
              onClick={() => setOpen(false)}
            />
            <nav
              id="site-menu"
              aria-label="Site"
              className={cn(
                'pointer-events-auto absolute top-0 right-0 bottom-0 flex w-full flex-col border-l border-line bg-surface shadow-lifted transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:w-100 md:w-108',
                visible ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              <DrawerContent pathname={pathname} visible={visible} onClose={closeAndFocusButton} onNavigate={() => setOpen(false)} />
            </nav>
          </div>,
          document.getElementById('app-shell') ?? document.body
        )}
    </MotionConfig>
  );
}
