<!-- Source of truth: this file, in this repo (F4LA/testimonial-system, branch main). The Google Doc in Drive is frozen (D-018). -->

# **Master Plan — Testimonial System Rock**

**Company: **Strong Standard    **Rock Owner ****&**** Project Director: **Bernardo

**Phase: **1 — Master Plan (closes Phase 1; Phase 2 — Execution starts now)    **Date approved: **July 9, 2026

**Source of truth for decisions: **Decision Log (Google Doc, Drive). Last used ID at approval: D-011.

## **1.  What this document is**

The complete task layout for the Testimonial System rock: every task, its owner, its AI-first classification, the decisions it contains, dependencies, and execution order per person. Built and approved in the Master Plan chat (Bernardo + Claude, July 9). Tasks go into Asana as written here.

Rules that govern execution:

- One chat = one task. Every chat closes with Decision Log rows, Project Brain edits if any, and a handoff prompt.

- Specs approved before anything is built. No mid-build design decisions.

- Open decisions are resolved by the task owner while doing the work, logged in the Decision Log; Joey approves creative/strategic items async (D-005).

- Outreach flow and monthly raffle draw logic are NOT redesigned (D-003). Raffle ENTRY requirements do expand (D-008).

- Aspirational target: everything except the dashboard done before Friday, July 17.

**AI-first legend (Brief §2):  [AUTO]** = system/AI does it alone;   **[AI+OK]** = AI produces ~90%, a human approves;   **[MANUAL]** = manual with a stated reason.   🔶 = task contains a decision the owner resolves while executing.

## **2.  The execution map — who does what, in what order**

One column per person; order runs top to bottom.  **★ = critical path.**  Each column only depends on itself except at the four handoffs below.

| **Step** | **Joey  (creative + async approvals)** | **Bernardo  (direction + ops)** | **Miguel  (heavy technical)** |
| --- | --- | --- | --- |
| **1** | **★ **B.1 Storytelling style*  day 1* | E.1+E.2 Process map + dashboard data*  day 1* | C.1 Google Business Profile*  day 1* |
| **2** | A.1+A.2 Client + coach questionnaires*  day 1* | 0.1 Transcripts + Looms spike*  day 1* | C.2a Review technical setup |
| **3** | **★ **B.2 Social templates | A.3 Standard client folder | **★ **B.4 Agent spec |
| **4** | B.3 Case study template | A.4 Collection build (Meet + Looms) | **★ **B.5 Agent build |
| **5** | A.5 Instructions email (incl. review) | C.2b Review tracking design | **★ **B.6 Real-testimonial test |
| **6** | D.1 Podcast criteria + selection | **E.3 Final documentation***  last task* | — |
| **7** | D.2 Client brief (≤2 pp) | — | — |

**The four cross-person handoffs (the only points where someone can be blocked by someone else):**

- Joey’s questionnaires (A.1+A.2) → Bernardo’s standard folder (A.3).

- Joey’s templates (B.2) → Miguel’s agent spec (B.4) — **the critical handoff.**

- Bernardo’s standard folder (A.3) → Miguel’s agent spec (B.4).

- Everything → Bernardo’s final documentation (E.3).

**Note: **all collection work (Meet transcripts, Looms, Everfit) is now Bernardo’s end to end — one owner, no cross-person spike/build handoff. Miguel is focused on Google Reviews and the storytelling agent (D-012).

**Critical path:  ****B.1 → B.2 → B.4 → B.5 → B.6  **(Joey → Joey → Miguel → Miguel → Miguel). If Jul 17 slips, it slips here. Joey’s three approvals on it (style, templates/spec, test content) arrive async, in small pieces.

## **3.  The task list (26 tasks)**

**Task count:  **Joey 8  ·  Bernardo 11  ·  Miguel 7 (+1 optional)  ·  26 total (added T-B.7 landing page → Miguel, T-E.4 SOPs by role → Bernardo, T-A.6 folder-link auto-surface → Bernardo, T-A.7 nomination scheduler → Bernardo, T-B.8 agent wiring → Miguel, and T-E.5 dashboard → Bernardo, per D-075). All collection (Meet + Looms + Everfit) is Bernardo’s; Miguel is focused on Google Reviews + the storytelling agent + the case study landing page.

### **WS-0 · Technical Spike**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-0.1** | **Spike: automatic access to transcripts + Looms  🔶 — ✅ DONE (D-024/D-025)** | **Bernardo** | Find out whether we can programmatically pull (a) Google Meet transcripts — sales, kickoff, end-of-mesocycle — and (b) coach Looms. One spike, one verdict per source: “yes, this way” or “no, manual”, with method and effort. Everfit is OUT — no open API, stays manual (D-007). | [AI+OK] — Claude Code investigates; human gives credentials and validates. |

