import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\Subham\\.gemini\\antigravity\\brain\\960b0928-b0d6-4adb-9654-4a4205c07b26\\.system_generated\\steps\\560\\content.md', 'utf-8');

const matches = Array.from(content.matchAll(/src=["']([^"']+)["']/g)).map(m => m[1]);
console.log('Images found in Euphoria Wikipedia:', matches);
