async function testGateway() {
  const url = 'https://veelscp.com/gateway/?id=gw_1788162617941_il4rfl8';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Gateway status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    // Find target destination in script / json
    const targetMatch = html.match(/https?:\/\/(files\.veelscp\.com\/f\/[a-zA-Z0-9]+|mega\.nz\/[^\s"']+|drive\.google\.com\/[^\s"']+)/i);
    console.log('Target Match:', targetMatch ? targetMatch[0] : 'None found');
    console.log(html.slice(0, 1500));
  } catch (e) {
    console.error(e);
  }
}
testGateway();
