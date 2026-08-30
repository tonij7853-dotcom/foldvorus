export interface TMDBMediaDetails {
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  cast: string[];
  director?: string;
}

export async function fetchTMDBEnrichment(query: string, year?: number): Promise<TMDBMediaDetails | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    // Graceful fallback: site still works 100% without TMDB
    return null;
  }

  try {
    const url = new URL('https://api.themoviedb.org/3/search/multi');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('query', query);
    if (year) {
      url.searchParams.set('year', String(year));
    }

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const first = data.results[0];
    const releaseDate = first.release_date || first.first_air_date;
    const extractedYear = releaseDate ? parseInt(releaseDate.split('-')[0], 10) : undefined;

    return {
      title: first.title || first.name,
      year: extractedYear,
      overview: first.overview,
      posterUrl: first.poster_path ? `https://image.tmdb.org/t/p/w500${first.poster_path}` : undefined,
      backdropUrl: first.backdrop_path ? `https://image.tmdb.org/t/p/original${first.backdrop_path}` : undefined,
      genres: [],
      cast: [],
    };
  } catch (error) {
    console.warn('[TMDB] Enrichment lookup error:', error);
    return null;
  }
}
