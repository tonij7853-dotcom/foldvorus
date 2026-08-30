import { NextResponse } from 'next/server';
import { MOCK_PACKS, INITIAL_SOURCES } from '@/lib/db/mock-db';

export async function GET() {
  const trending = [...MOCK_PACKS].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 8);
  const recent = [...MOCK_PACKS].sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()).slice(0, 8);

  const popularMovies = [
    { title: 'Cruella', count: 3, year: 2021, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
    { title: 'The Batman', count: 2, year: 2022, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80' },
    { title: 'Euphoria', count: 2, year: 2019, image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
    { title: 'Interstellar', count: 1, year: 2014, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
    { title: 'Spider-Man', count: 1, year: 2021, image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=400&q=80' },
    { title: 'Succession', count: 1, year: 2018, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
  ];

  const popularCharacters = [
    { name: 'Estella / Cruella', media: 'Cruella', count: 3 },
    { name: 'Bruce Wayne', media: 'The Batman', count: 2 },
    { name: 'Rue Bennett', media: 'Euphoria', count: 2 },
    { name: 'Peter Parker', media: 'Spider-Man', count: 1 },
    { name: 'Kendall Roy', media: 'Succession', count: 1 },
    { name: 'Jinx / Powder', media: 'Arcane', count: 1 },
    { name: 'Thomas Shelby', media: 'Peaky Blinders', count: 1 },
    { name: 'Joel Miller', media: 'The Last of Us', count: 1 },
  ];

  return NextResponse.json({
    trending,
    recent,
    popularMovies,
    popularCharacters,
    sources: INITIAL_SOURCES,
  });
}
