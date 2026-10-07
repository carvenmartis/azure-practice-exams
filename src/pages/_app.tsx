import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter, Playfair_Display } from 'next/font/google';
import { UpdateNotice } from '@/components/layout/update-notice';
import { VersionBadge } from '@/components/layout/version-badge';
import { ThemeProvider } from '@/contexts/theme-context';

// Self-hosted at build time by next/font; exposed to Tailwind as font-sans and font-display.
const bodyFont = Inter({ subsets: ['latin'], display: 'swap' });
const headingFont = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap' });

/**
 * Custom App component that wraps every page in the application with the
 * global styles, fonts, the theme provider, the update notice and the
 * version badge.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      {/* On :root so portalled content (the menu drawer) gets the fonts too */}
      <style jsx global>{`
        :root {
          --font-body: ${bodyFont.style.fontFamily};
          --font-heading: ${headingFont.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen bg-canvas font-sans text-ink">
        <Component {...pageProps} />
        <UpdateNotice />
        <VersionBadge />
      </div>
    </ThemeProvider>
  );
}
