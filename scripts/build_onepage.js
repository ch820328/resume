const fs = require('fs');
const path = require('path');

const PROJECTS_PATH = path.join(__dirname, '../.agent/skills/project_archivist/data/projects.json');
const PROFILE_PATH = path.join(__dirname, '../.agent/skills/project_archivist/data/user_profile.json');
const PROFILE_SLIDE_PATH = path.join(__dirname, '../src/slides/00_profile.html');
const TEMPLATE_PATH = path.join(__dirname, '../src/resume_onepage.html');
const OUTPUT_PATH = path.join(__dirname, '../resume_onepage.html');

function loadProjects() {
    if (!fs.existsSync(PROJECTS_PATH)) return { project_categories: {} };
    return JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
}

function loadProfile() {
    if (!fs.existsSync(PROFILE_PATH)) {
        return {
            personal_info: {
                name: "Your Name",
                title: "Software Engineer",
                mobile: "",
                email: "",
                profile_photo: "src/image/profile_photo.png"
            },
            summary: "",
            education: [],
            work_experience: [],
            skills: { languages: [], frameworks: [], tools: [] }
        };
    }
    return JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
}

function extractCoreCompetency() {
    // Try to scrape from 00_profile.html if it exists, otherwise use a default
    if (fs.existsSync(PROFILE_SLIDE_PATH)) {
        const content = fs.readFileSync(PROFILE_SLIDE_PATH, 'utf8');
        const match = content.match(/<p class="summary-text">(.*?)<\/p>/s);
        if (match) {
            return match[1].trim();
        }
    }
    return "Senior Software Engineer specialized in Embedded Systems, BSP, and Automation.";
}

