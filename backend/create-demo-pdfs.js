const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'uploads');
fs.mkdirSync(baseDir, { recursive: true });

const escapePdfText = (value) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const makePdf = (title) => {
    const content = `BT /F1 18 Tf 72 720 Td (${escapePdfText(title)}) Tj ET`;
    const contentBuffer = Buffer.from(content, 'latin1');

    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
        `<< /Length ${contentBuffer.length} >>\nstream\n${content}\nendstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    for (let i = 0; i < objects.length; i += 1) {
        offsets.push(pdf.length);
        pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i += 1) {
        pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.from(pdf, 'latin1');
};

const files = {
    'don-xac-nhan-sinh-vien.pdf': 'Don xac nhan sinh vien',
    'don-xin-hoan-hoc.pdf': 'Don xin hoan hoc',
    'giay-xac-nhan-hoc-tap.pdf': 'Giay xac nhan hoc tap',
};

for (const [name, title] of Object.entries(files)) {
    fs.writeFileSync(path.join(baseDir, name), makePdf(title));
}

console.log('Created demo PDFs:', Object.keys(files).join(', '));
console.log('Files in uploads:', fs.readdirSync(baseDir).filter((file) => file.endsWith('.pdf')).join(', '));
