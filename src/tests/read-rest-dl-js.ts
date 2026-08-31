async function readRestOfDownloadJs() {
  const url = 'https://files.veelscp.com/download.js';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  console.log(text.slice(1000, 3500));
}
readRestOfDownloadJs();
