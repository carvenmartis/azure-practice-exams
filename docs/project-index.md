# Project index

Indexed 2026-10-08. This map describes ownership and data flow; inspect the
named source before changing behavior.

## Product snapshot

Azure Practice Exams is a Next.js 16 / React 19 / TypeScript 5.9 / Tailwind v4
PWA. It currently catalogs 11 exams backed by 1,947 validated raw questions.
A normal attempt selects up to 60 questions and scores correct answers out of
1,000. The app also offers study mode, topic drills, spaced-repetition review,
bookmarks, progress history, notes, offline use, backup/restore, themes, and web
push reminders.

## Source-of-truth map

| Concern | Canonical source | Main consumers |
| --- | --- | --- |
| Exam catalog and categories | `src/lib/exams.ts` | Dashboard, category pages, dynamic static params, offline lists, progress, guides and notes indexes |
| Raw questions | `data/<slug>.json` | `scripts/build-exam-data.mjs`, build-time abbreviation extraction |
| Browser question payloads | Generated `public/exam-data/<slug>.json` | `src/lib/exam-data.ts`, service worker precache |
| Official outlines and topic keywords | `src/lib/exam-guides.ts` | Guide pages, study filters, topic classification and drills |
| Study notes | `src/lib/notes/<slug>.ts` and `src/lib/notes/index.ts` | Notes index and per-exam notes pages |
| Local progress schema and spaced repetition | `src/lib/progress-store.ts` | Exam, review, bookmarks, dashboard, progress and backups |
| Offline page/file manifest | `src/lib/offline.ts` | `/api/offline-pages`, `public/sw.js`, service-worker registration |
| Theme tokens | `src/styles/globals.css` | All UI; initial browser chrome color also mirrors in `src/lib/theme.ts` |
| Release history | `src/lib/changelog.ts` | About page; every repository change must be recorded here |
| Version identity | `package.json`, `next.config.js`, `src/lib/version.ts` | Footer badge, update polling and service-worker cache version |
| Reminder persistence and scheduler | `src/lib/server/reminders.ts` | Push API routes and `src/instrumentation.ts` |

## Route index

All pages compose `PageLayout`; dynamic exam routes set `dynamicParams = false`.

| Route | Owner | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Category dashboard, daily goal and due-review summary |
| `/categories/[id]` | `src/app/categories/[id]/page.tsx` | Exams within one catalog category |
| `/exams/[slug]` | route wrapper + `components/exam/exam-session.tsx` | Exam, review, bookmark and topic-drill modes |
| `/study`, `/study/[slug]` | app routes + `components/study/study-session.tsx` | Guided one-question-at-a-time study, optionally filtered by topic |
| `/guides`, `/guides/[slug]` | app routes | Official outline weights, skills and Microsoft Learn links |
| `/notes`, `/notes/[slug]` | app routes + `components/notes/study-notes.tsx` | Searchable notes, abbreviation reference and quiz mode |
| `/progress` | `components/progress/*` | Attempt history, score trends, topic strength and reset controls |
| `/review` | `components/review/review-list.tsx` | Due and upcoming spaced-repetition queues |
| `/bookmarks` | `components/bookmarks/bookmark-list.tsx` | Saved questions grouped by exam |
| `/settings` | `components/settings/*` | Theme, daily goal/reminders, offline status and backup/restore |
| `/about` | `src/app/about/page.tsx` | Version and changelog |

API routes are `/api/version`, `/api/offline-pages`, and the push endpoints
`/api/push/key`, `/subscribe`, `/unsubscribe`, `/progress`, `/status`, and
`/test`. They delegate reminder logic to `src/lib/server/reminders.ts`.

## Runtime flows

### Question build and delivery

`data/*.json` -> `scripts/build-exam-data.mjs` -> stable 12-character question
IDs, answer indexes, cleaned explanations and optional wrong-answer notes ->
`public/exam-data/*.json`. `predev` and `prebuild` run this generation. In the
browser, `src/lib/exam-data.ts` fetches the payload and keeps an IndexedDB copy
for offline fallback.

