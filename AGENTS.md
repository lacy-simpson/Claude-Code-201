# Claude 101: Get Started with Claude at UiPath — Project Instructions

Follows all conventions in the parent guidelines:
/Users/lsimpson/ID_Projects/CLAUDE.md

## Course Details

- **Title:** Claude 101: Get Started with Claude at UiPath
- **Series / session:** Standalone — AI UpSkilling Program
- **Architecture:** Single-file HTML
- **Audience:** All UiPath employees (Support/GPS, Sales, Engineering, HR/People, Finance/Ops)
- **Delivery format:** Facilitator-led webinar (50 min) — doubles as a lightweight participant reference after the session
- **Total duration:** 50 min session + 10 min buffer/Q&A
- **Prerequisites:** Anthropic introductory Claude courses (recommended, not required)

## Deliverable

A single `index.html` file that serves two purposes:
1. Facilitator guide for the live webinar presenter
2. Lightweight reference resource for participants after the session

Content should be scannable and self-contained. No quiz engine or interactive lesson nav needed — use callout variants, steppers, and collapsible sections instead.

## Course Voice and Lesson Style

Write lessons in a direct, practical facilitator voice. The course should sound like a knowledgeable teammate teaching colleagues how to work more intentionally, not like marketing copy or generic AI training content.

- Prefer natural, plainspoken framing: "You do not have to write perfect prompts. Focus on making a few small, intentional choices as you converse with Claude."
- Keep the learner in control. Reinforce that Claude is the assistant, not an oracle. Learners should steer, review, and verify the work before using it.
- Avoid AI-ish contrast patterns such as "not because..., but because..." or "this lesson isn't about X, it's about Y." Use straightforward positive framing instead.
- Use second person for participant-facing guidance: "Pick the right space," "give Claude context," "steer the draft," "check the parts that matter."
- Keep examples concrete and work-relevant. Show what to do, why it helps, and where to pause for judgment.
- For lesson openings, follow the lesson 03 pattern when possible: start with a short intro paragraph, then add a `callout checkpoint` block labeled "Lesson Objective."

## Lesson Editing Workflow

The modular lesson files are the source of truth for lesson content. After changing any files under `lessons/`, `assets/css/`, `assets/js/`, or `index_v2.html`, run:

```bash
node scripts/build-single-index.js
```

This regenerates the standalone `index.html` deliverable so the browser-ready single-file version stays in sync with the modular source files.

## Project Status

- [x] RESEARCH_SUMMARY.txt complete
- [x] learning_objectives.md complete
- [x] workshop_outline.md complete
- [x] Development started — index.html v1 complete
