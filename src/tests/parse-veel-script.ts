import fs from 'fs';

async function parseVeelDownload() {
  const url = 'https://files.veelscp.com/f/ab77eac4f7fc';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  // Extract script tags or embedded JSON
  const scripts = Array.from(html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)).map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('download') || s.includes('file') || s.includes('token') || s.includes('stream') || s.includes('api')) {
      console.log('--- Script snippet ---');
      console.log(s.slice(0, 500));
    }
  }
}
parseVeelDownload();
