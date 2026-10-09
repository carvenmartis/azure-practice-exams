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
    <Card className={cn('flex flex-col justify-between px-3 py-4 sm:px-6 sm:py-5', className)}>
      <dt className="text-xs font-medium text-ink-subtle sm:text-sm">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">{value}</dd>
    </Card>
  );
}
