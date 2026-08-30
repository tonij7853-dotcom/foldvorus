async function inspectLiveSites() {
  const sites = [
    { name: '411 Scenepacks', url: 'https://scenepacks.com' },
    { name: 'Veel Scenepacks', url: 'https://veelscp.com' },
    { name: 'EditPacks', url: 'https://editpacks.org' },
    { name: 'SuitsTM', url: 'https://suitstmscenepacks.com' },
  ];

  for (const site of sites) {
    console.log(`\n========================================`);
    console.log(`🔍 Inspecting: ${site.name} (${site.url})`);
    console.log(`========================================`);
    try {
      const res = await fetch(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      const html = await res.text();
      console.log(`HTTP Status: ${res.status}`);
      console.log(`HTML Length: ${Math.round(html.length / 1024)} KB`);

      // Title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      console.log(`Title: ${titleMatch ? titleMatch[1].trim() : 'N/A'}`);

      // Meta Description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      console.log(`Description: ${descMatch ? descMatch[1].trim() : 'N/A'}`);

      // Extract headings & popular texts
      const headings = Array.from(html.matchAll(/<h[1-4][^>]*>([^<]+)<\/h[1-4]>/gi)).map(m => m[1].trim()).filter(Boolean);
      console.log(`Key Headings:`, headings.slice(0, 10));

      // Extract pack / card titles or links
      const links = Array.from(html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
        .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
        .filter(l => l.text.length > 3 && !l.text.includes('Sign') && !l.text.includes('Log') && !l.text.includes('Cookie'));

      console.log(`Sample Navigation/Packs found (${links.length} total):`);
      links.slice(0, 12).forEach(l => console.log(`  • [${l.text}] -> ${l.href}`));

      // Check text snippets mentioning actual movie/TV show titles
      const commonTitles = ['Euphoria', 'Batman', 'Stranger Things', 'Spider-Man', 'Succession', 'Interstellar', 'Breaking Bad', 'The Last of Us', 'Wednesday', 'Oppenheimer', 'Dune', 'Arcane', 'Peaky Blinders', 'Top Gun', 'Whiplash', 'Fight Club', 'American Psycho', 'Loki', 'The Boys'];
      const foundTitles = commonTitles.filter(t => new RegExp(t, 'i').test(html));
      console.log(`Mentioned Popular Franchises in HTML:`, foundTitles);

    } catch (e) {
      console.error(`Error fetching ${site.name}:`, e);
    }
  }
}

inspectLiveSites();
