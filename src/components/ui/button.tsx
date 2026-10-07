import type { ComponentProps } from 'react';
import { cn, focusRing } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-card hover:bg-primary-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:border-accent hover:text-accent-strong',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm'
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Button classes, also for a Link that should look like a button. */
export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
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
