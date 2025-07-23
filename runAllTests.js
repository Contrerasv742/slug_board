#!/usr/bin/env node
import { runAllTests, getTestResults } from './src/utils/testFunctionality.js';

(async () => {
  console.log('\n==============================');
  console.log(' SLUG BOARD FUNCTIONALITY TESTS');
  console.log('==============================\n');

  try {
    const results = await runAllTests();
    const summary = results.summary;
    console.log('\n--- TEST SUMMARY ---');
    console.log(`Total: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Pass Rate: ${summary.passRate}`);
    if (summary.failed === 0) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n❌ Some tests failed. See details below.');
    }

    // Print detailed results
    console.log('\n--- DATABASE ---');
    console.dir(results.database, { depth: null });
    console.log('\n--- CRUD ---');
    console.dir(results.crud, { depth: null });
    console.log('\n--- SCRAPING ---');
    console.dir(results.scraping, { depth: null });
    console.log('\n--- AUTH ---');
    console.dir(results.auth, { depth: null });
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
})(); 