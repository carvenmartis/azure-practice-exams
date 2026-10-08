---
name: azure-practice-frontend
description: Build or review pages, components, styling, offline behavior, and client-side flows in this Azure Practice Exams Next.js app.
---

# Azure Practice Exams frontend

Match the repository's existing Next.js App Router architecture and visual
language. Read the files being changed and nearby examples; use
`docs/project-index.md` when the work crosses routes, persistence, offline
caching, reminders, or deployment.

## Architecture

- Keep `page.tsx`, `layout.tsx`, and route metadata on the server. Interactive
  pages should be thin server wrappers around Client Components in
  `src/components/<feature>/`.
- Read query strings with `useSearchParams()` in a Client Component and render
  it within `Suspense` from the route.
- Use `params: Promise<{ ... }>` in dynamic App Router pages and await it.
- Put shared UI with no app knowledge in `src/components/ui/`; feature-specific
  pieces stay in their feature directory.
- Access browser globals only from client-safe hooks or stores. Follow the
  existing cancelled-effect pattern for browser fetches and render loading and
  error states.

## Code and interface conventions

- Use TypeScript, 2-space indentation, single quotes, semicolons, kebab-case
  files, PascalCase components, named component exports, and `import type` for
  type-only imports.
- Use `@/` imports outside the current folder. Prefer existing primitives and
  helpers, including `Button`, `Card`, `Badge`, `cn`, and `focusRing`.
- Style with the semantic tokens defined in `src/styles/globals.css`; add any
  new token to both themes. Components should rarely need `dark:` variants.
- Preserve the scroll model: `PageLayout` owns the scrolling `<main>` beneath a
  non-sticky header.
- Keep buttons typed as `button`, external links protected with
  `rel="noreferrer"`, and keyboard/focus behavior usable.

## Cross-cutting checks

- A new user-facing page may need an entry in `src/lib/offline.ts`.
- Exam catalog changes flow from `src/lib/exams.ts` into dashboard cards,
  static params, offline files, guides, notes, and progress views.
- Theme header color changes must update both `src/styles/globals.css` and
  `src/lib/theme.ts`.
- Record every completed repository change in the newest appropriate entry in
  `src/lib/changelog.ts`, adding a new top entry for a distinct update.
- Do not hand-edit generated `public/exam-data/`.

Verify application changes with `npm run lint` and `npm run build`. Fix issues
introduced by the change and report any pre-existing failure separately.
