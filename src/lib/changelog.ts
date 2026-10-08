/** One update of the app, newest first in `changelog`. */
export interface ChangelogEntry {
  /** ISO date the update was released, e.g. '2026-10-08'. */
  date: string;
  title: string;
  changes: string[];
}

/**
 * What changed in each update, shown on the About page. Version numbers come
 * from the CI run, so entries are dated rather than numbered. Add a new entry
 * at the top when you ship something people will notice.
 */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-10-08',
    title: 'Track your progress and study smarter',
    changes: [
      'My progress: past attempts per exam, score trends and your weakest skill areas.',
      'Review mistakes: a practice round built only from questions you got wrong.',
      'Bookmarks: flag tricky questions during an exam and revisit them later.',
      'Study mode: no score, and the answer and explanation show right after each question.',
      'Exam guides: the official skills outline per exam with Microsoft Learn links.',
      'About: the app version and this list of changes.'
    ]
  },
  {
    date: '2026-10-07',
    title: 'New design and AI exams',
    changes: [
      'New navy and gold design with light, dark and system themes.',
      'Side menu, and a header that stays in place on iPhone and iPad.',
      'New AI-103, AI-200 and AI-300 practice exams with 120 questions each.',
      'Answer options are shuffled, so the right answer moves around.',
      'Leaving an exam early asks first and shows your results so far.',
      'A notice appears when a new version is available.'
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
