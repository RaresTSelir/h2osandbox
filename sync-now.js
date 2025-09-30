const fs = require('fs');
const path = require('path');
const LegacyHTMLMapper = require('./legacy-html-mapper');
const EnhancedLegacyHTMLMapper = require('./enhanced-legacy-mapper');

console.log('🔄 Syncing JSP changes to preview with enhanced legacy HTML conversion...');

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
    }
    
    return path.join(jspFolder, jspFiles[0]);
}

try {
    // Initialize the legacy HTML mapper
    const htmlMapper = new LegacyHTMLMapper();
    
    // Find JSP file
    const jspPath = findJSPFile();
    if (!jspPath) {
        console.log('❌ No JSP file to sync');
        process.exit(1);
    }
    
    const fileName = path.basename(jspPath);
    console.log(`📄 Syncing: ${fileName}`);
    
    // Read JSP file
    const jspContent = fs.readFileSync(jspPath, 'utf8');
    
    // Extract body content from JSP
    const bodyMatch = jspContent.match(/<body[^>]*>(.*?)<\/body>/s);
    let bodyContent = '<h1>No body content found</h1>';
    
    if (bodyMatch) {
        bodyContent = bodyMatch[1].trim();
        // Convert legacy HTML attributes to modern CSS with Enhanced Mapper
        const enhancedMapper = new EnhancedLegacyHTMLMapper();
        bodyContent = enhancedMapper.processDocument(bodyContent);
        
        // Show conversion statistics
        const stats = enhancedMapper.getStatistics();
        if (stats.convertedElements > 0) {
            console.log(`🎨 Enhanced conversion: ${stats.convertedElements}/${stats.totalElements} elements (${stats.conversionRate}%)`);
            console.log(`📊 Detected: ${stats.detectedAttributes.join(', ')}`);
        }
    }
    
    // Extract title if present
    const titleMatch = jspContent.match(/<title[^>]*>(.*?)<\/title>/s);
    const title = titleMatch ? titleMatch[1].trim() : 'JSP Development Preview';
    
    // Read preview.html
    let previewContent = fs.readFileSync('preview.html', 'utf8');
    
    // Update title
    previewContent = previewContent.replace(
        /<title[^>]*>.*?<\/title>/s,
        `<title>${title}</title>`
    );
    
    // Update the body content in preview.html
    previewContent = previewContent.replace(
        /<div class="last-updated".*?<\/div>\s*(.*?)<script>/s,
        `<div class="last-updated" id="lastUpdated">
        Last updated: <span id="timestamp" style="transition: opacity 0.3s ease;"></span>
    </div>
    
    ${bodyContent}

    <script>`
    );
    
    // Write updated content
    fs.writeFileSync('preview.html', previewContent, 'utf8');
    
    console.log('✅ Successfully synced JSP changes to preview!');
    console.log(`📝 Synced: ${fileName} → preview.html`);
    console.log(`🎯 Title: ${title}`);
    
} catch (error) {
    console.error('❌ Error syncing:', error.message);
    process.exit(1);
}