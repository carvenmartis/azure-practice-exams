import { readFileSync } from 'node:fs';
import path from 'node:path';
import { exams } from '@/lib/exams';

/** Questions in each exam's bank, by slug, read from data/<slug>.json (at build time for static pages). */
export const questionCounts: Record<string, number> = Object.fromEntries(
  exams.map((exam) => {
    const file = path.join(process.cwd(), 'data', `${exam.slug}.json`);
    return [exam.slug, (JSON.parse(readFileSync(file, 'utf8')) as unknown[]).length];
  })
);
