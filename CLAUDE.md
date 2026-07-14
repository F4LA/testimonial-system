# CLAUDE.md — Testimonial System repo

This repo is the single source of truth for the Strong Standard Testimonial System project (D-018, write path per D-021). It holds exactly three live documents:

- `decision-log.md` — every project decision, one row each, append-only.
- `project-brain.md` — the current state of the project.
- `master-plan.md` — the full task layout. Changes only via a logged decision.

Your job in this repo: receive change content (usually pasted from a chat in the Claude Project) and apply it safely. The person will typically paste text and say "upload this" / "sube esto". You handle all Git mechanics — they never should.

## Non-negotiable workflow

1. **Always `git pull` on `main` BEFORE touching any file.** No exceptions — someone else may have pushed since this session last ran.
2. Apply the change with **targeted edits only**. Never rewrite or regenerate a whole document. Edit exactly what the person handed you and nothing else. If the pasted content conflicts with what's already in the file (e.g., a decision ID already taken), STOP and tell the person before editing.
3. **Always commit and push immediately after editing.** Never leave local changes unpushed — an unpushed change does not exist for the rest of the team.
4. After pushing, report the commit hash and a one-line summary of what changed.

## Rules per document

### decision-log.md
- New rows go at the **TOP of the table**, directly under the header row.
- **Never edit or delete an old row**, with exactly one exception: changing an old row's Status to `Replaced by D-XXX` when a new decision supersedes it.
- IDs are sequential (D-001, D-002…). Read the top row to confirm the last used ID — never invent or guess an ID. If the pasted row's ID doesn't match the next sequential ID, flag it before committing.
- One row per decision. Columns: ID | Date | Decision | Context (2–3 lines max) | Who | Status.

### project-brain.md
- Update only the sections that changed (Current phase / Status / Done / In progress / Next up / Blocked / Open decisions / Key dates).
- Always update the "Last updated" line (date + who) as part of the same edit.

### master-plan.md
- Only accepts changes backed by a Decision Log row. If asked to change it without a corresponding D-XXX, ask for the decision ID first.

## Scope

Only the three live documents belong here, plus repo infrastructure (`CLAUDE.md`, `setup-claude-code.md`, `setup-checks.md`). Do not add other project artifacts — the Sheets tracker, Project Brief, SOPs and transcripts live elsewhere on purpose (D-021).

## Commit messages

Short and specific, referencing decision IDs when applicable. Examples: `Add D-022 (review tracking design)` · `Brain: T-A.3 done` · `D-017 marked Replaced by D-025`.
