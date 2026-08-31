async function fetchRemaining() {
  const pages = [
    { title: 'Arcane', url: 'https://www.themoviedb.org/tv/94605-arcane/images/backdrops' },
    { title: 'Succession', url: 'https://www.themoviedb.org/tv/76331-succession/images/backdrops' },
    { title: 'La La Land', url: 'https://www.themoviedb.org/movie/313369-la-la-land/images/backdrops' }
  ];

  for (const p of pages) {
    try {
      const res = await fetch(p.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await res.text();
      const images = Array.from(html.matchAll(/image\.tmdb\.org\/t\/p\/original\/([a-zA-Z0-9_]+\.jpg)/g)).map(m => m[1]);
      console.log(`\n${p.title} backdrops found:`, images.slice(0, 5));
    } catch (e) {
      console.error(p.title, e);
    }
  }
}

fetchRemaining();
