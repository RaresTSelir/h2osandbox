const LegacyHTMLMapper = require('./legacy-html-mapper');

// Test the HTML mapper
const mapper = new LegacyHTMLMapper();

console.log('🧪 Testing Legacy HTML to CSS Mapper\n');

// Test cases
const testCases = [
    // Table with multiple legacy attributes
    '<table border="1" cellspacing="0" cellpadding="5" bordercolor="#CCCCCC" width="100%" align="center">',
    
    // TD with alignment and dimensions
    '<td class="titolotab" height="35" align="center">',
    
    // Image with spacing
    '<img src="/img/h2o/triangolo.gif" width="25" height="22" hspace="10" align="absmiddle">',
    
    // Table with existing styles
    '<td colspan="2" class="VertSxBassa" style="color: red;">',
    
    // Simple width and align
    '<td width="100" align="center" class="VertDxBassa">'
];

testCases.forEach((testHTML, index) => {
    console.log(`Test ${index + 1}:`);
    console.log('Original:', testHTML);
    console.log('Converted:', mapper.processDocument(testHTML));
    console.log('');
});

console.log('✅ All tests completed!');