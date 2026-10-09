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
    title: 'A calmer, sharper look',
    changes: [
      'New typeface (Geist) replaces the serif headings; the cream, gold and navy colours stay.',
      'Section labels are plain sentence case, page titles are smaller, and exam codes and answer keys use a monospaced font.',
      'Buttons, cards and answers give a slight press response; menus and dialogs open faster, and the keyboard shortcuts overlay opens instantly.',
      'Added CLAUDE.md and the Emil Kowalski and Taste design skills for Claude Code under .claude/skills.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Harder answer choices and less repetitive rounds',
    changes: [
      'Wrong answer choices for AZ-104, AZ-204, AZ-304, AZ-400, AI-103, AI-200 and AI-300 were rewritten as close, plausible alternatives checked against Microsoft Learn, so the correct answer no longer stands out by length or detail.',
      'Practice rounds and study mode still pick questions at random, but spread repeated question wording and repeated correct answers apart.',
      'Added repository agent guidance, reusable development workflows and a maintained project index so future changes follow the same architecture and validation rules.',
      'Every repository change must now be recorded in this changelog.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Study notes for every exam',
    changes: [
      'New Study notes page per exam (in the menu, on each exam card and on the exam guide): the key terms, limits and facts of every skill area with a short explanation, plus all abbreviations used in the questions.',
      'Search the notes, jump to a skill area, or tap Quiz me to hide the meanings and test yourself one term at a time.',
      'Stuck on a tricky question? Search on Microsoft Learn (or press L), next to Bookmark, opens the Learn search for that question in a new tab, in exams and in study mode.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Four more AI exams',
    changes: [
      'New practice exams with 120 questions each: AI-901 Azure AI Fundamentals, SC-500 Cloud and AI Security Engineer, AB-620 AI Agent Builder and DP-800 SQL AI Developer.',
      'Each new exam has its official skills outline in Exam guides, topic drills, and a note on every wrong answer.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Learn from the wrong answers too',
    changes: [
      'After answering, every wrong option now says why it is wrong, with your own pick at the top.',
      'Abbreviations used in a question, such as LRS, RBAC or RU, are spelled out under the explanation.',
      'Removed leftover source markers like 【123†L74-L112】 from the explanations.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Safer taps and a start prompt',
    changes: [
      'Tapping the new version notice no longer also opens the category or exam card behind it.',
      'Starting a practice exam now asks first, showing the exam, the number of questions and the clock. Enter starts, Escape cancels.'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Topic drills, backups and a daily goal',
    changes: [
      'Topic drills: on My progress, each of your weakest skill areas has a short 10-question round on just that topic.',
      'Backup and sync: in Settings, export your progress, mistakes, bookmarks and daily goal to a file and import it on another device.',
      'Daily goal and streak: the dashboard shows how many questions you answered today against your goal, and how many days in a row you reached it.',
      'Daily reminder: choose a time in Settings and get a notification on days you have not reached your goal yet (needs an https address, and on iPhone and iPad the app added to the Home Screen).'
    ]
  },
  {
    date: '2026-10-08',
    title: 'Track your progress and study smarter',
    changes: [
      'Exams work with the keyboard: Tab or the up and down arrows move between the answers, Enter picks one and goes on, and Escape exits. Shortcuts in exams and study mode: A-D or 1-4 to answer, S to skip, left and right arrows to move between questions and M to bookmark. Press ? for the list.',
      'Clearer keyboard focus everywhere, a Skip to content link, and the menu can be used with the keyboard.',
      'The dashboard shows exam categories (Administration and Architecture, Development and DevOps, AI and Machine Learning); pick one to see its exams.',
      'Works offline: once the app has been opened online, every exam keeps working without Wi-Fi, and the corner label shows when you are offline.',
      'Settings shows whether offline use is ready on this device, or why not (it needs an https address).',
      'Exam questions are saved on the device too, so an exam opened without a connection loads its questions instead of asking you to refresh.',
      'Spaced repetition: questions you miss come back for review after 3 days, then after 7, 14 and 30 days each time you get them right, until you know them.',
      'Rebuilt on the Next.js App Router. Everything works as before, and unknown pages now show a proper page not found.',
      'My progress: past attempts per exam, score trends and your weakest skill areas.',
      'Review mistakes: a practice round built only from questions you got wrong.',
      'Bookmarks: flag tricky questions during an exam and revisit them later.',
      'Study mode: no score, and the answer and explanation show right after each question.',
      'Exam guides: the official skills outline per exam with Microsoft Learn links.',
      'About: the app version and this list of changes.',
      'Exams show how long you have been working, and the time is saved with each attempt.',
      'Skip a question and come back to it later from the question overview.'
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
