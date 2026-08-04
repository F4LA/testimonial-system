# Project Brain — Testimonial System

**Source of truth: this file, in this repo (`F4LA/testimonial-system`, branch `main`).** The Google Doc in Drive is frozen (D-018).

**What this is:** the living state of the project. One page. Anyone (or any Claude chat) reads this and knows exactly where the project stands. Updated by Bernardo every Wednesday after reviewing the check-ins, and at the close of any chat that changes project status.

**Last updated:** August 4, 2026 (English-rewrite chat — collection engine rewritten to English, Meet redesign finalized and VALIDATED end-to-end in production; launch moved to Aug 10; podcast outline replaced by a client brief)

## Current phase

Phase 2 — Execution. Master Plan built, approved, uploaded. The automatic collection system is deployed, was tested end-to-end on 31 Jul, and was rewritten to English and re-validated end-to-end in production on 4 Aug.

**Status:** ON TRACK — the collection engine is deployed, rewritten to English, and validated end-to-end in production. Launch was moved to Mon Aug 10 (one-week slip, D-057). What remains before launch is the client-instructions email (task 13).

## Done

- Rock defined, brief written, architecture decided
- Decision Log active (D-001 through D-058; D-001→D-006, D-018→D-021 superseded)
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
- Collection code built with keyless auth (D-043, D-044); keyless method verified live 30 Jul
- Questionnaires approved (D-046, tasks 05/06); case study for all (D-047); client of the month (D-048)
- All of Joey's work reassigned to Bernardo as executor, Joey reviews creative only (D-045)
- **DEPLOYMENT of the automatic collection — DONE and end-to-end tested (31 Jul):**
  - Trigger Sheet "Testimonial Collection — Signal & Event Log" (in the project Drive folder); container-bound Apps Script "Testimonial Collection Engine"; manifest scopes set; bound to Cloud project Testimonial System (1039269378752); SA testimonial-collector@testimonial-system-504016.iam.gserviceaccount.com confirmed (no key)
  - Roster enriched (D-050): Client Name + Coach Email; and Coach Slack Email added (D-051)
  - Template + parent folders built under Marketing/Testimonials ("Client Folder — TEMPLATE" id 1z-08AwDfi1-IElrZF9mTXJnJ6kpCh_TJ, "Client Folders" id 1en5_a4RWbLdFaZVYMDX7kBCh8lI8mUYo); old "Client Testimonials" left as archive
  - Slack bot installed (users:read.email + chat:write); all script properties filled; setup + IMPORTRANGE authorized (dropdown live)
  - End-to-end test (Pavle Pavlovic, Brent's client): ✅ folder + status + template; ✅ keyless signing + domain-wide delegation across ALL accounts; ✅ roster dropdown / identity bridge; ✅ Loom bridge; Slack fixed via D-051; Meet returned 0 → root-caused → redesigned (D-052)
- **ENGLISH REWRITE + Meet redesign — DONE and VALIDATED end-to-end in production (4 Aug):**
  - One clean pass to full English — tabs (Signal / Event Log / Roster (mirror)), per-client `Collection status.md`, Slack message, and all code internals + function names (D-054). Trigger functions renamed (onSignalEdit / onClientVideoSubmit / onCoachFormSubmit) and reinstalled. Script-property keys re-aligned where needed (D-055)
  - Slack DM wired to Coach Slack Email col J (D-051); confirmed it lands in the coach's **app DM** with the "Testimonial Collection" bot
  - Meet redesign finalized (D-055): Gemini Notes Docs harvested from Drive; auto-save folder matched by PREFIX "Meet Recordings*" (folders renamed by the AI Sales Coach team); Docs matched by email OR name with the email verified in the body; classified by title into 01/<type>; idempotent
  - Operator "Testimonial System" Sheet menu + guarded getUi (D-056)
  - **Re-test (Benjamin Jayne):** ✅ folder · ✅ Meet (2 Gemini Notes copied + classified, idempotent) · ✅ Loom (correct flag — no flag-form entry) · ✅ Slack (app DM). Identity + keyless + delegation green. Closes the retest pending in D-053

## In progress (Phase 2)

- Miguel: agent test (task 19), folded into the end-to-end test with a trusted client (D-049); Asana 21 (Bernardo — recruit/feed the trusted client), task 19 depends on 21
- The automatic collection is deployed, rewritten to English, and validated end-to-end in production (D-054/D-055) — launch-ready

## Next up

- Coach non-negotiables SOP (new backlog task): Gemini note-taker on every call; always book via GoHighLevel (not direct Google Calendar); always put the Loom link in the check-in description; **keep the Meet auto-save folder prefixed "Meet Recordings"** (the AI Sales Coach team renamed Bernardo's — confirm the other coaches'); **name calls with the keyword** (Discovery / Kickoff / Mesocycle) for reliable classification. Directly enables reliable Meet + Loom automation. Needs a master-plan/Asana entry.
- Bernardo (owns Joey's items too): client-instructions email (task 13, launch priority) → case study template (10) → reviews tracking (14) → client brief ≤2pp (17, D-058) → podcast criteria (11) → real end-to-end test (D-049) → final documentation (20)
- Joey: approves creative async

## Launch posture (Meet)

Meet is validated end-to-end (4 Aug) and runs **automatically**. The per-client "review manually" flag remains only for genuine misses (a call whose Gemini note doesn't carry the client email, or a client with a different email at the origin) — correct behavior, not a fallback. Folder + Loom + Slack also run automatically. Consistent with the zero-cost fallback (D-004/D-031).

## Blocked

Nothing rock-wide.

- **Drive source archive swap pending:** the new English `.gs.txt` replaces the old key-era Spanish source (fileId 1ZnL2hFldSyc_ZNUHNdtnZUgZeOJvdp26, in the project folder) — upload new, trash old. One live copy.
- Old Drive deployment guide (key-based method) is stale/superseded — deployment was done inline in chat, no guide. Archive it; not a reference.
- Dangling ref to sweep: process map (stage 3.5) still says "before/after photos — client uploads"; moved to Gaby's Everfit pull (D-037). Fix in final documentation.

## Open decisions

None standing alone — remaining open items live inside their tasks (Master Plan §6). Backlog strategy (~10 stored testimonials) still OPEN (D-032).

## Key dates

- Mon Aug 10 — full system launch with the first monthly testimonial request (moved from Aug 3, D-057). Collection engine is validated and launch-ready; gated on the client-instructions email (task 13).

## How to update this doc (Bernardo, Wednesdays — plus any chat that changes status)

1. Read the check-in thread in #leadership.
2. Move items between Done / In progress / Next up / Blocked.
3. Update Status (ON TRACK / AT RISK / OFF TRACK) honestly.
4. Update "Last updated" date.
5. Commit and push to `main` (Claude does this at chat close; manual edits go through GitHub's web editor).
6. If anything is AT RISK or OFF TRACK → that's your L10 report on Friday.
