async function findDownloadButton() {
  const url = 'https://files.veelscp.com/f/ab77eac4f7fc';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const index = html.indexOf('Download File');
  if (index !== -1) {
    console.log(html.substring(Math.max(0, index - 400), index + 600));
  }
}
findDownloadButton();
