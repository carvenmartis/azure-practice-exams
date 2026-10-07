---
name: frontend-conventions
description: Stack, layout and TypeScript/React/Tailwind v4 conventions for this Next.js Pages Router app. Use when writing or reviewing any code in pages/, styles/ or next/postcss/eslint config.
---

# Frontend conventions

## Stack
- Next.js 16 **Pages Router** (`pages/`, no `app/`). Don't use App Router features:
  no `"use client"`, Server Components, `app/layout.tsx` or `next/navigation`. Use
  `next/router`, `next/link`, `next/head`, `getStaticProps`/`getStaticPaths`, `AppProps`.
- React 19, function components and hooks only.
- TypeScript 5.9, `strict: false`, `moduleResolution: "bundler"`, no path aliases, so
  imports are relative.
- Tailwind v4 via `@tailwindcss/postcss`. No `tailwind.config.js`: config lives in
  `styles/globals.css` (`@import 'tailwindcss';`, `@theme`, `@custom-variant`).
- ESLint 9 flat config: `eslint-config-next/core-web-vitals` + `/typescript`.
- `next.config.js` is CommonJS, `output: 'standalone'` (Docker).

## Layout
- `pages/_app.tsx`: imports `globals.css`, owns the dark mode context and exports
  `useDarkMode()`, the single toggle and the version badge.
- `pages/index.tsx`: dashboard grid built from the `exams` array.
- `pages/exams/[slug].tsx`: quiz. Static paths list the slugs (`fallback: false`); props
  carry only `slug`; questions are fetched in the browser from `/exam-data/<slug>.json`.
- `scripts/build-exam-data.mjs` turns `data/*.json` into `public/exam-data/` (git-ignored)
  before `dev` and `build`. Never commit that folder or put question data in page props.

## TypeScript
- `interface` for props and data shapes at the top of the file; `?` for optional fields.
- `import type` for type-only imports.
- Typed data functions: `export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ...`.
- Explicit state types when not inferable: `useState<ProcessedQuestion[] | null>(null)`.
- `export default function Page(props: Props)`; handlers are `const handleX = () => {}`.
- Write code that would pass strict mode (no implicit `any`, handle null), but don't turn
  `strict` on as a side effect.

## React
- Local `useState`; app-wide state via a context in `_app.tsx` plus a `useX()` hook.
- Fetching effects use a `cancelled` flag with cleanup and show loading and error states.
- Copy before updating arrays (`[...selectedAnswers]`). Use data keys (`exam.slug`).
- `type="button"` on buttons; `target="_blank" rel="noreferrer"` on external links.
- Touch `window`/`matchMedia` only inside `useEffect`.

## Tailwind
- Utilities in `className`, mobile first (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- Conditional classes are template literals with ternaries; there's no `clsx`/`cn`.
- Palette: `gray` surfaces/text, `blue-600`/`blue-700` primary actions, `green-*` correct,
  `red-*` wrong. `rounded-lg` buttons/panels, `rounded-xl` cards, `transition-colors`.
- Shared component styles go in `globals.css` via `@apply` (like `.answer-button`) only
  when repeated in several places. Keep the v3 border-colour base rule there.
- Use v4 names: `shadow-xs`/`shadow-sm`, `rounded-sm`, `outline-hidden`, `bg-black/50`.
- Dark mode: pages pick classes from `useDarkMode()` with ternaries; `_app.tsx` uses
  `dark:`. In v4, `dark:` follows the OS unless `globals.css` has
  `@custom-variant dark (&:where(.dark, .dark *));`, which it doesn't yet. Match the file
  you're in; if you switch to `dark:`, add that line first and say so.

## Style and accessibility
- 2-space indent, single quotes, semicolons, no trailing commas, JSDoc above components
  and data functions.
- Semantic elements, visible `focus-visible:` states, real `disabled` attributes, and
  enough contrast in light and dark mode.
