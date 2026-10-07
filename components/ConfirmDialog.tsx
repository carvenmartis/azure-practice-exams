import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDarkMode } from '../pages/_app';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal yes/no prompt. The safe choice (cancel) has focus when it opens,
 * and Escape or a click on the backdrop cancels.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const { darkMode } = useDarkMode();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
            className={`w-full max-w-sm rounded-xl border p-6 shadow-xl ${
              darkMode ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            <p id="confirm-dialog-message" className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {message}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className={`rounded-lg border px-4 py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  darkMode
                    ? 'border-gray-700 hover:bg-gray-800 focus-visible:outline-blue-400'
                    : 'border-gray-300 hover:bg-gray-100 focus-visible:outline-blue-600'
                }`}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  darkMode ? 'focus-visible:outline-blue-400' : 'focus-visible:outline-blue-600'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
