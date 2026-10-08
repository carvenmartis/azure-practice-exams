# Azure Practice Exams agent guide

This is a Next.js 16 App Router PWA for Azure certification practice. Use the
smallest relevant context for the task; [docs/project-index.md](docs/project-index.md)
is the architecture and ownership map when a change crosses features or layers.

## Repository rules

- Keep route files in `src/app/` as Server Components. Put state, effects,
  browser APIs, event handlers, and Framer Motion in a focused Client Component
  under `src/components/<feature>/`.
- Use the `@/` alias across `src/`, kebab-case filenames, named component
  exports, and default exports only for Next.js special files.
- Compose every page with `PageLayout`. The document is fixed to `h-dvh`; the
  page `<main>` scrolls. Do not make the header fixed or sticky.
- Use the semantic color and shadow tokens in `src/styles/globals.css`, `cn()`
  and `focusRing` from `src/lib/utils.ts`, and the existing UI primitives.
  Avoid raw Tailwind palette colors in components.
- `src/lib/exams.ts` is the canonical exam catalog. `data/*.json` is raw source
  data; `public/exam-data/` is generated and ignored.
- When adding a route that must work offline, update `src/lib/offline.ts`.
- Keep `src/lib/theme.ts` `themeColors` synchronized with the `--header` values
  in `src/styles/globals.css`.
- Preserve accessibility: semantic elements, visible keyboard focus, genuine
  disabled states, and the established keyboard interactions.
- Record every repository change in `src/lib/changelog.ts`. Update the newest
  dated entry when it belongs to the same update; otherwise add a new entry at
  the top. Describe user-facing effects plainly and include developer-facing
  changes when they have no visible UI effect.
- Do not change generated or incidental files such as `.next/`,
  `public/exam-data/`, `next-env.d.ts`, or `*.tsbuildinfo` by hand.

## Reusable workflows

- For frontend implementation or review, use the repo-local
  `azure-practice-frontend` skill.
- To add an exam, use the repo-local `add-practice-exam` skill.

Run validation proportionate to the change. For application changes, the normal
checks are `npm run lint` and `npm run build`; `npm run build` already regenerates
exam data through `prebuild`.
