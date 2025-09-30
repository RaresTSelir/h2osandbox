const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const LegacyHTMLMapper = require('./legacy-html-mapper');
const EnhancedLegacyHTMLMapper = require('./enhanced-legacy-mapper');

console.log('🔥 Starting UNIVERSAL JSP Auto-Sync System with Legacy HTML Conversion...');

let isUpdating = false;
let lastUpdateTime = 0;
let currentJSPFile = null;

// Initialize the legacy HTML mapper
const htmlMapper = new LegacyHTMLMapper();

// Function to find JSP files in JSPUnderConstruction folder
function findJSPFile() {
    const jspFolder = path.join(__dirname, 'JSPUnderConstruction');
    
    if (!fs.existsSync(jspFolder)) {
        console.log('❌ JSPUnderConstruction folder not found!');
        return null;
    }
    
    const files = fs.readdirSync(jspFolder);
    const jspFiles = files.filter(file => file.endsWith('.jsp'));
    
    if (jspFiles.length === 0) {
        console.log('📁 No JSP files found in JSPUnderConstruction folder');
        console.log('💡 Drop any .jsp file into JSPUnderConstruction/ folder to start development!');
        return null;
    }
    
    if (jspFiles.length > 1) {
        console.log('⚠️  Multiple JSP files found. Using the first one:', jspFiles[0]);
        console.log('📝 Found files:', jspFiles.join(', '));
        console.log('💡 For best results, keep only one JSP file in the folder');
    }
    
    const selectedFile = jspFiles[0];
    console.log(`📄 Working with JSP file: ${selectedFile}`);
    return path.join(jspFolder, selectedFile);
}

// Enhanced sync function for any JSP file
function syncJSPToPreview() {
    const now = Date.now();
    
    // Debounce: ignore if updated recently
    if (isUpdating || (now - lastUpdateTime) < 150) return;
    
    isUpdating = true;
    lastUpdateTime = now;
    
    try {
        // Find current JSP file
        const jspPath = findJSPFile();
        if (!jspPath) {
            console.log('⏸️  No JSP file to sync');
            return;
        }
        
        currentJSPFile = jspPath;
        
        // Read JSP file
        const jspContent = fs.readFileSync(jspPath, 'utf8');
        
        // Extract body content
        const bodyMatch = jspContent.match(/<body[^>]*>(.*?)<\/body>/s);
        if (!bodyMatch) {
            console.log('❌ No <body> content found in JSP file');
            return;
        }
        
        const bodyContent = bodyMatch[1].trim();
        
        // Convert legacy HTML attributes to modern CSS with Enhanced Mapper
        const enhancedMapper = new EnhancedLegacyHTMLMapper();
        const modernBodyContent = enhancedMapper.processDocument(bodyContent);
        
        // Get conversion statistics
        const stats = enhancedMapper.getStatistics();
        if (stats.convertedElements > 0) {
            console.log(`🎨 Enhanced conversion: ${stats.convertedElements}/${stats.totalElements} elements (${stats.conversionRate}%)`);
            console.log(`📊 Detected attributes: ${stats.detectedAttributes.join(', ')}`);
        }
        
        // Extract title if present
        const titleMatch = jspContent.match(/<title[^>]*>(.*?)<\/title>/s);
        const title = titleMatch ? titleMatch[1].trim() : 'JSP Development Preview';
        
        // Read and update preview.html
        const previewPath = path.join(__dirname, 'preview.html');
        let previewContent = fs.readFileSync(previewPath, 'utf8');
        
        // Update title
        previewContent = previewContent.replace(
            /<title[^>]*>.*?<\/title>/s,
            `<title>${title}</title>`
        );
        
        // Update body content with converted HTML
        const updatedPreview = previewContent.replace(
            /(<div class="last-updated".*?<\/div>\s*)(.*?)(\s*<script>)/s,
            `$1\n    ${modernBodyContent}\n$3`
        );
        
        // Write with minimal delay
        fs.writeFileSync(previewPath, updatedPreview, 'utf8');
        
        const timestamp = new Date().toLocaleTimeString();
        const fileName = path.basename(jspPath);
        console.log(`⚡ [${timestamp}] ${fileName} synced in ${Date.now() - now}ms`);
        
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
console.log('🔧 Performing initial sync...');
syncJSPToPreview();

// Watch the entire JSPUnderConstruction folder
const watchPath = path.join(__dirname, 'JSPUnderConstruction', '*.jsp');
console.log(`👀 Watching: ${watchPath}`);

const watcher = chokidar.watch(watchPath, {
    ignored: /node_modules/,
    persistent: true,
    usePolling: true,
    interval: 100,
    binaryInterval: 200,
    atomic: false,
    ignoreInitial: true
});

// Minimal debouncing for maximum speed
let syncTimeout;

watcher.on('change', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`📝 ${fileName} changed`);
    
    // Ultra-fast debounce
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncJSPToPreview, 50);
});

watcher.on('add', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`📁 New JSP file added: ${fileName}`);
    console.log(`🔄 Auto-switching to new file...`);
    
    // Reset current file and sync to new one
    currentJSPFile = null;
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncJSPToPreview, 100);
});

watcher.on('unlink', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`🗑️  JSP file removed: ${fileName}`);
    
    // If the removed file was the current one, find another
    if (currentJSPFile && path.basename(currentJSPFile) === fileName) {
        console.log(`🔄 Current file removed, searching for other JSP files...`);
        currentJSPFile = null;
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(syncJSPToPreview, 200);
    }
});

watcher.on('ready', () => {
    console.log('🚀 UNIVERSAL JSP watcher ready!');
    console.log('');
    console.log('💡 How to use:');
    console.log('   1. Drop any .jsp file into JSPUnderConstruction/ folder');
    console.log('   2. Edit the JSP file');
    console.log('   3. See changes instantly in browser!');
    console.log('');
    console.log('⚡ Auto-sync enabled for any JSP file!');
});

watcher.on('error', (error) => {
    console.error('❌ Watcher error:', error);
});

// Graceful shutdown
const shutdown = () => {
    console.log('\n🛑 Stopping universal JSP watcher...');
    watcher.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);