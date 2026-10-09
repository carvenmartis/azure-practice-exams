/** One update of the app, newest first in `changelog`. */
export interface ChangelogEntry {
  /** ISO date the update was released, e.g. '2026-10-08'. */
  date: string;
  title: string;
  changes: string[];
}

/**
 * What changed in each update, shown on the About page. Version numbers come
 * from the CI run, so entries are dated rather than numbered. Every repository
 * change must be recorded in the newest dated entry, or in a new entry at the
 * top when it is a distinct update.
 */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-10-09',
    title: 'Every page redesigned',
    changes: [
      'A calmer look on every page: the Geist typeface, plain titles with a short intro, and the same cream, gold and navy colours.',
      'Lists, settings and the Course page use simple rows instead of stacks of cards.',
      'Answers show a check or cross once answered, and the question text is larger.',
      'Pages fade in, buttons respond to a press, and menus open faster and work reliably on iOS.',
      'The Dashboard is now called Course.',
      'Progress, mistakes, bookmarks and the daily goal can sync between your devices through the NAS: create a sync code in Settings and enter it on your other devices. Backups can also be saved to iCloud Drive from the share sheet.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'New exams and study tools',
    changes: [
      'Four new AI exams: AI-901, SC-500, AB-620 and DP-800.',
      'Harder wrong answers for seven exams, and every wrong answer now explains why it is wrong.',
      'Study notes for every exam, with search and a Quiz me mode.',
      'My progress, Review mistakes, Bookmarks, Study mode, Exam guides and topic drills for your weakest areas.',
      'Spaced repetition, a daily goal with a streak and reminder, and backup to move your progress to another device.',
      'Works offline, with keyboard shortcuts throughout (press ? for the list).',
      'Exams ask before they start, show a timer and let you skip questions.'
    ]
  },
  {
    date: '2026-10-07',
    title: 'New design and AI exams',
    changes: [
      'New navy and gold design with light, dark and system themes, and a side menu.',
      'New AI-103, AI-200 and AI-300 practice exams.',
      'Shuffled answers, a check before leaving an exam early, and a notice when a new version is out.'
    ]
  },
  {
    date: '2025-08-06',
    title: 'First release',
    changes: [
      'AZ-104, AZ-204, AZ-400 and AZ-304 practice exams with 60 random questions per attempt.',
      'The correct answer, an explanation and a documentation link after every question.',
      'Scores out of 1000 with the 700 passing mark, and dark mode.'
    ]
  }
];
