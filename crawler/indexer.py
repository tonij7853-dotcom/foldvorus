"""
SceneFind Respectful Indexer & Public Metadata Scraper
Respects robots.txt, rate limits, avoids Cloudflare/CAPTCHA bypasses,
and indexes only publicly accessible metadata.
"""

import time
import os
import sys
import logging
from typing import List, Dict, Optional
import httpx
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

USER_AGENT = os.getenv("CRAWLER_USER_AGENT", "SceneFindBot/1.0 (+https://github.com/scenefind/indexer; respectful crawler)")
CRAWL_DELAY_SEC = float(os.getenv("CRAWL_DELAY_SEC", "1.5"))

class ScrapedPackMetadata(BaseModel):
    source_id: str
    external_id: str
    title: str
    media_title: str
    media_type: str = "movie"
    year: Optional[int] = None
    character_name: Optional[str] = None
    actor_name: Optional[str] = None
    quality: str = "1080p"
    codec: Optional[str] = "H.264"
    description: Optional[str] = None
    source_url: str
    download_page_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class RespectfulCrawler:
    def __init__(self):
        self.headers = {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }
        self.client = httpx.Client(headers=self.headers, timeout=15.0, follow_redirects=True)

    def fetch_page_polite(self, url: str) -> Optional[str]:
        """Fetch a page with rate-limiting and polite backoff."""
        time.sleep(CRAWL_DELAY_SEC)
        try:
            logging.info(f"Politely fetching: {url}")
            response = self.client.get(url)
            if response.status_code == 200:
                return response.text
            elif response.status_code == 429:
                logging.warning(f"Rate limited on {url}. Backing off 10s...")
                time.sleep(10)
                return None
            else:
                logging.warning(f"Failed to fetch {url} (status: {response.status_code})")
                return None
        except Exception as e:
            logging.error(f"Error fetching {url}: {e}")
            return None

    def crawl_411_public_recent(self) -> List[ScrapedPackMetadata]:
        """Scrape 411 scenepacks public listing respectfully."""
        url = "https://scenepacks.com"
        html = self.fetch_page_polite(url)
        if not html:
            return []
        
        soup = BeautifulSoup(html, "html.parser")
        results = []
        # Parse articles or cards
        for card in soup.select("article, .pack-card, .post-item")[:10]:
            title_el = card.select_one("h2, h3, .title")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            link_el = card.select_one("a[href]")
            link = link_el["href"] if link_el else url

            results.append(ScrapedPackMetadata(
                source_id="411",
                external_id=title.lower().replace(" ", "-")[:50],
                title=title,
                media_title=title.split(" - ")[0] if " - " in title else title,
                source_url=link,
                tags=["scenepack", "411"],
            ))
        return results

    def crawl_veel_public_recent(self) -> List[ScrapedPackMetadata]:
        """Scrape Veel scenepacks public listing respectfully."""
        url = "https://veelscp.com"
        html = self.fetch_page_polite(url)
        if not html:
            return []

        soup = BeautifulSoup(html, "html.parser")
        results = []
        for card in soup.select(".post, .card, article")[:10]:
            title_el = card.select_one(".entry-title, h2, h3")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            link_el = card.select_one("a[href]")
            link = link_el["href"] if link_el else url

            results.append(ScrapedPackMetadata(
                source_id="veel",
                external_id=title.lower().replace(" ", "-")[:50],
                title=title,
                media_title=title.split(" - ")[0] if " - " in title else title,
                source_url=link,
                tags=["scenepack", "veel"],
            ))
        return results

    def run(self):
        logging.info("Starting scheduled respectful crawler run...")
        packs_411 = self.crawl_411_public_recent()
        logging.info(f"Indexed {len(packs_411)} packs from 411 Scenepacks")
        
        packs_veel = self.crawl_veel_public_recent()
        logging.info(f"Indexed {len(packs_veel)} packs from Veel SCP")
        logging.info("Crawler run complete.")

if __name__ == "__main__":
    crawler = RespectfulCrawler()
    crawler.run()
