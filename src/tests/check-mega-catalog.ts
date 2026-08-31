async function checkMegaCatalog() {
  const images = [
    // American Psycho
    'https://image.tmdb.org/t/p/w780/93pmt92nUj4iP5X0z6kO7vK9A5F.jpg',
    // Joker
    'https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    'https://image.tmdb.org/t/p/w780/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    // Wednesday
    'https://image.tmdb.org/t/p/w780/9PFonQ921SHAZvQgNWOC0ne8Xc6.jpg',
    // Attack on Titan
    'https://image.tmdb.org/t/p/w780/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    // Jujutsu Kaisen
    'https://image.tmdb.org/t/p/w780/gmECX1DvFNgTtUCECdvdzfn6vke.jpg',
    // Demon Slayer
    'https://image.tmdb.org/t/p/w780/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',
    // Cyberpunk Edgerunners
    'https://image.tmdb.org/t/p/w780/5DUMPBSnHOZsbBv81GFXZZvvpo6.jpg',
    // Drive
    'https://image.tmdb.org/t/p/w780/6020imbZUGDuZ387FmUDb35tC4z.jpg',
    // The Wolf of Wall Street
    'https://image.tmdb.org/t/p/w780/cWUOv3H7YFwvKeaQhoAQTLLpo9Z.jpg',
    // House of the Dragon
    'https://image.tmdb.org/t/p/w780/etj5da900muVOO8hw9bkyh17Aoc.jpg',
    // Better Call Saul
    'https://image.tmdb.org/t/p/w780/fC2HDm5t0kHsfNxPkUQIZLaYemma.jpg'
  ];

  for (const u of images) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      console.log(`[${res.status}] ${u}`);
    } catch {
      console.log(`[ERR] ${u}`);
    }
  }
}

checkMegaCatalog();
