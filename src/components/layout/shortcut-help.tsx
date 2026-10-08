'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { ShortcutHandlers, ShortcutHelpItem } from '@/lib/keyboard';
import { useKeyboardShortcuts } from '@/lib/keyboard';
import { cn, focusRing } from '@/lib/utils';

interface ShortcutHelpProps {
  /** What each key does on this page. */
  handlers: ShortcutHandlers;
  /** The same shortcuts as listed in the overlay; '?' is added at the end. */
  shortcuts: ShortcutHelpItem[];
}

/**
 * Turns on the page's keyboard shortcuts while it is rendered, and shows a
 * "Shortcuts" button plus the overlay that lists the page's keyboard
 * shortcuts. '?' opens it too; Escape, the Close button or a click outside
 * closes it and puts focus back where it was.
 */
export function ShortcutHelp({ handlers, shortcuts }: ShortcutHelpProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  const show = () => {
    returnFocusRef.current = document.activeElement;
    setOpen(true);
  };

  useKeyboardShortcuts({ ...handlers, '?': show });

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === '?') {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (returnFocusRef.current instanceof HTMLElement) returnFocusRef.current.focus();
    };
  }, [open]);

  const rows = [...shortcuts, { keys: ['?'], label: 'Show or hide this list' }];

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-keyshortcuts="Shift+?"
        className={cn(
          'hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex',
          focusRing
        )}
      >
        <Key>?</Key>
        Shortcuts
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortcut-help-title"
              className="w-full max-w-md rounded-2xl border border-line bg-surface p-7 text-ink shadow-lifted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="shortcut-help-title" className="font-display text-2xl font-semibold">
                Keyboard shortcuts
              </h2>
              <dl className="mt-5 divide-y divide-line text-sm">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-ink-muted">{row.label}</dt>
                    <dd className="flex shrink-0 items-center gap-1">
                      {row.keys.map((key, idx) => (
                        <span key={key} className="flex items-center gap-1">
                          {idx > 0 && <span className="text-xs text-ink-subtle">or</span>}
                          <Key>{key}</Key>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                Tab moves between buttons and links; Enter or Space presses the one in focus.
              </p>
              <div className="mt-6 flex justify-end">
                <Button ref={closeRef} variant="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** A key cap, e.g. for "A" or "Enter". */
export function Key({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex min-w-6 items-center justify-center rounded-md border border-line-strong bg-surface-muted px-1.5 py-0.5 font-sans text-xs font-semibold text-ink-muted',
        className
      )}
    >
      {children}
    </kbd>
  );
}
