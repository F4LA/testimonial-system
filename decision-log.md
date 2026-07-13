# DECISION LOG — TESTIMONIAL SYSTEM

**Source of truth: this file, in this repo (`F4LA/testimonial-system`, branch `main`).** The Google Doc in Drive is frozen (D-018).

What this is: the shared memory of the project. Every decision made anywhere (a Claude chat, a call, Slack) gets one row here. Every work chat in this Project reads this file from the repo at chat start and pushes new rows at chat close.

## Rules (read once, then just follow the format)

- Append-only. Never edit or delete a past row. If a decision changes, add a NEW row and mark the old one "Replaced by D-XXX" in its Status column. This is the only edit allowed on old rows.
- New rows go at the TOP of the table.
- One row per decision. Short. If it needs a paragraph of context, link to it — don't write it here.
- Capture at chat close. Every work chat in this Project ends with Claude committing the new row(s) directly to this file.
- IDs are sequential (D-001, D-002…). Check the top row for the last used ID.

## Status values

- Active — decision stands
- Open — decision pending (waiting on info, a spike, or a conversation)
- Replaced by D-XXX — superseded

## The Log

> ⚠️ **Migration note (Jul 13, 2026):** rows **D-014 and D-015 were missing** from the Drive snapshot migrated here, although the Project Brain references them (T-C.2a review link/QR handoff; "physical component" idea discarded). Recover them from the Drive doc's version history and append them here. Until then, the D-014/D-015 slots stay reserved.