### **WS-A · Collection — what we ask for, and where it lands**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-A.1** | **Build the client questionnaire  🔶 — ✅ DONE (D-046)** | **Joey** | Decide what story we capture from the client AND write the final questionnaire (replaces today’s 6 video questions). One task, one delivery. | [AI+OK] — AI drafts, Joey directs and approves. |
| **T-A.2** | **Build the coach questionnaire  🔶 — ✅ DONE (D-046)** | **Joey** | Same for the coach: the client’s process, challenges, adjustments, turning points. Happens regardless of spike outcome (D-006). | [AI+OK] |
| **T-A.3** | **Define the standard client folder  🔶 — ✅ DONE (D-037)** | **Bernardo** | How every client’s folder is organized: which files, names, order — identical for everyone, so the agent always knows where to look. Must register the data points required by T-E.2. Defines the “where”; T-A.4a/b build the pipes into it. | [AI+OK] design; filling the folder targets [AUTO] in operation. |
| **T-A.4** | **Automatic collection build — Meet + Looms (+ Everfit manual step)  🔶** | **Bernardo** | Build what the spike (T-0.1) concluded: Meet transcripts and Looms arrive in the standard folder with no manual work. Document a justified manual fallback for anything ruled out, and the Everfit pull as a justified manual step (no open API — D-007). | [AUTO] target; [MANUAL] where not feasible. |
| **T-A.5** | **Rewrite the client instructions email  🔶 — ✅ DONE (D-059)** | **Joey (delegable to Bernardo)** | Rewrite the email with: new questionnaire, expanded raffle entry requirements (before/after photos + questionnaire + Google review — D-008), and the review request (working assumption: inside this same email). Everfit outreach untouched (D-003). | [AI+OK] — AI drafts; Joey approves. |
| **T-A.6** | **Auto-surface the client-video folder link into the Signal sheet — ✅ DONE (D-065)** | **Bernardo** | On the fan-out that already creates the client folder, the engine also sets the "03 · Client video" subfolder to "anyone with the link – Editor" and writes that subfolder's shareable link into a Signal-sheet column, so Gaby copy-pastes it into the kickoff email instead of navigating Drive. NOT auto-send (stays manual for launch; full auto-send is a separate future project — email lives in GoHighLevel). Not an Aug 10 blocker: manual path documented in the kickoff-email doc. Read the current engine code before specifying the change. Asana GID 1217203594532990 (number pending alignment). (D-064) | [AI+OK] |
| **T-A.7** | **Auto-schedule the monthly nomination message (nearest-Monday)** | **Bernardo** | Builds the scheduler that sends the nomination prompt on the Monday closest to the 1st. Asana 24. (D-075) | [AUTO] |

### **WS-B · Content Production — the agent and the content structures**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-B.1** | **Define the Strong Standard storytelling style  🔶 — ✅ DONE (D-016)** | **Joey** | Put the storytelling formula in writing: analyze the Canva posts that already work (the Bobby experiment) and extract the rules. This document is the agent’s brain. | [AI+OK] — AI analyzes patterns; Joey directs and approves. |
| **T-B.2** | **Carousel, reel, and story templates — ✅ DONE (D-020)** | **Joey** | Defined structure for each social piece: carousel, reel, 3-frame story. DoD item — Joey-approved. | [AI+OK] |
| **T-B.3** | **Case study template  🔶 — ✅ DONE (D-060)** | **Joey** | What a full case study contains and how it's used as a lead magnet, PLUS the weekly client-of-the-week email template (scope extended per D-030). Does not block the agent — runs without pressure. | [AI+OK] |
| **T-B.4** | **Storytelling agent — spec  🔶 — ✅ DONE (D-041)** | **Miguel** | One page: what the agent reads (the standard folder), what it produces (drafts of the 3 social pieces), what knowledge it uses (style + templates), where it lives. Approved BEFORE building. | [AI+OK] |
| **T-B.5** | **Storytelling agent — build — ✅ DONE (D-042)** | **Miguel** | Build to spec. Zero new decisions mid-build; if one appears, stop and resolve it where it belongs. | AI-built; human verifies. |
| **T-B.6** | **Validate the agent on the first real client of the cycle  🔶 — re-scoped (D-069)** | **Miguel** | Run the agent on the first real client of the launch cycle → publishable content approved by Joey (approval-before-publish is the filter). The DoD's "working" criterion. No recruited test client and no old-backlog run: validation rides on the first real testimonial after launch. The backlog decision (D-032) is now a hard pre-close gate for the rock (D-075); still Open, informed by this result. | [AI+OK] — Joey approves the content. |
| **T-B.7** | **Case study landing page design (Strong Standard branding)** | **Miguel** | Reusable visual design hosting any case study — layout, typography, colors, and the 3 discovery-call CTA placements per task 10 (a case study drops in, the design does not change). Built in Claude (holds the brand guide + a landing-page project). Depends on task 10 + brand guide. Asana #: pending creation. (D-061) | [AI+OK] |
| **T-B.8** | **Wire the case study + weekly email into the storytelling agent** | **Miguel** | The agent writes all five pieces (3 social + case study + weekly email) from their templates, not just the 3 social ones. Asana 25. (D-075) | [AI+OK] |

