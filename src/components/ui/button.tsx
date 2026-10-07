import type { ComponentProps } from 'react';
import { cn, focusRing } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2'
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Button classes, also for a Link that should look like a button. */
export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
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

/** Standard button: primary (blue), secondary (outlined) or ghost (text only). */
export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
