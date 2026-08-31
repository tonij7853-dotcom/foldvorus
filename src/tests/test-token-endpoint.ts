async function testTokenEndpoint() {
  const fileId = 'ab77eac4f7fc';
  try {
    const res = await fetch(`https://files.veelscp.com/api/download/${fileId}/token`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://files.veelscp.com/f/${fileId}`,
        'Origin': 'https://files.veelscp.com',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);
  } catch (e) {
    console.error(e);
  }
}
testTokenEndpoint();
