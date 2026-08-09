# Project Brain — Testimonial System

**Source of truth: this file, in this repo (`F4LA/testimonial-system`, branch `main`).** The Google Doc in Drive is frozen (D-018).

**What this is:** the living state of the project. One page. Anyone (or any Claude chat) reads this and knows exactly where the project stands. Updated by Bernardo every Wednesday after reviewing the check-ins, and at the close of any chat that changes project status.

**Last updated:** August 9, 2026 — late session (task/alert engine BUILT and validated to the v2 model, D-094; kickoff checklist split into 2 steps to unlock the video ladder, D-095)

## Current phase

Phase 2 — Execution. Master Plan built, approved, uploaded. The automatic collection system is deployed, was tested end-to-end on 31 Jul, and was rewritten to English and re-validated end-to-end in production on 4 Aug.

**Status:** ON TRACK — the collection engine is deployed, rewritten to English, and validated end-to-end in production. Launch was moved to Mon Aug 10 (one-week slip, D-057). The design work and both launch-blocking operational pieces are done (D-063): the client-instructions email, the preferences form (built, no-login verified), and the email link wiring. The only thing left for Aug 10 is Gaby sending the kickoff email by hand, pasting each client's video-folder link — inherent to launch. The rock's scope expanded on Aug 6 (dashboard + agent wiring + nomination scheduler brought in-rock, backlog locked as a pre-close gate), so the rock's finish line now extends past the Aug 10 launch; the launch itself is unaffected.

## Done

