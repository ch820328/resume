const fs = require('fs');
const path = require('path');

const PROJECTS_PATH = path.join(__dirname, '../.agent/skills/project_archivist/data/projects.json');
const PROFILE_PATH = path.join(__dirname, '../.agent/skills/project_archivist/data/user_profile.json');
const PROFILE_SLIDE_PATH = path.join(__dirname, '../src/slides/00_profile.html');
const TEMPLATE_PATH = path.join(__dirname, '../src/resume_onepage.html');
const CONFIG_PATH = path.join(__dirname, 'onepage_config.json');

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
            skills: { backend: [], frontend: [], infrastructure: [], domain: [] }
        };
    }
    return JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
}

function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) return { profiles: {} };
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function markdownToHtml(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function generateResume(profileKey, profileCfg, masterProjectData, masterProfileData) {
    console.log(`🏗️  Generating Resume for Profile: ${profileKey} (${profileCfg.name})...`);
    let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    // 1. Inject Personal Info
    html = html.replace(/id="name">.*?<\/h1>/, `id="name">${masterProfileData.personal_info.name}</h1>`);
    html = html.replace(/id="title".*?>.*?<\/div>/, `id="title" style="color:#666; font-size:12pt; margin-top:5px;">${profileCfg.name}</div>`);
    
    const contactInfo = `
        <div>Email: ${masterProfileData.personal_info.email}</div>
        <div>GitHub: <a href="https://github.com/ch820328" style="color: var(--primary-color); text-decoration: none;">github.com/ch820328</a></div>
        <div>LinkedIn: <a href="https://www.linkedin.com/in/chun-yu-tsai-5614371b5/" style="color: var(--primary-color); text-decoration: none;">linkedin.com/in/chun-yu-tsai</a></div>
    `;
    html = html.replace(/<div class="header-middle">[\s\S]*?<\/div>/, `<div class="header-middle">${contactInfo}</div>`);

    // 2. Inject Summary
    const summary = profileCfg.summary;
    html = html.replace('[Core Competency Placeholder]', markdownToHtml(summary));

    // 3. Inject Education
    let educationHtml = '';
    masterProfileData.education.forEach(edu => {
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

    // 4. Process Work Experience (Filtered by Profile Projects)
    const companyProjectsMap = {};
    const FEATURED_PROJECTS = profileCfg.featured_projects;

    for (const catKey in masterProjectData.project_categories) {
        const category = masterProjectData.project_categories[catKey];
        if (category.projects) {
            category.projects.forEach(proj => {
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
    masterProfileData.work_experience.forEach(workExp => {
        const companyProjects = companyProjectsMap[workExp.company] || [];
        let projectsHtml = '';

        if (workExp.description && workExp.description.trim() && companyProjects.length === 0) {
            projectsHtml = `<li>${markdownToHtml(workExp.description)}</li>`;
        } else if (companyProjects.length > 0) {
            companyProjects.forEach(proj => {
                let description = '';
                if (proj.details) {
                    let action = '';
                    if (proj.details.solution) {
                        const fullSolution = proj.details.solution;
                        const match = fullSolution.match(/^.*?[.!?](?:\s|$)/);
                        action = match ? match[0].trim() : fullSolution;
                        action = markdownToHtml(action);
                    }
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
                    projectsHtml += `<li>${description}</li>`;
                }
            });
        }

        if (projectsHtml) {
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

    // 5. Inject Skills (Re-ordered by Priority)
    const skillMap = {
        backend: `<strong>Backend:</strong> <span>${(masterProfileData.skills.backend || []).join(", ")}</span>`,
        frontend: `<strong>Frontend:</strong> <span>${(masterProfileData.skills.frontend || []).join(", ")}</span>`,
        infrastructure: `<strong>Infrastructure:</strong> <span>${(masterProfileData.skills.infrastructure || []).join(", ")}</span>`,
        domain: `<strong>Domain:</strong> <span>${(masterProfileData.skills.domain || []).join(", ")}</span>`
    };

    const priority = profileCfg.skills_priority || ["backend", "frontend", "infrastructure", "domain"];
    let skillsHtml = priority.map(p => skillMap[p]).join('<br>\n        ');

    html = html.replace('id="must-to-do-skills" style="margin-bottom: 5px;">', 'id="backend-skills">');
    html = html.replace('<strong>Must-to-do:</strong> <span id="must-to-do-list"></span>', `<span>${skillsHtml}</span>`);
    
    // Cleanup old tech-skills block if it exists
    html = html.replace(/<div id="tech-skills">[\s\S]*?<\/div>/, '');
    html = html.replace('<!-- Entries go here -->', experienceHtml);

    const outputPath = path.join(__dirname, '../', profileCfg.output_file || `resume_${profileKey}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Resume for [${profileKey}] generated at: ${outputPath}`);
}

function runBuild() {
    const projectData = loadProjects();
    const profileData = loadProfile();
    const config = loadConfig();

    const args = process.argv.slice(2);
    let targetProfile = null;
    args.forEach(arg => {
        if (arg.startsWith('--profile=')) {
            targetProfile = arg.split('=')[1];
        }
    });

    if (targetProfile) {
        if (config.profiles[targetProfile]) {
            generateResume(targetProfile, config.profiles[targetProfile], projectData, profileData);
        } else {
            console.error(`❌ Profile "${targetProfile}" not found in config.`);
        }
    } else {
        // Build all profiles by default
        for (const key in config.profiles) {
            generateResume(key, config.profiles[key], projectData, profileData);
        }
    }
}

runBuild();
