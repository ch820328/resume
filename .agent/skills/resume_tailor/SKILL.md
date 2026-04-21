---
name: Resume Tailor
description: Tailors resume content (one-page and slides) based on a specifically provided Job Description (JD).
---

# Resume Tailor Skill

This skill allows the agent to act as a career-matching specialist who optimizes a candidate's portfolio for a specific JD.

## 1. JD Analysis Protocol

When a JD is provided, perform the following extraction:
- **Core Stack**: Programming languages, frameworks, and infrastructure tools.
- **Key Responsibilities**: Abstract the core tasks (e.g., "Designing high-availability systems").
- **Seniority Signals**: Look for requirements like "Mentoring", "System Design ownership", or "Ambiguity handling".
- **Keywords**: High-frequency terms used in the JD (for ATS optimization).

## 2. Selection & Mapping

Compare the JD requirements against `.agent/skills/project_archivist/data/projects.json`:
- **Ranking**: Select the top 5 projects that demonstrate 80% or more of the JD's core requirements.
- **Diversity**: Ensure the selection covers both technical depth and leadership/impact if required.

## 3. STAR Tailoring (Slides)

For each selected project, rewrite the `details` section:
- **Challenge**: Frame the problem using context relevant to the target company's domain.
- **Solution**: Explicitly use keywords from the JD (e.g., if JD mentions "Redis", ensure the solution highlights Redis usage).
- **Impact**: Quantify results using metrics that directly address the JD's goals.

## 4. One-Page Optimization

- **Summary**: Draft a 2-3 line summary that mirrors the JD's "Ideal Candidate" description.
- **Featured Projects**: Update the profile config to include only the top-ranked projects.
- **Skills Priority**: Reorder the skills categories (Backend, Frontend, etc.) based on the JD's emphasis.

## 5. Execution Workflow

1. Read `projects.json` and `user_profile.json`.
2. Analyze JD provided by the user.
3. Generate tailored content in memory.
4. Update `scripts/onepage_config.json` with a `tailored` profile.
5. Create tailored slide HTML files in `src/slides/tailored_[slug].html`.
6. Update `slides_order_tailored.json` with the selected slides.
7. Run build scripts.
