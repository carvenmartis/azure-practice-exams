'use client';

import { RadioCard } from '@/components/ui/radio-card';
import { useTheme } from '@/contexts/theme-context';
import type { ThemePreference } from '@/contexts/theme-context';

const themeOptions: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Always use the light theme.' },
  { value: 'dark', label: 'Dark', description: 'Always use the dark theme.' },
  { value: 'system', label: 'System', description: 'Match your device setting.' }
];

/** Light / Dark / System choice; saved on this device by the theme context. */
export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset>
      <legend className="font-display text-xl font-semibold">Theme</legend>
      <p className="mt-1 text-sm text-ink-muted">
        Choose how the site looks. Your choice is saved on this device.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {themeOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="theme"
            value={option.value}
            label={option.label}
            description={option.description}
            checked={theme === option.value}
            onChange={() => setTheme(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
