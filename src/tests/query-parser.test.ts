import { parseQueryIntent } from '../lib/search/query-parser';

export function runQueryParserTests(): { passed: number; failed: number } {
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

  console.log('\n--- Running Query Parser & Intent Extraction Tests ---');

  // Test 1: Mother murder discovery intent
  {
    const intent = parseQueryIntent('girl realizes someone killed her mother');
    assert(intent.gender === 'female', 'Extracts gender: female');
    assert(intent.events.includes('murder discovery'), 'Extracts event: murder discovery');
    assert(intent.tropes.includes('revenge'), 'Extracts trope: revenge');
    assert(intent.emotions.includes('grief'), 'Extracts emotion: grief');
    assert(intent.expandedKeywords.includes('mother'), 'Expands keyword: mother');
  }

  // Test 2: Emotional clips concept expansion
  {
    const intent = parseQueryIntent('find me emotional clips');
    assert(intent.emotions.includes('sadness'), 'Extracts emotion: sadness');
    assert(intent.emotions.includes('grief'), 'Extracts emotion: grief');
    assert(intent.expandedKeywords.includes('crying'), 'Expands keyword: crying');
    assert(intent.expandedKeywords.includes('heartbreak'), 'Expands keyword: heartbreak');
  }

  // Test 3: Exact title query
  {
    const intent = parseQueryIntent('Cruella 2021');
    assert(intent.mediaTitle === 'Cruella', 'Detects mediaTitle: Cruella');
    assert(intent.year === 2021, 'Detects year: 2021');
    assert(intent.detectedMode === 'exact', 'Detects mode: exact');
  }

  // Test 4: Typo correction in query
  {
    const intent = parseQueryIntent('spiderman crying alone');
    assert(intent.mediaTitle === 'Spider-Man', 'Normalizes typo spiderman -> Spider-Man');
    assert(intent.emotions.includes('sadness') || intent.expandedKeywords.includes('crying'), 'Detects crying emotion');
  }

  // Test 5: Badass entrance / aura
  {
    const intent = parseQueryIntent('confident entrance scene');
    assert(intent.emotions.includes('confidence'), 'Detects emotion: confidence');
    assert(intent.tropes.includes('badass'), 'Detects trope: badass');
    assert(intent.visuals.includes('walking'), 'Detects visual: walking');
  }

  return { passed, failed };
}
