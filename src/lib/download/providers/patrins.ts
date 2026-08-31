import { DownloadTarget, PatrinsResolution } from '../types';

/**
 * Resolves Patrins-hosted files (e.g. patrins.com/f/<id> or files.veelscp.com/f/<id>)
 * Checks for officially exposed public direct-download URLs without guessing or manufacturing tokens.
 */
export async function resolvePatrins(url: string, timeoutMs = 7000): Promise<DownloadTarget> {
  const cleanUrl = url.trim();
  const fileIdMatch = cleanUrl.match(/\/f\/([a-zA-Z0-9_-]+)/i);
  const fileId = fileIdMatch ? fileIdMatch[1] : '';

  // Standardize share page URL
  const sharePageUrl = fileId 
    ? (cleanUrl.includes('veelscp.com') ? `https://files.veelscp.com/f/${fileId}` : `https://patrins.com/f/${fileId}`)
    : cleanUrl;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(sharePageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        provider: 'patrins',
        originalUrl: cleanUrl,
        resolvedUrl: sharePageUrl,
        sharePageUrl,
        directDownloadVerified: false,
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'likely',
        strategy: 'PATRINS_SHARE_PAGE',
        status: res.status === 404 ? 'dead' : 'unknown',
        reason: `HTTP ${res.status} returned from Patrins`
      };
    }

    const html = await res.text();

    // Extract metadata
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i) || html.match(/class=["']file-name["'][^>]*>([^<]+)<\//i);
    const sizeMatch = html.match(/(\d+(\.\d+)?\s*(GB|MB|KB))/i);

    let rawTitle = titleMatch ? titleMatch[1].replace(' - Patrins', '').replace('Download ', '').trim() : '';
    if (!rawTitle || rawTitle.includes('404') || rawTitle.includes('Not Found')) {
      rawTitle = fileId ? `Patrins File [${fileId}]` : 'Patrins Shared Scenepack';
    }

    // Inspect if HTML or developer config explicitly exposes an authorized public direct download URL
    let directDownloadUrl: string | undefined = undefined;
    let directDownloadVerified = false;

    const directMatch = html.match(/data-direct-download=["'](https:\/\/patrins\.com\/api\/download\/[^"']+)["']/i) ||
                        html.match(/data-download-url=["'](https:\/\/[^"']+)["']/i);

    if (directMatch && directMatch[1]) {
      const candidateUrl = directMatch[1];
      if (candidateUrl.startsWith('https://patrins.com/') || candidateUrl.startsWith('https://files.veelscp.com/')) {
        directDownloadUrl = candidateUrl;
        directDownloadVerified = true;
      }
    }

    const is4K = rawTitle.toUpperCase().includes('4K') || rawTitle.includes('2160p');
    const isHEVC = rawTitle.toUpperCase().includes('HEVC') || rawTitle.toUpperCase().includes('H265') || rawTitle.toUpperCase().includes('H.265');

    return {
      provider: 'patrins',
      originalUrl: cleanUrl,
      resolvedUrl: directDownloadVerified && directDownloadUrl ? directDownloadUrl : sharePageUrl,
      sharePageUrl,
      directDownloadUrl,
      directDownloadVerified,
      filename: rawTitle,
      fileSize: sizeMatch ? sizeMatch[1] : undefined,
      resolution: is4K ? '4K' : '1080p',
      codec: isHEVC ? 'HEVC (H.265)' : 'H.264',
      extension: rawTitle.endsWith('.mp4') ? 'mp4' : rawTitle.endsWith('.mov') ? 'mov' : 'mp4',
      host: cleanUrl.includes('veelscp.com') ? 'files.veelscp.com' : 'patrins.com',
      canDirectDownload: directDownloadVerified,
      requiresExternalPage: !directDownloadVerified,
      confidence: 'verified',
      strategy: directDownloadVerified ? 'DIRECT_PATRINS' : 'PATRINS_SHARE_PAGE',
      status: 'active',
      reason: directDownloadVerified 
        ? 'Official direct download link verified from Patrins'
        : 'Official Patrins file page resolved. Opens directly with zero ads.'
    };
  } catch (err: any) {
    return {
      provider: 'patrins',
      originalUrl: cleanUrl,
      resolvedUrl: sharePageUrl,
      sharePageUrl,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: 'likely',
      strategy: 'PATRINS_SHARE_PAGE',
      status: 'unknown',
      reason: `Patrins inspection fallback: ${err.message || 'Connection error'}`
    };
  }
}
