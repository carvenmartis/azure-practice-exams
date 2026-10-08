/** A term or fact to memorize and its short explanation. */
export type StudyNote = readonly [term: string, definition: string];

/** The notes for one skill area of an exam's official outline. */
export interface NoteGroup {
  /** Must match a SkillArea name in src/lib/exam-guides.ts. */
  area: string;
  notes: StudyNote[];
}

export type ExamNotes = NoteGroup[];