Current raw question counts: `az-104` 207; `az-204`, `az-304`, and `az-400`
300 each; `ab-620`, `ai-103`, `ai-200`, `ai-300`, `ai-901`, `dp-800`, and
`sc-500` 120 each. Every current entry has a matching answer option and link.

### Practice and progress

`ExamSession` is the largest client feature. Query parameters select `exam`,
`review`, `bookmarks`, or `drill` mode. It downloads questions and chooses a
varied pool that prioritizes balanced option sets and delays repeated stems or
answers through `src/lib/question-selection.ts`. It then shuffles options,
manages keyboard navigation and leave guards, and records answer results.
`progress-store.ts` persists attempts,
mistakes, review schedules, bookmarks and daily counts in localStorage. Wrong
answers enter review at 3 days; correct due reviews advance through 7, 14 and
30 days before removal. Only normal exam mode writes an attempt.

### Offline and updates

`ServiceWorker` registers `public/sw.js` only in production. The worker asks
`/api/offline-pages` for all static pages and files, discovers their Next.js
assets, and precaches them. Navigations and exam JSON are network-first with a
six-second cached fallback; immutable `/_next/static` assets are cache-first;
API and RSC requests are never cached. Its cache key uses the build ID. The
update notice polls `/api/version` and detects a changed build.

### Reminders

The browser stores reminder preferences separately from progress, registers a
Push subscription, and sends the user's IANA timezone plus daily status to the
server. `src/instrumentation.ts` starts the Node scheduler. Server state and
VAPID keys live under `REMINDER_DATA_DIR` (default `reminder-data/`), mounted as
a Docker volume in Compose. The service worker displays notifications and
opens the dashboard when tapped.

## Component boundaries

- `src/components/ui/`: app-agnostic primitives.
- `src/components/layout/`: application shell, navigation, update/version UI,
  service-worker lifecycle, skip link and shortcut help.
- Feature directories (`dashboard`, `exam`, `study`, `notes`, `progress`,
  `review`, `bookmarks`, `settings`) own interactive domain UI.
- `src/contexts/theme-context.tsx` is the only app-wide React context.
- `src/lib/` contains plain domain and browser infrastructure; server-only
  reminder code is isolated under `src/lib/server/`.

Notable high-change/high-coupling files are `components/exam/exam-session.tsx`,
`lib/progress-store.ts`, `lib/exam-guides.ts`, `lib/server/reminders.ts`,
`styles/globals.css`, and `public/sw.js`.

## Build and deployment

- Local: Node 20.9+, `npm run dev`, `npm run lint`, `npm run build`.
- `next.config.js` enables standalone output and injects version/commit values.
- The multi-stage Dockerfile builds with Node 22 Alpine and runs as an
  unprivileged `nextjs` user on port 3000.
- `docker-compose.yml` maps port 3002, persists reminder data, and runs a
  label-scoped Watchtower service.
- `.github/workflows/docker.yml` lints and builds on pull requests and main;
  main also publishes versioned, SHA and latest images to Docker Hub.

## Change checklist by area

- New exam: validate raw JSON, update `src/lib/exams.ts`, consider guide and
  notes coverage, update README, then regenerate and build.
- New page: use `PageLayout`, add metadata, place interactivity in components,
  and decide whether `src/lib/offline.ts` must include it.
- Progress schema: preserve `normalizeProgress`, backup compatibility and merge
  semantics; localStorage data already exists in users' browsers.
- Theme: define tokens in both themes and keep browser chrome/header colors in
  sync.
- Reminder API: validate all untrusted request fields and preserve the
  no-secret-in-client boundary around VAPID private keys.
- Service worker: test production behavior; development intentionally skips
  registration.

There is no dedicated automated test suite. Lint and a production build are the
baseline regression checks; browser-level verification is important for PWA,
keyboard, IndexedDB/localStorage, notification and responsive-layout changes.
