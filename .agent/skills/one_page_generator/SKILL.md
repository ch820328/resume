---
name: One-Page Generator
description: Generates a condensed, single-page printable resume (A4/Letter) suitable for ATS scanning and quick recruiter review.
---

# One-Page Generator Skill

This skill transforms content from `user_profile.json` and `projects.json` into a concise **One-Page Resume** optimized for ATS scanning and quick recruiter review.

## 1. Objective
- **Format**: Standard A4/Letter vertical layout (210mm × 297mm)
- **Target Audience**: Recruiters, ATS systems, Hiring Managers (6-second scan)
- **Constraint**: Must fit strictly on **one page**
- **Focus**: Concise action + quantifiable impact

## 2. Data Sources

### Primary: `user_profile.json`
```json
{
  "personal_info": { name, title, mobile, email, profile_photo },
  "summary": "Core competency statement",
  "education": [{ school, degree, date }],
  "work_experience": [
    {
      "company": "Company Name",
      "role": "Position",
      "date": "MM/YYYY - MM/YYYY",
      "description": "Optional: for non-software roles"
    }
  ]
}
```

### Secondary: `projects.json`
- **Used for**: Populating software projects under matching companies
- **Format**: `tags` generate tech footer; `details` generate content
- **Mapping**: Projects linked to companies via `company` field

## 3. Content Format

### Structure
```
Header: Name, Title, Contact, Photo
├── Summary (1-2 lines)
├── Education (date + school + degree)
└── Experience (chronological, newest first)
    ├── Company 1
    │   ├── Project A: [Action] → [Impact]
    │   └── Project B: [Action] → [Impact]
    ├── Company 2 (non-software role)
    │   └── Description from user_profile.json
    └── ...
```

### Project Description Format
**Old** (verbose STAR):
```
• Project Name
  • Challenge: [description]
  • Solution: [description]
  • Impact: [description]
```

**New** (concise action → impact):
```
• Project Name
  • [Solution description] → [Quantified impact with metrics]
```

**Example**:
```
• Ansible OS Baseline Setup
  • Created reusable Ansible playbooks with modular roles to standardize OS 
    initialization. Implemented dynamic version fetching to auto-install the 
    latest Go release from go.dev. → Reduced machine setup time from 2-3 hours 
    to 5 minutes. Achieved reproducible baseline environments across CentOS 
    and Ubuntu systems.
```

## 4. CSS Styling

### Key Features
- **Line height**: 1.5 for readability
- **Bullet spacing**: 0.4rem between items
- **Text alignment**: Justified for density
- **Color scheme**:
  - Primary (headings): `#0056b3` (blue)
  - Text: `#333` (dark grey)
  - Strong tags in bullets: Blue accent
- **Date column**: Fixed width (120px) for alignment
- **Photo**: 24mm × 32mm, rounded circle

### Print Optimization
```css
@media print {
  body { -webkit-print-color-adjust: exact; }
  .page { width: 210mm; height: 297mm; }
}
```

## 5. Build Process

### Script: `scripts/build_onepage.js`

**Logic**:
1. Load `user_profile.json` for personal info and work timeline
2. Load `projects.json` and group projects by company
3. Inject personal info (name, email, mobile, photo path)
4. Inject education entries (from user_profile.json)
5. For each `work_experience`:
   - If `description` exists → use it (non-software roles)
   - If matching projects exist → generate from `projects.json`
   - Format: `{solution} → {impact}` (skip challenge)
6. Write to `resume_onepage.html`

### Commands
```bash
# Build one-page resume
npm run build:onepage

# Full release (includes one-page)
npm run release  # Step 0:sync → 1:build → 2:export
```

## 6. Key Differences vs. Slide Deck

| Aspect | Slide Deck | One-Page Resume |
|--------|-----------|-----------------|
| **Purpose** | Storytelling, interview prep | Quick scan, ATS |
| **Format** | STAR (Challenge/Solution/Impact) | Action → Impact |
| **Length** | Multi-page, one project per slide | Single page, all projects |
| **Data Source** | `projects.json` only | `user_profile.json` + `projects.json` |
| **Tech Tags** | In slide footer (auto-synced) | Not displayed |

## 7. Workflow Integration

The One-Page Generator is part of the **Release Pipeline**:

```
npm run release
├── [0/3] sync:tags    → Update slide tech footers
├── [1/3] build        → Generate index.html (slides)
│         build:onepage → Generate resume_onepage.html
└── [2/3] export       → Generate both PDFs
```

**Output**:
- `resume_onepage.html` (web version)
- `resume_onepage.pdf` (print version)

## 8. Maintenance Notes

- **Adding new work experience**: Edit `user_profile.json` → `work_experience` array
- **Updating personal info**: Edit `user_profile.json` → `personal_info` object
- **Changing photo**: Update file at path specified in `user_profile.json`
- **Tweaking layout**: Modify CSS in `src/resume_onepage.html` template

---

**Last Updated**: 2026-01-29  
**Script**: `scripts/build_onepage.js`  
**Template**: `src/resume_onepage.html`
