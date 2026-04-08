const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function exportPDF(inputFile, outputFile) {
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

    // Detect if we are printing slides (landscape) or onepage (portrait)
    const isSlides = inputFile.includes('index.html');

    await page.pdf({
        path: outputFile,
        printBackground: true,
        format: 'A4',
        landscape: isSlides,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();
    console.log(`✅ PDF Export complete: ${outputFile}`);
}

(async () => {
    try {
        console.log('🚀 Starting PDF Export Process...');

        const arg1 = process.argv[2];
        const arg2 = process.argv[3];

        if (arg1 && arg2) {
            // Explicit mode
            console.log(`Mapping specific file: ${arg1} -> ${arg2}`);
            await exportPDF(arg1, arg2);
        } else {
            // Standard mode
            if (fs.existsSync('index.html')) {
                await exportPDF('index.html', 'resume_slides.pdf');
            }
            if (fs.existsSync('resume_onepage.html')) {
                await exportPDF('resume_onepage.html', 'resume_onepage.pdf');
            }
        }

    } catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    }
})();
