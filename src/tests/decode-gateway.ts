async function decodeGatewayScript() {
  const url = 'https://veelscp.com/gateway/?id=gw_1788162617941_il4rfl8';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  // Find script tags at the bottom
  const scripts = Array.from(html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)).map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('gateway') || s.includes('target') || s.includes('destination') || s.includes('redirect') || s.includes('timer') || s.includes('id=')) {
      console.log('--- Gateway Script Snippet ---');
      console.log(s.slice(0, 1500));
    }
  }
}
decodeGatewayScript();
