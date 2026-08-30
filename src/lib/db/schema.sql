-- ==============================================================================
-- SceneFind PostgreSQL Schema (Supabase Compatible)
-- Supports Full-Text Search, pg_trgm for typo-tolerance, and pgvector for embeddings.
-- ==============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SOURCES TABLE
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    badge_name VARCHAR(50) NOT NULL,
    badge_color VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    last_crawled_at TIMESTAMPTZ,
    pack_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PACKS TABLE
CREATE TABLE IF NOT EXISTS packs (
    id VARCHAR(100) PRIMARY KEY,
    source_id VARCHAR(50) REFERENCES sources(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    media_title VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) DEFAULT 'movie',
    year INTEGER,
    character_name VARCHAR(150),
    actor_name VARCHAR(150),
    director_name VARCHAR(150),
    creator_name VARCHAR(150),
    category VARCHAR(100),
    quality VARCHAR(20) DEFAULT '1080p',
    codec VARCHAR(50) DEFAULT 'H.264',
    description TEXT,
    source_url VARCHAR(500) NOT NULL,
    download_page_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    popularity INTEGER DEFAULT 50,
    download_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    indexed_at TIMESTAMPTZ DEFAULT NOW(),
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    tags TEXT[] DEFAULT '{}',
    vibe_tags TEXT[] DEFAULT '{}',
    embedding vector(384),
    fts_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(media_title, '') || ' ' || 
            coalesce(character_name, '') || ' ' || 
            coalesce(actor_name, '') || ' ' || 
            coalesce(description, '') || ' ' ||
            array_to_string(tags, ' ') || ' ' ||
            array_to_string(vibe_tags, ' ')
        )
    ) STORED,
    CONSTRAINT unique_source_external UNIQUE (source_id, external_id)
);

-- 3. PACK_TAGS (Normalized relational tags)
CREATE TABLE IF NOT EXISTS pack_tags (
    pack_id VARCHAR(100) REFERENCES packs(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (pack_id, tag)
);

-- 4. SEARCH_TAGS & SYNONYMS
CREATE TABLE IF NOT EXISTS search_tags (
    tag VARCHAR(100) PRIMARY KEY,
    synonyms TEXT[] DEFAULT '{}',
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FAVORITES (User saved packs)
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    pack_id VARCHAR(100) REFERENCES packs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_pack UNIQUE (user_id, pack_id)
);

-- 6. SEARCH_HISTORY (Diagnostics and analytics)
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    query TEXT NOT NULL,
    search_mode VARCHAR(20) DEFAULT 'all',
    result_count INTEGER DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CRAWL_LOGS (Audit and dead-link checker)
CREATE TABLE IF NOT EXISTS crawl_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(50) REFERENCES sources(id) ON DELETE CASCADE,
    pages_crawled INTEGER DEFAULT 0,
    packs_indexed INTEGER DEFAULT 0,
    failed_urls TEXT[] DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM SEARCH SPEED & TYPO-TOLERANCE
-- ==============================================================================

-- Trigram indexes for fuzzy searching & typo tolerance (e.g. "cruela", "spiderman")
CREATE INDEX IF NOT EXISTS idx_packs_title_trgm ON packs USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_packs_media_title_trgm ON packs USING gin (media_title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_packs_character_trgm ON packs USING gin (character_name gin_trgm_ops);

-- Full-Text Search Index
CREATE INDEX IF NOT EXISTS idx_packs_fts ON packs USING gin (fts_vector);

-- Filter Indexes
CREATE INDEX IF NOT EXISTS idx_packs_source ON packs (source_id);
CREATE INDEX IF NOT EXISTS idx_packs_media_type ON packs (media_type);
CREATE INDEX IF NOT EXISTS idx_packs_quality ON packs (quality);
CREATE INDEX IF NOT EXISTS idx_packs_is_active ON packs (is_active);

-- Vector embedding index (HNSW for fast cosine similarity search)
CREATE INDEX IF NOT EXISTS idx_packs_embedding ON packs USING hnsw (embedding vector_cosine_ops);
