---
name: frontend-conventions
description: Stack, folder layout, naming and TypeScript/React/Tailwind v4 conventions for this Next.js Pages Router app. Use when writing or reviewing any code in src/ or next/postcss/eslint config.
---

# Frontend conventions

## Stack
- Next.js 16 **Pages Router** (`src/pages/`, no `app/`). Don't use App Router features:
  no `"use client"`, Server Components, `app/layout.tsx` or `next/navigation`. Use
  `next/router`, `next/link`, `next/head`, `getStaticProps`/`getStaticPaths`, `AppProps`.
- React 19, function components and hooks only. Animation with `framer-motion`.
- TypeScript 5.9, `strict: false`, `moduleResolution: "bundler"`. Import from `src/` with
  the `@/` alias (`@/components/ui/button`); use `./` only within the same folder.
- Tailwind v4 via `@tailwindcss/postcss`. No `tailwind.config.js`: config lives in
  `src/styles/globals.css` (`@import 'tailwindcss';`, `@theme`, `@custom-variant`).
- ESLint 9 flat config: `eslint-config-next/core-web-vitals` + `/typescript`.
- `next.config.js` is CommonJS, `output: 'standalone'` (Docker).

## Folder layout
```
src/
  pages/                 routes only (Next.js names: _app, _document, [slug], api/)
  components/
    ui/                  reusable UI with no app knowledge: button, card, badge,
                         stat-card, radio-card, confirm-dialog
    layout/              app shell: page-layout, course-header, nav-menu,
                         update-notice, version-badge
    dashboard/ exam/ settings/   feature components used by one area
  contexts/              React contexts + their hook (theme-context: useTheme)
  lib/                   plain TS: exams list, theme colours, version, leave-guard, utils
  styles/globals.css
data/                    raw exam JSON (root)
scripts/                 build-exam-data.mjs (root)
public/                  static files; public/exam-data/ is generated
```
- File and folder names are **kebab-case** (`course-header.tsx`, `leave-guard.ts`); only
  Next.js special files keep their names (`_app.tsx`, `[slug].tsx`). Component names
  are PascalCase.
- Components are **named exports** (`export function Button`); pages and
  `_app`/`_document` are default exports.
- Put a UI element in `components/ui/` as soon as a second place needs it; put a piece of
  a feature in `components/<feature>/` when it makes a page easier to read. Pages compose
  components and own the page state.
- Every page renders inside `<PageLayout>` (tab title, sticky `CourseHeader`, `<main>`).

## Data and pages
- `src/lib/exams.ts` is the single exam list: dashboard cards, header titles and
  `getStaticPaths` all read it.
- `src/pages/exams/[slug].tsx`: quiz. Static paths come from `exams` (`fallback: false`);
  props carry only `slug`; questions are fetched in the browser from
  `/exam-data/<slug>.json`.
- `scripts/build-exam-data.mjs` turns `data/*.json` into `public/exam-data/` (git-ignored)
  before `dev` and `build`. Never commit that folder or put question data in page props.
- `src/pages/api/version.ts` returns the running build; `UpdateNotice` polls it.

## TypeScript
- `interface` for props and data shapes at the top of the file; `?` for optional fields.
- `import type` for type-only imports.
- Typed data functions: `export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ...`.
- Explicit state types when not inferable: `useState<ProcessedQuestion[] | null>(null)`.
- Handlers are `const handleX = () => {}`.
- Write code that would pass strict mode (no implicit `any`, handle null), but don't turn
  `strict` on as a side effect.

## React
- Local `useState`; app-wide state via a context in `src/contexts/` plus a `useX()` hook,
  provided in `_app.tsx`.
- Fetching effects use a `cancelled` flag with cleanup and show loading and error states.
- Copy before updating arrays (`[...selectedAnswers]`). Use data keys (`exam.slug`).
- `type="button"` on buttons; `target="_blank" rel="noreferrer"` on external links.
- Touch `window`/`matchMedia`/`localStorage` only in effects or `useSyncExternalStore`.

## Tailwind
- Utilities in `className`, mobile first (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- Combine conditional classes with `cn()` from `@/lib/utils`; reuse `focusRing` from there
  for keyboard focus.
- Reuse the UI components instead of repeating their classes; for a Link that should look
  like a button or card use `buttonClasses()` / `cardClasses()`.
- Palette: `gray` surfaces/text, `blue-600`/`blue-700` primary actions, `green-*` correct,
  `red-*` wrong. `rounded-lg` buttons/panels, `rounded-xl` cards, `transition-colors`.
- Use v4 names: `shadow-xs`/`shadow-sm`, `rounded-sm`, `outline-hidden`, `bg-black/50`.
- Dark mode: always `dark:` variants. `globals.css` maps `dark:` to the `.dark` class on
  `<html>`, which the script in `_document.tsx` sets before first paint and
  `ThemeProvider` keeps in sync. Don't branch on `useTheme().darkMode` for styling.
- The header and status bar are solid (`bg-white` / `dark:bg-black`, matching
  `themeColors` in `src/lib/theme.ts`); keep them in step.

## Style and accessibility
- 2-space indent, single quotes, semicolons, no trailing commas, JSDoc above components
  and data functions.
- Semantic elements, visible `focus-visible:` states, real `disabled` attributes, and
  enough contrast in light and dark mode.
