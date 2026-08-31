import { DownloadTarget } from '../types';

/**
 * Resolves EditPacks URLs to extract raw download targets (MEGA, Drive, Gofile, or direct).
 */
export async function resolveEditPacks(url: string, timeoutMs = 7000): Promise<DownloadTarget> {
  const cleanUrl = url.trim();

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
        provider: 'editpacks',
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
    const title = titleMatch ? titleMatch[1].trim() : 'EditPacks Animation Scenepack';

    const cloudMatch = html.match(/href=["'](https:\/\/(mega\.nz|drive\.google\.com|mediafire\.com|gofile\.io)[^"']+)["']/i);
    const targetUrl = cloudMatch ? cloudMatch[1] : cleanUrl;

    return {
      provider: 'editpacks',
      originalUrl: cleanUrl,
      resolvedUrl: targetUrl,
      filename: title,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: cloudMatch ? 'verified' : 'likely',
      strategy: cloudMatch ? 'CLOUD_STORAGE' : 'SOURCE_FALLBACK',
      status: 'active',
      reason: cloudMatch ? 'Extracted raw cloud storage folder' : 'EditPacks link'
    };
  } catch (err: any) {
    return {
      provider: 'editpacks',
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
