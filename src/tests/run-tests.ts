import { runQueryParserTests } from './query-parser.test';
import { runSearchQualityTests } from './search-quality.test';
import { runAdapterTests } from './adapters.test';

async function main() {
  console.log('=====================================================');
  console.log('       SceneFind Automated Verification Suite        ');
  console.log('=====================================================');

  const parserRes = runQueryParserTests();
  const adapterRes = runAdapterTests();
  const searchRes = await runSearchQualityTests();

  const totalPassed = parserRes.passed + adapterRes.passed + searchRes.passed;
  const totalFailed = parserRes.failed + adapterRes.failed + searchRes.failed;

  console.log('\n=====================================================');
  console.log(`Results: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('=====================================================');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
