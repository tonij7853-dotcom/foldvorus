async function testMore() {
  const candidates = [
    // Euphoria
    'https://image.tmdb.org/t/p/w780/jLHkWYp5g01pIeJcNuqWJdZc7u.jpg',
    'https://image.tmdb.org/t/p/w780/eeij7Hk1b7p7gK4B6h9Y2j0H9v.jpg',
    'https://image.tmdb.org/t/p/w780/5Nbo7n7WbJz2Wp4VvW6P1zJm4jP.jpg',
    'https://image.tmdb.org/t/p/w780/jW8fD8mHq69mYFvDk3fVd8WjFfC.jpg',
    'https://image.tmdb.org/t/p/w780/3r4ET8i8q2r2Z1f7H6v1vH7y1x.jpg',
    'https://image.tmdb.org/t/p/w780/kH10W7c2rBfVj6x9y1x4v8K4P1.jpg',
    'https://image.tmdb.org/t/p/w780/9yBVqNruk6Ohkrpa9zg9fl416.jpg',
    'https://image.tmdb.org/t/p/w780/9yBVqNruk6Ohkrpa9zg9fl416.png',
    // Succession
    'https://image.tmdb.org/t/p/w780/w7DAZ24r3h7l7r0y7n7m7n7m7.jpg',
    'https://image.tmdb.org/t/p/w780/7k4e9z5vK8x1v4x6v5x8x4v6.jpg',
    // Arcane
    'https://image.tmdb.org/t/p/w780/q879K2k1r5l8v8x1v4x6v5x8x4v6.jpg',
    'https://image.tmdb.org/t/p/w780/vGvF7vW9b8r1x5P7KkP8X5P7Kk.jpg',
    // Peaky Blinders
    'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkWcT0l.jpg',
    'https://image.tmdb.org/t/p/w780/2ugrwPsq3tW42eN7dG8gD9M8n0z.jpg',
    // La La Land
    'https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkVJt0Rf0.jpg',
    'https://image.tmdb.org/t/p/w780/ylXCdC106IKiarftHkcacasaAcb.jpg'
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status === 200) {
        console.log(`[200 OK] ${url}`);
      }
    } catch {}
  }
}
testMore();
