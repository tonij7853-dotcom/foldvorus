import { DownloadTarget, ResolverOptions } from './types';
import { downloadCache } from './cache';
import { resolvePatrins } from './providers/patrins';
import { resolveVeel } from './providers/veel';
import { resolve411 } from './providers/scenepacks411';
import { resolveEditPacks } from './providers/editpacks';
import { resolveSuits } from './providers/suits';

const ALLOWED_DOMAINS = new Set([
  'scenepacks.com',
  'www.scenepacks.com',
  'veelscp.com',
  'www.veelscp.com',
  'files.veelscp.com',
  'cdn.veelscp.com',
  'patrins.com',
  'www.patrins.com',
  'files.patrins.com',
  'dl.patrins.com',
  'editpacks.org',
  'www.editpacks.org',
  'suitstmscenepacks.com',
  'www.suitstmscenepacks.com',
  'mega.nz',
  'drive.google.com',
  'mediafire.com',
  'www.mediafire.com',
  'gofile.io'
]);

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // AWS / GCP metadata
  /^::1$/,
  /^fe80:/i,
  /^0\.0\.0\.0$/
];

/**
 * Validates a URL for SSRF protection and domain allowlisting.
 */
export function validateUrlForSsrf(urlStr: string): { isValid: boolean; error?: string; hostname?: string } {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: `Invalid protocol: ${parsed.protocol}. Only HTTP and HTTPS are permitted.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked IP ranges and localhost
    for (const pattern of BLOCKED_HOST_PATTERNS) {
      if (pattern.test(hostname)) {
        return { isValid: false, error: `Security check failed: IP or private host is blocked.` };
      }
    }

    // Check allowlisted domains
    let isDomainAllowed = false;
    for (const allowed of ALLOWED_DOMAINS) {
      if (hostname === allowed || hostname.endsWith(`.${allowed}`)) {
        isDomainAllowed = true;
        break;
      }
    }

    if (!isDomainAllowed) {
      return { isValid: false, error: `Security check failed: Domain ${hostname} is not in the allowed source list.` };
    }

    return { isValid: true, hostname };
  } catch (err: any) {
    return { isValid: false, error: `Malformed URL: ${err.message || 'Invalid syntax'}` };
  }
}

/**
 * Main Download Target Resolver Orchestrator.
 * Resolves safe, authorized public download targets with caching, SSRF defense, and timeout controls.
 */
export async function resolveDownloadTarget(
  url: string,
  packId?: string,
  options: ResolverOptions = {}
): Promise<DownloadTarget> {
  const cleanUrl = (url || '').trim();
  const startTime = Date.now();

  const cacheKey = packId || cleanUrl;

  // 1. Check cache first unless forceFresh is specified
  if (!options.forceFresh) {
    const cached = downloadCache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        latencyMs: Date.now() - startTime
      };
    }
  }

  // 2. Validate URL against SSRF rules
  const validation = validateUrlForSsrf(cleanUrl);
  if (!validation.isValid) {
    return {
      provider: 'unknown',
      originalUrl: cleanUrl,
      resolvedUrl: cleanUrl,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: 'unknown',
      strategy: 'SOURCE_FALLBACK',
      status: 'dead',
      reason: validation.error,
      resolvedAt: new Date().toISOString(),
      latencyMs: Date.now() - startTime
    };
  }

  const hostname = validation.hostname || '';
  const timeoutMs = options.timeoutMs || 7000;

  let target: DownloadTarget;

  try {
    // 3. Dispatch to dedicated provider resolver
    if (hostname.includes('patrins.com') || hostname.includes('files.veelscp.com')) {
      target = await resolvePatrins(cleanUrl, timeoutMs);
    } else if (hostname.includes('veelscp.com')) {
      target = await resolveVeel(cleanUrl, timeoutMs);
    } else if (hostname.includes('scenepacks.com')) {
      target = await resolve411(cleanUrl, timeoutMs);
    } else if (hostname.includes('editpacks.org')) {
      target = await resolveEditPacks(cleanUrl, timeoutMs);
    } else if (hostname.includes('suitstmscenepacks.com')) {
      target = await resolveSuits(cleanUrl, timeoutMs);
    } else if (hostname.includes('mega.nz')) {
      target = {
        provider: 'mega',
        originalUrl: cleanUrl,
        resolvedUrl: cleanUrl,
        directDownloadVerified: false,
        host: 'mega.nz',
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'verified',
        strategy: 'CLOUD_STORAGE',
        status: 'active',
        reason: 'MEGA direct cloud storage folder'
      };
    } else if (hostname.includes('drive.google.com')) {
      target = {
        provider: 'gdrive',
        originalUrl: cleanUrl,
        resolvedUrl: cleanUrl,
        directDownloadVerified: false,
        host: 'drive.google.com',
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'verified',
        strategy: 'CLOUD_STORAGE',
        status: 'active',
        reason: 'Google Drive direct cloud folder'
      };
    } else {
      target = {
        provider: 'unknown',
        originalUrl: cleanUrl,
        resolvedUrl: cleanUrl,
        directDownloadVerified: false,
        canDirectDownload: false,
        requiresExternalPage: true,
        confidence: 'unknown',
        strategy: 'SOURCE_FALLBACK',
        status: 'active',
        reason: 'External web link'
      };
    }
  } catch (err: any) {
    target = {
      provider: 'unknown',
      originalUrl: cleanUrl,
      resolvedUrl: cleanUrl,
      directDownloadVerified: false,
      canDirectDownload: false,
      requiresExternalPage: true,
      confidence: 'unknown',
      strategy: 'SOURCE_FALLBACK',
      status: 'unknown',
      reason: `Resolution error: ${err.message || 'Timeout'}`
    };
  }

  // 4. Attach metadata and save to cache
  target.packId = packId;
  target.resolvedAt = new Date().toISOString();
  target.lastVerifiedAt = new Date().toISOString();
  target.latencyMs = Date.now() - startTime;

  if (target.status !== 'dead') {
    downloadCache.set(cacheKey, target);
  }

  return target;
}
