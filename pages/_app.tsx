import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { themeColors } from '../lib/theme';

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

export function useDarkMode() {
  return useContext(ThemeContext);
}

/**
 * Custom App component that wraps every page in the application.
 * It imports the global Tailwind CSS styles, owns the theme setting
 * (saved in localStorage) and forwards all properties to the
 * underlying page component.
 */
function MyApp({ Component, pageProps }: AppProps) {
  // The server render uses 'system' and light; the saved choice and the
  // live OS setting take over right after hydration.
  const theme = useSyncExternalStore<ThemePreference>(subscribeTheme, readTheme, () => 'system');
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    () => window.matchMedia(darkQuery).matches,
    () => false
  );
  const darkMode = theme === 'system' ? systemDark : theme === 'dark';

  // Apply the theme to <html> and the theme-color meta (both first set before
  // paint by the script in _document.tsx), so the page background, scrollbars
  // and the iOS status bar follow the setting.
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
      <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
        <Component {...pageProps} />
        <div className="fixed bottom-2 right-3 z-50 rounded-sm bg-white/85 px-1.5 py-0.5 text-xs text-gray-500 backdrop-blur-sm dark:bg-black/85 dark:text-gray-400 select-none">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
          {process.env.NEXT_PUBLIC_COMMIT_SHA && ` (${process.env.NEXT_PUBLIC_COMMIT_SHA})`}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default MyApp;