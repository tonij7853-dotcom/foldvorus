async function fetchOfficialPosters() {
  const titles = [
    { title: 'Cruella', year: 2021, type: 'movie' },
    { title: 'The Batman', year: 2022, type: 'movie' },
    { title: 'Euphoria', year: 2019, type: 'tv' },
    { title: 'Spider-Man: No Way Home', year: 2021, type: 'movie' },
    { title: 'Interstellar', year: 2014, type: 'movie' },
    { title: 'Succession', year: 2018, type: 'tv' },
    { title: 'Arcane', year: 2021, type: 'tv' },
    { title: 'Peaky Blinders', year: 2013, type: 'tv' },
    { title: 'Breaking Bad', year: 2008, type: 'tv' },
    { title: 'The Last of Us', year: 2023, type: 'tv' },
    { title: 'Oppenheimer', year: 2023, type: 'movie' },
    { title: 'La La Land', year: 2016, type: 'movie' },
    { title: 'Stranger Things', year: 2016, type: 'tv' }
  ];

  // We can query the public TMDB endpoint with a free key or query the search endpoint
  for (const item of titles) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/${item.type}?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${encodeURIComponent(item.title)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const top = data.results[0];
        console.log(`\n${item.title}:`);
        console.log(`  backdrop: https://image.tmdb.org/t/p/w780${top.backdrop_path}`);
        console.log(`  poster:   https://image.tmdb.org/t/p/w500${top.poster_path}`);
      }
    } catch (e) {
      console.error(item.title, e);
    }
  }
}

fetchOfficialPosters();
