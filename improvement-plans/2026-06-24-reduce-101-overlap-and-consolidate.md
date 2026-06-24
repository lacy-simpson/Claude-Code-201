# Plan: Reduce Claude 101 Overlap & Consolidate Lessons

Date: 2026-06-24
Branch: `trim-redundancy`
Status: Implemented. 13 lessons -> 8; 101 overlap trimmed to pointers; Skills
consolidated into one lesson with four beats; permission modes (5) and permission
prompts (4) restored from the Hands-On build with the current "What Claude May Do"
framing. `index.html` rebuilt and verified in the browser preview.

## Implementation notes

- Final lesson files: `00-welcome`, `01-overview` (overview + desktop),
  `02-models-context`, `03-working-well`, `04-connect-automate`, `05-skills`,
  `06-takeaways`, `07-close`. The 11 superseded files were deleted.
- Permission carousels reuse the shared `.tool-carousel` component. New color
  variants (ask/plan/auto/accept/bypass and allow/always/approve/deny, including
  amber caution and red danger) were added to `styles.css`.
- The settings simulator was kept (Code-specific) but its duplicate reference-table
  tab was removed; a pointer to 101 covers model-choice rationale.
- Folder-vs-session habit split resolved: "one session per task" lives in Lesson 02,
  "one folder, one purpose" lives in Lesson 03 (cross-refs updated to match).
- Dormant widget JS in `app.js` (mode-match, role-explorer, RTCFC builder,
  prompt-flip, prompt-deck) is now unused by any lesson. It is harmless (each guards
  with an early return) and was left in place; a later cleanup pass could remove it.

## Goal

Claude 201 currently re-teaches material that Claude 101 owns as its flagship
interactive content, and it carries more lessons than the content warrants. This
plan removes the duplication, points learners back to 101 for the basics, and
consolidates 13 lesson files into roughly 8 with logical grouping.

Source compared against: `/Users/lsimpson/ID_Projects/claude-101/index.html`.

## Approved decisions

- **Skills consolidation:** one sidebar lesson with sub-pages (Understand / Run /
  Build / Find), not a collapsible lesson group.
- **Trim depth:** trim 101-overlap to compact pointers that link back to 101.
  Assumes the learner has completed 101. No light recap versions retained.
- **Scope of this turn:** plan only. No lesson files change until the plan is
  reviewed.

## Overlap with Claude 101 (the redundancy)

| Topic | Claude 101 treatment | Duplicated here |
|---|---|---|
| Claude ecosystem (Chat / Plugins / Cowork / Code) | Full 3D carousel + 9-scenario "Mode Match" practice (101 Lesson 1) | `lessons/01-overview.html` reproduces the same 4-card carousel |
| RTCFC prompting | Flagship interactive builder + 3 weak/strong prompt-flips (101 Lesson 3) | `lessons/05-habits.html` reproduces the RTCFC builder + a vague/specific prompt-flip |
| Model & effort selection | Decision tables for model + effort (101 Lesson 3) | `lessons/03-models.html` re-teaches which model when via the settings simulator |

## Unique to this build (keep — the real value)

Desktop control tour, permission modes, usage limits (5-hr / weekly / extra),
200K vs 1M context, context window & compaction, one-folder/one-session habits,
memory, routines, connectors/MCP + CLI, running a skill, creating a skill, and
the marketplace. None of this is covered meaningfully in 101.

## Trims (replace duplicated depth with pointers to 101)

1. **Ecosystem carousel (Lesson 01):** cut the full 4-card carousel to a compact
   "where Claude Code fits" block emphasizing the Code card, with a pointer to
   101 for the full comparison and practice.
2. **RTCFC builder + prompt-flip (Lesson 05):** remove the builder and the
   vague/specific prompt-flip. Keep a short "prompt with intention" reminder, a
   pointer to 101's RTCFC lesson, and the Code-useful "ask Claude to improve your
   prompt" tip.
3. **Model/effort tables (Lesson 03):** drop the re-teach of which model when.
   Keep only what is Code-specific: the in-app settings simulator framing, usage
   limits, and 200K vs 1M context. Point to 101 for model-choice rationale.
4. **"You own the outcome" (Lesson 05):** tighten to a one-line callout; it
   lightly repeats 101's "Stay in the driver's seat."

## Consolidation: 13 files -> ~8 lessons

| New lesson | Merges | Rationale |
|---|---|---|
| 0. Welcome | 00 | Keep |
| 1. Overview & the Desktop App | 01 (trimmed) + 02 | Orient + tour the workspace; ecosystem carousel trimmed, skill intro removed |
| 2. Models, Usage & Context | 03 (trimmed) + 04 | Both cover capability/cost + working memory; short on their own |
| 3. Working Well: Permissions, Prompting & Memory | 05 (trimmed) | Permissions, memory, folder/session habits, own-the-outcome; RTCFC removed |
| 4. Connecting & Automating | 06 + 07 | Routines + connections both extend Claude's reach beyond the laptop |
| 5. Skills: Understand, Run, Build, Find | skill intro from 01 + 08 + 09 + 10 | Single lesson, sub-pages (see below) |
| 6. Key Takeaways | 11 | Keep |
| 7. What's Next / Capstone | 12 | Keep placeholder |

## Agent Skill relocation

Pull "What is an Agent Skill?" out of `lessons/01-overview.html` and make it the
opening section of the consolidated Skills lesson. The lesson runs as one sidebar
entry with sub-pages:

1. **Understand** — what a skill is (relocated from Lesson 01), SKILL.md, skills + scripts.
2. **Run** — install the easy way and run by name (from Lesson 08).
3. **Build** — create a personal skill, let Claude draft it or write it yourself (from Lesson 09).
4. **Find** — the marketplace and the three install methods (from Lesson 10).

## Build / mechanics notes

- Modular lesson files under `lessons/` are the source of truth. After edits, run
  `node scripts/build-single-index.js` to regenerate the single-file `index.html`.
- Renumbering lessons touches sidebar/nav wiring in `index_v2.html` and any
  per-lesson `id`/`data-*` hooks in `assets/js/app.js`. Confirm the nav model and
  lesson-counter update cleanly after the merge.
- `cc-index.html` is the legacy single-file build and is not edited.

## Open questions for implementation

- Sub-page mechanics for the Skills lesson: confirm whether the paged model
  supports intra-lesson sub-pages, or whether sub-pages render as stacked
  sections within the one lesson screen.
- Whether the folder/session habits should live in Lesson 2 (Context) or Lesson 3
  (Working Well). Currently split; pick one home during implementation.
