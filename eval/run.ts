import { extractEvent } from '../src/lib/extract';
import testCases from './test-cases.json';

async function runEval() {
  console.log("Starting ML Extraction Eval...");
  let totalScore = 0;
  let maxScore = 0;

  for (const tc of testCases) {
    console.log(`\nEvaluating: ${tc.name}`);
    const result = await extractEvent({ type: 'link', url: tc.link });

    // Compare fields
    const fields = ['title', 'category', 'is_free'];
    let passed = 0;
    for (const f of fields) {
      if (String(result[f as keyof typeof result]).toLowerCase() === String(tc.expected[f as keyof typeof tc.expected]).toLowerCase()) {
        passed++;
        totalScore++;
      } else {
        console.warn(`  [FAIL] ${f}: expected "${tc.expected[f as keyof typeof tc.expected]}", got "${result[f as keyof typeof result]}"`);
      }
      maxScore++;
    }
    console.log(`  Score: ${passed}/${fields.length}`);
  }

  const accuracy = (totalScore / maxScore) * 100;
  console.log(`\n============================`);
  console.log(`FINAL ACCURACY: ${accuracy.toFixed(1)}%`);
  console.log(`============================`);
}

runEval().catch(console.error);