- Rock defined, brief written, architecture decided
- Decision Log active (D-001 through D-095; D-001→D-006, D-018→D-021, D-004, D-049 superseded; D-071, D-072 partially superseded by D-086; D-089 delivered by D-091; D-090's production-half detail refined by D-094)
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
- Client instructions email ("collection kickoff") rewritten (D-059, task 13): approved 11-question video script + video-to-folder-link + no-login preferences form (credit / photo permission / do-not-publish / review self-report). Raffle entry made explicit as hard (photos + review). Asana 13 complete
- Case study + weekly email templates defined (D-060, task 10): landing-page-hosted case study on the 8-beat arc with source/voice triangulation, one discovery-call CTA in 3 placements; weekly email links to the case study; client brief reversed to derive from the case study. Asana 10 complete.
- Pre-launch operational prep done (D-063, from D-059): preferences form built in Google Forms (name + email identity questions for attribution; no-login verified; Q6 branches to two closing sections; responses sheet in the project folder), and the kickoff email wired (static form link inserted; video link → each client's "03 · Client video" subfolder; internal send-steps documented).
- Client-video folder link auto-surfaced into the Signal sheet (D-065, task T-A.6 / Asana GID 1217203594532990): the fan-out shares "03 · Client video" as anyone-with-link–editor and writes the link into Signal col E; validated live (link in col E on the real checkbox + external upload confirmed in incognito). Gaby copy-pastes from col E instead of navigating Drive. Asana T-A.6 complete.
- Google review tracking designed (D-066, task 14): two separated signals — client self-report ("said yes", from the preferences form) vs. human confirmation of a real review matched by displayed name ("confirmed") — never collapsed; the raffle opens on self-report, confirmation is an audit layer; instrumented into the append-only event log with a per-client state derived from it; generic by design (any client), full-base extension out of scope. Reviews carry the reviewer's public name, but there's no automatic email→review match, so confirmation is manual. Feeds Gaby's weekly process (verification step), the SOPs by role (task 23), and final documentation (task 20). Asana 14 complete.
- Client brief (≤2 pages) designed (D-067, task 17): single-job human-readable summary of everything relevant about a client — NOT a prep sheet (no questions/podcast-running guidance, dropped by Bernardo); Joey preps himself from it. Derived by compression from the finished case study (not a fresh folder read). Keeps the factual arc + concrete data (start → now) + 2–3 verbatim client quotes; drops the case study's voice/CTA/triangulation/length. Structure: one-line header + 5 blocks (Starting point · Challenges · What's working · Where they are now · Takeaways) + In their words. Left agent-compatible (deterministic from the case study) without wiring it. Not an Aug 10 blocker; unblocks no one → no Slack. Asana 17 complete.
- Podcast criteria + client-of-the-month selection designed (D-068, task 11): client of the month chosen by an internal coach vote for the best story of the month's completed testimonials (one vote per coach, self-vote allowed, NOT a community vote); coaches review the landing page once it exists, else the case study draft or the ≤2-page brief, with the client video + coach form as the always-available floor; the vote runs at the close of the cycle (after Miguel's production week), 48h, in Slack; ties broken by Joey. Podcast: one episode/month, the client of the month is invited (best/most inspiring story), consent captured at collection; if they decline, they stay client of the month and Joey invites the runner-up or skips the month. Editorial → Joey's async review packet (D-045). Asana 11 complete.
- T-E.3 Final process documentation delivered (D-070, task 20 / Asana 1216566585460461): master design doc — 9 stages with decisions integrated, AI-first label + justification per stage, cross-cutting design, and the who-does-what runbook. Dangling-ref sweep done (stage 3.5 photos → Gaby's Everfit pull). Plus production split consolidated (D-071), publishing model + reel-required rule + startup buffer (D-072), vote window 24h (D-073), raffle conditions in the kickoff email (D-074). Delivered as a download to upload. Asana 20 complete.
- Monthly nomination auto-scheduler built + validated in production (D-076, task 24 / Asana 1217260848462808): hangs off the collection engine; a weekly Monday time trigger posts the nomination message on the Monday nearest the 1st (window never opens on a weekend), idempotent per month; posts to the collection channel as the bot and pings Gaby in a thread. Message = Gaby's existing copy with "Fit4Life Case Studies" → "Strong Standard Case Studies"; 5 AM project time. First automatic send ≈ Aug 31 (September); August goes out by hand as the launch. Blocks no one → no Slack. Asana 24 complete.
- Case study landing page design built (D-077, task 22): reusable HTML template for Strong Standard branding, built from the live Axel Rubio case study page, locked to 3 CTA placements (sticky header, after Results, after Reflection). Asana 22 complete.
- Case study + weekly email wired into the storytelling agent (D-078, task 25): the agent now produces 5 pieces per run (carousel, reel, story, case study, weekly email), filling the landing page template directly and applying consent gates from the client's preferences form. Asana 25 complete.
- Collection engine — Meet retrieval hardened + reporting corrected + sales-account coverage + actionable review flag (D-081), validated in production Aug 7 across six clients: (1) the client email is verified against the doc's HTML export so person-chip emails aren't dropped; (2) search extended to sales closers via a new SALES_ACCOUNT_EMAILS property (Deniz added); (3) success/flag decided by matched not copied — idempotent re-runs read as "✅ already there", not a false "0 matched"; docs deduped across accounts; (4) a name-match-without-email now writes a "Needs review — call recordings.md" in 01 listing each candidate with a direct link. Outcomes seen: copied-new (Karen/Amy/Tammera), already-there (Karen re-run), Loom valid (Amy) + no-transcript (Karen/Tammera), real 0-match with review file (Laurel). Latest Code.gs pasted into the bound project.
- Coach recognition form built + wired (D-083): the "04" coach input — one general Google Form, client dropdown fed live from the roster (daily refresh, coach picks never types), 3 approved recognition questions, coach email as audit trail. Engine routes responses to each client's "04" folder (onCoachFormSubmit) and the coach's Slack notice links to it. Validated end-to-end Aug 7. Closes the gap where the questionnaire content was approved but the form itself had never been created. Engine bug fixed (D-085, logEvent_ silent no-op on non-container triggers) so form submissions actually write an event to the log — without it the dashboard would show the coach-form input as permanently missing; validated live Aug 8.
- Testimonial Dashboard — Phases 1-3 built and live (D-084, F4LA/testimonial-dashboard, GitHub Pages): read/write/identity/event-log fold (Phase 1), 8-stage pipeline board + client card with the corrected-fold fixes (Phase 2), per-owner action queue + manual-review flags as tasks (Phase 3, superseded by the D-090 redesign before Phase 4). Collecting→Producing gate defined (D-087): the client video (hard requirement) + Gaby's manual Everfit/photos step advance the client; automatic-input flags (Meet/Loom) never block. Task 26 stays open until the dashboard is operational.
- Reel moves in-house with Miguel; Pipix and Sofi are OUT of the process (D-086) — reverts the reel/agency portions of D-071 and D-072 (both marked superseded there; the collaboration-post model and reel-required publishing rule still stand).
- Dashboard↔spreadsheet integration built + validated end to end (D-091), closing the open piece from D-089 (delivered by this row). Option C (polling): the dashboard's "Fire the kickoff fan-out" button writes a confirmed row into the engine's Signal sheet via the proxy; a new engine time-trigger `processPendingSignals` (every minute) picks it up and runs the existing fan-out. Engine untouched (onSignalEdit/fanOut_ unchanged); the manual checkbox stays as the free fallback. Validated live Aug 9 with a fresh test client (Cameron Colbo): board move → Signal row → fan-out ran within a minute → card advanced on real events.
- Dashboard write-proxy hardened (D-092) after a silent-failure incident: dropped no-cors so real errors surface; feedback moved next to the button + a fixed toast; added a PROXY_VERSION handshake that warns when the deployed proxy is older than the repo. Root cause was an undeployed fix on a stale Web App deployment — fixed by editing that specific deployment. Pending post-launch cleanup: archive the duplicate proxy deployments and rename the survivor "ACTIVE — used by dashboard/config.js"; rule going forward is always edit the existing deployment, never "New deployment."
- Task/alert engine BUILT and validated to the v2 model (D-094) — the last build piece before Phase 4. Declarative 7-flow rule table (owner + threshold + text + escalation); every task belongs to a real dashboard user, coaches are never owners (a coach not responding becomes Gaby's "chase the coach" task); all 12 thresholds seeded into Settings via syncSettings; all copy sourced from the SOPs (outreach FU#1/#2, video follow-ups matching Flow 3, new tell-the-coach/coach-form copy), no em dashes. Simulated-clock URL param (?sim=+120h) built and validated for testing escalations without waiting real hours. Write-proxy bumped to PROXY_VERSION 3 (adds the v2 stage vocabulary + syncSettings). Kickoff checklist split into 2 explicit steps (D-095) to unlock Flow 3's video clock, which anchors on step 2 (instructions email sent), not the fan-out; the 8 existing test clients have no running video clock until someone marks the email sent.
- Pipeline move UX decided (D-093): buttons are the working base for launch (tested end to end); drag-and-drop is a planned post-launch enhancement layered on top, with the same confirmation/block layer. Move taxonomy set — confirmations only on outward-facing/hard-to-reverse moves (Outreach→Invited, Scheduled→Published, any→Declined/Dropped), one hard block (Collecting→Producing, D-087), everything else flows freely. Manual-add-to-Nominated built (roster dropdown, never free text). No-undo/forward-only logged as an OPEN post-launch decision.

## In progress (Phase 2)

- Miguel: agent run (task 19) re-scoped to the first real client of the launch cycle (D-069) — no recruited test client; starts when the first real testimonial lands after Aug 10, with Joey approving before publish. Task 21 (recruit/feed a trusted client) retired.
- The automatic collection is deployed, rewritten to English, and validated end-to-end in production (D-054/D-055) — launch-ready
- Bernardo: Testimonial Dashboard (task 26) — Phases 1-3 built and live (D-084); the dashboard↔spreadsheet integration (D-091) and the task/alert engine v2 (D-094) are both built and validated. Phase 4 (calendar+buffer) is the only major build piece left, then Phase 5 (recognitions). The two-source-of-truth guard (D-088) is still open.

## Next up

- Coach non-negotiables: now folded into the per-role SOPs task (23, T-E.4). Brief the coaches informally BEFORE the Aug 10 launch so Meet/Loom automation is reliable; the formal SOP is written in task 23 after final documentation. Now also covers the CLOSERS (Joey, Deniz): sales/discovery + kickoff calls must be scheduled as calendar invites with the client as a guest, so the Gemini note carries the client email and attaches automatically (D-082); instant/ad-hoc Meets have no email and go to manual review.
- Bernardo: the per-role SOPs (task 23, now unblocked by task 20). Plus the pre-close gate: resolve the old backlog before the rock closes (D-032/D-075). Task 23 must fold in two things from D-068: (a) Miguel's monthly production week — after collection closes, Miguel builds all landing pages + edits the in-page videos in one dedicated week, then the vote opens the following week (the reel is now edited in-house by Miguel too, per D-086 — not a vote dependency); (b) the client-of-the-month vote + podcast-invitation mechanics for the relevant roles. **For Aug 10:** form + email wiring are done (D-063); Gaby sends the kickoff email by hand, pasting each client's "03 · Client video" link (manual steps documented in the email doc). The folder-link auto-surface is DONE (D-065): Gaby copies the "03 · Client video" link from Signal col E; the manual share-by-hand path remains the documented fallback if external sharing is ever blocked.
- Dashboard (task 26): Phases 1-3 built and live (D-084); the dashboard↔spreadsheet integration (D-091) and the task/alert engine v2 (D-094) are both done. Remaining: Phase 4 (calendar+buffer), then Phase 5 (recognitions). Pre-close gate alongside the backlog (D-032/D-075).
  DASHBOARD FOLLOW-UP TASKS (surfaced from the dashboard design; to do after/alongside the build — the dashboard is designed on these decisions but they need Bernardo's action to be real):
  1. Podcast sub-process (Bernardo + Joey): create the podcast booking calendar in GoHighLevel; write/approve the podcast invitation copy; Joey approves the calendar. Needed before the dashboard's podcast invite chain runs for real.
  2. Shout-out copy + posting account (Bernardo + Joey): define the client-of-the-month shout-out copy and which account posts it. Needed before the dashboard's shout-out task is real.
  3. Teach Miguel the Master-Sheet month-add (Bernardo → Miguel): send Miguel a video showing how to add the extra free month in the client Master Sheet and where to leave the note (D-080). Needed before the first raffle winner.
  4. Verify podcast consent capture (Bernardo): confirm the preferences form has a podcast-consent checkbox; add it if missing. Needed before the first podcast invite.
- Two-source-of-truth guard (D-088) — OPEN: the Slack digest (Digest.gs) re-implements the dashboard's fold as a second source of truth. To add: (a) selfCheck() promoted to a ~48h scheduled job that emails Bernardo on divergence; (b) a written "change both places" rule in CLAUDE.md and/or DASHBOARD-SYSTEM.md.
- Post-launch (none blocking Aug 10): (a) UX redesign pass — density, collapsible sections, feedback polish, and drag-and-drop (D-093); (b) archive the duplicate proxy deployments and rename the survivor "ACTIVE — used by dashboard/config.js" (D-092); (c) decide the no-undo "Pipeline — correction" event (D-093, open); (d) the two-source-of-truth selfCheck email (D-088, see above).
- Pre-launch data wipe (Aug 10, Bernardo, manual): all current dashboard/engine data is test data — wipe by hand in four places before launch: the Event Log (keep header), the 7 test-client Drive folders (including Cameron Colbo, plus the extra Signal rows and fan-out events his kickoff test produced), the coach-form responses sheet TEST rows, and the Signal sheet. No tracking file needed.
- Digest activation (launch-day step, Aug 10): needs team Slack addresses, the management channel ID, and bot-token confirmation. Preview with previewDigest() first, then wire the trigger.
- Joey: approves creative async
- Miguel: run the agent on the first real client of the cycle (task 19, D-069) when the first testimonial lands after launch.

## Launch posture (Meet)

Meet is validated end-to-end (4 Aug) and hardened + re-validated across six clients (7 Aug, D-081); runs **automatically**. The client email is verified against the doc's HTML export (person-chip emails survive), search covers team + coaches + sales closers (SALES_ACCOUNT_EMAILS), and success/flag is decided by matched — so idempotent re-runs read as success, not a false miss. The per-client "review manually" flag remains only for genuine misses (a Gemini note with no client email — e.g. an instant Meet with no calendar invite, or a client with a different email at the origin) — correct behavior, not a fallback; when candidates are found by name without the email, the flag is now ACTIONABLE (a "Needs review — call recordings.md" file lists each candidate with a direct link). Going forward, sales/kickoff calls must be scheduled as calendar invites so the email is captured (D-082). Folder + Loom + Slack also run automatically. Consistent with the zero-cost fallback (D-004/D-031).

## Blocked

Nothing rock-wide.

- Old Drive deployment guide (key-based method) is stale/superseded — deployment was done inline in chat, no guide. Archive it; not a reference.

## Open decisions

None standing alone — remaining open items live inside their tasks (Master Plan §6). Backlog strategy (~10 stored testimonials) still OPEN (D-032), now a hard pre-close gate for the rock (D-075) — decided once the first real client shows what the new pipeline produces.

- To verify (not blocking Aug 10): confirm the preferences form captures a podcast-consent checkbox (D-068 assumes consent is captured at collection). If missing, it's a small form addition; the first podcast comes after launch.

- Operating rule for Claude Code sessions on this project (searching before declaring something absent) lives in `CLAUDE.md`, not here — added after this bit the build twice (D-085, D-095).

## Key dates

- Mon Aug 10 — full system launch with the first monthly testimonial request (D-057). Collection engine validated and launch-ready; the client-instructions email is done (D-059). Pre-launch prep done (D-063): form built + email wired. Remaining: Gaby sends the kickoff email by hand.
- Mon Aug 31 — first automatic nomination message (September cycle); August's request goes out by hand as part of the Aug 10 launch (D-076).
- Post-launch, within the rock: build the dashboard (D-075) and resolve the backlog before closing the rock.

## How to update this doc (Bernardo, Wednesdays — plus any chat that changes status)

1. Read the check-in thread in #leadership.
2. Move items between Done / In progress / Next up / Blocked.
3. Update Status (ON TRACK / AT RISK / OFF TRACK) honestly.
4. Update "Last updated" date.
5. Commit and push to `main` (Claude does this at chat close; manual edits go through GitHub's web editor).
6. If anything is AT RISK or OFF TRACK → that's your L10 report on Friday.
