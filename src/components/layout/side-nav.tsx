'use client';

import { usePathname } from 'next/navigation';
import { DrawerContent } from './nav-drawer';

/**
 * The site menu as a permanent column on desktop windows (lg, 1024px and
 * wider), on the right of <main> and below the header (PageLayout), the
 * side the drawer slides in from. It shows the same
 * DrawerContent as the burger drawer (NavMenu), minus the Close bar, and is
 * hidden below lg, where the burger and drawer take over. It sits in the app
 * shell's normal flow, not fixed, so iOS has nothing to misplace, and it
 * scrolls on its own when the window is short.
 */
export function SideNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Site"
      className="hidden w-96 shrink-0 flex-col border-l border-line bg-surface lg:flex"
    >
      <DrawerContent pathname={pathname} visible />
    </nav>
  );
}
