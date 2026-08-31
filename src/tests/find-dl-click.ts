async function findDownloadClick() {
  const url = 'https://veelscp.com/gateway/?id=gw_1788162617941_il4rfl8';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const index = html.indexOf("downloadBtn.addEventListener('click'");
  if (index !== -1) {
    console.log(html.substring(index, index + 2500));
  }
}
findDownloadClick();
