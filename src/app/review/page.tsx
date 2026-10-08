import type { Metadata } from 'next';
import { ReviewList } from '@/components/review/review-list';

export const metadata: Metadata = { title: 'Review mistakes' };

/** Review mistakes: per exam, the questions answered wrong on this browser. */
export default function ReviewPage() {
  return <ReviewList />;
}
