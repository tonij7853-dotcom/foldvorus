import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\Subham\\.gemini\\antigravity\\brain\\960b0928-b0d6-4adb-9654-4a4205c07b26\\.system_generated\\steps\\590\\content.md', 'utf-8');

const matches = Array.from(content.matchAll(/image\.tmdb\.org\/t\/p\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/g)).map(m => m[0]);
console.log('Euphoria TMDB images:', matches);
