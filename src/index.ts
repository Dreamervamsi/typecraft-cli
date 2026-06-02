import { analyzeFiles } from './analyzer.js';
import { scanFiles } from './scanner.js';
import { getSuggestion } from './suggester.js';

async function main(): Promise<void> {
  const files = await scanFiles();
  const findings = analyzeFiles(files);

  if (findings.length === 0) {
    console.log('✅ No type issues found.');
    return;
  }

  for (const finding of findings) {
    console.log(`\nFound issue in ${finding.file}:${finding.line}`);
    console.log(`Kind:    ${finding.kind}`);
    console.log(`Message: ${finding.message}`);

    try {
      const suggestion = await getSuggestion(finding);
      console.log(`💡 Suggested Fix:\n${suggestion}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`⚠️  Could not fetch suggestion: ${message}`);
    }
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Fatal error during scan:', message);
  process.exit(1);
});