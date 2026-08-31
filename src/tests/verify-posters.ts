async function verifyPosters() {
  const images = {
    // Cruella (Emma Stone)
    cruella: [
      'https://image.tmdb.org/t/p/w780/rTh4K5uw9HypmpGslcKd4QfHl93.jpg',
      'https://image.tmdb.org/t/p/w780/wTxW03g309mF4g4d5G56pWkH7Yh.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/c5/Cruella2021Poster.jpg'
    ],
    // The Batman (Robert Pattinson)
    batman: [
      'https://image.tmdb.org/t/p/w780/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg'
    ],
    // Euphoria (Zendaya)
    euphoria: [
      'https://image.tmdb.org/t/p/w780/9knGnxvN3ut2VSpLpA8k3nQv80Z.jpg',
      'https://image.tmdb.org/t/p/w780/sP4UoXv5p1x5P7KkP8X5P7KkP8X.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7a/Euphoria_Season_1_Poster.jpg'
    ],
    // Spider-Man
    spiderman: [
      'https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
      'https://image.tmdb.org/t/p/w780/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg'
    ],
    // Interstellar
    interstellar: [
      'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      'https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg'
    ],
    // Oppenheimer
    oppenheimer: [
      'https://image.tmdb.org/t/p/w780/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      'https://image.tmdb.org/t/p/w780/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg'
    ],
    // Breaking Bad
    breakingBad: [
      'https://image.tmdb.org/t/p/w780/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg'
    ],
    // Stranger Things
    strangerThings: [
      'https://image.tmdb.org/t/p/w780/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'
    ],
    // The Last of Us
    lastOfUs: [
      'https://image.tmdb.org/t/p/w780/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'
    ]
  };

  for (const [key, urls] of Object.entries(images)) {
    console.log(`\nTesting ${key}:`);
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log(`  [${res.status}] ${url}`);
      } catch (e) {
        console.log(`  [ERR] ${url}`);
      }
    }
  }
}

verifyPosters();
