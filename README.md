# Azure Practice Exams

A Next.js website for practising Microsoft Azure certification exams (AZ-104, AZ-204, AZ-304, AZ-400, SC-500, AI-901, AI-103, AI-200, AI-300, AB-620 and DP-800). Each exam draws up to 60 varied questions from the JSON files in `data/`, prioritizes balanced answer choices, and scores you out of 1000.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Project structure

```
src/
  app/             routes (App Router): layout.tsx, page.tsx per route (exams/[slug],
                   study, guides, progress, review, bookmarks, settings, about), api/version
  components/
    ui/            reusable UI: button, card, badge, stat-card, radio-card, confirm-dialog
    layout/        page-layout, course-header, nav-menu, update-notice, version-badge
    dashboard/     exam-card
    exam/          exam-session, answer-option, answer-feedback, exam-results, ...
    study/ progress/ review/ bookmarks/ settings/   the interactive part of each page
  contexts/        theme-context (Light / Dark / System)
  lib/             exams list, theme colours, version, leave-guard, utils
  styles/          globals.css (Tailwind v4)
data/              exam questions (JSON)
scripts/           build-exam-data.mjs: data/ -> public/exam-data/ before dev and build
```

Files and folders use kebab-case, and imports from `src/` use the `@/` alias.

## Docker

```bash
docker compose up --build   # http://localhost:3002
```

The image uses Next.js standalone output, so it only contains the server and the packages it needs.

## Deployment

`.github/workflows/docker.yml` runs on every pull request and push to `main`:

1. Lints and builds the app.
2. Builds the Docker image.
3. On `main` only, pushes it to Docker Hub as `carvenmartisit/azure-practice-exams` with the tags `latest` and `sha-<commit>`.

Add these repository secrets in GitHub (Settings > Secrets and variables > Actions):

- `DOCKERHUB_USERNAME`: your Docker Hub username
- `DOCKERHUB_TOKEN`: a Docker Hub access token with Read & Write access

## Adding an exam

Add `data/<slug>.json`, then add `{ slug, name, description }` to the `exams` list in `src/lib/exams.ts`. The dashboard, the exam page header and the static exam pages all read from it.
