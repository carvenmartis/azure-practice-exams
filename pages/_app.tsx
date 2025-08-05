import type { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * Custom App component that wraps every page in the application.
 * It imports the global Tailwind CSS styles and forwards all
 * properties to the underlying page component.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}