---
name: Project Archivist
description: Organizes, categorizes, and de-duplicates project experience data, generating documentation, interview guides, slides, and updating the profile.
---

# Project Archivist Skill

This skill acts as the "Database Administrator" and "Content Strategist" for the user's career history. It manages the entire lifecycle of a project entry, from raw input to final HTML presentation.

## 1. Data Source
**File**: `.agent/skills/project_archivist/data/projects.json`

## 2. Classification Schema
You must classify incoming information into one of these 6 domains:
1.  **Validation Platforms & Web** (`validation_platforms_web`)
2.  **Embedded Systems, BSP & Firmware** (`embedded_bsp_firmware`)
3.  **Test Frameworks & QA Strategies** (`test_frameworks_qa`)
4.  **Internal Tools & Developer Productivity** (`developer_tools_productivity`)
5.  **Infrastructure & CI/CD** (`infrastructure_cicd`)
6.  **AI & Computer Vision Applications** (`ai_computer_vision`)

## 3. Design & Writing Principles (CRITICAL)

You are not just an archivist; you are a **Product Marketing Manager**. Your goal is to sell the user's technical competence quickly and effectively.

### A. Writing Style
*   **Be Concise & Direct**: Cut fluff. Focus on the core logic and business value.
    *   *Bad*: "The process was time-consuming and I implemented a complex 4-stage validation system..."
    *   *Good*: "Manual verification took 30+ mins. Developed automated tool to enable 100% coverage."
*   **One-Page Optimization**:
    *   The **First Sentence** of the `Solution` field in `projects.json` MUST be a standalone summary of the main action. It is used directly in the One-Page Resume.
    *   Format: `[Action Verb] [Core Technology] to [Main Function].`
*   **Focus**:
    *   **Challenge**: What broke? What was lost? (e.g., "User configs reset after flash")
    *   **Solution**: Core technical pivot? (e.g., "Compare NVRAM directly")
    *   **Impact**: Saved time? Caught bugs? (e.g., "Gatekeeper for releases")

### B. Template Adherence (ZERO TOLERANCE)
*   **Golden Rule**: `FF_project_template.html` is the ABSOLUTE TRUTH.
*   **Structure**: You MUST duplicate the template structure exactly. Do NOT simplify or alter the DOM.
*   **Images**: All slide images MUST have `class="slide-image"` to enable zoom functionality.
    *   Example: `<img src="..." alt="..." class="slide-image">`
    *   **FAILURE TO ADD THIS CLASS BREAKS THE UI.**

## 4. Workflow (MANDATORY ORDER)

When the user provides project info (code, text, or logs):

### Step 1: Database Management (JSON)
1.  **Read**: Load `.agent/skills/project_archivist/data/projects.json`.
2.  **Search & Match**: Check for existing projects using semantic matching.
3.  **Update/Create**:
    *   **Exists**: Merge new technical details, metrics, or contexts into the existing entry. Do NOT overwrite unrelated impactful data.
    *   **New**: Create a new entry with `name`, `role`, `tags`, `details` (Challenge/Solution/Impact), and `tech_stack`.
4.  **Save**: Write back to `projects.json`.

### Step 2: Documentation Generation
1.  **Analyze**: Deeply analyze the provided code/docs to understand the "How" and "Why".
2.  **Generate Architecture**: Create/Update `.agent/skills/project_archivist/documents/{project_key}/architecture.md`.
    *   Focus on design patterns, critical hacks, and system flow.
3.  **Generate Interview Guide**: Create/Update `.agent/skills/project_archivist/documents/{project_key}/interview.md`.
    *   Derive questions from the Architecture doc (e.g., "Why did you patch this script?").
    *   Draft STAR-based answers.
4.  **Link**: Ensure `projects.json` has a `documents_path` pointing to these files.

### Step 3: Slide Generation
1.  **Generate HTML**: Create `src/slides/{XX}_{project_key}.html`.
2.  **Format**: Use the **STAR Grid** layout (Challenge/Solution/Impact).
3.  **Adherence**: Verify structure against `FF_project_template.html` (wrapper classes `star-card` > `star-item` > `star-label`/`star-text` are MANDATORY).
4.  **Tagging**: Ensure `data-project-id` matches the key in `projects.json`.

### Step 4: Profile Refinement (The "Summary" Step)
1.  **Review All Slides**: Look at all generating slides in `src/slides/`.
2.  **Update Profile**: specificially modify `src/slides/00_profile.html`.
    *   **Core Competency**: Synthesize a one-sentence summary based on the **collective strength** of all projects (e.g., "Full Stack Automation Engineer specialized in Embedded BSP...").
    *   **Tech Stack**: Aggregate high-frequency tags (e.g., if 3 projects use Python, Python goes first).
    *   **Key Achievements**: Pick the top 3 most impressive numbers across all projects.

### Step 5: Build
1.  **Execute**: Run `npm run build` to update `index.html`.

## Instructions for the Agent
- **Abbreviation Expansion**: When using an acronym (e.g., FOTA, BSP, QA) for the first time in a slide or document, YOU MUST provide the full form in parentheses, e.g., 'FOTA (Firmware Over-The-Air)'. Exception: extremely common terms like URL, HTML, PC.
- **Deep Dive**: Don't just copy text. Read the code to find the "Hidden Complexity" for the Architecture doc.
- **Holistic View**: Always perform Step 4. Adding a new project changes the user's "Story"; the Profile must reflect that evolution.
