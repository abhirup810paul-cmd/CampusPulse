/**
 * CampusPulse AI Ingestion Engine — Test Harness
 *
 * A CLI script that runs the extraction engine against all posters
 * in the test-posters/ directory and a sample URL, then prints
 * formatted results to the console.
 *
 * Usage:
 *   npx tsx src/test-harness.ts
 *   npm run dev
 */

import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import { extractEvent } from './lib/extract';
import type { ExtractedEvent } from './types';
import { imageFileToBase64, findImageFiles } from './lib/helpers';

interface ExtractionInput {
  type: 'image' | 'link';
  image_base64?: string;
  mime_type?: string;
  url?: string;
}

// ─── Console Formatting ─────────────────────────────────────────────────────

const DIVIDER = '═'.repeat(70);
const THIN_DIVIDER = '─'.repeat(70);

function colorize(text: string, code: number): string {
  return `\x1b[${code}m${text}\x1b[0m`;
}

const bold = (s: string) => colorize(s, 1);
const green = (s: string) => colorize(s, 32);
const red = (s: string) => colorize(s, 31);
const yellow = (s: string) => colorize(s, 33);
const cyan = (s: string) => colorize(s, 36);
const dim = (s: string) => colorize(s, 2);

function printEvent(event: ExtractedEvent, label: string): void {
  const confColor = event.confidence === 'high' ? green : red;

  console.log(`\n${THIN_DIVIDER}`);
  console.log(bold(`  📋 ${label}`));
  console.log(THIN_DIVIDER);
  console.log(`  ${cyan('Title:')}        ${event.title ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('Description:')}  ${event.description ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('Start Time:')}   ${event.start_time ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('End Time:')}     ${event.end_time ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('Location:')}     ${event.location ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('Category:')}     ${event.category ?? dim('(not extracted)')}`);
  console.log(`  ${cyan('Confidence:')}   ${confColor(event.confidence.toUpperCase())}`);
  console.log();
  console.log(dim(`  Raw JSON:`));
  console.log(dim(`  ${JSON.stringify(event, null, 2).split('\n').join('\n  ')}`));
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Main Test Runner ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\n${DIVIDER}`);
  console.log(bold('  🚀 CampusPulse AI Ingestion Engine — Test Harness'));
  console.log(`  ${dim(`Running at ${new Date().toISOString()}`)}`);
  console.log(DIVIDER);

  const postersDir = path.resolve('test-posters');
  const imageFiles = findImageFiles(postersDir);

  if (imageFiles.length === 0) {
    console.log(yellow('\n  ⚠ No images found in test-posters/ directory.'));
    console.log(dim('    Add some event poster images (.png, .jpg, .webp) and try again.\n'));
  } else {
    console.log(`\n  ${green('✓')} Found ${imageFiles.length} poster(s) in test-posters/\n`);

    // ── Test each poster ──────────────────────────────────────────────
    for (let i = 0; i < imageFiles.length; i++) {
      const filePath = imageFiles[i];
      const base64Data = imageFileToBase64(filePath);

      console.log(dim(`  ⏳ Processing: ${base64Data.fileName} (${base64Data.mimeType})...`));

      const input: ExtractionInput = {
        type: 'image',
        image_base64: base64Data.base64,
        mime_type: base64Data.mimeType,
      };

      const startMs = Date.now();
      const event = await extractEvent(input);
      const elapsed = Date.now() - startMs;

      printEvent(event, `${base64Data.fileName} ${dim(`(${elapsed}ms)`)}`);

      // Rate limit protection for Free Tier: Wait 5 seconds between requests
      if (i < imageFiles.length - 1) {
        console.log(yellow(`  ⏱️  Waiting 5 seconds to respect API rate limits...`));
        await delay(5000);
      }
    }
  }

  // ── Test URL extraction ─────────────────────────────────────────────
  console.log(`\n${DIVIDER}`);
  console.log(bold('  🔗 Testing URL Extraction'));
  console.log(DIVIDER);

  const testUrl = 'https://lu.ma/college-hackathon';
  console.log(dim(`\n  ⏳ Processing URL: ${testUrl}...`));

  const urlInput: ExtractionInput = {
    type: 'link',
    url: testUrl,
  };

  const startMs = Date.now();
  const urlEvent = await extractEvent(urlInput);
  const elapsed = Date.now() - startMs;

  printEvent(urlEvent, `URL: ${testUrl} ${dim(`(${elapsed}ms)`)}`);

  // ── Test error handling (corrupted input) ───────────────────────────
  console.log(`\n${DIVIDER}`);
  console.log(bold('  🛡️  Testing Error Handling (Corrupted Input)'));
  console.log(DIVIDER);

  const corruptedInput: ExtractionInput = {
    type: 'image',
    image_base64: 'not_a_valid_base64_string_at_all',
    mime_type: 'image/png',
  };

  console.log(dim('\n  ⏳ Sending corrupted base64 data...'));
  const corruptedEvent = await extractEvent(corruptedInput);
  printEvent(corruptedEvent, 'Corrupted Input (should be confidence: low)');

  // ── Summary ─────────────────────────────────────────────────────────
  console.log(`\n${DIVIDER}`);
  console.log(bold('  ✅ Test harness complete!'));
  console.log(DIVIDER);
  console.log();
}

main().catch((err) => {
  console.error('\n❌ Fatal error in test harness:', err);
  process.exit(1);
});
