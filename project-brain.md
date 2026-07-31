# Project Brain — Testimonial System

**Source of truth: this file, in this repo (`F4LA/testimonial-system`, branch `main`).** The Google Doc in Drive is frozen (D-018).

**What this is:** the living state of the project. One page. Anyone (or any Claude chat) reads this and knows exactly where the project stands. Updated by Bernardo every Wednesday after reviewing the check-ins, and at the close of any chat that changes project status.

**Last updated:** July 31, 2026 (deployment chat — automatic collection DEPLOYED and end-to-end tested live; roster enriched with the two-coach-email model; Meet redesigned to harvest Gemini transcript Docs from Drive; full English rewrite queued as the next task)

## Current phase

Phase 2 — Execution. Master Plan built, approved, uploaded. The automatic collection system is deployed and was tested end-to-end on 31 Jul.

**Status:** ON TRACK — launch (Aug 3) is days away. The automatic collection is deployed and its hard core is proven live; what remains before launch is one bundled rewrite (English + Slack wiring + Meet redesign + rebuild/re-test), plus the client-instructions email.

## Done

- Rock defined, brief written, architecture decided
- Decision Log active (D-001 through D-053; D-001→D-006, D-018→D-021 superseded)
- Current-system documentation loaded into Project knowledge
- AI-first definition and hierarchy adopted (Brief §2)
- Master Plan v1 built, approved, uploaded (Jul 9): 20 tasks, owners, dependencies, execution order + map. D-012: all collection reassigned to Bernardo end to end
- T-C.1 Google Business Profile created + verified (D-013). T-C.2a review link + QR done (D-014, D-015)
- T-B.1 Storytelling style guide v1.0 approved (D-016); publishing pages confirmed (D-017)
- Decision Log / Brain / Master Plan migrated to GitHub as single source of truth; public repo, read via raw URLs, write via Claude Code (D-018, D-019, D-021)
- T-B.2 Social templates done + per-page voice rule (D-020)
- Master Plan loaded to Asana (D-023)
- T-0.1 Spike closed: both sources AUTOMATABLE — Meet via domain-wide watch of the "Meet Recordings" Drive folders (D-024), Looms via flag-system Sheet + Loom public transcript endpoint (D-025). Asana 09 complete
- Governance: deliverables convention (D-026); stale-snapshot/cache reading rule (D-027)
- T-E.1 Process Map v0 (D-028, D-029, D-030). Asana 08 complete
- T-E.2 Dashboard Data Requirements v0 (D-033, D-034). Asana 07 complete
- T-A.3 Standard client folder v0 (D-037). Asana 12 complete
- Automatic-collection spec v1 (D-040) + system-wide identity decision (D-039)
- T-B.4 agent spec (D-041, Asana 15). T-B.5 agent build (D-042)
- Collection code built with keyless auth (D-043, D-044); keyless method verified live 30 Jul. Source code uploaded to Drive ("recoleccion-automatica (sin llave).gs.txt", fileId 1ZnL2hFldSyc_ZNUHNdtnZUgZeOJvdp26)
- Questionnaires approved (D-046, tasks 05/06); case study for all (D-047); client of the month (D-048)
- All of Joey's work reassigned to Bernardo as executor, Joey reviews creative only (D-045)
- **DEPLOYMENT of the automatic collection — DONE and end-to-end tested (31 Jul):**
  - Trigger Sheet "Testimonial Collection — Signal & Event Log" (in the project Drive folder); container-bound Apps Script "Testimonial Collection Engine"; manifest scopes set; bound to Cloud project Testimonial System (1039269378752); SA testimonial-collector@testimonial-system-504016.iam.gserviceaccount.com confirmed (no key)
  - Roster enriched (D-050): Client Name + Coach Email; and Coach Slack Email added (D-051)
  - Template + parent folders built under Marketing/Testimonials ("Client Folder — TEMPLATE" id 1z-08AwDfi1-IElrZF9mTXJnJ6kpCh_TJ, "Client Folders" id 1en5_a4RWbLdFaZVYMDX7kBCh8lI8mUYo); old "Client Testimonials" left as archive
  - Slack bot installed (users:read.email + chat:write); all script properties filled; setupInicial + IMPORTRANGE authorized (dropdown live)
  - **End-to-end test (Pavle Pavlovic, Brent's client):** ✅ folder + status file + template copy; ✅ keyless signing + domain-wide delegation across ALL accounts (the hardest piece, proven live, zero access errors); ✅ roster dropdown / identity bridge; ✅ Loom bridge (found the video; that one had no transcript — most do); Slack failed only on the email mismatch (fixed via D-051 data); Meet returned 0 → root-caused to the recordings living in Drive, not on the event → Meet redesigned (D-052)

## In progress (Phase 2)

- Miguel: agent test (task 19), folded into the end-to-end test with a trusted client (D-049); Asana 21 (Bernardo — recruit/feed the trusted client), task 19 depends on 21
- The automatic collection is deployed; its finalization is the next task (the rewrite)

## Next up

- **THE REWRITE (next chat, before Aug 3):** one clean pass on the Apps Script — full English (interface + code internals), Slack DM wired to Coach Slack Email (D-051), Meet redesign (D-052), then rebuild tabs (setupInicial → English) + install triggers + re-test with Pavle (D-053). This is what makes the system operational for launch.
- Coach non-negotiables SOP (new backlog task): Gemini note-taker on every call; always book via GoHighLevel (not direct Google Calendar); always put the Loom link in the check-in description. Directly enables reliable Meet + Loom automation. Needs a master-plan/Asana entry.
- Bernardo (owns Joey's items too): client-instructions email (task 13, launch priority) → case study template (10) → reviews tracking (14) → podcast (11, 17) → real end-to-end test (D-049) → final documentation (20)
- Joey: approves creative async

## Launch posture (Meet)

If the Meet redesign isn't fully re-tested by Aug 3, Meet launches in **manual-with-flag** mode (the system already flags "review manually" and the coach/Gaby drops the transcript into folder 01). Folder + Loom + Slack run automatically. Consistent with the zero-cost fallback (D-004/D-031).

## Blocked

Nothing rock-wide.

- Old Drive deployment guide (key-based method) is stale/superseded — deployment was done entirely inline in chat, no guide. Archive it; not a reference.
- Dangling ref to sweep: process map (stage 3.5) still says "before/after photos — client uploads"; moved to Gaby's Everfit pull (D-037). Fix in final documentation.

## Open decisions

None standing alone — remaining open items live inside their tasks (Master Plan §6).

## Key dates

- Mon Aug 3 — full system launch with the first monthly testimonial request (fallback: launch on Sheet signal / manual-with-flag Meet if the rewrite slips)

## How to update this doc (Bernardo, Wednesdays — plus any chat that changes status)

1. Read the check-in thread in #leadership.
2. Move items between Done / In progress / Next up / Blocked.
3. Update Status (ON TRACK / AT RISK / OFF TRACK) honestly.
4. Update "Last updated" date.
5. Commit and push to `main` (Claude does this at chat close; manual edits go through GitHub's web editor).
6. If anything is AT RISK or OFF TRACK → that's your L10 report on Friday.
