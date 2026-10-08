'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { themeColors } from '@/lib/theme';

/** The theme the user picked on the Settings page; 'system' follows the OS. */
export type ThemePreference = 'light' | 'dark' | 'system';

const themeStorageKey = 'theme';
const darkQuery = '(prefers-color-scheme: dark)';

// The saved theme lives in localStorage; memoryTheme covers browsers that
// block storage, and listeners re-render the app when the choice changes.
let memoryTheme: ThemePreference = 'system';
const themeListeners = new Set<() => void>();

function readTheme(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(themeStorageKey);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // Storage blocked (e.g. private mode); fall back to this visit's choice.
  }
  return memoryTheme;
}

function writeTheme(theme: ThemePreference) {
  memoryTheme = theme;
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Not saved, but still applied for this visit.
  }
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function subscribeSystemTheme(listener: () => void) {
  const query = window.matchMedia(darkQuery);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

interface ThemeContextValue {
  /** The theme actually shown, after resolving 'system'. */
  darkMode: boolean;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  theme: 'system',
  setTheme: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Owns the theme setting (saved in localStorage) and applies it to <html>
 * and the theme-color meta, so dark: utilities, scrollbars and the iOS status
 * bar follow it. The script in src/app/layout.tsx applies it before first paint.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // The server render uses 'system' and light; the saved choice and the
  // live OS setting take over right after hydration.
  const theme = useSyncExternalStore<ThemePreference>(subscribeTheme, readTheme, () => 'system');
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    () => window.matchMedia(darkQuery).matches,
    () => false
  );
  const darkMode = theme === 'system' ? systemDark : theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.style.colorScheme = darkMode ? 'dark' : 'light';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', darkMode ? themeColors.dark : themeColors.light);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, theme, setTheme: writeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
