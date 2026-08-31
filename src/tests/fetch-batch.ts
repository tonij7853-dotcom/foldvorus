async function fetchBackdropsBatch() {
  const list = [
    { name: 'American Psycho', url: 'https://www.themoviedb.org/movie/1359-american-psycho/images/backdrops' },
    { name: 'Wednesday', url: 'https://www.themoviedb.org/tv/119051-wednesday/images/backdrops' },
    { name: 'Cyberpunk', url: 'https://www.themoviedb.org/tv/105248-cyberpunk-edgerunners/images/backdrops' },
    { name: 'Drive', url: 'https://www.themoviedb.org/movie/64690-drive/images/backdrops' },
    { name: 'House of the Dragon', url: 'https://www.themoviedb.org/tv/94997-house-of-the-dragon/images/backdrops' },
    { name: 'Jujutsu Kaisen', url: 'https://www.themoviedb.org/tv/95479-jujutsu-kaisen/images/backdrops' },
    { name: 'Better Call Saul', url: 'https://www.themoviedb.org/tv/60059-better-call-saul/images/backdrops' },
    { name: 'Top Gun Maverick', url: 'https://www.themoviedb.org/movie/361743-top-gun-maverick/images/backdrops' },
    { name: 'Death Note', url: 'https://www.themoviedb.org/tv/13916-death-note/images/backdrops' },
    { name: 'Chainsaw Man', url: 'https://www.themoviedb.org/tv/114410-chainsaw-man/images/backdrops' },
    { name: 'Game of Thrones', url: 'https://www.themoviedb.org/tv/1399-game-of-thrones/images/backdrops' }
  ];

  for (const item of list) {
    try {
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const matches = Array.from(html.matchAll(/image\.tmdb\.org\/t\/p\/original\/([a-zA-Z0-9_]+\.jpg)/g)).map(m => m[1]);
      if (matches.length > 0) {
        console.log(`${item.name}: https://image.tmdb.org/t/p/w780/${matches[0]}`);
      } else {
        console.log(`${item.name}: none found`);
      }
    } catch (e) {
      console.error(item.name, e);
    }
  }
}

fetchBackdropsBatch();
