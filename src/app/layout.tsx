import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { ProgressSync } from '@/components/layout/progress-sync';
import { ServiceWorker } from '@/components/layout/service-worker';
import { UpdateNotice } from '@/components/layout/update-notice';
import { VersionBadge } from '@/components/layout/version-badge';
import { ThemeProvider } from '@/contexts/theme-context';
import { siteName } from '@/lib/exams';
import { themeInitScript } from '@/lib/theme';

// Self-hosted at build time by next/font. The variables are set on <html>, so
// portalled content (the menu drawer) gets the fonts too; globals.css exposes
// them to Tailwind as font-sans, font-display and font-mono.
const bodyFont = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const codeFont = Geist_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-code' });

/**
 * Tab title, app icons and web manifest for every page. Pages set their own
 * title, and the site name is appended. iOS reads apple-touch-icon and the
 * appleWebApp tags for the home-screen app, Android the manifest.
 */
export const metadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '48x48' },
      { url: '/icons/icon-192.png?v=2', type: 'image/png', sizes: '192x192' }
    ],
    // A new file name rather than a ?v= query, so iOS can't reuse a cached or failed
    // fetch. /apple-touch-icon.png and -precomposed.png stay for iOS's own lookups.
    apple: [{ url: '/icons/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' }]
  },
  // Home-screen web app: the status bar takes the theme-color with matching text
  appleWebApp: { title: 'Azure Exams', statusBarStyle: 'default' }
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout that wraps every page with the global styles, fonts, the theme
 * provider, the update notice and the version badge, registers the
 * service worker that keeps the app working offline, and keeps progress in
 * sync with the server. The inline script sets
 * the theme and the status bar / toolbar colour (theme-color meta) before the
 * page paints, so <html> is allowed to differ from the server render. The
 * theme context keeps both in sync afterwards.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${codeFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <div id="app-shell" className="relative flex h-dvh flex-col overflow-hidden bg-canvas font-sans text-ink">
            {children}
            <UpdateNotice />
            <VersionBadge />
          </div>
          <ServiceWorker />
          <ProgressSync />
        </ThemeProvider>
      </body>
    </html>
  );
}
