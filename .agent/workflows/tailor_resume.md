---
description: Generate JD-Tailored Resume and Slides
---

# Workflow: Tailor Resume for JD

This workflow guides the process of creating a custom version of your resume and slides for a specific job application.

## Prerequisites
- **Job Description (JD)**: Paste the full text of the JD into the chat.
- **Projects Data**: Ensure `projects.json` is up to date.

## Steps

### 1. JD Analysis
- Use the **Resume Tailor** skill to analyze the JD.
- Identify the top 5-7 matching projects.
- Extract key technologies and "must-have" requirements.

### 2. Generate Tailored Content
- Draft a **Tailored Summary** for the profile header.
- For each selected project, generate a **Tailored STAR** description (Challenge, Solution, Impact).
- Save these descriptions as new, temporary slide files in `src/slides/` using the prefix `tailored_`.

### 3. Update Configurations
- **One-Page**: Update `scripts/onepage_config.json` with a `tailored` profile containing the new summary and featured projects list.
- **Slides**: Create/Update `slides_order_tailored.json` to include:
  - `00_profile.html` (with JD keywords)
  - The list of `tailored_[slug].html` files.
  - `99_end.html`.

### 4. Build and Export
// turbo
- Run the build commands:
  ```bash
  # Build One-Page
  node scripts/build_onepage.js --profile=tailored
  
  # Build Slides
  node scripts/build.js --config slides_order_tailored.json
  
  # Export to PDF
  node export_pdf.js resume_tailored.html resume_onepage_tailored.pdf
  node export_pdf.js index_tailored.html resume_slides_tailored.pdf
  ```

## Output Artifacts
- ✅ `output/resume_tailored.html` & `output/resume_onepage_tailored.pdf`
- ✅ `output/index_tailored.html` & `output/resume_slides_tailored.pdf`
- ✅ Analysis report showing the project selection rationale.
