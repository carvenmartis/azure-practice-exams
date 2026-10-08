'use client';

import { useEffect, useRef } from 'react';

/** Maps a key (lower case, as in KeyboardEvent.key) to what it does. */
export type ShortcutHandlers = Partial<Record<string, (event: KeyboardEvent) => void>>;

/** One row of the shortcut help: the keys and what they do. */
export interface ShortcutHelpItem {
  keys: string[];
  label: string;
}

/** Fields where typing must not trigger shortcuts. */
const typingSelector = 'input, textarea, select, [contenteditable="true"]';

/** Elements that already act on Enter and Space themselves. */
const activatableSelector = 'button, a[href], summary, [role="button"]';

/**
 * Page-wide keyboard shortcuts. Keys are ignored while typing in a field,
 * with Ctrl, Alt or Cmd held, and while a modal dialog is open. Enter and
 * Space are left alone when a button or link has focus, so they still press
 * it. A handled key has its default (e.g. arrow scrolling) prevented.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled = true) {
  // Read the latest handlers on each key press without re-subscribing every render.
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(typingSelector)) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if ((key === 'Enter' || key === ' ') && target?.closest(activatableSelector)) return;
      const handler = handlersRef.current[key];
      if (!handler) return;
      event.preventDefault();
      handler(event);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}

/** Letters shown on the answer options; A-D and 1-4 both pick them. */
export const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Shortcut handlers that pick option N with its letter or its number. */
export function optionShortcuts(count: number, onPick: (index: number) => void): ShortcutHandlers {
  const handlers: ShortcutHandlers = {};
  for (let idx = 0; idx < Math.min(count, optionLetters.length); idx++) {
    handlers[optionLetters[idx].toLowerCase()] = () => onPick(idx);
    handlers[String(idx + 1)] = () => onPick(idx);
  }
  return handlers;
}

/** <main> (from PageLayout) is the scroll area, not the window. */
export function scrollToTop() {
  document.querySelector('main')?.scrollTo({ top: 0 });
}

/** Brings the answer and Next button into view after answering by key. */
export function revealFeedback() {
  requestAnimationFrame(() => {
    document.getElementById('answer-feedback')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}

/**
 * Moves keyboard focus to the next (or previous) element matching
 * `selector`, wrapping around at either end. Starts at the first (or last)
 * one when focus is elsewhere.
 */
export function cycleFocus(selector: string, backwards = false) {
  const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!items.length) return;
  const current = items.indexOf(document.activeElement as HTMLElement);
  const next =
    current < 0
      ? backwards ? items.length - 1 : 0
      : (current + (backwards ? items.length - 1 : 1)) % items.length;
  items[next].focus();
}
