import type { Metadata } from 'next';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';

export const metadata: Metadata = { title: 'Bookmarks' };

/** Bookmarks: questions flagged during an exam on this browser. */
export default function BookmarksPage() {
  return <BookmarkList />;
}
