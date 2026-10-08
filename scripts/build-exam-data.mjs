// Converts the raw exam files in data/ into public/exam-data/<slug>.json.
// The exam page downloads these on demand instead of embedding every
// question in the page props, which keeps the page data small.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const outDir = path.join(process.cwd(), 'public', 'exam-data');
// data/wrong-answers/<slug>.json: { [question id]: { [wrong option text]: why it is wrong } }
const wrongAnswersDir = path.join(dataDir, 'wrong-answers');

// Leftover citation markers from the question sources, e.g. 【123†L74-L112】
const citation = /【[^】]*】|:?contentReference\[[^\]]*\]\{[^}]*\}/g;

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'))) {
  const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
  const wrongAnswersFile = path.join(wrongAnswersDir, file);
  const wrongAnswers = fs.existsSync(wrongAnswersFile) ? JSON.parse(fs.readFileSync(wrongAnswersFile, 'utf-8')) : {};

  // Keep only complete entries and convert the answer text to an index
  const questions = raw
    .filter((item) => item.question && item.options && item.answer && item.explanation)
    .map((item) => {
      const answerIndex = item.options.findIndex((option) => option === item.answer);
      // Stable id for saved mistakes and bookmarks; changes only if the question or answer text does
      const id = crypto.createHash('sha1').update(`${item.question}\n${item.answer}`).digest('hex').slice(0, 12);
      return {
        id,
        question: item.question,
        options: item.options,
        answerIndex: answerIndex >= 0 ? answerIndex : 0,
        explanation: item.explanation.replace(citation, '').trim(),
        ...(item.link && { link: item.link }),
        ...(wrongAnswers[id] && { wrongAnswers: wrongAnswers[id] })
      };
    });

  fs.writeFileSync(path.join(outDir, file), JSON.stringify(questions));
  const explained = questions.filter((question) => question.wrongAnswers).length;
  console.log(`exam-data: ${file} (${questions.length} questions, ${explained} with wrong-answer notes)`);
}
