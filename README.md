# SceneFind 🎬

> **The Search Engine for Video Scenepacks**  
> Discover high-quality scenepacks across multiple platforms (411 Scenepacks, Veel SCP, EditPacks, SuitsTM, and future adapters) via exact title/character search or natural-language scene/vibe descriptions.

---

## 🌟 Key Features

1. **Natural Language Scene Discovery (Query Understanding Layer)**:
   - Search by emotion, story event, visual setting, tropes, or edit vibes without needing to remember the movie title:
     - *"someone finds out who killed their mother"* → discovers **Cruella (Estella)** & **The Batman**
     - *"girl crying alone after losing someone"* → discovers **Euphoria (Rue)** & **Stranger Things (Max)**
     - *"confident entrance scene"* → discovers **Peaky Blinders (Thomas Shelby)** & **Cruella**
     - *"sad breakup in a car"* → discovers **Euphoria** & **La La Land**
     - *"clips for a sad edit"* → discovers emotional melancholic packs across all sources
2. **Exact Title & Character Matching with Typo Tolerance**:
   - Handles common typos using fuzzy trigram matching: `"cruela"`, `"spiderman"`, `"rue bennet"`, `"intersteller"`.
3. **Multi-Source Adapter Architecture**:
   - Modular adapters for:
     - `411 Scenepacks` (`https://scenepacks.com`)
     - `Veel Scenepacks` (`https://veelscp.com`)
     - `EditPacks` (`https://editpacks.org`)
     - `SuitsTM Scenepacks` (`https://suitstmscenepacks.com`)
     - Easily pluggable interface for future community sites (`BaseSourceAdapter`).
4. **Deduplication & Cross-Source Grouping**:
   - Groups similar packs for the same movie/show (e.g. *Cruella 2021* has packs across 411 and Veel) while preserving direct source links.
5. **Vibe Clustering & Fallback Discovery**:
   - Broad searches (e.g. *"find me emotional clips"*) are automatically structured into intuitive sections: **GRIEF / LOSS**, **BREAKUPS**, **BETRAYAL**, **FAMILY**, and **REUNIONS**.
6. **Transparent Confidence & Scoring**:
   - Honest labeling: `BEST MATCH`, `LIKELY MATCH`, and `RELATED` with explicit match reasons.
7. **Legal & Safe**:
   - Zero video hosting/re-uploading. Only indexes publicly accessible metadata and directs users straight to original source pages.
8. **100% Free Stack**:
   - Next.js + TypeScript + Tailwind CSS (Vercel Free Tier).
   - Supabase PostgreSQL with Full-Text Search, `pg_trgm`, and `pgvector` (Free Tier).
   - Zero-cost open-source vector embedding model simulation (384-dim).
   - GitHub Actions for polite, scheduled crawling.

---

## 🚀 1. Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm** / **yarn**
- **Python**: 3.10+ (for running the standalone crawler/indexer)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/scenefind.git
   cd scenefind
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Run test suite:
   ```bash
   npm test
   ```

6. Run Information Retrieval Benchmark (100 ground-truth queries):
   ```bash
   npm run benchmark
   ```

7. Verify live source adapter endpoints:
   ```bash
   npm run test:live-adapters
   ```

---

## 🗄️ 2. Supabase Setup & Database Migrations

SceneFind works out-of-the-box in local offline mode using its rich built-in dataset and can be connected to Supabase in minutes:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open [`src/lib/db/schema.sql`](src/lib/db/schema.sql) and execute the entire script. This creates:
   - `pg_trgm` extension for typo tolerance
   - `vector` extension (pgvector) for embeddings
   - `sources`, `packs`, `pack_tags`, `search_tags`, `favorites`, `search_history`, `crawl_logs` tables
   - Trigram and full-text GIN search indexes
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** from Supabase Settings -> API into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🔌 3. How to Add a New Source Adapter

To add a new scenepack website (e.g. `NewSource`), follow these 3 steps:

