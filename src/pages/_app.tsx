import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { UpdateNotice } from '@/components/layout/update-notice';
import { VersionBadge } from '@/components/layout/version-badge';
import { ThemeProvider } from '@/contexts/theme-context';

/**
 * Custom App component that wraps every page in the application with the
 * global styles, the theme provider, the update notice and the version badge.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
        <Component {...pageProps} />
        <UpdateNotice />
        <VersionBadge />
      </div>
    </ThemeProvider>
  );
}
