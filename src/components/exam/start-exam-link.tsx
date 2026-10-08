'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { exams, splitExamName } from '@/lib/exams';

/** Questions in a full practice exam; matches questionsPerAttempt in exam-session.tsx. */
const examQuestionCount = 60;

interface StartExamLinkProps {
  slug: string;
  className?: string;
  children: ReactNode;
}

/**
 * Link to a full practice exam that asks first: a dialog names the exam, the
 * number of questions and the clock, with Start and Cancel. Start has focus,
 * so Enter starts and Escape cancels; focus returns to the link on cancel.
 * Ctrl/Cmd/Shift-click still opens the exam in a new tab or window.
 */
export function StartExamLink({ slug, className, children }: StartExamLinkProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const href = `/exams/${slug}`;
  const exam = exams.find((item) => item.slug === slug);
  const { code, title } = exam ? splitExamName(exam) : { code: slug.toUpperCase(), title: '' };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(true);
  };

  const cancel = useCallback(() => {
    setOpen(false);
    linkRef.current?.focus();
  }, []);

  return (
    <>
      <Link ref={linkRef} href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
      <ConfirmDialog
        open={open}
        title={`Start ${code}?`}
        message={`${title ? `${title}. ` : ''}${examQuestionCount} random questions, with a clock that records your time (there is no time limit). Your score is saved to My progress.`}
        confirmLabel="Start exam"
        cancelLabel="Cancel"
        initialFocus="confirm"
        onConfirm={() => {
          setOpen(false);
          router.push(href);
        }}
        onCancel={cancel}
      />
    </>
  );
}
