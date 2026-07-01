import * as fs from 'node:fs';
import * as path from 'node:path';

const htmlPath = process.argv[2];
const fragmentPath = process.argv[3];
if (!htmlPath || !fragmentPath) {
  console.error('Usage: node splice-html-content.mjs <html-file> <fragment-file>');
  process.exit(1);
}

const content = fs.readFileSync(htmlPath, 'utf8');
const newBody = fs.readFileSync(fragmentPath, 'utf8');
const startMarker = process.argv[4] || '<!-- ==================== 文档内容 ==================== -->';
const endMarker = process.argv[5] || '<!-- ==================== 示例内容结束 ==================== -->';
const start = content.indexOf(startMarker);
const end = content.indexOf(endMarker);
if (start < 0 || end < 0) {
  console.error('Content markers not found');
  process.exit(1);
}

const mermaidBlock = `
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.mermaid').forEach(function(el) {
        el.dataset.originalCode = el.textContent;
      });
      if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'base',
          themeVariables: {
            fontSize: '14px',
            primaryColor: '#DBEAFE',
            primaryTextColor: '#1E3A8A',
            primaryBorderColor: '#2563EB',
            lineColor: '#64748B',
            secondaryColor: '#FFEDD5',
            tertiaryColor: '#FEE2E2'
          },
          flowchart: { htmlLabels: true, curve: 'basis', useMaxWidth: true },
          securityLevel: 'loose'
        });
      }
    });
    </script>
`;

let out = content.slice(0, start) + newBody + '\n\n            ' + content.slice(end);
if (!out.includes('mermaid.min.js')) {
  out = out.replace('    <script>\n        (function() {', `${mermaidBlock}\n    <script>\n        (function() {`);
}
fs.writeFileSync(htmlPath, out, 'utf8');
console.log(`Assembled: ${htmlPath}`);
