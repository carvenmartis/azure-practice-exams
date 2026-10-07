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
- Every page renders inside `<PageLayout>` (tab title, `CourseHeader`, `<main>`). The
  document never scrolls: `<main>` is the scroll area below a header that never moves,
  because iOS 26 Safari misplaces `fixed`/`sticky` bars. Don't make the header fixed or
  sticky, and scroll `<main>`, not `window`.

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
- Design tokens, not raw palette colours. `globals.css` defines each colour once per theme
  (`:root` and `.dark`) and exposes it to Tailwind: `bg-canvas` (page), `bg-surface` /
  `bg-surface-muted` (cards, panels), `bg-header`, `text-ink` / `text-ink-muted` /
  `text-ink-subtle`, `border-line` / `border-line-strong`, `text-accent` / `bg-accent-soft`
  (muted gold), `bg-primary` + `text-on-primary` (navy, gold in dark mode), and
  `success` / `danger` (+ `-soft`) for right and wrong answers. A new colour gets a token
  in both themes; don't use `gray-*`, `blue-*` and so on in components.
- Because the tokens switch with the theme, components rarely need `dark:`. `dark:` still
  follows the `.dark` class on `<html>` (set by the script in `_document.tsx` before first
  paint, kept in sync by `ThemeProvider`). Don't branch on `useTheme().darkMode` for styling.
- Look: `font-display` (Playfair Display) for page titles, card titles and big numbers
  (add `lining-nums` to numbers); `font-sans` (Inter) for everything else. Fonts load
  with `next/font/google` in `_app.tsx`. Eyebrow labels are `text-xs font-semibold
  uppercase tracking-[0.2em] text-accent`. `rounded-2xl` cards and panels, `rounded-xl`
  options and menu items, `rounded-full` buttons and badges; `shadow-card` at rest,
  `shadow-lifted` for hover, drawers and dialogs. Keep gold as an accent, not a fill.
- Use v4 names: `rounded-sm`, `outline-hidden`, `bg-black/50`.
- The header and status bar are solid and the same colour: `--header` in `globals.css`
  must equal `themeColors` in `src/lib/theme.ts`; change both together.

## Style and accessibility
- 2-space indent, single quotes, semicolons, no trailing commas, JSDoc above components
  and data functions.
- Semantic elements, visible `focus-visible:` states, real `disabled` attributes, and
  enough contrast in light and dark mode.