### **WS-C · Google Reviews**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-C.1** | **Create the Google Business Profile — ✅ DONE (D-013)** | **Miguel** | Create the business’s Google profile — nothing exists today. Includes Google’s verification (days of dead lead time outside our control). Day 1, first thing. | [MANUAL] justified — Google requires human business verification; AI assists. |
| **T-C.2a** | **Review technical setup  🔶 — ✅ DONE (D-014/D-015)** | **Miguel** | Direct link/QR and the technical side of capturing reviews; resolve Joey’s “physical component” idea. Starts once Google verifies the profile. | [AI+OK]; verification targets [AUTO] if feasible. |
| **T-C.2b** | **Review tracking design  🔶 — ✅ DONE (D-066)** | **Bernardo** | How we know who said yes and who actually left the review; how it fits Gaby’s SOP and whether it lives in the dashboard. Designed generic from the start: any client, not just testimonials (D-009). | [AI+OK] |

### **WS-D · Podcast**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-D.1** | **Podcast criteria + how we pick the case study of the month  🔶 — ✅ DONE (D-068)** | **Joey** | Two decisions: (1) invitation criteria and cadence; (2) how the “case study of the month” is chosen — raffle winner ≠ case study person; selection method is open. | [MANUAL] justified — editorial judgment; AI supplies options. |
| **T-D.2** | **Client brief (≤2 pages) — ✅ DONE (D-067)** | **Joey (executor Bernardo, D-045)** | A ≤2-page per-client brief from the collected inputs: where the client started, how they felt, their challenges, where they are now, how they feel, what's helping them improve, and their takeaways. Feeds Joey's podcast (run ad-hoc per client — no fixed outline, D-058) and serves as the legible summary of the collected material; is derived from the finished case study (D-060), not an input to it. Replaces the podcast episode outline. | [AI+OK] |

### **WS-E · The full process, documented (+ dashboard seed)**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-E.1** | **New process map v0 (skeleton)  🔶 — ✅ DONE (D-028/D-029/D-030)** | **Bernardo** | Early map of the full process from Joey’s Miro diagram: nomination → outreach (as-is, D-003) → expanded collection → agent → approval → publishing → Google review → podcast → raffle (as-is). Each stage with a tentative AI-first label. Day 1. | [AI+OK] |
| **T-E.2** | **Dashboard data requirements (one page)  🔶 — ✅ DONE (D-033/D-034)** | **Bernardo** | One page: what the dashboard will show (pipeline, stage timings, reviews, raffle, published content) and therefore what data every stage must register. NOT dashboard design — process instrumentation from day 1 (D-010). Feeds T-A.3, T-C.2b, T-E.3. | [AI+OK] |
| **T-E.3** | **Final process documentation — ✅ DONE (D-070)** | **Bernardo** | The master document: final map with all decisions integrated, AI-first justification stage by stage, and the operating runbook (Gaby vs. system). Updates affected SOPs. | [AI+OK] — AI drafts; Bernardo validates ops, Joey approves design. |
| **T-E.4** | **Update the testimonial SOPs by role (Gaby, Miguel, coaches)** | **Bernardo** | End-to-end overview of the new testimonial process + one operating SOP per role (Gaby / Miguel / coaches), containing only what that person does. Folds in the coach non-negotiables (Gemini every call, GoHighLevel booking, Loom in the description, "Meet Recordings" folder name, keyword call naming). Distinct from T-E.3: T-E.3 is the master design doc, T-E.4 is the day-to-day operating docs. Depends on T-E.3. Asana 23. | [AI+OK] |
| **T-E.5** | **Testimonial Dashboard (spec → approval → build → operational)** | **Bernardo** | Built inside the rock, as soon as its blockers clear; close not tied to surviving a full cycle. Asana 26. Phases 1-3 built and live (D-084); the dashboard↔spreadsheet integration piece is done (D-091). Remaining build order: the task-engine rebuild to the v2 model (D-090) → Phase 4 → Phase 5 (calendar+buffer, recognitions). UX redesign + drag-and-drop as their own pass (D-093). Stays open. | [AI+OK] |

**Dashboard follow-ups (post-design), owner Bernardo (with Joey/Miguel), tracked alongside T-E.5 — needed for the dashboard's designed chains to run for real (D-079/D-080):**

