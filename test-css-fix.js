const LegacyHTMLMapper = require('./legacy-html-mapper');

const mapper = new LegacyHTMLMapper();
const testHTML = '<td colspan="2" class="VertSxBassa" style="color: red;">';

console.log('Testing CSS concatenation fix:');
console.log('Original:', testHTML);
console.log('Converted:', mapper.processDocument(testHTML));