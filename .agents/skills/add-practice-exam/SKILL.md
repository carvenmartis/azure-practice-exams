---
name: add-practice-exam
description: Add a practice exam from a supplied data JSON file and wire it into the catalog, static pages, offline support, and documentation.
---

# Add a practice exam

Inputs are a slug, display name, description, category, and a supplied
`data/<slug>.json` file. Ask only for values that cannot be inferred safely.

1. Confirm the slug is kebab-case and the data file is a JSON array. Every item
   must have a non-empty `question`, an `options` string array, an `answer` that
   exactly equals one option, an `explanation`, and an optional `link`. Stop for
   a missing file; report invalid entries before editing the catalog.
2. Add the exam to `src/lib/exams.ts`. Use an existing `examCategories` id and
   match the `CODE: Title` naming pattern used by the current entries.
3. Check the related sources of truth described in `docs/project-index.md`:
   add an `ExamGuide` in `src/lib/exam-guides.ts` when official outline data is
   available, and add notes through `src/lib/notes/` only when supplied or
   explicitly requested. Static exam and study routes plus offline exam data
   derive automatically from the catalog.
4. Update the exam list in `README.md` when it enumerates supported exams, and
   record the completed change in the newest appropriate entry in
   `src/lib/changelog.ts`.
5. Run `npm run exam-data`, `npm run lint`, and `npm run build`. Report the
   generated question count and whether any wrong-answer notes were attached.

Never edit or commit `public/exam-data/`; it is generated and git-ignored.
