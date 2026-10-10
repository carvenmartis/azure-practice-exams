import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  /** `wide` fills the header's width (grids, lists); `reading` keeps text lines short. */
  width?: 'wide' | 'reading';
  className?: string;
  children: ReactNode;
}

/**
 * Content column shared by every page. The column always starts at the header's
 * left edge (the logo), so titles line up from page to page; `reading` only
 * limits how far the content runs to the right. The page transition itself is
 * on <main> (PageLayout).
 */
export function PageContainer({ width = 'wide', className, children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16 sm:pb-24 lg:pt-8 lg:pb-10">
      <div className={cn(width === 'reading' && 'max-w-3xl', className)}>{children}</div>
    </div>
  );
}
