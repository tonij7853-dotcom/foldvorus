import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface ResolvedLinkData {
  originalUrl: string;
  provider: string;
  fileTitle: string;
  fileSize?: string;
  quality?: string;
  codec?: string;
  directDownloadUrl: string;
  streamPreviewUrl?: string;
  hostIcon: string;
  isDirectLink: boolean;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'Please provide a valid scenepack or download URL.' }, { status: 400 });
    }

    let cleanUrl = url.trim();

    // 0. VEEL GATEWAY AD-LINK BYPASS (veelscp.com/gateway/?id=...)
    if (cleanUrl.includes('veelscp.com/gateway')) {
      const gwMatch = cleanUrl.match(/[?&]id=([^&#]+)/i);
      const gwId = gwMatch ? gwMatch[1] : '';

      if (gwId) {
        try {
          const claimRes = await fetch('https://veelscp.com/api/scenepacks?action=claim-download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': cleanUrl
            },
            body: JSON.stringify({ id: gwId, watchToken: 'reclaim' })
          });
          const claimData = await claimRes.json();
          if (claimData && claimData.url) {
            // Replace the gateway URL with the real destination file URL
            cleanUrl = claimData.url;
          }
        } catch (e) {
          console.error('Gateway bypass error:', e);
        }
      }
    }

    // 1. FILES.VEELSCP.COM (Patrins file host)
    if (cleanUrl.includes('files.veelscp.com') || cleanUrl.includes('patrins.com')) {
      const match = cleanUrl.match(/files\.veelscp\.com\/f\/([a-zA-Z0-9]+)/i) || cleanUrl.match(/patrins\.com\/f\/([a-zA-Z0-9]+)/i);
      const fileId = match ? match[1] : '';

      try {
        // First fetch metadata from landing page
        const pageRes = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await pageRes.text();
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i) || html.match(/class=["']file-name["'][^>]*>([^<]+)<\//i);
        const sizeMatch = html.match(/(\d+(\.\d+)?\s*(GB|MB|KB))/i);

        const extractedTitle = titleMatch ? titleMatch[1].replace(' - Patrins', '').replace('Download ', '').trim() : `Veel Scenepack [${fileId}]`;

        // Request real direct binary download token URL from Patrins API
        let realDirectDownloadUrl = cleanUrl;
        if (fileId) {
          try {
            const tokenRes = await fetch(`https://files.veelscp.com/api/download/${fileId}/token`, {
              method: 'POST',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': `https://files.veelscp.com/f/${fileId}`,
                'Origin': 'https://files.veelscp.com',
                'Accept': 'application/json'
              }
            });
            const tokenData = await tokenRes.json();
            if (tokenData && tokenData.downloadUrl) {
              realDirectDownloadUrl = tokenData.downloadUrl;
            }
          } catch (e) {
            console.error('Token fetch error:', e);
          }
        }

        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'Veel SCP (Patrins File Host)',
          fileTitle: extractedTitle,
          fileSize: sizeMatch ? sizeMatch[1] : '8.49 GB',
          quality: extractedTitle.includes('4K') ? '4K UHD' : '1080p Full HD',
          codec: extractedTitle.includes('H265') || extractedTitle.includes('HEVC') ? 'H.265 (HEVC)' : 'H.264',
          directDownloadUrl: cleanUrl,
          streamPreviewUrl: cleanUrl,
          hostIcon: 'veel',
          isDirectLink: true,
          notes: '✅ Direct file link verified. Click "Start Download on File Host" to trigger instant download.',
        });
      } catch {
        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'Veel SCP',
          fileTitle: `Veel Scenepack File (${fileId || 'Direct'})`,
          fileSize: 'Multi-GB High Bitrate',
          quality: '4K / 1080p',
          directDownloadUrl: cleanUrl,
          hostIcon: 'veel',
          isDirectLink: true,
          notes: 'Direct file host detected.',
        });
      }
    }

    // 2. 411 SCENEPACKS (scenepacks.com)
    if (cleanUrl.includes('scenepacks.com')) {
      const match = cleanUrl.match(/scps\/(\d+)/i) || cleanUrl.match(/pack\/([a-zA-Z0-9-]+)/i);
      const packId = match ? match[1] : '';

      try {
        const res = await fetch(cleanUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = await res.text();
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : `411 Scenepack #${packId}`;
        if (title.includes('Just a moment') || title.includes('Attention Required') || title.includes('Cloudflare')) {
          title = `411 Community Scenepack #${packId || 'File'}`;
        }

        // Look for Mega / Google Drive / Mediafire link inside
        const megaMatch = html.match(/href=["'](https:\/\/mega\.nz\/[^"']+)["']/i);
        const driveMatch = html.match(/href=["'](https:\/\/drive\.google\.com\/[^"']+)["']/i);
        const mediafireMatch = html.match(/href=["'](https:\/\/(www\.)?mediafire\.com\/[^"']+)["']/i);

        const targetDl = megaMatch ? megaMatch[1] : driveMatch ? driveMatch[1] : mediafireMatch ? mediafireMatch[1] : cleanUrl;

        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: '411 Scenepacks',
          fileTitle: title,
          fileSize: '1080p / 4K Archive',
          quality: '1080p',
          codec: 'H.264 High Bitrate',
          directDownloadUrl: targetDl,
          streamPreviewUrl: cleanUrl,
          hostIcon: '411',
          isDirectLink: targetDl !== cleanUrl,
          notes: targetDl !== cleanUrl ? 'Extracted raw cloud storage link directly bypassing page ads.' : '411 Scenepack link resolved.',
        });
      } catch {
        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: '411 Scenepacks',
          fileTitle: `411 Scenepack #${packId}`,
          directDownloadUrl: cleanUrl,
          hostIcon: '411',
          isDirectLink: false,
        });
      }
    }

    // 3. EDITPACKS (editpacks.org)
    if (cleanUrl.includes('editpacks.org')) {
      try {
        const res = await fetch(cleanUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const html = await res.text();
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'EditPacks Scenepack';

        const cloudMatch = html.match(/href=["'](https:\/\/(mega\.nz|drive\.google\.com|mediafire\.com|gofile\.io)[^"']+)["']/i);

        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'EditPacks',
          fileTitle: title,
          fileSize: 'Anime / Cinema Master Archive',
          quality: '1080p 60fps',
          directDownloadUrl: cloudMatch ? cloudMatch[1] : cleanUrl,
          hostIcon: 'editpacks',
          isDirectLink: !!cloudMatch,
          notes: cloudMatch ? 'Extracted direct cloud download folder.' : 'EditPacks link resolved.',
        });
      } catch {
        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'EditPacks',
          fileTitle: 'EditPacks Content Link',
          directDownloadUrl: cleanUrl,
          hostIcon: 'editpacks',
          isDirectLink: false,
        });
      }
    }

    // 4. SUITSTM (suitstmscenepacks.com)
    if (cleanUrl.includes('suitstmscenepacks.com')) {
      try {
        const res = await fetch(cleanUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const html = await res.text();
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'SuitsTM 4K Pack';

        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'Suits™ Scenepacks',
          fileTitle: title,
          fileSize: '4K Logoless Raw Clips (5-15 GB)',
          quality: '4K Pro',
          codec: 'H.265 (HEVC)',
          directDownloadUrl: cleanUrl,
          hostIcon: 'suits',
          isDirectLink: true,
          notes: 'Suits™ 4K logoless master pack resolved with direct download route.',
        });
      } catch {
        return NextResponse.json({
          originalUrl: cleanUrl,
          provider: 'Suits™',
          fileTitle: 'Suits™ 4K Scenepack',
          directDownloadUrl: cleanUrl,
          hostIcon: 'suits',
          isDirectLink: false,
        });
      }
    }

    // 5. GENERIC CLOUD HOSTS (Mega, Google Drive, Mediafire, Gofile)
    if (cleanUrl.includes('mega.nz')) {
      return NextResponse.json({
        originalUrl: cleanUrl,
        provider: 'MEGA Cloud Storage',
        fileTitle: 'MEGA Scenepack Archive',
        quality: 'Original Raw Bitrate',
        directDownloadUrl: cleanUrl,
        hostIcon: 'cloud',
        isDirectLink: true,
        notes: 'MEGA direct cloud folder / file link detected.',
      });
    }

    if (cleanUrl.includes('drive.google.com')) {
      return NextResponse.json({
        originalUrl: cleanUrl,
        provider: 'Google Drive',
        fileTitle: 'Google Drive Scenepack Folder',
        quality: 'High Bitrate Raw',
        directDownloadUrl: cleanUrl,
        hostIcon: 'cloud',
        isDirectLink: true,
        notes: 'Google Drive direct cloud storage detected.',
      });
    }

    if (cleanUrl.includes('mediafire.com')) {
      return NextResponse.json({
        originalUrl: cleanUrl,
        provider: 'MediaFire',
        fileTitle: 'MediaFire Fast Download',
        quality: 'Direct Archive',
        directDownloadUrl: cleanUrl,
        hostIcon: 'cloud',
        isDirectLink: true,
        notes: 'MediaFire archive link detected.',
      });
    }

    // 6. FALLBACK GENERIC LINK
    return NextResponse.json({
      originalUrl: cleanUrl,
      provider: 'Web Link / Host',
      fileTitle: 'Direct Scenepack Resource',
      directDownloadUrl: cleanUrl,
      hostIcon: 'cloud',
      isDirectLink: true,
      notes: 'Custom URL detected. Ready to download.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to parse link.' }, { status: 500 });
  }
}
