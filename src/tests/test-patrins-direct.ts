async function testPatrinsDirect() {
  const fileId = 'ab77eac4f7fc';
  const tokenRes = await fetch(`https://files.veelscp.com/api/download/${fileId}/token`, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': `https://files.veelscp.com/f/${fileId}`,
      'Origin': 'https://files.veelscp.com',
      'Accept': 'application/json'
    }
  });
  const data = await tokenRes.json();
  console.log('Token data:', data);
  if (data.downloadUrl) {
    try {
      const dlRes = await fetch(data.downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://files.veelscp.com/f/${fileId}`,
        }
      });
      console.log('Download Stream status:', dlRes.status);
      console.log('Content-Type:', dlRes.headers.get('content-type'));
      console.log('Content-Length:', dlRes.headers.get('content-length'));
    } catch (e: any) {
      console.error('DL error:', e.message);
    }
  }
}
testPatrinsDirect();
