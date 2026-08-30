import { MOCK_PACKS, INITIAL_SOURCES } from './mock-db';

/**
 * Script to seed Supabase PostgreSQL live database with initial sources and packs.
 * Run with: npm run seed:supabase
 */
async function seedSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  console.log(`📡 Connecting to Supabase: ${supabaseUrl}...`);

  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',
  };

  // 1. Seed Sources
  console.log('Seeding sources table...');
  const sourcesPayload = INITIAL_SOURCES.map(s => ({
    id: s.id,
    name: s.name,
    base_url: s.baseUrl,
    badge_name: s.badgeName,
    badge_color: s.badgeColor,
    enabled: s.enabled,
    pack_count: s.packCount || 0,
    last_crawled_at: s.lastCrawledAt || new Date().toISOString(),
  }));

  const srcRes = await fetch(`${supabaseUrl}/rest/v1/sources`, {
    method: 'POST',
    headers,
    body: JSON.stringify(sourcesPayload),
  });

  if (!srcRes.ok) {
    console.error('❌ Failed to seed sources:', await srcRes.text());
  } else {
    console.log(`✓ Inserted/Updated ${sourcesPayload.length} sources`);
  }

  // 2. Seed Packs
  console.log('Seeding packs table...');
  const packsPayload = MOCK_PACKS.map(p => ({
    id: p.id,
    source_id: p.sourceId,
    external_id: p.external_id || p.externalId,
    title: p.title,
    media_title: p.mediaTitle,
    media_type: p.mediaType || 'movie',
    year: p.year,
    character_name: p.characterName,
    actor_name: p.actorName,
    director_name: p.directorName,
    creator_name: p.creatorName,
    category: p.category,
    quality: p.quality,
    codec: p.codec,
    description: p.description,
    source_url: p.sourceUrl,
    download_page_url: p.downloadPageUrl,
    thumbnail_url: p.thumbnailUrl,
    popularity: p.popularity,
    download_count: p.downloadCount,
    published_at: p.publishedAt,
    indexed_at: p.indexedAt,
    last_checked_at: p.lastCheckedAt,
    is_active: p.isActive,
    tags: p.tags,
    vibe_tags: p.vibeTags,
  }));

  const packRes = await fetch(`${supabaseUrl}/rest/v1/packs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(packsPayload),
  });

  if (!packRes.ok) {
    console.error('❌ Failed to seed packs:', await packRes.text());
  } else {
    console.log(`✓ Inserted/Updated ${packsPayload.length} packs`);
  }

  console.log('\n🎉 Supabase online database seeding completed successfully!');
}

seedSupabase().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
