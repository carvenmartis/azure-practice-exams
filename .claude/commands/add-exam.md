---
description: Add a new practice exam (data file, static path and dashboard card)
argument-hint: <slug> "<display name>"  e.g. az-305 "AZ-305: Designing Azure Infrastructure Solutions"
---

Add a new practice exam. Arguments: $ARGUMENTS

1. Check `data/<slug>.json` exists and is an array of objects with `question`,
   `options` (string array), `answer` (exactly one of the options), `explanation` and
   optional `link`. If it's missing, stop and ask for it. Report any entries whose
   `answer` isn't in `options`, since the build script silently falls back to option 0.
2. Add the slug to `slugs` in `getStaticPaths` in `pages/exams/[slug].tsx`.
3. Add `{ slug, name }` to the `exams` array in `pages/index.tsx`, matching the existing
   name format.
4. Update the exam list in `README.md` if it names the exams.
5. Run `npm run exam-data`, `npm run lint` and `npm run build`, and report the question
   count printed for the new exam.
