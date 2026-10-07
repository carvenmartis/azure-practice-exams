import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for dark mode
const DarkModeContext = createContext<{
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}>({ darkMode: false, setDarkMode: () => {} });

export function useDarkMode() {
  return useContext(DarkModeContext);
}

/**
 * Custom App component that wraps every page in the application.
 * It imports the global Tailwind CSS styles and forwards all
 * properties to the underlying page component.
 */
function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  // Apply the theme to <html> as well, so the page background, scrollbars
  // and browser UI (e.g. the tablet status bar) follow the toggle.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <Head>
        {/* Colors the browser's status bar / toolbar on mobile and tablets */}
        <meta name="theme-color" content={darkMode ? '#000000' : '#ffffff'} />
      </Head>
      <div className={darkMode
        ? 'dark bg-gray-900 text-white min-h-screen'
        : 'bg-white text-gray-900 min-h-screen'}>
        {/* Only one toggle for the whole app */}
        <button
          className="fixed top-4 right-4 z-50 px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Component {...pageProps} />
        <div className="fixed bottom-2 right-3 z-50 text-xs text-gray-500 dark:text-gray-400 select-none">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
          {process.env.NEXT_PUBLIC_COMMIT_SHA && ` (${process.env.NEXT_PUBLIC_COMMIT_SHA})`}
        </div>
      </div>
    </DarkModeContext.Provider>
  );
}

export default MyApp;