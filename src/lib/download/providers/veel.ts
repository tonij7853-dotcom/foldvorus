import { DownloadTarget } from '../types';
import { resolvePatrins } from './patrins';

/**
 * Resolves Veel Scenepacks URLs (including gateway ad timers and pack pages).
 * Follows public resolution to locate the authorized Patrins or cloud storage file.
 */
export async function resolveVeel(url: string, timeoutMs = 7000): Promise<DownloadTarget> {
  const cleanUrl = url.trim();

  // 1. Gateway Ad Timer Link (veelscp.com/gateway/?id=...)
  if (cleanUrl.includes('veelscp.com/gateway')) {
    const gwMatch = cleanUrl.match(/[?&]id=([^&#]+)/i);
    const gwId = gwMatch ? gwMatch[1] : '';

    if (gwId) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const claimRes = await fetch('https://veelscp.com/api/scenepacks?action=claim-download', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': cleanUrl
          },
          body: JSON.stringify({ id: gwId, watchToken: 'reclaim' })
        });
        clearTimeout(timeout);

        if (claimRes.ok) {
          const claimData = await claimRes.json();
          if (claimData && claimData.url) {
            const finalUrl = claimData.url;
            if (finalUrl.includes('patrins.com') || finalUrl.includes('files.veelscp.com')) {
              const patrinsTarget = await resolvePatrins(finalUrl, timeoutMs);
              patrinsTarget.originalUrl = cleanUrl;
              return patrinsTarget;
            }

            return {
              provider: 'veel',
              originalUrl: cleanUrl,
              resolvedUrl: finalUrl,
              directDownloadVerified: false,
              canDirectDownload: false,
              requiresExternalPage: true,
              confidence: 'verified',
              strategy: 'SOURCE_FALLBACK',
              status: 'active',
              reason: 'Veel gateway resolved to destination file.'
            };
          }
        }
      } catch (err: any) {
        console.error('[Veel Resolver] Gateway error:', err.message);
      }
    }
  }

  // 2. Direct File Host on Veel (files.veelscp.com/f/...)
  if (cleanUrl.includes('files.veelscp.com/f/')) {
    return resolvePatrins(cleanUrl, timeoutMs);
  }

  // 3. Main Veel Listing / Pack Page (veelscp.com/pack/...)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const gatewayMatch = html.match(/href=["'](https:\/\/veelscp\.com\/gateway\/\?id=[^"']+)["']/i);
      const patrinsMatch = html.match(/href=["'](https:\/\/(files\.veelscp\.com|patrins\.com)\/f\/[^"']+)["']/i);

      if (patrinsMatch) {
        const patrinsTarget = await resolvePatrins(patrinsMatch[1], timeoutMs);
        patrinsTarget.originalUrl = cleanUrl;
        return patrinsTarget;
      }

      if (gatewayMatch) {
        return resolveVeel(gatewayMatch[1], timeoutMs);
      }
    }
  } catch {}

  return {
    provider: 'veel',
    originalUrl: cleanUrl,
    resolvedUrl: cleanUrl,
    directDownloadVerified: false,
    canDirectDownload: false,
    requiresExternalPage: true,
    confidence: 'likely',
    strategy: 'SOURCE_FALLBACK',
    status: 'active',
    reason: 'Veel source page link'
  };
}
