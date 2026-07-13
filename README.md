# Testimonial System — Strong Standard

Shared memory of the Testimonial System rock. **This repo (branch `main`) is the single source of truth** for the three project documents (D-018). The Google Docs in Drive are frozen and point here.

## The three documents

| File | What it is | Update rule |
| --- | --- | --- |
| [`decision-log.md`](decision-log.md) | Every decision, one row each, append-only. Supersedes all other documents. | New rows at the top of the table. Never edit old rows (except marking "Replaced by D-XXX"). |
| [`project-brain.md`](project-brain.md) | Living state: phase, done, in progress, blocked, next. | Bernardo, Wednesdays — plus any chat that changes status. |
| [`master-plan.md`](master-plan.md) | Full task layout: tasks, owners, dependencies, execution order. | Only when the plan itself changes (logged as a decision first). |

## Workflow

- **Chat start:** every Claude work chat in the Project reads the three files from this repo via the GitHub API.
- **Chat close:** Claude commits new Decision Log rows and any Project Brain / Master Plan updates directly to `main`.
- Documents are pure Markdown — no HTML, no GitHub Pages (D-019).
- Everything is written in English; conversations may happen in Spanish.

Team: Bernardo (rock owner / director) · Joey (strategy & creative, async approvals) · Miguel (operations & technical).
write test Bernardo OK — 2026-07-13
