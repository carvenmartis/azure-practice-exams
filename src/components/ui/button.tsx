import type { ComponentProps } from 'react';
import { cn, focusRing } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-card hover:bg-primary-hover',
  secondary: 'border border-line-strong bg-surface text-ink shadow-card hover:border-ink-subtle',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm'
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Button classes, also for a Link that should look like a button. */
export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50',
    focusRing,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Standard button: primary (navy, gold in dark mode), secondary (outlined) or ghost (text only). */
export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
