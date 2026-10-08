import '@/styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Inter, Playfair_Display } from 'next/font/google';
import { UpdateNotice } from '@/components/layout/update-notice';
import { VersionBadge } from '@/components/layout/version-badge';
import { ThemeProvider } from '@/contexts/theme-context';
import { registerServiceWorker } from '@/lib/offline';

// Self-hosted at build time by next/font; exposed to Tailwind as font-sans and font-display.
const bodyFont = Inter({ subsets: ['latin'], display: 'swap' });
const headingFont = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap' });

/**
 * Custom App component that wraps every page in the application with the
 * global styles, fonts, the theme provider, the update notice and the
 * version badge. Also registers the service worker that keeps the app
 * working offline.
 */
export default function App({ Component, pageProps }: AppProps) {
  useEffect(registerServiceWorker, []);

  return (
    <ThemeProvider>
      {/* On :root so portalled content (the menu drawer) gets the fonts too */}
      <style jsx global>{`
        :root {
          --font-body: ${bodyFont.style.fontFamily};
          --font-heading: ${headingFont.style.fontFamily};
        }
      `}</style>
      <div className="flex h-dvh flex-col overflow-hidden bg-canvas font-sans text-ink">
        <Component {...pageProps} />
        <UpdateNotice />
        <VersionBadge />
      </div>
    </ThemeProvider>
  );
}
