const fs = require('fs');

const filePath = 'src/components/hr/HRPayroll.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<button') && !line.includes('title=') && !line.includes('aria-label=')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
    if (line.includes('<input') && !line.includes('title=') && !line.includes('aria-label=')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
    if (line.includes('<select') && !line.includes('title=') && !line.includes('aria-label=')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
}
