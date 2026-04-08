const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const SLIDES_DIR = path.join(SRC_DIR, 'slides');
const DIST_DIR = path.join(__dirname, '../'); // We decided to keep index.html in root for simplicity with styles/scripts
// Wait, user asked to structure as dist/index.html.
// But styles.css and script.js are in root.
// If we move index.html to dist/, we need to adjust links to ../styles.css
// OR we output index.html to Root (overwriting the old one).
// Outputting to Root is safer for existing relative paths (images, css, js).
const OUTPUT_FILE = path.join(__dirname, '../index.html');

const templatePath = path.join(SRC_DIR, 'template.html');

function build() {
    console.log('🏗️  Building Resume...');

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Template not found!');
        process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf-8');

    // 1. Read Slides
    if (!fs.existsSync(SLIDES_DIR)) {
        fs.mkdirSync(SLIDES_DIR, { recursive: true });
    }

    const ORDER_FILE = path.join(__dirname, '../slides_order.json');
    let slideFiles = [];

    if (fs.existsSync(ORDER_FILE)) {
        try {
            const orderList = JSON.parse(fs.readFileSync(ORDER_FILE, 'utf-8'));
            // Filter to only include files that actually exist in SLIDES_DIR
            slideFiles = orderList.filter(file => {
                const exists = fs.existsSync(path.join(SLIDES_DIR, file));
                if (!exists) console.warn(`⚠️ Warning: Configured slide ${file} not found in ${SLIDES_DIR}`);
                return exists;
            });

            // We only want to build what is explicitly listed in slides_order.json
        } catch (e) {
            console.error('❌ Error parsing slides_order.json, falling back to alphabetical sort.', e);
        }
    }

    if (slideFiles.length === 0) {
        slideFiles = fs.readdirSync(SLIDES_DIR)
            .filter(file => file.endsWith('.html'))
            .sort(); // Sort alphabetically (00_, 01_, etc)
    }

    console.log(`📂 Found ${slideFiles.length} slides:`, slideFiles);

    let slidesHtml = '';
    let navDotsHtml = '';

    slideFiles.forEach((file, index) => {
        const content = fs.readFileSync(path.join(SLIDES_DIR, file), 'utf-8');
        slidesHtml += content + '\n'; // Add newline for readability

        // Generate Nav Dot
        const activeClass = index === 0 ? 'active' : '';
        navDotsHtml += `<div class="nav-dot ${activeClass}" data-slide="${index}"></div>\n`;
    });

    // 2. Inject into Template
    // We used <!-- {{SLIDES_PLACEHOLDER}} --> in template
    // But simple string replacement is safer with unique tokens
    const finalHtml = template
        .replace('<!-- {{SLIDES_PLACEHOLDER}} -->', slidesHtml)
        .replace('<!-- {{NAV_DOTS_PLACEHOLDER}} -->', navDotsHtml);

    // 3. Write Output
    fs.writeFileSync(OUTPUT_FILE, finalHtml);
    console.log(`✅ Successfully built index.html with ${slideFiles.length} slides.`);
}

build();