1. Create directory `src/lib/sources/newsource/index.ts`:
   ```typescript
   import { BaseSourceAdapter, AdapterSearchResult, CrawlResult } from '../base-adapter';
   import { Pack, SourceId } from '../../types';

   export class NewSourceAdapter extends BaseSourceAdapter {
     readonly sourceId: SourceId = 'newsource' as any;
     readonly name = 'NewSource Scenepacks';
     readonly baseUrl = 'https://newsource.com';
     readonly badgeName = 'NewSource';
     readonly badgeColor = 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';

     async searchSource(query: string, page = 1): Promise<AdapterSearchResult> {
       // Search public interface
       return { packs: [] };
     }

     async getPackMetadata(url: string): Promise<Partial<Pack> | null> {
       return null;
     }

     async crawlPublicPages(cursor?: string): Promise<CrawlResult> {
       return { packs: [], hasMore: false };
     }

     normalizeResult(rawData: any): Pack {
       // Transform raw HTML/API data into standard Pack schema
       return {
         id: `newsource_${rawData.id}`,
         sourceId: this.sourceId,
         externalId: rawData.id,
         title: rawData.title,
         mediaTitle: rawData.mediaTitle || rawData.title,
         mediaType: 'movie',
         quality: '1080p',
         sourceUrl: rawData.url,
         indexedAt: new Date().toISOString(),
         isActive: true,
         tags: rawData.tags || [],
       };
     }
   }
   ```

2. Register the adapter in `src/lib/sources/index.ts`:
   ```typescript
   import { NewSourceAdapter } from './newsource';

   export const registeredAdapters: Record<string, BaseSourceAdapter> = {
     // ...
     'newsource': new NewSourceAdapter(),
   };
   ```

3. Update `SourceId` in `src/lib/types.ts`.

---

## 🕷️ 4. Running the Indexer / Crawler

The crawler runs respectfully using Python:

```bash
cd crawler
pip install -r requirements.txt

# Run crawler (respects robots.txt, 1.5s delay, polite User-Agent)
python indexer.py

# Run dead link checker
python link_checker.py
```

---

## ☁️ 5. Deployment to Vercel (Free Tier)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TMDB_API_KEY` (Optional)
4. Click **Deploy**. Vercel will automatically build and serve the application globally with serverless caching.

---

## ⏰ 6. Configuring GitHub Actions for Scheduled Crawling

The workflow in [`.github/workflows/scheduled-crawler.yml`](.github/workflows/scheduled-crawler.yml) runs automatically every 12 hours.

To enable automated runs:
1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRAWLER_USER_AGENT`

---

## 🔑 7. Environment Variables Reference

| Variable | Description | Required | Scope |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API endpoint | No (falls back to mock DB) | Public / Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | No | Public / Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key | No | **Server-side Only** |
| `TMDB_API_KEY` | Optional TMDB v3 API Key for poster/title enrichment | No | Server-side Only |
| `CRAWLER_USER_AGENT` | Custom User-Agent string for respectful crawling | No | Crawler Only |

---

## ⚠️ 8. Known Limitations

- SceneFind does not index private Discord channels or password-protected archives.
- Scene descriptions rely on verified metadata and story beat inference. If an exact timestamp is not in the source metadata, SceneFind honestly marks the result as `LIKELY MATCH` or `RELATED` rather than fabricating timestamps.
- Video downloads and hosting remain on original source providers.

---

## ⚖️ 9. Legal & Copyright Policy

- **No Video Hosting**: SceneFind does not host, store, stream, or re-upload copyrighted video material.
- **Metadata Indexing Only**: SceneFind functions as a specialized search engine indexing publicly accessible metadata (titles, characters, resolutions, descriptions).
- **Direct Linking**: All "Open Pack" and download actions redirect users directly to original creators' and source websites' public pages.
- **Respect for Source Platforms**: Crawlers obey `robots.txt`, implement polite rate-limiting, and respect anti-bot measures.
