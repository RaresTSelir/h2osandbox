const EnhancedLegacyHTMLMapper = require('./enhanced-legacy-mapper');
const LegacyMapperTester = require('./test-enhanced-mapper');
const fs = require('fs');
const path = require('path');

/**
 * System Integration Test for Enhanced Legacy HTML Detection
 */
class SystemIntegrationTest {
    constructor() {
        this.results = {
            enhancedMapperTests: null,
            systemIntegration: null,
            performance: null
        };
    }
    
    async runCompleteTest() {
        console.log('🔬 Running Complete System Integration Test\n');
        console.log('═'.repeat(60));
        
        // 1. Test Enhanced Mapper
        await this.testEnhancedMapper();
        
        // 2. Test System Integration
        await this.testSystemIntegration();
        
        // 3. Performance Test
        await this.testPerformance();
        
        // 4. Generate Final Report
        this.generateFinalReport();
    }
    
    async testEnhancedMapper() {
        console.log('\n🧪 Phase 1: Enhanced Mapper Functionality');
        console.log('-'.repeat(40));
        
        try {
            const tester = new LegacyMapperTester();
            tester.runAllTests();
            
            this.results.enhancedMapperTests = {
                status: 'completed',
                details: tester.testResults
            };
            
        } catch (error) {
            console.error('❌ Enhanced Mapper Test Failed:', error.message);
            this.results.enhancedMapperTests = {
                status: 'failed',
                error: error.message
            };
        }
    }
    
    async testSystemIntegration() {
        console.log('\n🔧 Phase 2: System Integration Test');
        console.log('-'.repeat(40));
        
        const integrationResults = {
            universalWatcherIntegration: false,
            syncNowIntegration: false,
            fileProcessing: false,
            errorHandling: false
        };
        
        try {
            // Test if enhanced mapper is properly integrated
            const enhancedMapper = new EnhancedLegacyHTMLMapper();
            
            // Test basic functionality
            const testHTML = '<table border="1" cellspacing="0"><tr><td bgcolor="red">Test</td></tr></table>';
            const converted = enhancedMapper.processDocument(testHTML);
            const stats = enhancedMapper.getStatistics();
            
            if (stats.convertedElements > 0 && converted.includes('style=')) {
                integrationResults.fileProcessing = true;
                console.log('✅ Enhanced mapper processing: WORKING');
            } else {
                console.log('❌ Enhanced mapper processing: FAILED');
            }
            
            // Test error handling
            try {
                const invalidHTML = '<div><span>unclosed tags';
                const result = enhancedMapper.processDocument(invalidHTML);
                integrationResults.errorHandling = true;
                console.log('✅ Error handling: WORKING');
            } catch (error) {
                console.log('❌ Error handling: FAILED');
            }
            
            // Check if integration files exist and have correct imports
            const universalWatcherPath = path.join(__dirname, 'universal-jsp-watcher.js');
            const syncNowPath = path.join(__dirname, 'sync-now.js');
            
            if (fs.existsSync(universalWatcherPath)) {
                const content = fs.readFileSync(universalWatcherPath, 'utf8');
                if (content.includes('EnhancedLegacyHTMLMapper')) {
                    integrationResults.universalWatcherIntegration = true;
                    console.log('✅ Universal watcher integration: WORKING');
                } else {
                    console.log('❌ Universal watcher integration: NOT FOUND');
                }
            }
            
            if (fs.existsSync(syncNowPath)) {
                const content = fs.readFileSync(syncNowPath, 'utf8');
                if (content.includes('EnhancedLegacyHTMLMapper')) {
                    integrationResults.syncNowIntegration = true;
                    console.log('✅ Sync-now integration: WORKING');
                } else {
                    console.log('❌ Sync-now integration: NOT FOUND');
                }
            }
            
        } catch (error) {
            console.error('❌ System Integration Error:', error.message);
        }
        
        this.results.systemIntegration = integrationResults;
    }
    
