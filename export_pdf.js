const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function exportPDF(inputFile, outputFile, landscapeOverride) {
    const systemChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const launchOptions = {
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    if (process.platform === 'darwin' && fs.existsSync(systemChromePath)) {
        launchOptions.executablePath = systemChromePath;
        console.log(`Using System Chrome: ${systemChromePath}`);
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    const fullPath = `file://${path.resolve(inputFile)}`;
    await page.goto(fullPath, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.pdf({
        path: outputFile,
        printBackground: true,
        format: 'A4',
        landscape: landscapeOverride !== undefined ? landscapeOverride : inputFile.includes('index.html'),
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();
    console.log(`✅ PDF Export complete: ${outputFile}`);
}

(async () => {
    try {
        console.log('🚀 Starting PDF Export Process...');

        const OUTPUT_DIR = path.join(__dirname, 'output');
        const arg1 = process.argv[2];
        const arg2 = process.argv[3];

        if (arg1 && arg2) {
            // Explicit mode
            // If paths are relative, resolve them. 
            const resolvedInput = path.join(arg1.startsWith('/') ? '' : __dirname, arg1);
            const resolvedOutput = path.join(arg2.startsWith('/') ? '' : __dirname, arg2);
            console.log(`Mapping specific file: ${resolvedInput} -> ${resolvedOutput}`);
            await exportPDF(resolvedInput, resolvedOutput);
        } else {
            // Standard multi-target mode
            const targets = [
                { input: 'index.html', output: 'resume_slides.pdf', landscape: true },
                { input: 'resume_master.html', output: 'resume_master.pdf', landscape: false },
                { input: 'index_embedded.html', output: 'resume_slides_embedded.pdf', landscape: true },
                { input: 'resume_embedded.html', output: 'resume_embedded.pdf', landscape: false },
                { input: 'index_fullstack.html', output: 'resume_slides_fullstack.pdf', landscape: true },
                { input: 'resume_fullstack.html', output: 'resume_fullstack.pdf', landscape: false },
                { input: 'index_tailored.html', output: 'resume_slides_tailored.pdf', landscape: true },
                { input: 'resume_tailored.html', output: 'resume_tailored.pdf', landscape: false }
            ];

            for (const target of targets) {
                const inputPath = path.join(OUTPUT_DIR, target.input);
                if (fs.existsSync(inputPath)) {
                    const outputPath = path.join(OUTPUT_DIR, target.output);
                    await exportPDF(inputPath, outputPath, target.landscape);
                } else {
                    console.log(`ℹ️ Skipping missing target: ${target.input}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    }
})();
