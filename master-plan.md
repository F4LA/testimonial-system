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
| **7** | D.2 Episode outline + integration | — | — |

**The four cross-person handoffs (the only points where someone can be blocked by someone else):**

- Joey’s questionnaires (A.1+A.2) → Bernardo’s standard folder (A.3).

- Joey’s templates (B.2) → Miguel’s agent spec (B.4) — **the critical handoff.**

- Bernardo’s standard folder (A.3) → Miguel’s agent spec (B.4).

- Everything → Bernardo’s final documentation (E.3).

**Note: **all collection work (Meet transcripts, Looms, Everfit) is now Bernardo’s end to end — one owner, no cross-person spike/build handoff. Miguel is focused on Google Reviews and the storytelling agent (D-012).

**Critical path:  ****B.1 → B.2 → B.4 → B.5 → B.6  **(Joey → Joey → Miguel → Miguel → Miguel). If Jul 17 slips, it slips here. Joey’s three approvals on it (style, templates/spec, test content) arrive async, in small pieces.

## **3.  The task list (22 tasks)**

**Task count:  **Joey 8  ·  Bernardo 8  ·  Miguel 5 (+1 optional)  ·  20 total. All collection (Meet + Looms + Everfit) is Bernardo’s; Miguel is focused on Google Reviews + the storytelling agent.

### **WS-0 · Technical Spike**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-0.1** | **Spike: automatic access to transcripts + Looms  🔶** | **Bernardo** | Find out whether we can programmatically pull (a) Google Meet transcripts — sales, kickoff, end-of-mesocycle — and (b) coach Looms. One spike, one verdict per source: “yes, this way” or “no, manual”, with method and effort. Everfit is OUT — no open API, stays manual (D-007). | [AI+OK] — Claude Code investigates; human gives credentials and validates. |

### **WS-A · Collection — what we ask for, and where it lands**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-A.1** | **Build the client questionnaire  🔶** | **Joey** | Decide what story we capture from the client AND write the final questionnaire (replaces today’s 6 video questions). One task, one delivery. | [AI+OK] — AI drafts, Joey directs and approves. |
| **T-A.2** | **Build the coach questionnaire  🔶** | **Joey** | Same for the coach: the client’s process, challenges, adjustments, turning points. Happens regardless of spike outcome (D-006). | [AI+OK] |
| **T-A.3** | **Define the standard client folder  🔶** | **Bernardo** | How every client’s folder is organized: which files, names, order — identical for everyone, so the agent always knows where to look. Must register the data points required by T-E.2. Defines the “where”; T-A.4a/b build the pipes into it. | [AI+OK] design; filling the folder targets [AUTO] in operation. |
| **T-A.4** | **Automatic collection build — Meet + Looms (+ Everfit manual step)  🔶** | **Bernardo** | Build what the spike (T-0.1) concluded: Meet transcripts and Looms arrive in the standard folder with no manual work. Document a justified manual fallback for anything ruled out, and the Everfit pull as a justified manual step (no open API — D-007). | [AUTO] target; [MANUAL] where not feasible. |
| **T-A.5** | **Rewrite the client instructions email  🔶** | **Joey (delegable to Bernardo)** | Rewrite the email with: new questionnaire, expanded raffle entry requirements (before/after photos + questionnaire + Google review — D-008), and the review request (working assumption: inside this same email). Everfit outreach untouched (D-003). | [AI+OK] — AI drafts; Joey approves. |