1. Podcast sub-process (Bernardo + Joey): create the podcast booking calendar in GoHighLevel; write/approve the podcast invitation copy; Joey approves the calendar.
2. Shout-out copy + posting account (Bernardo + Joey): define the client-of-the-month shout-out copy and which account posts it.
3. Teach Miguel the Master-Sheet month-add (Bernardo → Miguel): video showing how to add the extra free month in the client Master Sheet and where to leave the note (D-080).
4. Verify podcast consent capture (Bernardo): confirm the preferences form has a podcast-consent checkbox; add it if missing.

**In the plan but outside the assignable list:**

- **T-C.3 — Extend review collection to all clients **(optional, OUTSIDE the DoD): connect the review request to the client satisfaction questionnaire for the whole client base. Owner: Miguel. Only if time remains; does not block the rock (D-009).

## **4.  Execution order per person**

No dates — order and dependencies only. Aspirational target: everything except the dashboard by Fri Jul 17.

### **Miguel**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **T-C.1 Google Business Profile** | Now. First of everything — Google’s verification runs in the background. |
| **2** | **T-C.2a Review technical setup** | Google verifies the profile. Coordinates with Bernardo’s C.2b. |
| **3** | **★ ****T-B.4 Agent spec** | Style (B.1) + templates (B.2) from Joey + standard folder (A.3) from Bernardo. Spec approved before build. |
| **4** | **★ ****T-B.5 Agent build** | Spec approved. |
| **5** | **★ ****T-B.6 Validate agent on first real client** | Runs on the first real testimonial after launch; Joey approves before publish (D-069). |
| **6** | **T-B.8 Wire case study + weekly email into the agent** | Cleared to start — the case study template and the agent build are done. |

### **Joey**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **★ ****T-B.1 Storytelling style** | Now. Critical path of the rock — everything agent-related waits on this. |
| **2** | **T-A.1 + T-A.2 Questionnaires (client + coach)** | Now, in parallel — same working session. Output → Bernardo (feeds A.3). |
| **3** | **★ ****T-B.2 Social templates** | B.1 closed. Output → Miguel (unblocks the spec). |
| **4** | **T-B.3 Case study template** | After B.2. Blocks no one. |
| **5** | **T-A.5 Instructions email (incl. review entry)** | Questionnaires exist (A.1). Delegable to Bernardo. |
| **6** | **T-D.1 Podcast criteria + case-study selection** | Anytime — independent. |
| **7** | **T-D.2 Client brief (≤2 pages)** | After collection inputs exist. |

**Continuous — async approvals: **style → templates → spec → test content, as they arrive. Small pieces, never one big block.

### **Bernardo**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **T-E.1 Map v0 + T-E.2 Dashboard data requirements** | Now. One working block. Output sets requirements for A.3, C.2b, E.3. |
| **2** | **T-0.1 Spike — transcripts + Looms** | Now, in parallel. One verdict covering Meet transcripts and Looms. |
| **3** | **T-A.3 Standard client folder** | E.2 done + Joey’s questionnaires (may start earlier with placeholders). Output → Miguel (unblocks spec) + feeds A.4. |
| **4** | **T-A.4 Collection build — Meet + Looms (+ Everfit manual)** | Own spike verdict (0.1) + A.3. |
| **5** | **T-C.2b Review tracking design** | E.2 done; coordinates with Miguel’s C.2a. |
| **6** | **T-E.3 Final process documentation — ✅ DONE (D-070)** | E.2 done + all decisions integrated. |
| **7** | **T-E.4 SOPs by role** | After T-E.3 (final documentation) is closed. |
| **8** | **T-A.7 Nomination auto-scheduler** | Anytime — independent. |
| **9** | **T-E.5 Testimonial Dashboard** | When its blockers clear; start now if already clear. |

## **5.  Decisions resolved in this Master Plan chat**

**Registered as D-006 through D-011 in the Decision Log: **coach questionnaire unconditional (replaces D-001); Everfit stays manual, out of the spike (D-007); raffle entry requirements expanded without touching draw logic (D-008); review tracking generic by design, full-base extension outside DoD (D-009); process instrumented for the dashboard from day 1 (D-010); Master Plan approved with assignments and splits (D-011); all collection reassigned to Bernardo end to end — spike and build fused, Meet + Looms + Everfit one owner (D-012, replaces the split in D-011).

**Decisions still open, each living inside its task: **what story we capture (A.1/A.2) · Meet/Loom access methods (spikes) · folder structure (A.3) · review entry point + email (A.5) · storytelling style (B.1) · case study content/usage (B.3) · agent architecture (B.4) · test input strategy (B.6) · review setup + physical component (C.2a) · tracking design (C.2b) · podcast criteria + monthly selection (D.1) · stage-by-stage AI-first map (E.1→E.3) · dashboard data model (E.2).