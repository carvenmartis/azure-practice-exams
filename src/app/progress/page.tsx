import type { Metadata } from 'next';
import { ProgressOverview } from '@/components/progress/progress-overview';

export const metadata: Metadata = { title: 'My progress' };

/** My progress: attempts, score trends and weakest skill areas saved in this browser. */
export default function ProgressPage() {
  return <ProgressOverview />;
}
