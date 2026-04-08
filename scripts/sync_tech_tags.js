const fs = require('fs');
const path = require('path');

const PROJECTS_PATH = path.join(__dirname, '../.agent/skills/project_archivist/data/projects.json');
const SLIDES_DIR = path.join(__dirname, '../src/slides');

function loadProjects() {
    if (!fs.existsSync(PROJECTS_PATH)) {
        console.error('❌ projects.json not found!');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
}

function updateSlideTechFooter(slideFile, tags) {
    const slidePath = path.join(SLIDES_DIR, slideFile);

    if (!fs.existsSync(slidePath)) {
        console.warn(`⚠️  Slide not found: ${slideFile}`);
        return;
    }

    let content = fs.readFileSync(slidePath, 'utf8');

    // Generate tech tags HTML from tags array
    const techTagsHtml = tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('\n                    ');

    // Replace the tech-footer content
    // Pattern: <div class="tech-footer">...</div> (handles attributes like id)
    const techFooterRegex = /(<div class="tech-footer"[^>]*>)([\s\S]*?)(<\/div>)/;

    if (techFooterRegex.test(content)) {
        content = content.replace(
            techFooterRegex,
            `$1\n                    ${techTagsHtml}\n                $3`
        );
        fs.writeFileSync(slidePath, content);
        console.log(`✅ Updated ${slideFile} with ${tags.length} tags`);
    } else {
        console.warn(`⚠️  No tech-footer found in ${slideFile}`);
    }
}

function syncTechTags() {
    console.log('🔄 Syncing tech tags from projects.json to slides...\n');

    const data = loadProjects();

    // Map project names to slide files
    const projectSlideMap = {
        'Jetson Build Service & Automation Portal': null, // No slide yet
        "OpenClaw AI Merge Request Review Service": "openclaw_mr.html",
        "OpenClaw: Log Matrix & RAG Diagnostic Platform": "openclaw_log.html",
        'Jetson Orin BSP & Infrastructure Optimization': 'jetson_bsp.html',
        'Test-Driven Infrastructure as Code (Ansible)': 'ansible.html',
        'Unified Engineering Productivity Portal': 'central_dashboard.html',
        'Firmware Configuration & NVRAM Persistence Validation': 'bios_preserve_test.html',
        "Deterministic BIOS OCR Engine": "pic_transcript.html",
        "Cross-Interface Consistency Validation Framework": "redfish_smbios_check.html",
        'NVSSVT Enterprise Automation Platform': 'nvssvt_portal.html',
        'Cross-Platform Business Intelligence Engine': 'issue_analytics.html',
        'GitLab CI Automated Quality Gate': 'gitlab_ci.html',
        'Secure CD & Automated Release Engineering': 'gitlab_cd.html',
        'Offline-First Distributed System (Baby Tracker)': 'baby_tracker.html'
    };

    for (const categoryKey in data.project_categories) {
        const category = data.project_categories[categoryKey];

        if (!category.projects) continue;

        category.projects.forEach(project => {
            const slideFile = projectSlideMap[project.name];

            if (slideFile && project.tags) {
                updateSlideTechFooter(slideFile, project.tags);
            } else if (!slideFile) {
                console.log(`ℹ️  No slide mapping for: ${project.name}`);
            }
        });
    }

    console.log('\n✨ Tech tag sync complete!');
}

syncTechTags();
