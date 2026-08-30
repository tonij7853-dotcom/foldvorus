import { executeSearch } from '../lib/search/search-service';

export async function runSearchQualityTests(): Promise<{ passed: number; failed: number }> {
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

  console.log('\n--- Running Search Engine Quality & Intent Discovery Test Suite ---');

  // Test 1: Exact search "Cruella"
  {
    const res = await executeSearch('Cruella', 'exact');
    assert(res.results.length > 0, 'Returns results for "Cruella"');
    assert(res.results[0].mediaTitle === 'Cruella', 'Top match has mediaTitle Cruella');
    assert(res.results[0].confidence === 'BEST MATCH', 'Cruella is labeled BEST MATCH');
  }

  // Test 2: Character search "Estella"
  {
    const res = await executeSearch('Estella', 'all');
    assert(res.results.length > 0, 'Returns results for "Estella"');
    assert(res.results[0].characterName === 'Estella', 'Top match character is Estella');
  }

  // Test 3: Natural language scene "someone finds out who killed their mother"
  {
    const res = await executeSearch('someone finds out who killed their mother', 'vibe');
    assert(res.results.length > 0, 'Discovers packs for mother murder scene without knowing movie title');
    const topResult = res.results[0];
    assert(
      topResult.mediaTitle === 'Cruella' || topResult.mediaTitle === 'The Batman',
      `Identifies iconic mother/parent murder discovery pack (Found: ${topResult.mediaTitle})`
    );
  }

  // Test 4: Broad vibe search "find me emotional clips"
  {
    const res = await executeSearch('find me emotional clips', 'vibe');
    assert(res.results.length >= 3, 'Returns multiple packs for broad emotional clips');
    assert(res.vibeCategories !== undefined && res.vibeCategories.length > 0, 'Organizes broad emotional search into vibe clusters (Grief, Breakups, etc.)');
  }

  // Test 5: Typo queries: "cruela"
  {
    const res = await executeSearch('cruela', 'all');
    assert(res.results.length > 0 && res.results[0].mediaTitle === 'Cruella', 'Typo tolerance: "cruela" -> finds Cruella');
  }

  // Test 6: Typo queries: "spiderman"
  {
    const res = await executeSearch('spiderman', 'all');
    assert(res.results.length > 0 && res.results[0].mediaTitle === 'Spider-Man', 'Typo tolerance: "spiderman" -> finds Spider-Man');
  }

  // Test 7: Typo queries: "rue bennet"
  {
    const res = await executeSearch('rue bennet', 'all');
    assert(res.results.length > 0 && res.results[0].characterName === 'Rue Bennett', 'Typo tolerance: "rue bennet" -> finds Rue Bennett');
  }

  // Test 8: Typo queries: "intersteller"
  {
    const res = await executeSearch('intersteller', 'all');
    assert(res.results.length > 0 && res.results[0].mediaTitle === 'Interstellar', 'Typo tolerance: "intersteller" -> finds Interstellar');
  }

  // Test 9: Visual search: "screaming in the rain"
  {
    const res = await executeSearch('screaming in the rain', 'vibe');
    assert(res.results.length > 0, 'Discovers packs for "screaming in the rain"');
    const hasBatmanOrSpiderman = res.results.slice(0, 3).some(p => p.mediaTitle === 'The Batman' || p.mediaTitle === 'Spider-Man');
    assert(hasBatmanOrSpiderman, 'Ranks The Batman or Spider-Man near top for rain screaming grief scene');
  }

  // Test 10: Relationship scene: "mother and daughter arguing"
  {
    const res = await executeSearch('mother and daughter arguing', 'vibe');
    assert(res.results.length > 0, 'Discovers packs for mother-daughter argument');
    assert(res.results[0].mediaTitle === 'Euphoria', 'Ranks Euphoria (Rue & Leslie) top for mother-daughter argument');
  }

  // Test 11: Edit purpose: "clips for a sad edit"
  {
    const res = await executeSearch('clips for a sad edit', 'vibe');
    assert(res.results.length > 0, 'Returns candidate packs for sad edit');
    assert(res.results.some(p => p.vibeTags?.includes('sad edit') || p.tags.includes('sad edit')), 'Matches packs tagged with sad edit');
  }

  // Test 12: Deduplication verification
  {
    const res = await executeSearch('Cruella', 'exact');
    assert(res.groupedResults.length > 0, 'Generates grouped media entries');
    const cruellaGroup = res.groupedResults.find(g => g.mediaTitle === 'Cruella');
    assert(cruellaGroup !== undefined && cruellaGroup.totalPacks >= 2, 'Deduplicates multiple packs under Cruella while retaining source links');
  }

  return { passed, failed };
}
