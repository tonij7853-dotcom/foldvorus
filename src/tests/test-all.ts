async function testAll() {
  const images = [
    // Euphoria
    'https://image.tmdb.org/t/p/w780/jRXYjER1j0Cz3vRXXPRvQWfAZx5.jpg',
    'https://image.tmdb.org/t/p/w780/o76Z4d8H3G29p50Q3Jd8d7N5q1Y.jpg',
    // Peaky Blinders
    'https://image.tmdb.org/t/p/w780/3UupR0nS9R6Di9letdz4ftX95GF.jpg',
    // The Batman
    'https://image.tmdb.org/t/p/w780/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    // Cruella
    'https://image.tmdb.org/t/p/w780/rTh4K5uw9HypmpGslcKd4QfHl93.jpg',
    // Spider-Man
    'https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    // Interstellar
    'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    // Oppenheimer
    'https://image.tmdb.org/t/p/w780/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    // Breaking Bad
    'https://image.tmdb.org/t/p/w780/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    // Stranger Things
    'https://image.tmdb.org/t/p/w780/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    // The Last of Us
    'https://image.tmdb.org/t/p/w780/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'
  ];

  for (const url of images) {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(res.status, url);
  }
}

testAll();
