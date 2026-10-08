import { ab620Notes } from './ab-620';
import { ai103Notes } from './ai-103';
import { ai200Notes } from './ai-200';
import { ai300Notes } from './ai-300';
import { ai901Notes } from './ai-901';
import { az104Notes } from './az-104';
import { az204Notes } from './az-204';
import { az304Notes } from './az-304';
import { az400Notes } from './az-400';
import { dp800Notes } from './dp-800';
import { sc500Notes } from './sc-500';
import type { ExamNotes } from './types';

export type { ExamNotes, NoteGroup, StudyNote } from './types';

/**
 * Study notes per exam slug: the terms, abbreviations and facts worth
 * memorizing, grouped by the skill areas in src/lib/exam-guides.ts. The notes
 * page also lists every abbreviation the exam's questions use (from
 * src/lib/abbreviations.ts). A new exam gets a page once it has an entry here.
 */
const examNotes: Record<string, ExamNotes> = {
  'az-104': az104Notes,
  'az-204': az204Notes,
  'az-400': az400Notes,
  'az-304': az304Notes,
  'ai-901': ai901Notes,
  'ai-103': ai103Notes,
  'ai-200': ai200Notes,
  'ai-300': ai300Notes,
  'sc-500': sc500Notes,
  'ab-620': ab620Notes,
  'dp-800': dp800Notes
};

export function getExamNotes(slug: string): ExamNotes | undefined {
  return examNotes[slug];
}

/** Number of notes for an exam, not counting the abbreviation list. */
export function noteCount(slug: string) {
  return (examNotes[slug] ?? []).reduce((sum, group) => sum + group.notes.length, 0);
}
