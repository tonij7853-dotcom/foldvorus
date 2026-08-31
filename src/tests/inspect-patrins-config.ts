async function inspectDownloadEndpoint() {
  const url = 'https://files.veelscp.com/f/ab77eac4f7fc';
  // Let's check the HTML for PATRINS_DL configuration object
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const patrinsConfigMatch = html.match(/window\.PATRINS_DL\s*=\s*(\{[\s\S]*?\});/);
  if (patrinsConfigMatch) {
    console.log('PATRINS_DL Config:', patrinsConfigMatch[1]);
  } else {
    console.log('Searching for fileId or api in HTML:');
    const matches = Array.from(html.matchAll(/(fileId|apiBase|downloadUrl|tokenUrl|streamUrl)[\s"':]+([^"',\n]+)/gi)).map(m => `${m[1]}: ${m[2]}`);
    console.log(matches);
  }
}
inspectDownloadEndpoint();
