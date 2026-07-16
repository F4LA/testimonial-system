# Project Brain — Testimonial System

**Source of truth: this file, in this repo (`F4LA/testimonial-system`, branch `main`).** The Google Doc in Drive is frozen (D-018).

**What this is:** the living state of the project. One page. Anyone (or any Claude chat) reads this and knows exactly where the project stands. Updated by Bernardo every Wednesday after reviewing the check-ins, and at the close of any chat that changes project status.

**Last updated:** July 16, 2026 (by Bernardo — T-A.3 closed, D-037/D-038)

## Current phase

Phase 2 — Execution (starting). Master Plan built, approved, and uploaded to Project knowledge. Handoff prompts ready; team sent the plan for async review before each person opens their first task chat.

**Status:** ON TRACK

## Done

- Rock defined, brief written, architecture decided
- Decision Log active (D-001 through D-021; D-001 replaced by D-006)
- Current-system documentation loaded into Project knowledge
- AI-first definition and hierarchy adopted (Brief §2)
- Master Plan v1 built, approved, and uploaded (Jul 9): 20 tasks, owners (Joey 8 / Bernardo 8 / Miguel 5 +1 optional), dependencies, execution order + execution map. D-012: all collection reassigned to Bernardo end to end
- T-C.1 Google Business Profile created (service-area business, "Strong Standard"), verified by Google (D-013)
- T-C.2a Review technical setup done: Google review direct link + QR generated and handed off to Bernardo; Joey's "physical component" idea discarded — no physical customer-facing location exists (D-014, D-015)
- T-B.1 Storytelling style guide v1.0 approved (D-016). Publishing pages confirmed: Dr. Joey primary + Strong Standard + coaches; not Bernardo's page (D-017). Doc in Drive
- Decision Log, Project Brain and Master Plan migrated to GitHub (`F4LA/testimonial-system`) as the single source of truth; Drive docs frozen; pure Markdown, no Pages (D-018, D-019). Repo made public — chats read via raw URLs, no auth. Write path redesigned: reading via public URLs, writing via Claude Code, token removed (D-021, replaces D-018). Setup + instructions pending in a follow-up chat
- T-B.2 Social templates done (carousel, reel, 3-frame story) + per-page voice adaptation rule (D-020). Feeds T-B.4
- Master Plan cargado a Asana como proyecto del rock ("Testimonial System Rock — Master Plan"): 20 tasks numerados en orden de ejecución con owners (Bernardo, Joey, Miguel), due dates Jul 15–17, prerequisitos en el título y regla de handoff (avisar + entregar en la carpeta de Drive) en cada task que desbloquea a alguien (D-023)
- T-0.1 Spike closed: both sources AUTOMATABLE — Meet via domain-wide Drive watch (D-024), Looms via flag-system Sheet + Loom public transcript endpoint, verified live Jul 14 (D-025). Verdict doc in the Drive project folder. Unblocks T-A.4. Asana task 09 completed
- Governance: deliverables convention adopted — every task deliverable is a single live Google Doc in the Drive project folder, linked from its Decision Log row (D-026); reading rule hardened against stale snapshots and fetch-proxy caching (D-027). Review-link deliverable (T-C.2a) complete in the folder: doc + QR image
- T-E.1 Process Map v0 approved (D-028): 9 stages with AI-first labels; confirmation trigger decoupled from Asana via Sheet signal + AUTO fan-out (D-029); T-B.3 extended with the weekly email template (D-030). Doc in the Drive project folder. Asana task 08 completed
- T-E.2 Dashboard Data Requirements v0 approved (D-033): what every one of the 9 stages must register, AUTO/manual per stage; dashboard absorbs all Asana functions + all 5 spreadsheet tabs + the new signals; instrumentation lives in an append-only event log separate from the D-029 signal (D-034). Doc in the Drive project folder. Asana task 07 completed
- T-A.3 Standard client folder v0 approved (D-037): estructura idéntica por cliente + archivo de estado de recolección; fotos antes/después pasan a pull de Gaby vía Everfit. Doc en la carpeta de Drive. Asana task 12 completed. Desbloquea T-B.4

## In progress (Phase 2 — first tasks, all parallel from day 1)

- Joey: T-A.1 + T-A.2 (client + coach questionnaires)
- Miguel: none active — next task blocked (see below)

## Next up

- Bernardo: T-A.4 collection build (Meet + Looms) → T-C.2b review tracking → T-E.3 final documentation
- Joey: T-B.3 case study → T-A.5 instructions email → T-D.1 / T-D.2 podcast
- Miguel: T-B.4 agent spec — blocked only on Bernardo's standard client folder (T-A.3; templates T-B.2 delivered) → T-B.5 build → T-B.6 test

## Blocked

Nothing rock-wide.

## Open decisions

None standing alone — all remaining open items live inside their tasks and get resolved by each task's owner (see Master Plan §6).

## Key dates

- Fri Jul 17 — last working day before the trip (aspirational target: everything except dashboard done)
- Sun Jul 19 — team trip; 6-month planning (sprint structure gets redefined there)
- Week of Jul 27 — Bernardo builds the dashboard (D-031)
- Mon Aug 3 — full system launch with the first monthly testimonial request (D-031; fallback: launch on Sheet signal if the dashboard slips)

## How to update this doc (Bernardo, Wednesdays — plus any chat that changes status)

1. Read the check-in thread in #leadership.
2. Move items between Done / In progress / Next up / Blocked.
3. Update Status (ON TRACK / AT RISK / OFF TRACK) honestly.
4. Update "Last updated" date.
5. Commit and push to `main` (Claude does this at chat close; manual edits go through GitHub's web editor).
6. If anything is AT RISK or OFF TRACK → that's your L10 report on Friday.
