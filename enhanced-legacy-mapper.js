const cheerio = require('cheerio');

/**
 * Enhanced Legacy HTML Mapper with Cheerio validation
 * Provides robust detection, conversion, and validation of legacy HTML attributes
 */
class EnhancedLegacyHTMLMapper {
    constructor() {
        // Legacy attribute mappings
        this.attributeMap = {
            // Table attributes
            'border': (value) => `border: ${value}px solid #ddd`,
            'cellspacing': (value) => `border-spacing: ${value}px`,
            'cellpadding': (value) => `padding: ${value}px`,
            'bgcolor': (value) => `background-color: ${value}`,
            'background': (value) => `background-image: url(${value})`,
            
            // Layout attributes
            'align': (value) => {
                const alignMap = {
                    'left': 'text-align: left',
                    'center': 'text-align: center', 
                    'right': 'text-align: right',
                    'justify': 'text-align: justify'
                };
                return alignMap[value.toLowerCase()] || `text-align: ${value}`;
            },
            'valign': (value) => {
                const valignMap = {
                    'top': 'vertical-align: top',
                    'middle': 'vertical-align: middle',
                    'bottom': 'vertical-align: bottom',
                    'baseline': 'vertical-align: baseline'
                };
                return valignMap[value.toLowerCase()] || `vertical-align: ${value}`;
            },
            
            // Dimension attributes
            'width': (value) => {
                return value.includes('%') || value.includes('px') 
                    ? `width: ${value}` 
                    : `width: ${value}px`;
            },
            'height': (value) => {
                return value.includes('%') || value.includes('px') 
                    ? `height: ${value}` 
                    : `height: ${value}px`;
            },
            
            // Font attributes
            'color': (value) => `color: ${value}`,
            'face': (value) => `font-family: ${value}`,
            'size': (value) => {
                const sizeMap = {
                    '1': '10px', '2': '13px', '3': '16px',
                    '4': '18px', '5': '24px', '6': '32px', '7': '48px'
                };
                return `font-size: ${sizeMap[value] || value + 'px'}`;
            }
        };
        
        // Statistics tracking
        this.stats = {
            totalElements: 0,
            convertedElements: 0,
            detectedAttributes: new Set(),
            conversions: []
        };
    }
    
    /**
     * Process HTML document with Cheerio validation
     */
    processDocument(htmlContent) {
        try {
            const $ = cheerio.load(htmlContent, {
                xmlMode: false,
                decodeEntities: false,
                lowerCaseAttributeNames: false
            });
            
            this.resetStats();
            
            // Process all elements
            $('*').each((index, element) => {
                this.stats.totalElements++;
                this.processElement($, element);
            });
            
            return $.html();
            
        } catch (error) {
            console.error('❌ Enhanced HTML processing error:', error.message);
            return htmlContent; // Fallback to original
        }
    }
    
    /**
     * Process individual element
     */
    processElement($, element) {
        const $element = $(element);
        const tagName = element.tagName;
        const attributes = element.attribs || {};
        
        let hasLegacyAttributes = false;
        let styleProperties = [];
        
        // Check for existing style attribute
        const existingStyle = $element.attr('style') || '';
        
        // Process each attribute
        Object.keys(attributes).forEach(attr => {
            const value = attributes[attr];
            
            if (this.attributeMap[attr]) {
                // Convert legacy attribute
                const cssProperty = this.attributeMap[attr](value);
                styleProperties.push(cssProperty);
                
                // Track conversion
                this.stats.detectedAttributes.add(attr);
                this.stats.conversions.push({
                    element: tagName,
                    attribute: attr,
                    value: value,
                    css: cssProperty
                });
                
                // Remove legacy attribute
                $element.removeAttr(attr);
                hasLegacyAttributes = true;
            }
        });
        
        // Apply converted styles
        if (hasLegacyAttributes) {
            const newStyle = this.combineStyles(existingStyle, styleProperties);
            $element.attr('style', newStyle);
            this.stats.convertedElements++;
        }
    }
    
    /**
     * Combine existing styles with new CSS properties
     */
    combineStyles(existingStyle, newProperties) {
        const existing = existingStyle.trim();
        const newProps = newProperties.join('; ');
        
        if (!existing) return newProps;
        if (!newProps) return existing;
        
        // Ensure proper semicolon separation
        const separator = existing.endsWith(';') ? ' ' : '; ';
        return existing + separator + newProps;
    }
    
    /**
     * Validate conversion results
     */
    validateConversions(originalHtml, convertedHtml) {
        const validation = {
            success: true,
            errors: [],
            warnings: [],
            statistics: this.getStatistics()
        };
        
        try {
            const $original = cheerio.load(originalHtml);
            const $converted = cheerio.load(convertedHtml);
            
            // Check if all legacy attributes were removed
            const legacyAttrs = Object.keys(this.attributeMap);
            
            $converted('*').each((index, element) => {
                const attributes = Object.keys(element.attribs || {});
                
                legacyAttrs.forEach(legacyAttr => {
                    if (attributes.includes(legacyAttr)) {
                        validation.warnings.push(
                            `Legacy attribute '${legacyAttr}' still present in ${element.tagName}`
                        );
                    }
                });
            });
            
            // Check if styles were properly applied
            const elementsWithStyle = $converted('[style]').length;
            if (this.stats.convertedElements > elementsWithStyle) {
                validation.warnings.push(
                    `Some converted elements may be missing style attributes`
                );
            }
            
        } catch (error) {
            validation.success = false;
            validation.errors.push(`Validation error: ${error.message}`);
        }
        
        return validation;
    }
    
    /**
     * Detect legacy attributes without converting
     */
    detectLegacyAttributes(htmlContent) {
        const detectedAttributes = new Set();
        const elements = [];
        
        try {
            const $ = cheerio.load(htmlContent);
            
            $('*').each((index, element) => {
                const $element = $(element);
                const tagName = element.tagName;
                const attributes = element.attribs || {};
                
                Object.keys(attributes).forEach(attr => {
                    if (this.attributeMap[attr]) {
                        detectedAttributes.add(attr);
                        elements.push({
                            tag: tagName,
                            attribute: attr,
                            value: attributes[attr],
                            index: index
                        });
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Detection error:', error.message);
        }
        
        return {
            attributes: Array.from(detectedAttributes),
            elements: elements,
            count: elements.length
        };
    }
    
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalElements: 0,
            convertedElements: 0,
            detectedAttributes: new Set(),
            conversions: []
        };
    }
    
    /**
     * Get processing statistics
     */
    getStatistics() {
        return {
            totalElements: this.stats.totalElements,
            convertedElements: this.stats.convertedElements,
            conversionRate: this.stats.totalElements > 0 
                ? (this.stats.convertedElements / this.stats.totalElements * 100).toFixed(1)
                : 0,
            detectedAttributes: Array.from(this.stats.detectedAttributes),
            conversions: this.stats.conversions
        };
    }
    
    /**
     * Generate detailed report
     */
    generateReport() {
        const stats = this.getStatistics();
        
        const report = {
            summary: {
                totalElements: stats.totalElements,
                convertedElements: stats.convertedElements,
                conversionRate: `${stats.conversionRate}%`,
                detectedAttributes: stats.detectedAttributes.length
            },
            detectedAttributes: stats.detectedAttributes,
            conversions: stats.conversions,
            timestamp: new Date().toISOString()
        };
        
        return report;
    }
}

module.exports = EnhancedLegacyHTMLMapper;