### **WS-B · Content Production — the agent and the content structures**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-B.1** | **Define the Strong Standard storytelling style  🔶** | **Joey** | Put the storytelling formula in writing: analyze the Canva posts that already work (the Bobby experiment) and extract the rules. This document is the agent’s brain. | [AI+OK] — AI analyzes patterns; Joey directs and approves. |
| **T-B.2** | **Carousel, reel, and story templates** | **Joey** | Defined structure for each social piece: carousel, reel, 3-frame story. DoD item — Joey-approved. | [AI+OK] |
| **T-B.3** | **Case study template  🔶** | **Joey** | What a full case study contains and how it’s used as a lead magnet. Does not block the agent — runs without pressure. | [AI+OK] |
| **T-B.4** | **Storytelling agent — spec  🔶** | **Miguel** | One page: what the agent reads (the standard folder), what it produces (drafts of the 3 social pieces), what knowledge it uses (style + templates), where it lives. Approved BEFORE building. | [AI+OK] |
| **T-B.5** | **Storytelling agent — build** | **Miguel** | Build to spec. Zero new decisions mid-build; if one appears, stop and resolve it where it belongs. | AI-built; human verifies. |
| **T-B.6** | **Test the agent with 1–2 real testimonials  🔶** | **Miguel** | Run the agent against real backlog testimonials (~10 waiting) → publishable content approved by Joey. The DoD’s “working” criterion. Contains a decision: backlog clients lack the new questionnaires — partial inputs vs. asking 1–2 of them to fill it. | [AI+OK] — Joey approves the content. |

### **WS-C · Google Reviews**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-C.1** | **Create the Google Business Profile** | **Miguel** | Create the business’s Google profile — nothing exists today. Includes Google’s verification (days of dead lead time outside our control). Day 1, first thing. | [MANUAL] justified — Google requires human business verification; AI assists. |
| **T-C.2a** | **Review technical setup  🔶** | **Miguel** | Direct link/QR and the technical side of capturing reviews; resolve Joey’s “physical component” idea. Starts once Google verifies the profile. | [AI+OK]; verification targets [AUTO] if feasible. |
| **T-C.2b** | **Review tracking design  🔶** | **Bernardo** | How we know who said yes and who actually left the review; how it fits Gaby’s SOP and whether it lives in the dashboard. Designed generic from the start: any client, not just testimonials (D-009). | [AI+OK] |

### **WS-D · Podcast**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-D.1** | **Podcast criteria + how we pick the case study of the month  🔶** | **Joey** | Two decisions: (1) invitation criteria and cadence; (2) how the “case study of the month” is chosen — raffle winner ≠ case study person; selection method is open. | [MANUAL] justified — editorial judgment; AI supplies options. |
| **T-D.2** | **Episode outline + connect podcast to the new flow** | **Joey** | Base outline for the transformation episode + connect the existing podcast stage (SOP §7) to the new process using T-D.1 criteria. | [AI+OK] |

### **WS-E · The full process, documented (+ dashboard seed)**

| **ID** | **Task** | **Owner** | **What it is** | **AI-first** |
| --- | --- | --- | --- | --- |
| **T-E.1** | **New process map v0 (skeleton)  🔶** | **Bernardo** | Early map of the full process from Joey’s Miro diagram: nomination → outreach (as-is, D-003) → expanded collection → agent → approval → publishing → Google review → podcast → raffle (as-is). Each stage with a tentative AI-first label. Day 1. | [AI+OK] |
| **T-E.2** | **Dashboard data requirements (one page)  🔶** | **Bernardo** | One page: what the dashboard will show (pipeline, stage timings, reviews, raffle, published content) and therefore what data every stage must register. NOT dashboard design — process instrumentation from day 1 (D-010). Feeds T-A.3, T-C.2b, T-E.3. | [AI+OK] |
| **T-E.3** | **Final process documentation** | **Bernardo** | The master document: final map with all decisions integrated, AI-first justification stage by stage, and the operating runbook (Gaby vs. system). Updates affected SOPs. Last task of the rock. | [AI+OK] — AI drafts; Bernardo validates ops, Joey approves design. |

**In the plan but outside the assignable list:**

- **T-C.3 — Extend review collection to all clients **(optional, OUTSIDE the DoD): connect the review request to the client satisfaction questionnaire for the whole client base. Owner: Miguel. Only if time remains; does not block the rock (D-009).

