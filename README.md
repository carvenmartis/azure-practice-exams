# Azure Practice Exams

A Next.js website for practising Microsoft Azure certification exams (AZ-104, AZ-204, AZ-304 and AZ-400). Each exam draws up to 60 random questions from the JSON files in `data/` and scores you out of 1000.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

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

Add `data/<slug>.json`, then add `{ slug, name, description }` to the `exams` list in `lib/exams.ts`. The dashboard, the exam page header and the static exam paths all read from it.
