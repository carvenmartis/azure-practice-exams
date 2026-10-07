import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useDarkMode } from '../pages/_app';

const menuItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/settings', label: 'Settings' }
];

/**
 * Burger button that opens an animated dropdown with the site's pages.
 * Closes on navigation, Escape or a click outside the panel.
 */
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const { darkMode } = useDarkMode();
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const lineClass = `absolute left-0 block h-0.5 w-5 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-900'}`;
  const lineTransition = { duration: 0.25, ease: 'easeInOut' } as const;

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={`relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          darkMode
            ? 'border-gray-700 hover:bg-gray-800 focus-visible:outline-blue-400'
            : 'border-gray-200 hover:bg-gray-100 focus-visible:outline-blue-600'
        }`}
      >
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <motion.span
            className={`${lineClass} top-0`}
            animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={lineTransition}
          />
          <motion.span
            className={`${lineClass} top-1.5`}
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={lineTransition}
          />
          <motion.span
            className={`${lineClass} top-3`}
            animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={lineTransition}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="panel"
              id="site-menu"
              aria-label="Site"
              className={`absolute right-4 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border p-2 shadow-lg sm:right-6 ${
                darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <ul>
                {menuItems.map((item, index) => {
                  const active = router.pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 ${
                          active
                            ? (darkMode ? 'bg-blue-950 text-blue-300' : 'bg-blue-50 text-blue-700')
                            : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')
                        } ${darkMode ? 'focus-visible:outline-blue-400' : 'focus-visible:outline-blue-600'}`}
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
