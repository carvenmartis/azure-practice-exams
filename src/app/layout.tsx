import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import type { ReactNode } from 'react';
import { ServiceWorker } from '@/components/layout/service-worker';
import { UpdateNotice } from '@/components/layout/update-notice';
import { VersionBadge } from '@/components/layout/version-badge';
import { ThemeProvider } from '@/contexts/theme-context';
import { siteName } from '@/lib/exams';
import { themeInitScript } from '@/lib/theme';

// Self-hosted at build time by next/font. The variables are set on <html>, so
// portalled content (the menu drawer) gets the fonts too; globals.css exposes
// them to Tailwind as font-sans and font-display.
const bodyFont = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const headingFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-heading'
});

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
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: '/apple-touch-icon.png'
  },
  // Home-screen web app: the status bar takes the theme-color with matching text
  appleWebApp: { title: 'Azure Exams', statusBarStyle: 'default' }
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout that wraps every page with the global styles, fonts, the theme
 * provider, the update notice and the version badge, and registers the
 * service worker that keeps the app working offline. The inline script sets
 * the theme and the status bar / toolbar colour (theme-color meta) before the
 * page paints, so <html> is allowed to differ from the server render. The
 * theme context keeps both in sync afterwards.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex h-dvh flex-col overflow-hidden bg-canvas font-sans text-ink">
            {children}
            <UpdateNotice />
            <VersionBadge />
          </div>
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );
}
