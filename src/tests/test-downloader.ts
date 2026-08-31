async function testVeelFiles() {
  const url = 'https://files.veelscp.com/f/ab77eac4f7fc';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    console.log('Status:', res.status);
    console.log('HTML length:', html.length);
    // Find download buttons, direct links, or video streams in HTML
    const dlButtons = Array.from(html.matchAll(/href=["']([^"']+)["']/g)).map(m => m[1]);
    console.log('Links in page:', dlButtons.slice(0, 15));
    // Check if there is a direct api or download endpoint
    const forms = Array.from(html.matchAll(/<form[^>]*action=["']([^"']+)["']/g)).map(m => m[1]);
    console.log('Forms:', forms);
  } catch (e) {
    console.error(e);
  }
}
testVeelFiles();
