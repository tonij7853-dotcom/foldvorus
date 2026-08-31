async function findWorkingImages() {
  const list = [
    // Euphoria
    'https://image.tmdb.org/t/p/w780/jOHZgC1L9N4c0n72g8L7Y8y0z.jpg',
    'https://image.tmdb.org/t/p/w780/9yBVqNruk6Ohkrpa9zg9fl416.jpg',
    'https://image.tmdb.org/t/p/w780/kH10W7c2rBfVj6x9y1x4v8K4P1.jpg',
    'https://image.tmdb.org/t/p/w780/3T1dJk1Q6zY4z9E11xL1KqJzK9a.jpg',
    'https://image.tmdb.org/t/p/w780/eeij7Hk1b7p7gK4B6h9Y2j0H9v.jpg',
    'https://image.tmdb.org/t/p/w780/q879K2k1r5l8v8x1v4x6v5x8x4v6.jpg',
    'https://image.tmdb.org/t/p/w780/7k4e9z5vK8x1v4x6v5x8x4v6.jpg',
    'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkWcT0l.jpg',
    // TMDB official test
    'https://image.tmdb.org/t/p/w780/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', // Batman 200 OK
    'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg', // Batman 200 OK
    'https://image.tmdb.org/t/p/w780/rTh4K5uw9HypmpGslcKd4QfHl93.jpg', // Cruella 200 OK
    'https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg', // Spider-Man 200 OK
    'https://image.tmdb.org/t/p/w780/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', // Spider-Man 200 OK
    'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', // Interstellar 200 OK
    'https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg', // Interstellar 200 OK
    'https://image.tmdb.org/t/p/w780/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', // Oppenheimer 200 OK
    'https://image.tmdb.org/t/p/w780/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg', // Oppenheimer 200 OK
    'https://image.tmdb.org/t/p/w780/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg', // Breaking Bad 200 OK
    'https://image.tmdb.org/t/p/w780/56v2KjBlU4XaOv9rVYEQypROD7P.jpg', // Stranger Things 200 OK
    'https://image.tmdb.org/t/p/w780/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'  // The Last of Us 200 OK
  ];

  for (const u of list) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      console.log(`[${res.status}] ${u}`);
    } catch {}
  }
}

findWorkingImages();
