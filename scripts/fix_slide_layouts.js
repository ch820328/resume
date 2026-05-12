const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '../src/slides');

function fixSlide(file) {
    const filePath = path.join(SLIDES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to capture tech-footer inside star-content and move it out
    // Look for <div class="tech-footer">...</div></div>
    // Where the second </div> is the end of star-content
    
    const pattern = /(<div class="star-content">[\s\S]*?)(\s*<div class="tech-footer"[\s\S]*?<\/div>)\s*(<\/div>)/;
    
    if (pattern.test(content)) {
        content = content.replace(pattern, '$1$3\n            $2');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed layout for ${file}`);
    }
}

const files = fs.readdirSync(SLIDES_DIR).filter(f => f.endsWith('.html'));
files.forEach(fixSlide);
