---
name: frontend-conventions
description: Stack, folder layout, naming and TypeScript/React/Tailwind v4 conventions for this Next.js App Router app. Use when writing or reviewing any code in src/ or next/postcss/eslint config.
---

# Frontend conventions

## Stack
- Next.js 16 **App Router** (`src/app/`, no `src/pages/`). Routes are folders with a
  `page.tsx`; `src/app/layout.tsx` is the root layout. Use `next/link` and
  `next/navigation` (`usePathname`, `useSearchParams`, `useRouter`); don't use
  `next/router`, `next/head`, `getStaticProps`/`getStaticPaths` or `_app`/`_document`.
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
  app/                   routes only: layout.tsx, page.tsx per route, not-found.tsx,
                         [slug]/ folders, api/version and api/offline-pages route.ts
  components/
    ui/                  reusable UI with no app knowledge: button, card, badge,
                         stat-card, radio-card, confirm-dialog
    layout/              app shell: page-layout, course-header, nav-menu,
                         update-notice, version-badge
    dashboard/ exam/ study/ progress/ review/ bookmarks/ settings/
                         feature components, including each page's client part
  contexts/              React contexts + their hook (theme-context: useTheme)
  lib/                   plain TS: exams list, theme colours, version, leave-guard, utils
  styles/globals.css
data/                    raw exam JSON (root)
scripts/                 build-exam-data.mjs (root)
public/                  static files; public/exam-data/ is generated
```
- File and folder names are **kebab-case** (`course-header.tsx`, `leave-guard.ts`); only
  Next.js special files keep their names (`page.tsx`, `layout.tsx`, `route.ts`,
  `not-found.tsx`, `[slug]/`). Component names are PascalCase.
- Components are **named exports** (`export function Button`); `page.tsx`, `layout.tsx`
  and `not-found.tsx` are default exports.
- Put a UI element in `components/ui/` as soon as a second place needs it; put a piece of
  a feature in `components/<feature>/` when it makes a page easier to read. Pages compose
  components and own the page state.
- Every page renders inside `<PageLayout>` (`CourseHeader` and `<main>`). The
  document never scrolls: `<main>` is the scroll area below a header that never moves,
  because iOS 26 Safari misplaces `fixed`/`sticky` bars. Don't make the header fixed or
  sticky, and scroll `<main>`, not `window`.

## Server and client components
- Files in `src/app/` are Server Components: they export `metadata` (or
  `generateMetadata`), `generateStaticParams` and the default page, and hold no state.
  The tab title is `metadata.title`; the root layout appends the site name
  (`title.template`). Don't render `<title>` or `<meta>` yourself.
- Anything with state, effects, browser APIs, event handlers or `framer-motion` is a
  Client Component with `'use client';` as its first line, in `src/components/<feature>/`.
  A page that is mostly interactive is a thin `page.tsx` that renders one such component
  (`app/review/page.tsx` -> `ReviewList`, `app/exams/[slug]/page.tsx` -> `ExamSession`).
- Mark only the components that need it; a component that just forwards props (e.g.
  `AnswerOption`) stays unmarked and becomes client code when a client component imports it.
- Read query strings with `useSearchParams()` in the client component, and render that
  component inside `<Suspense>` in `page.tsx`, so the page stays statically generated.
- Head tags (icons, manifest, Apple web-app tags) live in `metadata` in `src/app/layout.tsx`.
  The theme-color meta is the exception: `themeInitScript` creates it before first
  paint, so don't add `viewport.themeColor` (React would add a second, light one).

## Data and pages
- `src/lib/exams.ts` is the single exam list: dashboard cards, header titles and
  `generateStaticParams` all read it.
- `src/app/exams/[slug]/page.tsx`: quiz. Static params come from `exams`
  (`dynamicParams = false`, so unknown slugs are a 404); the page passes only `slug` to
  `ExamSession`, which fetches the questions in the browser from `/exam-data/<slug>.json`.
  `study/[slug]` and `guides/[slug]` work the same way. `params` is a Promise: `await` it.
- `scripts/build-exam-data.mjs` turns `data/*.json` into `public/exam-data/` (git-ignored)
  before `dev` and `build`. Never commit that folder or pass question data from the server.
- `src/app/api/version/route.ts` (`GET`, `force-dynamic`, `no-store`) returns the running
  build; `UpdateNotice` polls it.
- Offline mode: `public/sw.js` precaches every page in `offlinePages` (`src/lib/offline.ts`)
  with its `/_next/static` files and all exam data. Add a new page to `offlinePages`. The
  worker never caches `/api/*` or RSC requests (`?_rsc=`); offline, Next.js falls back to
  a full page load, which the cached HTML answers.

## TypeScript
- `interface` for props and data shapes at the top of the file; `?` for optional fields.
- `import type` for type-only imports.
- Route props: `interface Props { params: Promise<{ slug: string }> }`, used by the page,
  `generateMetadata` (`Promise<Metadata>`) alike.
- Explicit state types when not inferable: `useState<ProcessedQuestion[] | null>(null)`.
- Handlers are `const handleX = () => {}`.
- Write code that would pass strict mode (no implicit `any`, handle null), but don't turn
  `strict` on as a side effect.

## React
- Local `useState`; app-wide state via a context in `src/contexts/` plus a `useX()` hook,
  provided in `src/app/layout.tsx`.
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
  follows the `.dark` class on `<html>` (set by the script in `src/app/layout.tsx` before
  first paint, kept in sync by `ThemeProvider`). Don't branch on `useTheme().darkMode` for styling.
- Look: `font-display` (Playfair Display) for page titles, card titles and big numbers
  (add `lining-nums` to numbers); `font-sans` (Inter) for everything else. Fonts load
  with `next/font/google` in `src/app/layout.tsx` as the `--font-body` / `--font-heading`
  variables on `<html>`. Eyebrow labels are `text-xs font-semibold
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