- **Phase 3 — Testimonial Dashboard (post-trip, D-004): **spec → approval → build → direct cutover, Asana frozen as fallback until it survives one full cycle. Spec starts from T-E.2’s data requirements — the process ships already instrumented for it. No tasks/owners yet; defined at/after the 6-month planning.

## **4.  Execution order per person**

No dates — order and dependencies only. Aspirational target: everything except the dashboard by Fri Jul 17.

### **Miguel**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **T-C.1 Google Business Profile** | Now. First of everything — Google’s verification runs in the background. |
| **2** | **T-C.2a Review technical setup** | Google verifies the profile. Coordinates with Bernardo’s C.2b. |
| **3** | **★ ****T-B.4 Agent spec** | Style (B.1) + templates (B.2) from Joey + standard folder (A.3) from Bernardo. Spec approved before build. |
| **4** | **★ ****T-B.5 Agent build** | Spec approved. |
| **5** | **★ ****T-B.6 Real-testimonial test** | Build done. Joey approves the content. |

### **Joey**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **★ ****T-B.1 Storytelling style** | Now. Critical path of the rock — everything agent-related waits on this. |
| **2** | **T-A.1 + T-A.2 Questionnaires (client + coach)** | Now, in parallel — same working session. Output → Bernardo (feeds A.3). |
| **3** | **★ ****T-B.2 Social templates** | B.1 closed. Output → Miguel (unblocks the spec). |
| **4** | **T-B.3 Case study template** | After B.2. Blocks no one. |
| **5** | **T-A.5 Instructions email (incl. review entry)** | Questionnaires exist (A.1). Delegable to Bernardo. |
| **6** | **T-D.1 Podcast criteria + case-study selection** | Anytime — independent. |
| **7** | **T-D.2 Episode outline + flow integration** | After D.1. |

**Continuous — async approvals: **style → templates → spec → test content, as they arrive. Small pieces, never one big block.

### **Bernardo**

| **#** | **Task** | **Starts when** |
| --- | --- | --- |
| **1** | **T-E.1 Map v0 + T-E.2 Dashboard data requirements** | Now. One working block. Output sets requirements for A.3, C.2b, E.3. |
| **2** | **T-0.1 Spike — transcripts + Looms** | Now, in parallel. One verdict covering Meet transcripts and Looms. |
| **3** | **T-A.3 Standard client folder** | E.2 done + Joey’s questionnaires (may start earlier with placeholders). Output → Miguel (unblocks spec) + feeds A.4. |
| **4** | **T-A.4 Collection build — Meet + Looms (+ Everfit manual)** | Own spike verdict (0.1) + A.3. |
| **5** | **T-C.2b Review tracking design** | E.2 done; coordinates with Miguel’s C.2a. |
| **6** | **T-E.3 Final process documentation** | Last task of the rock — everything else closed. |

## **5.  Decisions resolved in this Master Plan chat**

**Registered as D-006 through D-011 in the Decision Log: **coach questionnaire unconditional (replaces D-001); Everfit stays manual, out of the spike (D-007); raffle entry requirements expanded without touching draw logic (D-008); review tracking generic by design, full-base extension outside DoD (D-009); process instrumented for the dashboard from day 1 (D-010); Master Plan approved with assignments and splits (D-011); all collection reassigned to Bernardo end to end — spike and build fused, Meet + Looms + Everfit one owner (D-012, replaces the split in D-011).

**Decisions still open, each living inside its task: **what story we capture (A.1/A.2) · Meet/Loom access methods (spikes) · folder structure (A.3) · review entry point + email (A.5) · storytelling style (B.1) · case study content/usage (B.3) · agent architecture (B.4) · test input strategy (B.6) · review setup + physical component (C.2a) · tracking design (C.2b) · podcast criteria + monthly selection (D.1) · stage-by-stage AI-first map (E.1→E.3) · dashboard data model (E.2).