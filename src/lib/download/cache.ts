import { DownloadTarget } from './types';

interface CacheEntry {
  target: DownloadTarget;
  cachedAt: number;
  expiresAt: number;
}

class DownloadTargetCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  public get(key: string): DownloadTarget | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.target;
  }

  public set(key: string, target: DownloadTarget, ttlMs?: number): void {
    const ttl = ttlMs || this.DEFAULT_TTL_MS;
    this.cache.set(key, {
      target,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl
    });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  public getAll(): Array<{ key: string; target: DownloadTarget; cachedAt: number }> {
    const list: Array<{ key: string; target: DownloadTarget; cachedAt: number }> = [];
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        list.push({ key, target: entry.target, cachedAt: entry.cachedAt });
      }
    }
    return list;
  }
}

export const downloadCache = new DownloadTargetCache();
