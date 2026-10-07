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
        'flex cursor-pointer flex-col rounded-2xl border p-5 transition-colors',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
        checked
          ? 'border-accent bg-accent-soft shadow-card'
          : 'border-line bg-surface hover:border-line-strong'
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
            'h-4 w-4 rounded-full border-2 transition-colors',
            checked ? 'border-accent bg-accent shadow-[inset_0_0_0_2px_var(--color-surface)]' : 'border-line-strong'
          )}
        />
      </span>
      {description && (
        <span className="mt-1.5 text-sm text-ink-muted">{description}</span>
      )}
    </label>
  );
}
