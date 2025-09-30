const LegacyHTMLMapper = require('./legacy-html-mapper');

// Test complex HTML structure with cellpadding inheritance
const mapper = new LegacyHTMLMapper();

console.log('🧪 Testing Complete HTML Structure with cellpadding inheritance\n');

const complexHTML = `
<table border="1" cellspacing="0" cellpadding="5" bordercolor="#CCCCCC" width="100%" align="center">
    <tr>
        <td class="titolotab" height="35" align="center">Header Cell</td>
        <td width="100" align="center" class="VertDxBassa">Second Cell</td>
    </tr>
    <tr>
        <td colspan="2" class="VertSxBassa" style="color: red;">Footer Cell</td>
    </tr>
</table>
`;

console.log('Original HTML:');
console.log(complexHTML);
console.log('\nConverted HTML:');
console.log(mapper.processDocument(complexHTML));

// Test individual elements from CensimentoEdit.jsp
console.log('\n📄 Testing actual CensimentoEdit.jsp elements:\n');

const jspElements = [
    '<table width="100%" align="center">',
    '<td class="OrizTitoloH2O" colspan="4" align="center">Censimento Esercenti</td>',
    '<table border="1" cellspacing="0" cellpadding="5" bordercolor="#CCCCCC" width="100%" align="center">',
    '<td class="titolotab" height="35" align="center">',
    '<img src="/img/h2o/triangolo.gif" width="25" height="22" hspace="10" align="absmiddle">',
    '<td width="100" align="center" class="VertDxBassa">'
];

jspElements.forEach((element, index) => {
    console.log(`JSP Element ${index + 1}:`);
    console.log('Original:', element);
    console.log('Converted:', mapper.processDocument(element));
    console.log('');
});

console.log('✅ All complex tests completed!');