    async testPerformance() {
        console.log('\n⚡ Phase 3: Performance Test');
        console.log('-'.repeat(40));
        
        const performanceResults = {
            smallFile: null,
            mediumFile: null,
            largeFile: null,
            memoryUsage: null
        };
        
        try {
            const enhancedMapper = new EnhancedLegacyHTMLMapper();
            
            // Small file test
            const smallHTML = '<table border="1"><tr><td bgcolor="red">Small</td></tr></table>';
            const smallStart = performance.now();
            enhancedMapper.processDocument(smallHTML);
            const smallEnd = performance.now();
            performanceResults.smallFile = `${(smallEnd - smallStart).toFixed(2)}ms`;
            
            // Medium file test
            const mediumHTML = this.generateTestHTML(100); // 100 elements
            const mediumStart = performance.now();
            enhancedMapper.processDocument(mediumHTML);
            const mediumEnd = performance.now();
            performanceResults.mediumFile = `${(mediumEnd - mediumStart).toFixed(2)}ms`;
            
            // Large file test
            const largeHTML = this.generateTestHTML(1000); // 1000 elements
            const largeStart = performance.now();
            enhancedMapper.processDocument(largeHTML);
            const largeEnd = performance.now();
            performanceResults.largeFile = `${(largeEnd - largeStart).toFixed(2)}ms`;
            
            // Memory usage
            const memUsage = process.memoryUsage();
            performanceResults.memoryUsage = `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`;
            
            console.log(`⚡ Small file (1 element): ${performanceResults.smallFile}`);
            console.log(`⚡ Medium file (100 elements): ${performanceResults.mediumFile}`);
            console.log(`⚡ Large file (1000 elements): ${performanceResults.largeFile}`);
            console.log(`💾 Memory usage: ${performanceResults.memoryUsage}`);
            
        } catch (error) {
            console.error('❌ Performance Test Error:', error.message);
        }
        
        this.results.performance = performanceResults;
    }
    
    generateTestHTML(elementCount) {
        let html = '<div>';
        
        for (let i = 0; i < elementCount; i++) {
            html += `<table border="1" cellspacing="${i % 5}" bgcolor="#ff${i.toString(16).padStart(4, '0')}">`;
            html += `<tr><td width="${100 + i}" align="center" valign="top">Element ${i}</td></tr>`;
            html += '</table>';
        }
        
        html += '</div>';
        return html;
    }
    
    generateFinalReport() {
        console.log('\n📊 Final Integration Test Report');
        console.log('═'.repeat(60));
        
        const report = {
            timestamp: new Date().toISOString(),
            testPhases: {
                enhancedMapper: this.results.enhancedMapperTests?.status || 'not run',
                systemIntegration: this.getIntegrationStatus(),
                performance: this.results.performance ? 'completed' : 'failed'
            },
            systemStatus: this.getOverallSystemStatus(),
            recommendations: this.generateRecommendations()
        };
        
        console.log('Test Results:');
        console.log(`  🧪 Enhanced Mapper: ${report.testPhases.enhancedMapper.toUpperCase()}`);
        console.log(`  🔧 System Integration: ${report.testPhases.systemIntegration.toUpperCase()}`);
        console.log(`  ⚡ Performance: ${report.testPhases.performance.toUpperCase()}`);
        console.log(`\\n🎯 Overall System Status: ${report.systemStatus.toUpperCase()}`);
        
        if (report.recommendations.length > 0) {
            console.log('\\n💡 Recommendations:');
            report.recommendations.forEach((rec, index) => {
                console.log(`  ${index + 1}. ${rec}`);
            });
        }
        
        // Save detailed report
        fs.writeFileSync(
            path.join(__dirname, 'integration-test-report.json'), 
            JSON.stringify(report, null, 2)
        );
        
        console.log('\\n📁 Detailed report saved to: integration-test-report.json');
        console.log('\\n🏁 Integration Test Complete!');
    }
    
    getIntegrationStatus() {
        const integration = this.results.systemIntegration;
        if (!integration) return 'failed';
        
        const totalChecks = Object.keys(integration).length;
        const passedChecks = Object.values(integration).filter(Boolean).length;
        
        if (passedChecks === totalChecks) return 'excellent';
        if (passedChecks >= totalChecks * 0.75) return 'good';
        if (passedChecks >= totalChecks * 0.5) return 'fair';
        return 'poor';
    }
    
    getOverallSystemStatus() {
        const mapper = this.results.enhancedMapperTests?.status;
        const integration = this.getIntegrationStatus();
        const performance = this.results.performance ? 'good' : 'failed';
        
        if (mapper === 'completed' && integration === 'excellent' && performance === 'good') {
            return 'excellent';
        } else if (mapper === 'completed' && integration !== 'poor') {
            return 'good';
        } else if (mapper === 'completed') {
            return 'fair';
        } else {
            return 'needs attention';
        }
    }
    
    generateRecommendations() {
        const recommendations = [];
        const integration = this.results.systemIntegration;
        
        if (integration && !integration.universalWatcherIntegration) {
            recommendations.push('Update universal-jsp-watcher.js to use EnhancedLegacyHTMLMapper');
        }
        
        if (integration && !integration.syncNowIntegration) {
            recommendations.push('Update sync-now.js to use EnhancedLegacyHTMLMapper');
        }
        
        if (integration && !integration.errorHandling) {
            recommendations.push('Improve error handling in enhanced mapper');
        }
        
        if (this.results.enhancedMapperTests?.status === 'failed') {
            recommendations.push('Fix enhanced mapper functionality issues');
        }
        
        return recommendations;
    }
}

// Run integration test if script is executed directly
if (require.main === module) {
    const systemTest = new SystemIntegrationTest();
    systemTest.runCompleteTest().catch(console.error);
}

module.exports = SystemIntegrationTest;