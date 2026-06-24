# Claude 201: Working with Claude Code — Project Instructions

Follows all conventions in the parent guidelines:
/Users/lsimpson/ID_Projects/CLAUDE.md

## Course Details

- **Title:** Claude 201: Working with Claude Code
- **Series / session:** Session 2 of the AI UpSkilling Program (follows Claude 101)
- **Architecture:** Modular (per-lesson HTML + shared CSS/JS), built into a single `index.html`
- **Audience:** All UiPath teams. Team-neutral throughout: no Support/GPS specifics (no Salesforce, cases, PSE framing, UAT/prod, or the GPS Agent Skill Catalog)
- **Delivery format:** Self-paced reference, paged lesson model, no facilitator timers
- **Prerequisites:** Claude 101 recommended (not required)

## Deliverable

A single self-contained `index.html`, regenerated from the modular source by the build script. The legacy single-file `cc-index.html` is preserved as the previous build and is not edited.

Content is scannable and paged (one lesson per screen). Use callout variants, steppers, carousels, collapsible sections, and the interactive widgets carried over from Claude 101 (settings simulator, RTCFC builder, prompt-flip).

## Course Voice and Lesson Style

Write lessons in a direct, practical facilitator voice. The course should sound like a knowledgeable teammate teaching colleagues how to work more intentionally, not like marketing copy or generic AI training content.

- Prefer natural, plainspoken framing: "You do not have to write perfect prompts. Focus on making a few small, intentional choices as you converse with Claude."
- Keep the learner in control. Reinforce that Claude is the assistant, not an oracle. Learners should steer, review, and verify the work before using it.
- Avoid AI-ish contrast patterns such as "not because..., but because..." or "this lesson isn't about X, it's about Y." Use straightforward positive framing instead.
- Use second person for participant-facing guidance: "Pick the right space," "give Claude context," "steer the draft," "check the parts that matter."
- Keep examples concrete and work-relevant. Show what to do, why it helps, and where to pause for judgment.
- For lesson openings, start with a short `lead` paragraph, then add a `callout checkpoint` block labeled "Lesson Objective."

## Lesson Editing Workflow

The modular lesson files are the source of truth for lesson content. After changing any files under `lessons/`, `assets/css/`, `assets/js/`, or `index_v2.html`, run:

```bash
node scripts/build-single-index.js
```

This regenerates the standalone `index.html` deliverable so the browser-ready single-file version stays in sync with the modular source files.

## Project Status

- [x] Modular build established (index_v2.html shell, assets/css, assets/js, lessons/, scripts/build-single-index.js)
- [x] 13 lessons authored and team-neutral
- [x] index.html regenerated from modular source
- [ ] Capstone (lesson 12) is a placeholder, to be designed
