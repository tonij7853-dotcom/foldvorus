async function findScriptSrcs() {
  const url = 'https://files.veelscp.com/f/ab77eac4f7fc';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const srcs = Array.from(html.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)).map(m => m[1]);
  console.log('Script srcs:', srcs);
}
findScriptSrcs();
