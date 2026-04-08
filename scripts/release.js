const { execSync } = require('child_process');

try {
    console.log('🚀 Starting Full Release Pipeline...');
    // Step 0: Sync tech tags from projects.json
    console.log('[0/3] 🔄 Syncing tech tags...');
    execSync('npm run sync:tags', { stdio: 'inherit' });

    // Step 1: Build HTML
    console.log('\n[1/3] 🏗️  Building HTML...');
    execSync('npm run build', { stdio: 'inherit' });
    execSync('npm run build:onepage', { stdio: 'inherit' });

    // Step 2: Export PDF
    console.log('\n[2/3] 📄 Exporting PDF...');
    execSync('npm run export', { stdio: 'inherit' });

    console.log('\n✅ Release Pipeline Completed Successfully!');

} catch (error) {
    console.error('\n❌ Pipeline Failed:', error.message);
    process.exit(1);
}
