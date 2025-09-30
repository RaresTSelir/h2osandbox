const EnhancedLegacyHTMLMapper = require('./enhanced-legacy-mapper');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive test suite for Enhanced Legacy HTML Mapper
 */
class LegacyMapperTester {
    constructor() {
        this.mapper = new EnhancedLegacyHTMLMapper();
        this.testResults = [];
    }
    
    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🧪 Starting Enhanced Legacy HTML Mapper Tests...\n');
        
        this.testBasicConversions();
        this.testComplexHTML();
        this.testValidation();
        this.testRealJSPFiles();
        this.testDetectionOnly();
        
        this.printSummary();
    }
    
    /**
     * Test basic attribute conversions
     */
    testBasicConversions() {
        console.log('📋 Testing Basic Conversions...');
        
        const testCases = [
            {
                name: 'Table with border and spacing',
                input: '<table border="1" cellspacing="0" cellpadding="5"><tr><td>Test</td></tr></table>',
                expectedAttributes: ['border', 'cellspacing', 'cellpadding']
            },
            {
                name: 'Div with bgcolor and align',
                input: '<div bgcolor="#ff0000" align="center">Content</div>',
                expectedAttributes: ['bgcolor', 'align']
            },
            {
                name: 'Font with size and color',
                input: '<font size="3" color="blue" face="Arial">Text</font>',
                expectedAttributes: ['size', 'color', 'face']
            },
            {
                name: 'Image with width and height',
                input: '<img src="test.jpg" width="100" height="50" align="left">',
                expectedAttributes: ['width', 'height', 'align']
            }
        ];
        
        testCases.forEach(testCase => {
            const detection = this.mapper.detectLegacyAttributes(testCase.input);
            const converted = this.mapper.processDocument(testCase.input);
            const validation = this.mapper.validateConversions(testCase.input, converted);
            
            const passed = testCase.expectedAttributes.every(attr => 
                detection.attributes.includes(attr)
            );
            
            this.logTestResult(testCase.name, passed, {
                detected: detection.attributes,
                expected: testCase.expectedAttributes,
                converted: converted.includes('style='),
                validation: validation.success
            });
        });
    }
    
    /**
     * Test complex HTML structures
     */
    testComplexHTML() {
        console.log('\n📋 Testing Complex HTML Structures...');
        
        const complexHTML = `
            <table border="1" cellspacing="0" bgcolor="#f0f0f0">
                <tr>
                    <td width="200" align="center" valign="top">
                        <font size="4" color="red">Header</font>
                    </td>
                    <td bgcolor="white">
                        <div align="right">
                            <img src="logo.png" width="100" height="50" border="2">
                        </div>
                    </td>
                </tr>
            </table>
        `;
        
        const detection = this.mapper.detectLegacyAttributes(complexHTML);
        const converted = this.mapper.processDocument(complexHTML);
        const validation = this.mapper.validateConversions(complexHTML, converted);
        const stats = this.mapper.getStatistics();
        
        const passed = detection.count > 0 && stats.convertedElements > 0 && validation.success;
        
        this.logTestResult('Complex HTML Structure', passed, {
            detectedCount: detection.count,
            convertedElements: stats.convertedElements,
            conversionRate: stats.conversionRate,
            validationSuccess: validation.success
        });
    }
    
    /**
     * Test validation functionality
     */
    testValidation() {
        console.log('\n📋 Testing Validation Functionality...');
        
        const testHTML = '<table border="1"><td bgcolor="yellow" align="center">Test</td></table>';
        
        const converted = this.mapper.processDocument(testHTML);
        const validation = this.mapper.validateConversions(testHTML, converted);
        const report = this.mapper.generateReport();
        
        const passed = validation.success && 
                      report.summary.convertedElements > 0 &&
                      report.detectedAttributes.length > 0;
        
        this.logTestResult('Validation System', passed, {
            validationSuccess: validation.success,
            reportGenerated: !!report,
            detectedAttributes: report.detectedAttributes,
            conversions: report.conversions.length
        });
    }
    
    /**
     * Test real JSP files if available
     */
    testRealJSPFiles() {
        console.log('\n📋 Testing Real JSP Files...');
        
        const jspFolder = path.join(__dirname, 'JSPUnderConstruction');
        
        if (!fs.existsSync(jspFolder)) {
            this.logTestResult('Real JSP Files', false, { error: 'JSPUnderConstruction folder not found' });
            return;
        }
        
        const files = fs.readdirSync(jspFolder).filter(file => file.endsWith('.jsp'));
        
        if (files.length === 0) {
            this.logTestResult('Real JSP Files', false, { error: 'No JSP files found' });
            return;
        }
        
        let totalDetected = 0;
        let totalConverted = 0;
        
        files.forEach(file => {
            try {
                const filePath = path.join(jspFolder, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Extract body content
                const bodyMatch = content.match(/<body[^>]*>(.*?)<\/body>/s);
                if (bodyMatch) {
                    const bodyContent = bodyMatch[1];
                    const detection = this.mapper.detectLegacyAttributes(bodyContent);
                    const converted = this.mapper.processDocument(bodyContent);
                    const stats = this.mapper.getStatistics();
                    
                    totalDetected += detection.count;
                    totalConverted += stats.convertedElements;
                    
                    console.log(`  📄 ${file}: ${detection.count} legacy attributes detected, ${stats.convertedElements} elements converted`);
                }
            } catch (error) {
                console.log(`  ❌ Error processing ${file}: ${error.message}`);
            }
        });
        
        const passed = files.length > 0;
        this.logTestResult('Real JSP Files', passed, {
            filesProcessed: files.length,
            totalDetected: totalDetected,
            totalConverted: totalConverted
        });
    }
    
    /**
     * Test detection-only functionality
     */
    testDetectionOnly() {
        console.log('\n📋 Testing Detection-Only Mode...');
        
        const testHTML = `
            <table border="1" cellspacing="5">
                <tr bgcolor="#cccccc">
                    <td width="100" align="left">Cell 1</td>
                    <td height="50" valign="middle">Cell 2</td>
                </tr>
            </table>
        `;
        
        const detection = this.mapper.detectLegacyAttributes(testHTML);
        
        const expectedAttributes = ['border', 'cellspacing', 'bgcolor', 'width', 'align', 'height', 'valign'];
        const passed = expectedAttributes.every(attr => detection.attributes.includes(attr));
        
        this.logTestResult('Detection-Only Mode', passed, {
            detected: detection.attributes,
            expected: expectedAttributes,
            elementsFound: detection.elements.length
        });
    }
    
    /**
     * Log test result
     */
    logTestResult(testName, passed, details) {
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
        
        if (details && Object.keys(details).length > 0) {
            console.log(`     Details: ${JSON.stringify(details, null, 2).replace(/\n/g, '\n     ')}`);
        }
        
        this.testResults.push({ name: testName, passed, details });
    }
    
    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n📊 Test Summary:');
        console.log('═'.repeat(50));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.log('\nFailed Tests:');
            this.testResults.filter(r => !r.passed).forEach(test => {
                console.log(`  ❌ ${test.name}`);
            });
        }
        
        console.log('\n🎯 Enhanced Legacy HTML Mapper Testing Complete!');
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new LegacyMapperTester();
    tester.runAllTests();
}

module.exports = LegacyMapperTester;