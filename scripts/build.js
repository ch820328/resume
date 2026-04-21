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
const OUTPUT_DIR = path.join(__dirname, '../output'); 

const templatePath = path.join(SRC_DIR, 'template.html');
const DEFAULT_ORDER_FILE = path.join(__dirname, '../slides_order.json');

function build() {
    console.log('🏗️  Building Resume...');

    // Parse Arguments
    let configPath = DEFAULT_ORDER_FILE;
    const configArgIndex = process.argv.indexOf('--config');
    if (configArgIndex > -1 && process.argv[configArgIndex + 1]) {
        configPath = path.resolve(process.argv[configArgIndex + 1]);
    }

    let suffix = '';
    let slideFiles = [];

    if (fs.existsSync(configPath)) {
        try {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            
            // Handle new unified JSON format
            if (configData.slides && Array.isArray(configData.slides)) {
                slideFiles = configData.slides;
                suffix = configData.suffix || '';
            } else if (Array.isArray(configData)) {
                // Fallback for old simple array format
                slideFiles = configData;
            }

            // Filter to only include files that actually exist in SLIDES_DIR
            slideFiles = slideFiles.filter(file => {
                const exists = fs.existsSync(path.join(SLIDES_DIR, file));
                if (!exists) console.warn(`⚠️ Warning: Configured slide ${file} not found in ${SLIDES_DIR}`);
                return exists;
            });
        } catch (e) {
            console.error(`❌ Error parsing config at ${configPath}, falling back to alphabetical sort.`, e);
        }
    }

    const OUTPUT_FILENAME = suffix ? `index_${suffix}.html` : 'index.html';
    const OUTPUT_FILE = path.join(OUTPUT_DIR, OUTPUT_FILENAME);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Template not found!');
        process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf-8');

    // 1. Read Slides
    if (!fs.existsSync(SLIDES_DIR)) {
        fs.mkdirSync(SLIDES_DIR, { recursive: true });
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
    let finalHtml = template
        .replace('<!-- {{SLIDES_PLACEHOLDER}} -->', slidesHtml)
        .replace('<!-- {{NAV_DOTS_PLACEHOLDER}} -->', navDotsHtml);

    // 3. Adjust Paths for Output Subdirectory
    finalHtml = finalHtml
        .replace(/href="styles\.css"/g, 'href="../styles.css"')
        .replace(/href="chat_widget\.css"/g, 'href="../chat_widget.css"')
        .replace(/src="script\.js"/g, 'src="../script.js"')
        .replace(/src="chat_widget\.js"/g, 'src="../chat_widget.js"')
        .replace(/src="src\/image\//g, 'src="../src/image/');

    // 4. Write Output
    fs.writeFileSync(OUTPUT_FILE, finalHtml);
    console.log(`✅ Successfully built ${OUTPUT_FILENAME} with ${slideFiles.length} slides.`);
}

build();