| ID | Date | Decision | Context (2–3 lines max) | Who | Status |
| --- | --- | --- | --- | --- | --- |
| D-020 | Jul 13 | Per-page voice adaptation resolved (closes the open item from D-017): single asset reused across all pages; only the caption narrator shifts (Joey "I" → Strong Standard "we"); a coach may add one personal first-person line only if they personally trained that client (T-B.2) | Resolved by Joey in the T-B.2 chat as part of the social templates delivery. Templates: carousel (8-slide base + 9–10 expansion zone between Results and Reflection), reel (6-segment timing, client's own on-camera words favored), story (teaser/companion to the main post, zero new copy) | Joey | Active |
| D-019 | Jul 13 | Repo documents stay in pure Markdown — no HTML, no GitHub Pages | GitHub renders Markdown tables natively; no build step, readable diffs, works on private repos. Consumers are the team + Claude chats — nobody needs a website view | Bernardo | Active |
| D-018 | Jul 13 | GitHub repo `F4LA/testimonial-system` (branch `main`) becomes the single source of truth for the Decision Log, Project Brain and Master Plan (`decision-log.md`, `project-brain.md`, `master-plan.md`). Drive Google Docs frozen with a note pointing to the repo. Claude chats read the three files via the GitHub API at chat start and commit updates at chat close — no more manual pasting | Drive snapshots in the Project knowledge kept going stale and manual pasting was the main failure point of the chat workflow. Repo gives versioned history and closes the read/write loop | Bernardo | Active |
| D-017 | Jul 13 | Publishing pages set: Dr. Joey's page (primary, first-person voice), Strong Standard's page, and potentially coaches' pages. Bernardo's page is NOT a publish target — updates the Brief §4 assumption | Voice of the style guide is anchored to Dr. Joey as narrator because his page is primary. Per-page voice adaptation resolves in T-B.2 | Joey | Active |
| D-016 | Jul 13 | Storytelling style guide v1.0 approved — closes T-B.1. Formula: 8-beat arc (hook→context→struggle→turning point→method→results→reflection→CTA) across 7–10 slides, expansion slides reserved for beyond-the-scale material (capability, relationships, freedom, identity); Dr. Joey first-person voice; pain-point hooks (never results); numbers as supporting evidence; banned-language list; agent sourcing rule (nothing invented); universal "Comment [KEYWORD]" CTA (client name → case study, or coaching keyword → conversation) | Derived from 8 published carousels incl. the Bobby experiment + Joey's direction. Doc in Drive: "Strong Standard — Storytelling Style Guide (T-B.1, v1.0)". Feeds T-B.2 and T-B.4 | Joey | Active |
| D-013 | 2026-07-10 | Google Business Profile created as an online/service-area business (no physical address displayed), registered under the name "Strong Standard". Submitted for Google's automatic verification; review pending (≤5 business days) | Strong Standard operates as remote/online coaching with no customer-facing physical location; service-area is the correct profile type for accurate local search behavior and to unblock T-C.2a and T-C.2b downstream | Miguel | Active |
| D-012 | Jul 9 | All collection reassigned to Bernardo end to end: the transcripts+Looms spike (T-0.1) and the collection build (T-A.4) are fused into single tasks, both his. Meet + Looms + Everfit = one owner. Replaces the Meet/Looms split in D-011 | Bernardo defines the standard folder (A.3), so having him own the pipes that fill it removes the plan's most tangled cross-person handoff. Miguel focuses on Google Reviews + the storytelling agent | Bernardo | Active |
| D-011 | Jul 9 | Master Plan v1 approved: 22 tasks (after a/b splits), owners (Joey 8 / Miguel 7 / Bernardo 7), dependencies and execution order. Spike and collection build split: Google Meet = Miguel, Looms = Bernardo — each builds what they investigated | Full layout in the Master Plan doc (Project knowledge). Fulfills D-002. Critical path: B.1→B.2→B.4→B.5→B.6 | Bernardo | Active |
| D-010 | Jul 9 | Process is instrumented for the dashboard from day 1: a one-page data-requirements doc (T-E.2) defines what every stage must register. Dashboard build stays post-trip | Avoids rebuilding everything later because stages didn't capture data. D-004 unchanged — this is the seed, not the build | Bernardo | Active |
| D-009 | Jul 9 | Review tracking is designed generic from the start (any client, not just testimonials). Extending review requests to the full client base via the satisfaction questionnaire is optional and OUTSIDE the rock's DoD | Costs the same to build it right once. The extension only happens if time remains before the trip | Bernardo | Active |
| D-008 | Jul 9 | Raffle ENTRY requirements expand: before/after photos + story questionnaire + Google review. The raffle draw logic itself (random, free month) is untouched | Direction set by Joey at sprint planning. Clarifies the boundary of D-003: entry requirements live in collection, not in raffle logic | Bernardo | Active |
| D-007 | Jul 9 | Everfit data collection stays manual (justified): Everfit has no open API. Removed from the technical spike's scope | Gaby keeps pulling metrics/visuals as today; documented as a justified manual step in T-A.4b | Bernardo | Active |
| D-006 | Jul 9 | Coach questionnaire will be built regardless of Loom/transcript access. Replaces D-001 | Bernardo changed position: even with Looms available, the coach's written input is wanted. Coaches still have no tasks in the rock | Bernardo | Active |
| D-005 | Jul 8 | No additional design session. Strategic direction was set at sprint planning; open decisions are resolved by each task's owner as work happens, logged here, with Joey approving creative/strategic items async | Small team, everyone loaded with recurring work. The project advances through assigned tasks + this log + Wednesday check-in + L10 — zero new meetings | Bernardo | Active |
| D-004 | Jul 8 | Dashboard is the last phase, likely post-trip. Direct cutover when built (no parallel run); Asana pipeline frozen — not deleted — as fallback until the dashboard survives one full cycle | Bugs only surface with real use; parallel running doubles work. Freezing Asana costs nothing and protects the 3–5/month flow | Bernardo | Active |
| D-003 | Jul 8 | Outreach flow and monthly raffle logic are NOT redesigned in this rock — they get integrated into the new process design as-is | They work: 1/month → 3–5/month since January. Don't touch what produces | Bernardo | Active |
| D-002 | Jul 8 | Task assignments between Bernardo and Miguel are made during Phase 1 task planning, not pre-assigned | Both cover ops + tech; Bernardo directs the flow and assigns based on the actual task list | Bernardo | Active |
| D-001 | Jul 8 | Coaches' role in the new process (fill a story questionnaire vs. not needed at all): OPEN — depends on the technical spike on programmatic access to Looms + call transcripts | If Loom/transcript scraping works, the coach's side of the story may come from there and no questionnaire is needed. Coaches have no tasks in the rock either way | Bernardo | Replaced by D-006 |
