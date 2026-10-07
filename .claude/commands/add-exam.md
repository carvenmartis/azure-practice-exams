---
description: Add a new practice exam (data file, static path and dashboard card)
argument-hint: <slug> "<display name>"  e.g. az-305 "AZ-305: Designing Azure Infrastructure Solutions"
---

Add a new practice exam. Arguments: $ARGUMENTS

1. Check `data/<slug>.json` exists and is an array of objects with `question`,
   `options` (string array), `answer` (exactly one of the options), `explanation` and
   optional `link`. If it's missing, stop and ask for it. Report any entries whose
   `answer` isn't in `options`, since the build script silently falls back to option 0.
2. Add `{ slug, name, description }` to the `exams` array in `lib/exams.ts`, matching
   the existing name format (`CODE: Title`). The dashboard card, the exam page header and
   the static path in `pages/exams/[slug].tsx` all come from that list.
3. Update the exam list in `README.md` if it names the exams.
4. Run `npm run exam-data`, `npm run lint` and `npm run build`, and report the question
   count printed for the new exam.
