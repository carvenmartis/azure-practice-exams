# CLAUDE.md

@AGENTS.md

## Claude Code

- Code conventions: `.claude/skills/frontend-conventions` (the `senior-nextjs-frontend`
  agent loads it). Add an exam with `/add-exam`.
- UI work: apply `.claude/skills/emil-design-eng` for motion and interaction polish, and the
  anti-generic rules in `design-taste-frontend` and `redesign-existing-projects`. Those two
  target landing pages; here use their type, colour and AI-tell rules, not their layouts.
- Design system: Geist (Geist Mono for codes and keys) on the cream, gold `accent` and navy
  `primary` palette in globals.css (Carven chose to keep it). Controls `rounded-lg`, cards and dialogs
  `rounded-2xl`. Sentence-case labels, no tracked uppercase eyebrows, no em-dashes in UI copy.
- Motion: transform and opacity only, `ease-out` (a strong custom curve in globals.css),
  150-250ms, `active:scale-[0.97]` on pressables, nothing animated on keyboard shortcuts.
