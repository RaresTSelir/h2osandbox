/**
 * Legacy HTML Attributes to Modern CSS Mapper
 * Converts old HTML attributes to inline CSS styles for modern browser compatibility
 */

class LegacyHTMLMapper {
    constructor() {
        // Comprehensive mapping table for legacy HTML attributes
        this.attributeMap = {
            // Table attributes
            'border': (value) => value === '0' ? 'border: none;' : `border: ${value}px solid;`,
            'cellspacing': (value) => `border-collapse: ${value === '0' ? 'collapse' : 'separate'}; border-spacing: ${value}px;`,
            'cellpadding': (value) => `padding: ${value}px;`,
            'bordercolor': (value) => `border-color: ${value};`,
            
            // Layout attributes
            'width': (value) => {
                if (value.includes('%')) return `width: ${value};`;
                return `width: ${value}px;`;
            },
            'height': (value) => {
                if (value.includes('%')) return `height: ${value};`;
                return `height: ${value}px;`;
            },
            
            // Alignment attributes
            'align': (value) => {
                const alignMap = {
                    'left': 'text-align: left;',
                    'center': 'text-align: center;',
                    'right': 'text-align: right;',
                    'justify': 'text-align: justify;',
                    'top': 'vertical-align: top;',
                    'middle': 'vertical-align: middle;',
                    'bottom': 'vertical-align: bottom;',
                    'absmiddle': 'vertical-align: middle;',
                    'absbottom': 'vertical-align: bottom;',
                    'baseline': 'vertical-align: baseline;'
                };
                return alignMap[value] || `text-align: ${value};`;
            },
            
            'valign': (value) => {
                const valignMap = {
                    'top': 'vertical-align: top;',
                    'middle': 'vertical-align: middle;',
                    'bottom': 'vertical-align: bottom;',
                    'baseline': 'vertical-align: baseline;'
                };
                return valignMap[value] || `vertical-align: ${value};`;
            },
            
            // Background attributes
            'bgcolor': (value) => `background-color: ${value};`,
            'background': (value) => `background-image: url(${value});`,
            
            // Spacing attributes for images
            'hspace': (value) => `margin-left: ${value}px; margin-right: ${value}px;`,
            'vspace': (value) => `margin-top: ${value}px; margin-bottom: ${value}px;`,
            
            // Table cell attributes
            'colspan': null, // Keep as is - CSS equivalent is complex
            'rowspan': null, // Keep as is - CSS equivalent is complex
            
            // Font attributes
            'color': (value) => `color: ${value};`,
            'face': (value) => `font-family: ${value};`,
            'size': (value) => {
                // Convert HTML font sizes to CSS
                const sizeMap = {
                    '1': '10px', '2': '13px', '3': '16px', 
                    '4': '18px', '5': '24px', '6': '32px', '7': '48px'
                };
                return `font-size: ${sizeMap[value] || value};`;
            },
            
            // Margin attributes
            'topmargin': (value) => `margin-top: ${value}px;`,
            'bottommargin': (value) => `margin-bottom: ${value}px;`,
            'leftmargin': (value) => `margin-left: ${value}px;`,
            'rightmargin': (value) => `margin-right: ${value}px;`,
            'marginwidth': (value) => `margin-left: ${value}px; margin-right: ${value}px;`,
            'marginheight': (value) => `margin-top: ${value}px; margin-bottom: ${value}px;`,
            
            // Scrolling and overflow
            'scrolling': (value) => {
                const scrollMap = {
                    'yes': 'overflow: auto;',
                    'no': 'overflow: hidden;',
                    'auto': 'overflow: auto;'
                };
                return scrollMap[value] || 'overflow: auto;';
            }
        };
        
        // Attributes that should be processed for table cells specifically
        this.tableCellAttributes = [];
        
        // Attributes that should be processed for table elements specifically  
        this.tableAttributes = ['border', 'cellspacing', 'bordercolor', 'cellpadding'];
    }
    
    /**
     * Convert legacy HTML attributes to CSS inline styles
     * @param {string} htmlContent - The HTML content to process
     * @returns {string} - HTML content with converted styles
     */
    convertLegacyAttributes(htmlContent) {
        // First pass: collect table cellpadding values for inheritance
        const tableCellPadding = this.extractTableCellPadding(htmlContent);
        
        // Process each HTML tag that might have legacy attributes
        return htmlContent.replace(/<(\w+)([^>]*)>/gi, (match, tagName, attributes) => {
            const processedAttributes = this.processAttributes(tagName.toLowerCase(), attributes, tableCellPadding);
            return `<${tagName}${processedAttributes}>`;
        });
    }
    
