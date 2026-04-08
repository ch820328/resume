---
name: Resume Generator
description: Updates the web-based resume with new content while preserving the specific slide layout/STAR format, and manages PDF export.
---

# Resume Generator Skill

This skill handles updating the content of the slide-based resume (`index.html`) and exporting it to PDF. The resume uses a rigid HTML structure that MUST be preserved to maintain the visual design.

## 1. Content Update Strategy

When the user provides new resume content (e.g., raw text, list of projects), you must map it to the following HTML structure. **Do not deviate from these classes.**

### File Structure
*   **Template**: `src/template.html` (The skeleton)
*   **Slides**: `src/slides/*.html` (Individual slide files)
*   **Build**: `npm run build` (Combines them into `index.html`)

### Slide 1: Introduction (Profile)
**File**: `src/slides/00_profile.html`
- **Header**: `h1` (Name), `h2` (Title)
- **Summary**: `.core-competency p` (Use `<strong>` for key phrases)
- **Metrics**: `.key-achievements` container with 3 `div.metric-card`:
    - `span.metric-value` (The number/stat)
    - `span.metric-label` (The description)
- **Tech**: `.tech-stack p` (List of core technologies)

### Slides 2+: Projects (Experience)
**Selector**: `#slide-N` (e.g., slide-2, slide-3...)
All project slides use the **STAR** (Situation/Task, Action, Result) grid layout.

**Structure**:
```html
<!-- Saved as src/slides/XX_project_name.html -->
<section class="slide" id="slide-N" data-project-id="project_key_from_archivist">
    <div class="content-wrapper">
        <!-- Header -->
        <div class="slide-header-row">
            <h2 class="slide-title">PROJECT_TITLE</h2>
            <span class="slide-tag">CATEGORY (e.g. System Design, Innovation)</span>
        </div>
        
        <!-- Grid -->
        <div class="star-grid">
            <div class="star-content">
                <!-- STAR Item 1: Challenge/Problem -->
                <div class="star-card">
                    <div class="star-item">
                        <span class="star-label">Challenge:</span> <!-- or Problem: -->
                        <span class="star-text">DESCRIPTION</span>
                    </div>
                </div>
                
                <!-- STAR Item 2: Solution/Engineering -->
                <div class="star-card">
                    <div class="star-item">
                        <span class="star-label">Solution:</span> <!-- or Engineering: -->
                        <span class="star-text">DESCRIPTION (Use <strong> for emphasis)</span>
                    </div>
                </div>
                
                <!-- STAR Item 3: Impact/Result -->
                <div class="star-card">
                    <div class="star-item">
                        <span class="star-label">Impact:</span> <!-- or Result: -->
                        <span class="star-text">DESCRIPTION</span>
                    </div>
                </div>
                
                <!-- Tech Tags -->
                <div class="tech-footer">
                    <span class="tech-tag">Tech1</span>
                    <span class="tech-tag">Tech2</span>
                </div>
            </div>
            
            <!-- Image -->
            <div class="star-visual">
                <img src="path/to/image.png" alt="Description" class="slide-image">
            </div>
        </div>
    </div>
</section>
```

**Rules**:
1. Always keep the `star-grid` structure with `star-content` (left) and `star-visual` (right).
2. If no image is available, use a placeholder or ask the user.
3. Use `<strong>` tags within `.star-text` to highlight key metrics or technologies.

## 3. Integration with Project Archivist & Smart Updates

When the user asks to "Update resume" or "Add Project X":

1.  **Read Source**: Read `.agent/skills/project_archivist/data/projects.json`.
2.  **Match**: 
    - Check if a slide with `data-project-id="project_key"` already exists in `index.html`.
    - If yes,3.  **Render**:
    *   **File Naming**: Use a prefix for ordering, e.g., `src/slides/01_project_key.html`.
    *   **Action**: Write the HTML content to the new/existing file in `src/slides/`.
    *   **Build**: Execute `npm run build` to regenerate `index.html`.
3.  **Nav Dots**: Update `.nav-bar` to ensure there is one dot per slide.


**Rules**:
1. Always keep the `star-grid` structure with `star-content` (left) and `star-visual` (right).
2. If no image is available, use a placeholder or ask the user.
3. Use `<strong>` tags within `.star-text` to highlight key metrics or technologies.

## 2. PDF Export

The project contains a script to export the resume to PDF using Puppeteer to ensure the print layout is perfectly captured.

### Usage
1. Ensure dependencies are installed in the project root:
   ```bash
   npm install
   ```
2. Run the export script:
   ```bash
   node export_pdf.js [output_path]
   ```
   *Default output*: `resume.pdf` in the project root.

### Browser Manual Export
Alternatively, the user can click the "Export PDF" button on the webpage, which triggers `window.print()`. The CSS (`@media print`) is already optimized for this.
