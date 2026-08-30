import { registeredAdapters } from '../lib/sources';

export function runAdapterTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  console.log('\n--- Running Source Adapters & Normalization Tests ---');

  // Test 1: 411 Adapter Normalization
  {
    const adapter = registeredAdapters['411'];
    assert(adapter !== undefined, '411 Adapter is registered');
    const normalized = adapter.normalizeResult({
      id: 'cruella-estella-1080p',
      title: 'Cruella (2021) - Estella Scenepack',
      mediaTitle: 'Cruella',
      year: 2021,
      characterName: 'Estella',
      url: 'https://scenepacks.com/pack/cruella-2021-estella',
      tags: ['cruella', 'estella'],
    });

    assert(normalized.sourceId === '411', '411 sourceId assigned properly');
    assert(normalized.mediaTitle === 'Cruella', '411 mediaTitle normalized');
    assert(normalized.quality === '1080p', '411 quality default assigned');
    assert(normalized.sourceUrl.startsWith('https://scenepacks.com'), '411 sourceUrl validated');
  }

  // Test 2: Veel Adapter Normalization
  {
    const adapter = registeredAdapters['veel'];
    assert(adapter !== undefined, 'Veel Adapter is registered');
    const normalized = adapter.normalizeResult({
      id: 'batman-4k-hdr',
      title: 'The Batman (2022) [4K]',
      url: 'https://veelscp.com/pack/batman-4k',
      tags: ['batman', '4k'],
    });

    assert(normalized.sourceId === 'veel', 'Veel sourceId assigned properly');
    assert(normalized.quality === '4K', 'Veel 4K detected from title');
    assert(normalized.sourceUrl.startsWith('https://veelscp.com'), 'Veel sourceUrl validated');
  }

  // Test 3: EditPacks & Suits Adapters
  {
    assert(registeredAdapters['editpacks'] !== undefined, 'EditPacks adapter registered');
    assert(registeredAdapters['suits'] !== undefined, 'Suits adapter registered');
  }

  return { passed, failed };
}
