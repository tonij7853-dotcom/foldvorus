async function testGatewayBypass() {
  const gatewayUrl = 'https://veelscp.com/gateway/?id=gw_1788162617941_il4rfl8';
  const gwMatch = gatewayUrl.match(/[?&]id=([^&#]+)/i);
  const gwId = gwMatch ? gwMatch[1] : '';

  const claimRes = await fetch('https://veelscp.com/api/scenepacks?action=claim-download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': gatewayUrl
    },
    body: JSON.stringify({ id: gwId, watchToken: 'reclaim' })
  });
  const claimData = await claimRes.json();
  console.log('Claimed file host URL:', claimData.url);

  // Now resolve metadata
  const pageRes = await fetch(claimData.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await pageRes.text();
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const sizeMatch = html.match(/(\d+(\.\d+)?\s*(GB|MB|KB))/i);
  console.log('Final Movie/Show:', titleMatch ? titleMatch[1] : 'Unknown');
  console.log('Final Size:', sizeMatch ? sizeMatch[1] : 'Unknown');
}
testGatewayBypass();
