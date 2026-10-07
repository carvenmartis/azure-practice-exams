import Head from 'next/head';
import CourseHeader from '../components/CourseHeader';
import { siteName } from '../lib/exams';
import { useDarkMode } from './_app';
import type { ThemePreference } from './_app';

const themeOptions: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Always use the light theme.' },
  { value: 'dark', label: 'Dark', description: 'Always use the dark theme.' },
  { value: 'system', label: 'System', description: 'Match your device setting.' }
];

/**
 * Settings page. The theme choice is saved in the browser and applied
 * across the whole site by _app.tsx.
 */
export default function Settings() {
  const { darkMode, theme, setTheme } = useDarkMode();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Head>
        <title>{`Settings | ${siteName}`}</title>
      </Head>
      <CourseHeader title="Settings" />
      <main className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <fieldset className="mt-8">
          <legend className="text-lg font-semibold">Theme</legend>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose how the site looks. Your choice is saved on this device.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const selected = theme === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                    selected
                      ? (darkMode ? 'border-blue-500 bg-blue-950' : 'border-blue-600 bg-blue-50')
                      : (darkMode ? 'border-gray-800 bg-gray-900 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-400')
                  } ${darkMode ? 'has-[:focus-visible]:outline-blue-400' : 'has-[:focus-visible]:outline-blue-600'}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={selected}
                    onChange={() => setTheme(option.value)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between font-semibold">
                    {option.label}
                    <span
                      aria-hidden="true"
                      className={`h-4 w-4 rounded-full border-2 ${
                        selected
                          ? (darkMode ? 'border-blue-400 bg-blue-400' : 'border-blue-600 bg-blue-600')
                          : (darkMode ? 'border-gray-600' : 'border-gray-300')
                      }`}
                    />
                  </span>
                  <span className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </main>
    </div>
  );
}
