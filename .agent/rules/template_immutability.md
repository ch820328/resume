# Resume System Core Rules

## 🔒 Critical: Template Immutability

### Rule 1: Golden Template is Sacred
**File**: `/home/Resume/src/slides/FF_project_template.html`

This file is the **ONLY** authoritative layout reference for all project slides.

**PROHIBITED Actions**:
- ❌ Creating new HTML structures for slides
- ❌ Modifying the grid layout (`.star-grid`, `.star-content`, `.star-visual`)
- ❌ Changing the header structure (`.slide-header-row`, `<h2>`, `<span>`)
- ❌ Reordering elements (Challenge, Solution, Impact)
- ❌ Moving `.tech-footer` outside of `.star-content`

**REQUIRED Actions**:
- ✅ **Always** copy `FF_project_template.html` as the starting point
- ✅ **Only** replace placeholder text with project-specific content
- ✅ Preserve all class names exactly as written
- ✅ Keep element hierarchy intact

### Rule 2: Mandatory Structure Verification

Before creating or updating ANY slide, verify:

```html
<!-- CORRECT Structure (from FF_project_template.html) -->
<section class="slide" id="slide-X">
  <div class="content-wrapper">
    <div class="slide-header-row">
      <h2 class="slide-title">[Title]</h2>
      <span class="slide-tag">[Category]</span>
    </div>
    <div class="star-grid">
      <div class="star-content">
        <div class="star-card">
          <div class="star-item">
            <span class="star-label">Challenge:</span>
            <span class="star-text">...</span>
          </div>
        </div>
        <div class="star-card">
          <div class="star-item">
            <span class="star-label">Solution:</span>
            <span class="star-text">...</span>
          </div>
        </div>
        <div class="star-card">
          <div class="star-item">
            <span class="star-label">Impact:</span>
            <span class="star-text">...</span>
          </div>
        </div>
        <div class="tech-footer">
          <span class="tech-tag">...</span>
        </div>
      </div>
      <div class="star-visual">
        <img src="..." class="slide-image">
      </div>
    </div>
  </div>
</section>
```

### Rule 3: Content-Only Modifications

When working on slides, you may ONLY change:
- Text inside `<span class="star-text">`
- Project title inside `<h2 class="slide-title">`
- Category name inside `<span class="slide-tag">`
- Tech tags inside `<span class="tech-tag">`
- Image `src` attribute

**Everything else is FROZEN.**

### Rule 4: Enforcement Protocol

If you find yourself:
- Writing new `<div>` structures
- Creating new class names for slides
- Reordering STAR sections
- Moving the tech footer

**STOP IMMEDIATELY** and refer back to `FF_project_template.html`.

---

## 📋 Workflow Integration

This rule applies to:
- `/add_project` workflow (Step 4)
- `/update_project` workflow (Step 5)
- Any manual slide creation or modification

**Pre-commit Checklist**:
- [ ] Slide structure matches `FF_project_template.html` 100%
- [ ] Only placeholder content was replaced
- [ ] No new classes or elements were added
- [ ] Tech footer is inside `.star-content`, not outside

---

## 🚨 Violation Consequences

If this rule is violated:
- User must manually fix the layout
- Multiple rebuilds may be required
- PDF formatting may break

**When in doubt, copy `FF_project_template.html` verbatim and start over.**
