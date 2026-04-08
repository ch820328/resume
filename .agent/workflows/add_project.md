---
description: Add New Project to Resume (Complete Pipeline)
---

# Workflow: Add New Project to Resume

This workflow standardizes the process of adding a new project entry to the resume system, ensuring all artifacts are generated consistently.

## Prerequisites
- User provides project information (raw data, logs, context, or existing documentation)

## Steps

### 1. Update `projects.json`
- Add the new project entry to the appropriate category in `.agent/skills/project_archivist/data/projects.json`
- **Required fields**: 
  - `name`: Project name
  - `role`: Your role in the project
  - `company`: Company name
  - `date`: Date range (e.g., "2023 - Present")
  - `tags`: Technology tags for the slide
  - `details`: Object containing `challenge`, `solution`, `impact`
  - `tech_stack`: Array of technologies used
- **Optional**: `documents_path` if you want to link to detailed docs

### 2. Generate Architecture Document
- Create `.agent/skills/project_archivist/documents/[project_slug]/architecture.md`
- Use the **Project Archivist** skill as reference (see `/home/Resume/.agent/skills/project_archivist/documents/jetson_bsp/architecture.md`)
- Document:
  - Technical architecture and design decisions
  - Key challenges and how they were solved
  - System diagrams or component breakdown
  - Technology stack justification
  - Deployment/build process if applicable

### 3. Generate Interview Guide
- Create `.agent/skills/project_archivist/documents/[project_slug]/interview.md`
- Format answers using **STAR methodology** (Situation, Task, Action, Result)
- Cover common behavioral interview questions:
  - "Tell me about this project"
  - "What was the biggest challenge?"
  - "How did you approach the problem?"
  - "What was the impact/result?"
  - "What would you do differently?"

### 4. Create Slide HTML
**⚠️ CRITICAL: MUST use `FF_project_template.html` as the golden reference**

- **Copy** `src/slides/FF_project_template.html` to `src/slides/0X_[project_slug].html`
- **DO NOT** create new layouts or structures
- **Required structure** (EXACT order):
  ```html
  <section class="slide">
    <div class="content-wrapper">
      <div class="slide-header-row">
        <h2 class="slide-title">[Title]</h2>
        <span class="slide-tag">[Category]</span>
      </div>
      <div class="star-grid">
        <div class="star-content">
          <!-- 3 STAR cards: Challenge, Solution, Impact -->
          <div class="tech-footer">
            <!-- Tech tags -->
          </div>
        </div>
        <div class="star-visual">
          <!-- Image -->
        </div>
      </div>
    </div>
  </section>
  ```
- **Fill in content**:
  - Replace placeholders with actual project data
  - Keep `star-label` format: "Challenge:", "Solution:", "Impact:" (with colon)
  - Keep `<strong>` and `<code>` formatting for emphasis
  - **Tech footer is auto-generated** from `tags` in `projects.json` (via `npm run sync:tags`)
- Use sequential numbering (01, 02, 03, ...)

### 5. Build and Release
// turbo
- Run `npm run release` to:
  - Build slide deck HTML (`index.html`)
  - Build one-page resume (`resume_onepage.html`)
  - Export both to PDF (`resume_slides.pdf`, `resume_onepage.pdf`)

## Output Artifacts
- ✅ Updated `projects.json`
- ✅ Architecture documentation (`architecture.md`)
- ✅ Interview preparation guide (`interview.md`)
- ✅ New slide in the deck (`0X_project.html`)
- ✅ Updated one-page resume HTML
- ✅ Fresh PDFs ready for distribution

## Example: Adding "Ansible Infrastructure Automation"

```bash
# Step 1: Update projects.json (manual or assisted)
# Step 2: Create architecture doc
mkdir -p .agent/skills/project_archivist/documents/ansible
# (Generate content)
# Step 3: Create interview guide
# (Generate content)
# Step 4: Create slide HTML
# src/slides/02_ansible.html
// turbo
# Step 5: Release
npm run release
```

## Notes
- Always follow the **Project Archivist** skill guidelines for content quality
- Use **abbreviation expansion** for first mentions (e.g., "IaC (Infrastructure as Code)")
- Ensure slide numbers are sequential and don't conflict with existing slides