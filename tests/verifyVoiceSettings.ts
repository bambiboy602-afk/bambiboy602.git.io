/**
 * Verification Suite for Tom's Deep Male Voice Settings & Synthesis Configuration
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

function runVoiceTests() {
  console.log('====================================================');
  console.log('Running Tom Deep Male Voice Verification Tests');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Check useSpeech.ts default pitch & rate
  const useSpeechContent = readFileSync(resolve('src/hooks/useSpeech.ts'), 'utf-8');
  assert(useSpeechContent.includes('0.72'), 'useSpeech.ts defaults to deep baritone pitch 0.72');
  assert(useSpeechContent.includes('0.90'), 'useSpeech.ts defaults to unhurried curb rate 0.90');

  // 2. Check prioritized male voice keyword filtering
  assert(useSpeechContent.includes('maleKeywords'), 'useSpeech.ts defines explicit male keywords');
  assert(useSpeechContent.includes('femaleKeywords'), 'useSpeech.ts defines female voice exclusion list');
  assert(useSpeechContent.includes("'guy'"), 'maleKeywords includes guy');
  assert(useSpeechContent.includes("'david'"), 'maleKeywords includes david');
  assert(useSpeechContent.includes("'daniel'"), 'maleKeywords includes daniel');
  assert(useSpeechContent.includes("'alex'"), 'maleKeywords includes alex');

  // 3. Check TomBotCard.tsx voice tone preset buttons
  const tomBotCardContent = readFileSync(resolve('src/components/TomBotCard.tsx'), 'utf-8');
  assert(tomBotCardContent.includes('Deep Male Baritone'), 'TomBotCard features Deep Male Baritone preset');
  assert(tomBotCardContent.includes('Deep Grounded Peer'), 'TomBotCard features Deep Grounded Peer preset');
  assert(tomBotCardContent.includes('Warm Street Brother'), 'TomBotCard features Warm Street Brother preset');
  assert(tomBotCardContent.includes('applyVoicePreset(0.70, 0.90'), 'Deep Male Baritone preset uses pitch 0.70 and rate 0.90');
  assert(tomBotCardContent.includes('Masculine Baritone Active'), 'TomBotCard highlights Masculine Baritone Active');

  // 4. Check min pitch allows deep register (0.5)
  assert(tomBotCardContent.includes('min="0.5"'), 'Pitch slider allows deep tuning down to 0.5');

  console.log('====================================================');
  console.log(`Results: ${passed}/${passed + failed} Passed (${failed} Failed)`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVoiceTests();
