import { DownloadTarget } from '../types';

/**
 * Resolves 411 Scenepacks URLs.
 * Extracts underlying Google Drive, MEGA, or MediaFire cloud folder links.
 */
export async function resolve411(url: string, timeoutMs = 7000): Promise<DownloadTarget> {
  const cleanUrl = url.trim();
  const packIdMatch = cleanUrl.match(/scps\/(\d+)/i) || cleanUrl.match(/pack\/([a-zA-Z0-9-]+)/i);
  const packId = packIdMatch ? packIdMatch[1] : '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        provider: '411',
        originalUrl: cleanUrl,
        resolvedUrl: cleanUrl,
        directDownloadVerified: false,
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'likely',
        strategy: 'SOURCE_FALLBACK',
        status: res.status === 404 ? 'dead' : 'unknown'
      };
    }

    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : `411 Scenepack #${packId}`;
    if (title.includes('Just a moment') || title.includes('Attention Required')) {
      title = `411 Scenepack #${packId || 'Community Pack'}`;
    }

    const megaMatch = html.match(/href=["'](https:\/\/mega\.nz\/[^"']+)["']/i);
    const driveMatch = html.match(/href=["'](https:\/\/drive\.google\.com\/[^"']+)["']/i);
    const mediafireMatch = html.match(/href=["'](https:\/\/(www\.)?mediafire\.com\/[^"']+)["']/i);

    const cloudUrl = megaMatch ? megaMatch[1] : driveMatch ? driveMatch[1] : mediafireMatch ? mediafireMatch[1] : undefined;

    if (cloudUrl) {
      const isMega = cloudUrl.includes('mega.nz');
      const isDrive = cloudUrl.includes('drive.google.com');

      return {
        provider: isMega ? 'mega' : isDrive ? 'gdrive' : 'mediafire',
        originalUrl: cleanUrl,
        resolvedUrl: cloudUrl,
        directDownloadVerified: false,
        filename: title,
        host: isMega ? 'mega.nz' : isDrive ? 'drive.google.com' : 'mediafire.com',
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'verified',
        strategy: 'CLOUD_STORAGE',
        status: 'active',
        reason: 'Direct cloud storage destination extracted from 411'
      };
    }

    return {
      provider: '411',
      originalUrl: cleanUrl,
      resolvedUrl: cleanUrl,
      filename: title,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: 'likely',
      strategy: 'SOURCE_FALLBACK',
      status: 'active',
      reason: '411 page resolved'
    };
  } catch (err: any) {
    return {
      provider: '411',
      originalUrl: cleanUrl,
      resolvedUrl: cleanUrl,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: 'unknown',
      strategy: 'SOURCE_FALLBACK',
      status: 'unknown',
      reason: err.message
    };
  }
}
