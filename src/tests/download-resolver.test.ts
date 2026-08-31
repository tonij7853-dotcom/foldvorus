import { validateUrlForSsrf, resolveDownloadTarget } from '../lib/download/resolver';
import { downloadCache } from '../lib/download/cache';

async function runDownloadResolverTests() {
  console.log('=====================================================');
  console.log('      SceneFind Download Resolver Test Suite         ');
  console.log('=====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
      failed++;
    }
  }

  console.log('\n--- 1. SSRF & Security Defense Tests ---');
  
  const ssrfLocalhost = validateUrlForSsrf('http://localhost:3000/secret');
  assert(!ssrfLocalhost.isValid, 'Blocks localhost attempts');

  const ssrf127 = validateUrlForSsrf('http://127.0.0.1/admin');
  assert(!ssrf127.isValid, 'Blocks loopback 127.0.0.1 CIDR');

  const ssrfPrivate10 = validateUrlForSsrf('http://10.0.1.50/internal');
  assert(!ssrfPrivate10.isValid, 'Blocks private 10.0.0.0/8 subnet');

  const ssrfMetadata = validateUrlForSsrf('http://169.254.169.254/latest/meta-data/');
  assert(!ssrfMetadata.isValid, 'Blocks cloud metadata IP (169.254.169.254)');

  const ssrfFtp = validateUrlForSsrf('ftp://scenepacks.com/file.mp4');
  assert(!ssrfFtp.isValid, 'Blocks non-HTTP/HTTPS protocols (FTP)');

  const ssrfUnauthorized = validateUrlForSsrf('https://malicious-site.com/steal');
  assert(!ssrfUnauthorized.isValid, 'Blocks unauthorized external domains');

  const allowVeel = validateUrlForSsrf('https://veelscp.com/gateway/?id=gw_123');
  assert(allowVeel.isValid, 'Permits allowlisted veelscp.com domain');

  const allowPatrins = validateUrlForSsrf('https://patrins.com/f/ab77eac4f7fc');
  assert(allowPatrins.isValid, 'Permits allowlisted patrins.com domain');

  const allow411 = validateUrlForSsrf('https://scenepacks.com/scps/698');
  assert(allow411.isValid, 'Permits allowlisted scenepacks.com domain');

  const allowMega = validateUrlForSsrf('https://mega.nz/folder/abc#123');
  assert(allowMega.isValid, 'Permits allowlisted mega.nz domain');

  const allowGDrive = validateUrlForSsrf('https://drive.google.com/drive/folders/abc');
  assert(allowGDrive.isValid, 'Permits allowlisted drive.google.com domain');

  console.log('\n--- 2. Strategy & Provider Differentiation Tests ---');

  // Test MEGA direct cloud storage
  const megaTarget = await resolveDownloadTarget('https://mega.nz/folder/test#123', 'mega-test-pack');
  assert(megaTarget.provider === 'mega', 'Identifies MEGA provider');
  assert(megaTarget.strategy === 'CLOUD_STORAGE', 'Assigns CLOUD_STORAGE strategy to MEGA');
  assert(megaTarget.confidence === 'verified', 'Labels cloud destination as verified');

  // Test Google Drive direct cloud storage
  const driveTarget = await resolveDownloadTarget('https://drive.google.com/drive/folders/test123', 'drive-test-pack');
  assert(driveTarget.provider === 'gdrive', 'Identifies Google Drive provider');
  assert(driveTarget.strategy === 'CLOUD_STORAGE', 'Assigns CLOUD_STORAGE strategy to Google Drive');

  // Test Malformed URL
  const malformedTarget = await resolveDownloadTarget('not-a-valid-url');
  assert(malformedTarget.status === 'dead', 'Marks malformed URL as dead');
  assert(malformedTarget.confidence === 'unknown', 'Labels malformed URL as unknown confidence');

  console.log('\n--- 3. Cache & Performance Verification ---');

  downloadCache.set('test-cache-key', {
    provider: 'patrins',
    originalUrl: 'https://files.veelscp.com/f/cached-id',
    resolvedUrl: 'https://files.veelscp.com/f/cached-id',
    sharePageUrl: 'https://files.veelscp.com/f/cached-id',
    directDownloadVerified: false,
    filename: 'Cached Movie 4K.mp4',
    fileSize: '4.20 GB',
    resolution: '4K',
    codec: 'HEVC',
    canDirectDownload: false,
    requiresExternalPage: true,
    confidence: 'verified',
    strategy: 'PATRINS_SHARE_PAGE',
    status: 'active'
  });

  const cachedResult = await resolveDownloadTarget('https://files.veelscp.com/f/cached-id', 'test-cache-key');
  assert(cachedResult.filename === 'Cached Movie 4K.mp4', 'Retrieves cached download target instantaneously');
  assert(cachedResult.fileSize === '4.20 GB', 'Retains cached file size');
  assert(cachedResult.strategy === 'PATRINS_SHARE_PAGE', 'Retains cached strategy');

  console.log('\n--- 4. Live Gateway & Public Resolver Tests ---');

  // Test live Veel gateway unshortener
  try {
    const liveGwTarget = await resolveDownloadTarget('https://veelscp.com/gateway/?id=gw_1788162617941_il4rfl8', 'gw-live-test', { timeoutMs: 8000 });
    assert(liveGwTarget.status === 'active', 'Live gateway resolved successfully');
    assert(liveGwTarget.provider === 'patrins' || liveGwTarget.provider === 'veel', 'Detected Patrins/Veel file host');
    assert(liveGwTarget.resolvedUrl?.includes('/f/'), 'Extracted clean /f/<id> share page bypassing video ad gateway');
    if (liveGwTarget.filename) {
      assert(liveGwTarget.filename.length > 0, `Extracted real title: ${liveGwTarget.filename}`);
    }
  } catch (err: any) {
    console.log(`  ⚠ Live network test skipped or timed out: ${err.message}`);
  }

  console.log('\n=====================================================');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runDownloadResolverTests();
