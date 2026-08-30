"""
SceneFind Dead-Link Health Monitor
Performs lightweight HEAD requests to verify availability of indexed sources.
"""

import time
import httpx
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

SOURCES_TO_CHECK = [
    {"name": "411 Scenepacks", "url": "https://scenepacks.com"},
    {"name": "Veel Scenepacks", "url": "https://veelscp.com"},
    {"name": "EditPacks", "url": "https://editpacks.org"},
    {"name": "SuitsTM", "url": "https://suitstmscenepacks.com"},
]

def check_sources():
    headers = {"User-Agent": "SceneFindHealthCheck/1.0"}
    with httpx.Client(headers=headers, timeout=10.0, follow_redirects=True) as client:
        for src in SOURCES_TO_CHECK:
            try:
                resp = client.head(src["url"])
                status = "ACTIVE" if resp.status_code < 400 else f"STATUS {resp.status_code}"
                logging.info(f"[{src['name']}] URL: {src['url']} -> {status}")
            except Exception as e:
                logging.warning(f"[{src['name']}] Connection issue: {e}")
            time.sleep(1.0)

if __name__ == "__main__":
    check_sources()
