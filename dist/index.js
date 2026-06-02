#!/usr/bin/env node
import { analyzeFiles } from './analyzer.js';
import { scanFiles } from './scanner.js';
import { getSuggestion } from './suggester.js';
import * as path from 'path';
import * as fs from 'fs';
import { markdownToTxt } from 'markdown-to-txt';
async function main() {
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
            const outputPath = path.join(process.cwd(), 'type-checker.md');
            const plainText = markdownToTxt(suggestion);
            fs.writeFileSync(outputPath, plainText);
            console.log(`💡 Suggested Fix is written in type-checker.md file`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`⚠️  Could not fetch suggestion: ${message}`);
        }
    }
}
main().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Fatal error during scan:', message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map