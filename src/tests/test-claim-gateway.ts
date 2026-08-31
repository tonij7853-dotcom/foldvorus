async function testClaimGateway() {
  const downloadId = 'gw_1788162617941_il4rfl8';
  try {
    const res = await fetch('https://veelscp.com/api/scenepacks?action=claim-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://veelscp.com/gateway/?id=${downloadId}`
      },
      body: JSON.stringify({ id: downloadId, watchToken: 'reclaim' })
    });
    console.log('Claim status:', res.status);
    const data = await res.json();
    console.log('Claim response data:', data);
  } catch (e) {
    console.error(e);
  }
}
testClaimGateway();
