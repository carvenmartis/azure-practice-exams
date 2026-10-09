'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { animate } from 'framer-motion/dom/mini';

/** Set after the first page has hydrated; later mounts are client navigations. */
let hasHydrated = false;

// A gentle ease-out (easeOutCubic): it slows down evenly instead of snapping
// most of the way in on the first frames like the app's stronger UI curve.
const ease = [0.33, 1, 0.68, 1] as const;

interface PageTransitionMainProps {
  className?: string;
  children: ReactNode;
}

/**
 * The page's <main>, faded in and raised 12px by Framer Motion when a page
 * opens. Each page renders its own PageLayout, so this mounts again on every
 * navigation, Back and Forward included. Only <main> animates: the header
 * beside it stays still. Enter only: App Router swaps the old page out at
 * once, so a tap never waits for an exit.
 *
 * Motion's mini `animate` runs on the Web Animations API, so the browser's
 * compositor plays both the fade and the slide: they stay smooth while React
 * is still busy rendering the new page. It starts in a layout effect, before
 * the first paint, so the new page never flashes in at full opacity. Nothing
 * stays on <main> once it ends (no transform or will-change), because iOS
 * Safari mis-hits taps on overlays such as the menu drawer while a transformed
 * layer sits on the scroller.
 *
 * The first page load doesn't animate, so the server HTML is shown straight
 * away. Reduced motion gets a shorter fade with no movement.
 */
export function PageTransitionMain({ className, children }: PageTransitionMainProps) {
  const [animateIn] = useState(() => hasHydrated);
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    hasHydrated = true;
    const main = mainRef.current;
    if (!animateIn || !main) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animation = reduceMotion
      ? animate(main, { opacity: [0, 1] }, { duration: 0.24, ease })
      : animate(main, { opacity: [0, 1], transform: ['translateY(12px)', 'none'] }, { duration: 0.38, ease });
    return () => animation.stop();
  }, [animateIn]);

  return (
    <main ref={mainRef} id="main-content" tabIndex={-1} className={className}>
      {children}
    </main>
  );
}