    /**
     * Extract cellpadding values from table elements for inheritance
     * @param {string} htmlContent - The HTML content
     * @returns {Map} - Map of table positions to cellpadding values
     */
    extractTableCellPadding(htmlContent) {
        const tablePadding = new Map();
        const tableRegex = /<table[^>]*cellpadding=(["']?)(\d+)\1[^>]*>/gi;
        let match;
        
        while ((match = tableRegex.exec(htmlContent)) !== null) {
            const paddingValue = match[2];
            // Store the position for potential inheritance (simplified approach)
            tablePadding.set('default', paddingValue);
        }
        
        return tablePadding;
    }
    
    /**
     * Process attributes for a specific tag
     * @param {string} tagName - The HTML tag name
     * @param {string} attributesString - The attributes string
     * @param {Map} tableCellPadding - Map of table cellpadding values
     * @returns {string} - Processed attributes string
     */
    processAttributes(tagName, attributesString, tableCellPadding = new Map()) {
        if (!attributesString.trim()) return attributesString;
        
        // Parse existing attributes
        const attributeRegex = /(\w+)=(["']?)([^"'\s>]*)\2/g;
        const attributes = {};
        const preservedAttributes = [];
        let match;
        
        // Extract all attributes
        while ((match = attributeRegex.exec(attributesString)) !== null) {
            const [fullMatch, attrName, quote, attrValue] = match;
            attributes[attrName.toLowerCase()] = {
                name: attrName,
                value: attrValue,
                quote: quote || '"',
                fullMatch: fullMatch
            };
        }
        
        // Extract existing style attribute
        let existingStyle = '';
        if (attributes.style) {
            existingStyle = attributes.style.value;
            if (!existingStyle.endsWith(';') && existingStyle.trim()) {
                existingStyle += ';';
            }
        }
        
        // Convert legacy attributes to CSS
        let newStyles = '';
        const attributesToRemove = [];
        
        for (const [attrName, attrData] of Object.entries(attributes)) {
            if (this.attributeMap.hasOwnProperty(attrName)) {
                const converter = this.attributeMap[attrName];
                
                // Skip attributes that should be preserved (like colspan, rowspan)
                if (converter === null) {
                    continue;
                }
                
                // Apply specific rules for table elements
                if (this.shouldProcessAttribute(tagName, attrName)) {
                    const cssStyle = converter(attrData.value);
                    if (cssStyle) {
                        newStyles += ' ' + cssStyle;
                        attributesToRemove.push(attrName);
                    }
                }
            }
        }
        
        // Handle special cases for table cellpadding inheritance
        if ((tagName === 'td' || tagName === 'th') && tableCellPadding.has('default')) {
            const padding = tableCellPadding.get('default');
            newStyles += ` padding: ${padding}px;`;
        }
        
        // Rebuild attributes string
        let result = attributesString;
        
        // Remove converted attributes
        attributesToRemove.forEach(attrName => {
            const attrData = attributes[attrName];
            result = result.replace(attrData.fullMatch, '');
        });
        
        // Add or update style attribute
        if (newStyles.trim()) {
            const combinedStyle = (existingStyle + newStyles).trim();
            
            if (attributes.style) {
                // Replace existing style - ensure proper semicolon handling
                const cleanStyle = combinedStyle.endsWith(';') ? combinedStyle : combinedStyle + ';';
                result = result.replace(
                    attributes.style.fullMatch,
                    `style="${cleanStyle}"`
                );
            } else {
                // Add new style attribute
                const cleanStyle = newStyles.trim();
                result = ` style="${cleanStyle}"` + result;
            }
        }
        
        return result;
    }
    
    /**
     * Determine if an attribute should be processed based on tag and context
     * @param {string} tagName - The HTML tag name
     * @param {string} attrName - The attribute name
     * @returns {boolean} - Whether to process this attribute
     */
    shouldProcessAttribute(tagName, attrName) {
        // Table-specific attributes
        if (this.tableAttributes.includes(attrName)) {
            return tagName === 'table';
        }
        
        // Cell-specific attributes
        if (this.tableCellAttributes.includes(attrName)) {
            return tagName === 'td' || tagName === 'th';
        }
        
        // General attributes can be applied to any element
        return true;
    }
    
    /**
     * Inherit table styles for cell elements (for cellpadding simulation)
     * @param {string} attributesString - Current attributes
     * @returns {string} - Additional CSS styles
     */
    inheritTableStyles(attributesString) {
        // This would be enhanced to look up parent table cellpadding
        // For now, return empty string as cellpadding is handled at table level
        return '';
    }
    
    /**
     * Process an entire HTML document
     * @param {string} htmlContent - Full HTML document
     * @returns {string} - Processed HTML document
     */
    processDocument(htmlContent) {
        console.log('🎨 Converting legacy HTML attributes to modern CSS...');
        
        const startTime = Date.now();
        const result = this.convertLegacyAttributes(htmlContent);
        const duration = Date.now() - startTime;
        
        console.log(`✨ Legacy HTML conversion completed in ${duration}ms`);
        
        return result;
    }
}

module.exports = LegacyHTMLMapper;