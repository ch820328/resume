---
description: Update Existing Project in Resume
---

# Workflow: Update Existing Project

This workflow handles modifications to existing project entries, allowing selective updates without regenerating everything.

## Prerequisites
- Project already exists in `projects.json`
- User specifies which artifacts need updating

## Decision Tree

### Scenario 1: Minor Content Update (e.g., rewording, fixing typos)
**Artifacts to Update**: 
- `projects.json` (edit the relevant fields)
- Re-run `npm run release` to rebuild HTML/PDF

**Skip**:
- `architecture.md` (unless technical details changed)
- `interview.md` (unless STAR answers need revision)

### Scenario 2: Technical Details Changed (e.g., new tech stack, updated metrics)
**Artifacts to Update**:
1. `projects.json` → Update `details`, `tech_stack`, or `tags`
2. `architecture.md` → Revise technical sections
3. `0X_project.html` → Update slide content (Challenge/Solution/Impact)
4. `npm run release`

**Skip**:
- `interview.md` (unless answers are outdated)

### Scenario 3: Major Rewrite/Pivot
**Use `/add_project` instead**, treating it as a new project:
- Create new slug (e.g., `project_v2`)
- Move old files to `documents/[old_slug]_archived/`

## Steps for Typical Update

### 1. Identify Target Project
Locate the project in `projects.json` by name or category.

### 2. Update `projects.json`
Edit the relevant fields:
- `details.challenge/solution/impact`
- `tech_stack`
- `tags`
- `date` (if timeline changed)

### 3. Update Architecture Doc (if needed)
If technical implementation changed:
- Edit `.agent/skills/project_archivist/documents/[slug]/architecture.md`
- Keep section structure consistent

### 4. Update Interview Guide (if needed)
If STAR answers need revision:
- Edit `.agent/skills/project_archivist/documents/[slug]/interview.md`
- Ensure new metrics/impacts are reflected

### 5. Update Slide HTML
Edit `src/slides/0X_[slug].html`:
- Modify STAR grid content
- Update tech tags
- Replace visual if needed

### 6. Rebuild
// turbo
Run `npm run release` to propagate changes to all output formats.

## Example: Updating Ansible Project

Scenario: Ansible now supports Ubuntu in addition to CentOS.

```bash
# 1. Update projects.json
# Add "Ubuntu" to tags

# 2. Update architecture.md
# Add section on Ubuntu-specific role tasks

# 3. Update slide
# Change "CentOS" tag to "CentOS/Ubuntu"

# 4. Rebuild
npm run release
```

## Quick Reference

| What Changed | Update projects.json | Update architecture.md | Update interview.md | Update slide | Rebuild |
|--------------|---------------------|----------------------|-------------------|--------------|---------|
| Typo fix | ✅ | - | - | ✅ | ✅ |
| New tech added | ✅ | ✅ | - | ✅ | ✅ |
| Impact metrics updated | ✅ | - | ✅ | ✅ | ✅ |
| Complete rewrite | Use `/add_project` instead |

## Notes
- Always keep `projects.json` as the single source of truth
- Slide numbering (`0X_`) should remain stable unless reordering
- Test PDF output after updates to ensure formatting is correct
