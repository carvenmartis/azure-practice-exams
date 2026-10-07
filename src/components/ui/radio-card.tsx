import { cn } from '@/lib/utils';

interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  description?: string;
  onChange: () => void;
}

/** A radio button drawn as a selectable card. Group several in a <fieldset>. */
export function RadioCard({ name, value, checked, label, description, onChange }: RadioCardProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer flex-col rounded-xl border p-4 transition-colors',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 dark:has-[:focus-visible]:outline-blue-400',
        checked
          ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
          : 'border-gray-200 bg-white hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="flex items-center justify-between font-semibold">
        {label}
        <span
          aria-hidden="true"
          className={cn(
            'h-4 w-4 rounded-full border-2',
            checked
              ? 'border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400'
              : 'border-gray-300 dark:border-gray-600'
          )}
        />
      </span>
      {description && (
        <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</span>
      )}
    </label>
  );
}
