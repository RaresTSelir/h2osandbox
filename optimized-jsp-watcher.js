const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

console.log('⚡ Starting OPTIMIZED JSP Auto-Sync...');

let isUpdating = false;
let lastUpdateTime = 0;

// Optimized sync function with faster timing
function syncJSPToPreview() {
    const now = Date.now();
    
    // Debounce: ignore if updated recently
    if (isUpdating || (now - lastUpdateTime) < 150) return;
    
    isUpdating = true;
    lastUpdateTime = now;
    
    try {
        // Read JSP file
        const jspPath = path.join(__dirname, 'InserimentoNuovoMassimaleJSP.jsp');
        const jspContent = fs.readFileSync(jspPath, 'utf8');
        
        // Extract body content
        const bodyMatch = jspContent.match(/<body[^>]*>(.*?)<\/body>/s);
        if (!bodyMatch) {
            console.log('❌ No body content found');
            return;
        }
        
        const bodyContent = bodyMatch[1].trim();
        
        // Read and update preview.html
        const previewPath = path.join(__dirname, 'preview.html');
        let previewContent = fs.readFileSync(previewPath, 'utf8');
        
        // Fast replace - more specific pattern
        const updatedPreview = previewContent.replace(
            /(<div class="last-updated".*?<\/div>\s*)(.*?)(\s*<script>)/s,
            `$1\n    ${bodyContent}\n$3`
        );
        
        // Write with minimal delay
        fs.writeFileSync(previewPath, updatedPreview, 'utf8');
        
        const timestamp = new Date().toLocaleTimeString();
        console.log(`⚡ [${timestamp}] JSP synced in ${Date.now() - now}ms`);
        
    } catch (error) {
        console.error('❌ Sync error:', error.message);
    } finally {
        // Quick release
        setTimeout(() => {
            isUpdating = false;
        }, 50);
    }
}

// Initial sync
console.log('🔧 Initial sync...');
syncJSPToPreview();

// Optimized watcher with faster polling
const watcher = chokidar.watch('InserimentoNuovoMassimaleJSP.jsp', {
    ignored: /node_modules/,
    persistent: true,
    usePolling: true,
    interval: 100,        // Very fast polling
    binaryInterval: 200,
    atomic: false,        // Faster detection
    ignoreInitial: true
});

// Minimal debouncing for maximum speed
let syncTimeout;
watcher.on('change', (filePath) => {
    console.log(`📝 JSP changed`);
    
    // Ultra-fast debounce
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncJSPToPreview, 50);
});

watcher.on('ready', () => {
    console.log('👀 OPTIMIZED JSP watcher ready!');
    console.log('💨 Ultra-fast sync enabled - save JSP to see instant updates!');
});

// Graceful shutdown
const shutdown = () => {
    console.log('\\n🛑 Stopping optimized JSP watcher...');
    watcher.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);