function generateResume() {
    const projectData = loadProjects();
    const profile = loadProfile();
    let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    // 1. Inject Personal Info
    html = html.replace(/id="name">.*?<\/h1>/, `id="name">${profile.personal_info.name}</h1>`);
    html = html.replace(/id="title".*?>.*?<\/div>/, `id="title" style="color:#666; font-size:12pt; margin-top:5px;">${profile.personal_info.title}</div>`);
    html = html.replace(/Mobile:.*?<\/div>/, `Mobile: ${profile.personal_info.mobile}</div>`);
    html = html.replace(/E-mail:.*?<\/div>/, `E-mail: ${profile.personal_info.email}</div>`);

    // 2. Inject Summary
    const summary = profile.summary || extractCoreCompetency();
    function markdownToHtml(text) {
        if (!text) return '';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
    html = html.replace('[Core Competency Placeholder]', markdownToHtml(summary));

    // 3. Inject Education (Moved to bottom in template, but data process here)
    // Note: Template has hardcoded education structure for simplicity in this redesign, 
    // or we can dynamically inject if we want to support multiple entries.
    // For now, let's keep the hardcoded one in HTML or update if needed.
    // Actually, let's overwrite the hardcoded one to be safe.
    let educationHtml = '';
    profile.education.forEach(edu => {
        educationHtml += `
            <div class="entry">
                <div class="date-col">${edu.date}</div>
                <div class="content-col">
                    <div class="job-header">
                        <span class="job-title">${edu.school}</span> <span style="font-weight: normal; font-size: 10pt; color: #444;">${edu.degree}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html = html.replace(/<div id="education-container">[\s\S]*?<\/div>/, `<div id="education-container">${educationHtml}</div>`);

    // 4. Process Work Experience
    // Group projects by company
    const companyProjectsMap = {};

    // Define the specific order and selection of projects for the One-Page Resume
    const FEATURED_PROJECTS = [
        "NVSSVT Enterprise Automation Platform",
        "Deterministic BIOS OCR Engine",
        "Unified Engineering Productivity Portal",
        "Test-Driven Infrastructure as Code (Ansible)",
        "Jetson Orin BSP & Infrastructure Optimization",
        "Offline-First Distributed System (Baby Tracker)"
    ];
    for (const catKey in projectData.project_categories) {
        const category = projectData.project_categories[catKey];
        if (category.projects) {
            category.projects.forEach(proj => {
                // Filter: Only include if it's in our featured list
                if (!FEATURED_PROJECTS.includes(proj.name)) return;

                const comp = proj.company || "Independent Projects";
                if (!companyProjectsMap[comp]) {
                    companyProjectsMap[comp] = [];
                }
                companyProjectsMap[comp].push(proj);
            });
        }
    }

    // Sort projects within each company bucket based on the FEATURED_PROJECTS order
    for (const comp in companyProjectsMap) {
        companyProjectsMap[comp].sort((a, b) => {
            return FEATURED_PROJECTS.indexOf(a.name) - FEATURED_PROJECTS.indexOf(b.name);
        });
    }

    let experienceHtml = '';

    function markdownToHtml(text) {
        if (!text) return '';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    // Use work_experience from profile as the source of truth for timeline
    profile.work_experience.forEach(workExp => {
        const companyProjects = companyProjectsMap[workExp.company] || [];

        let projectsHtml = '';

        if (workExp.description && workExp.description.trim()) {
            // Use description from profile (for non-software roles)
            projectsHtml = `<li>${markdownToHtml(workExp.description)}</li>`;
        } else if (companyProjects.length > 0) {
            // Use projects from projects.json (for software roles)
            companyProjects.forEach(proj => {
                let description = '';

                if (proj.details) {
                    // Extract only the FIRST sentence from solution (main action)
                    let action = '';
                    if (proj.details.solution) {
                        const fullSolution = proj.details.solution;
                        // Take only first sentence. Look for period followed by space or end of string.
                        // This prevents splitting on "CheckBIOSPreserveSetupConfigurationX64.efi"
                        const match = fullSolution.match(/^.*?[.!?](?:\s|$)/);
                        action = match ? match[0].trim() : fullSolution;
                        action = markdownToHtml(action);
                    }

                    // Keep full impact (already quantified)
                    const impact = proj.details.impact ? markdownToHtml(proj.details.impact.trim()) : '';

                    if (action && impact) {
                        description = `<strong>${proj.name}</strong>: ${action} ➔ ${impact}`;
                    } else if (action) {
                        description = `<strong>${proj.name}</strong>: ${action}`;
                    } else if (impact) {
                        description = `<strong>${proj.name}</strong>: ${impact}`;
                    }
                }

                if (description) {
                    projectsHtml += `
                        <li>${description}</li>
                    `;
                }
            });
        }

        if (projectsHtml || workExp.description) {
            experienceHtml += `
                <div class="entry">
                    <div class="date-col">${workExp.date}</div>
                    <div class="content-col">
                        <div class="job-header">
                            <span class="job-title">${workExp.role}</span> 
                            <span class="company-name">@ ${workExp.company}</span>
                        </div>
                        <ul class="project-list">
                            ${projectsHtml}
                        </ul>
                    </div>
                </div>
            `;
        }
    });

    // 5. Inject Skills
    const skills = profile.skills;
    const backend = skills.backend ? skills.backend.join(", ") : "";
    const frontend = skills.frontend ? skills.frontend.join(", ") : "";
    const infra = skills.infrastructure ? skills.infrastructure.join(", ") : "";
    const domain = skills.domain ? skills.domain.join(", ") : "";

    html = html.replace('id="must-to-do-skills" style="margin-bottom: 5px;">', 'id="backend-skills">');
    html = html.replace('<strong>Must-to-do:</strong> <span id="must-to-do-list"></span>', `<strong>Backend:</strong> <span>${backend}</span>`);

    html = html.replace('id="tech-skills">', 'id="frontend-skills">');
    html = html.replace('<strong>Languages & Tools:</strong> <span id="languages-tools-list"></span>', `
        <strong>Frontend:</strong> <span>${frontend}</span><br>
        <strong>Infrastructure:</strong> <span>${infra}</span><br>
        <strong>Domain:</strong> <span>${domain}</span>
    `);

    html = html.replace('<!-- Entries go here -->', experienceHtml);

    fs.writeFileSync(OUTPUT_PATH, html);
    console.log(`✅ One-Page Resume Generated at: ${OUTPUT_PATH}`);
}

generateResume();
