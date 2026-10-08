import { Head, Html, Main, NextScript } from 'next/document';
import { themeColors, themeInitScript } from '@/lib/theme';

/**
 * Custom document. Sets the theme before the page paints and tells iOS how
 * to colour the status bar, including when the site runs from the home screen.
 * Also links the app icons and web manifest in public/.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Status bar / toolbar colour; the theme context keeps it in sync with the theme */}
        <meta name="theme-color" content={themeColors.light} />
        {/* Home-screen web app: the status bar takes the theme-color with matching text */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* App icon for the browser tab and home screen (iOS reads apple-touch-icon, Android the manifest) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Azure Exams" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
