import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';

interface StatCardProps {
  label: string;
  value: ReactNode;
  className?: string;
}

/** A labelled number tile. Place it inside a <dl>. */
export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card className={cn('px-3 py-3 sm:px-5 sm:py-4', className)}>
      <dt className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold sm:text-2xl">{value}</dd>
    </Card>
  );
}
