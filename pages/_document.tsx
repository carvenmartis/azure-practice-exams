import { Head, Html, Main, NextScript } from 'next/document';
import { themeColors, themeInitScript } from '../lib/theme';

/**
 * Custom document. Sets the theme before the page paints and tells iOS how
 * to colour the status bar, including when the site runs from the home screen.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Status bar / toolbar colour; _app.tsx keeps it in sync with the theme */}
        <meta name="theme-color" content={themeColors.light} />
        {/* Home-screen web app: the status bar takes the theme-color with matching text */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
