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
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle sm:text-xs">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-semibold text-ink lining-nums sm:text-4xl">{value}</dd>
    </Card>
  );
}
