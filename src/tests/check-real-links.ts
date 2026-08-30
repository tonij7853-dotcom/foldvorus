async function checkRealLinks() {
  console.log('--- 411 Scenepacks ---');
  try {
    const res = await fetch('https://scenepacks.com');
    const html = await res.text();
    const matches = Array.from(html.matchAll(/href=["']([^"']+)["']/g)).map(m => m[1]);
    console.log('Found links:', matches.slice(0, 15));
  } catch (e) {
    console.error('411 Error:', e);
  }

  console.log('\n--- Veel Scenepacks ---');
  try {
    const res = await fetch('https://veelscp.com');
    const html = await res.text();
    const matches = Array.from(html.matchAll(/href=["']([^"']+)["']/g)).map(m => m[1]);
    console.log('Found links:', matches.slice(0, 15));
  } catch (e) {
    console.error('Veel Error:', e);
  }
}

checkRealLinks();
