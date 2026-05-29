const fs = require('fs');
const path = require('path');

const files = [
    'src/assets/styles.css',
    'src/slides/jetson_bsp.html',
    'src/slides/openclaw_log.html',
    'src/slides/openclaw_log.md',
    'src/slides/openclaw_mr.html',
    'src/slides/openclaw_mr.md',
    'src/slides/pic_transcript.html',
    'src/slides/secure_python_efi.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const isHtml = file.endsWith('.html');
    
    // Regex to match conflict block
    const conflictRegex = /<<<<<<< HEAD\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]+\n/g;
    
    content = content.replace(conflictRegex, (match, headBlock, originBlock) => {
        let remoteText = originBlock.trim();
        
        if (isHtml) {
            // Check if head block had a ul
            if (headBlock.includes('<ul')) {
                // Try to split the remote text into bullet points
                // We split by ". " or ".\n"
                let sentences = remoteText.split(/\.\s+/).map(s => s.trim()).filter(s => s.length > 0);
                
                let lis = sentences.map(s => {
                    // re-add period if it was stripped and sentence doesn't end with punctuation
                    if (!/[.!?]$/.test(s) && !s.endsWith('</strong>')) {
                        s += '.';
                    } else if (s.endsWith('</strong>') && !sentences[sentences.length-1].endsWith(s)) {
                        // wait, actually just appending period is fine unless it's a list
                        // Let's just do a simple replacement
                    }
                    return `                                <li>${s}</li>`;
                }).join('\n');
                
                return `                            <ul style="padding-left: 1.2rem; margin: 0; padding-top: 0;">\n${lis}\n                            </ul>\n`;
            } else {
                return originBlock; // Just take origin if no ul in HEAD
            }
        } else {
            // For CSS and MD files, just take origin/main
            return originBlock;
        }
    });

    fs.writeFileSync(file, content);
    console.log(`✅ Resolved ${file}`);
});
