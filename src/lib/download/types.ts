export type ProviderType = 'patrins' | 'veel' | '411' | 'editpacks' | 'suits' | 'mega' | 'gdrive' | 'mediafire' | 'unknown';

export type ConfidenceType = 'verified' | 'likely' | 'unknown';

export type DownloadStatus = 'active' | 'dead' | 'unknown';

export type DownloadStrategy = 'DIRECT_OFFICIAL' | 'DIRECT_PATRINS' | 'PATRINS_SHARE_PAGE' | 'CLOUD_STORAGE' | 'SOURCE_FALLBACK';

export interface DownloadTarget {
  id?: string;
  packId?: string;
  provider: ProviderType;
  originalUrl: string;
  resolvedUrl?: string;
  sharePageUrl?: string;
  directDownloadUrl?: string;
  directDownloadVerified: boolean;
  filename?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  resolution?: string;
  codec?: string;
  extension?: string;
  host?: string;
  canDirectDownload: boolean;
  requiresExternalPage: boolean;
  confidence: ConfidenceType;
  strategy: DownloadStrategy;
  reason?: string;
  resolvedAt?: string;
  lastVerifiedAt?: string;
  status: DownloadStatus;
  latencyMs?: number;
}

export interface PatrinsResolution {
  sharePageUrl: string;
  directDownloadUrl?: string;
  directDownloadVerified: boolean;
  filename?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  resolution?: string;
  codec?: string;
  sourceType?: 'html' | 'official_api' | 'provider_metadata';
}

export interface ResolverOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  forceFresh?: boolean;
}
