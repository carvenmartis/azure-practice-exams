// Converts the raw exam files in data/ into public/exam-data/<slug>.json.
// The exam page downloads these on demand instead of embedding every
// question in the page props, which keeps the page data small.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const outDir = path.join(process.cwd(), 'public', 'exam-data');

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'))) {
  const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

  // Keep only complete entries and convert the answer text to an index
  const questions = raw
    .filter((item) => item.question && item.options && item.answer && item.explanation)
    .map((item) => {
      const answerIndex = item.options.findIndex((option) => option === item.answer);
      return {
        // Stable id for saved mistakes and bookmarks; changes only if the question or answer text does
        id: crypto.createHash('sha1').update(`${item.question}\n${item.answer}`).digest('hex').slice(0, 12),
        question: item.question,
        options: item.options,
        answerIndex: answerIndex >= 0 ? answerIndex : 0,
        explanation: item.explanation,
        ...(item.link && { link: item.link })
      };
    });

  fs.writeFileSync(path.join(outDir, file), JSON.stringify(questions));
  console.log(`exam-data: ${file} (${questions.length} questions)`);
}
