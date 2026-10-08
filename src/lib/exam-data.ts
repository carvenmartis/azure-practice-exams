/** One question as served from public/exam-data/<slug>.json. */
export interface ExamQuestion {
  /** Stable id from scripts/build-exam-data.mjs, used for mistakes and bookmarks. */
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  link?: string;
}

/** Downloads every question of one exam, in data file order. */
export async function fetchExamQuestions(slug: string): Promise<ExamQuestion[]> {
  const res = await fetch(`/exam-data/${slug}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
