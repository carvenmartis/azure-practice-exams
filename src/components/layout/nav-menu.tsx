import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { canLeave } from '@/lib/leave-guard';
import { cn, focusRing } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/settings', label: 'Settings' }
];

const lineClass = 'absolute left-0 block h-0.5 w-5 rounded-full bg-gray-900 dark:bg-white';
const lineTransition = { duration: 0.25, ease: 'easeInOut' } as const;

/**
 * Burger button that opens a full-height drawer with the site's pages. The
 * drawer slides in from the right edge and closes on navigation, Escape or a
 * click outside it.
 */
export function NavMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => setOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    // Keep the page behind the drawer from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={cn(
          'relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-gray-100 dark:hover:bg-gray-800',
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

      <AnimatePresence>
        {open && (
          <>
            {/* Dims the page below the header only, so the header keeps matching the status bar */}
            <motion.div
              key="backdrop"
              className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="panel"
              id="site-menu"
              aria-label="Site"
              className="fixed top-16 right-0 bottom-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-l border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const active = router.pathname === item.href;
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
                          'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                          focusRing,
                          active
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
      </AnimatePresence>
    </MotionConfig>
  );
}
