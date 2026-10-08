'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Button focused on open: 'cancel' (default, the safe choice) or 'confirm' (Enter confirms). */
  initialFocus?: 'cancel' | 'confirm';
}

const subscribeNever = () => () => {};

/**
 * Modal yes/no prompt. The safe choice (cancel) has focus when it opens
 * unless initialFocus says otherwise, and Escape or a click on the backdrop
 * cancels. It is portalled to <body> so a transformed or scrolling ancestor
 * can't shift the fixed overlay.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  initialFocus = 'cancel'
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    (initialFocus === 'confirm' ? confirmRef : cancelRef).current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel, initialFocus]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            className="w-full max-w-sm rounded-2xl border border-line bg-surface p-7 text-ink shadow-lifted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-dialog-title" className="font-display text-2xl font-semibold">
              {title}
            </h2>
            <p id="confirm-dialog-message" className="mt-3 text-sm leading-relaxed text-ink-muted">
              {message}
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button ref={confirmRef} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
