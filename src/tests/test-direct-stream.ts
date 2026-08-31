import http from 'http';
import https from 'https';

async function testDirectStream() {
  const fileId = 'f64e4bdf0136';
  // Get token
  const tokenRes = await fetch(`https://files.veelscp.com/api/download/${fileId}/token`, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': `https://files.veelscp.com/f/${fileId}`,
      'Origin': 'https://files.veelscp.com',
      'Accept': 'application/json'
    }
  });
  const tokenData = await tokenRes.json();
  console.log('Token data:', tokenData);
  
  if (tokenData && tokenData.downloadUrl) {
    const parsed = new URL(tokenData.downloadUrl);
    console.log('Host:', parsed.host, 'Path:', parsed.pathname);
    
    // Test native https request with full browser headers
    const req = https.request({
      hostname: parsed.host,
      path: parsed.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://files.veelscp.com/f/${fileId}`,
        'Accept': '*/*',
        'Connection': 'keep-alive'
      }
    }, (res) => {
      console.log('HTTPS Status:', res.statusCode);
      console.log('HTTPS Headers:', res.headers);
      let bytes = 0;
      res.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > 1000000) {
          console.log(`Successfully received ${bytes} bytes of raw MP4 video!`);
          req.destroy();
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('HTTPS Error:', err.message);
    });
    
    req.end();
  }
}
testDirectStream();
