async function findMoreTMDB() {
  const titles = [
    // Fight Club
    'https://image.tmdb.org/t/p/w780/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    'https://image.tmdb.org/t/p/w780/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
    // American Psycho
    'https://image.tmdb.org/t/p/w780/93pmt92nUj4iP5X0z6kO7vK9A5F.jpg',
    'https://image.tmdb.org/t/p/w780/34D976mNfT1p1L2Lz4x8x4v6.jpg',
    // Dune Part 2
    'https://image.tmdb.org/t/p/w780/xOMo8BRK7PfcJv9JCnx7s5hj0xO.jpg',
    'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    // The Boys
    'https://image.tmdb.org/t/p/w780/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    'https://image.tmdb.org/t/p/w780/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg',
    // House of the Dragon
    'https://image.tmdb.org/t/p/w780/etj5da900muVOO8hw9bkyh17Aoc.jpg',
    'https://image.tmdb.org/t/p/w780/1XddXPXGiI8id7MrUxK36ke7gkX.jpg',
    // Blade Runner 2049
    'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    'https://image.tmdb.org/t/p/w780/sAtoMqDVhNDQBc3QJL3RF6hlxGq.jpg',
    // Whiplash
    'https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    'https://image.tmdb.org/t/p/w780/6bbZ6XUwvgUpQ2nf5EvAn9rlYUE.jpg',
    // Wednesday
    'https://image.tmdb.org/t/p/w780/9PFonQ921SHAZvQgNWOC0ne8Xc6.jpg',
    // Jujutsu Kaisen
    'https://image.tmdb.org/t/p/w780/h4K58k1gU4i9Y2Z5p8x8x4v6.jpg'
  ];

  for (const u of titles) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status === 200) {
        console.log(`[200 OK] ${u}`);
      }
    } catch {}
  }
}

findMoreTMDB();
