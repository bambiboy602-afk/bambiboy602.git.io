/**
 * Test Suite: verifyGeminiSkillsMaestro.ts
 *
 * Verifies Gemini Skills Architecture & Maestro v1.3 Universal Runtime:
 * 1. Skill Collection & Specializations (Skill 0/99 Maestro, Skill 1 Tom Core, Skill 2 B.A.M.B.I., Skill 3 The Grower, Skill 5 Master Vault)
 * 2. Privacy Quarantine: Never leak number ending in 6251
 * 3. Low-Battery Override: Drop (602) 767-2147, CASS shelter, power-down order
 * 4. Overdose Override: A.R.S. § 36-2263 Good Samaritan protections & emergency medical routing
 * 5. Sudo Tom Developer Telemetry: Maestro v1.3 Universal Runtime confirmation
 * 6. Word Economy & PAT: Concise 2–4 sentence responses
 */

import {
  GEMINI_SKILLS_COLLECTION,
  GOOGLE_GEMS_COLLECTION,
  BAMBI_PUBLIC_PHONE,
  sanitizePrivacyQuarantine,
  VERIFIED_PHOENIX_GRID,
  MAESTRO_CONFIG,
  MAESTRO_RESOURCE_DATABASE,
} from '../src/data/geminiSkillsData';
import { generateClientTomReply, executeTomModule } from '../src/services/tomBrainEngine';
import { TOM_OPENING_STATEMENT } from '../src/data/tomOpeningStatements';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
  }
}

console.log('====================================================');
console.log('Running Gemini Skills & Maestro v1.3 Verification Tests');
console.log('====================================================\n');

// Test Group 1: Gemini Skills Collection & Tripod Legs
console.log('Test Group 1: Gemini Skills Collection & Tripod Legs');
assert(Array.isArray(GEMINI_SKILLS_COLLECTION), 'GEMINI_SKILLS_COLLECTION is an array');
assert(GEMINI_SKILLS_COLLECTION.length === 5, 'Skills collection contains 5 distinct skills');

const skillIds = GEMINI_SKILLS_COLLECTION.map((s) => s.id);
assert(skillIds.includes('tom-core'), 'Skill 1: tom-core is present');
assert(skillIds.includes('bambi'), 'Skill 2: bambi is present');
assert(skillIds.includes('the-grower'), 'Skill 3: the-grower is present');
assert(skillIds.includes('master-vault'), 'Skill 5: master-vault is present');
assert(skillIds.includes('maestro'), 'Skill 0/99: maestro is present');

// Backward compatibility check
assert(GOOGLE_GEMS_COLLECTION === GEMINI_SKILLS_COLLECTION, 'GOOGLE_GEMS_COLLECTION is aliased for backwards compatibility');

// Test Group 2: Privacy Quarantine Enforcement (Number ending in 6251)
console.log('\nTest Group 2: Privacy Quarantine Enforcement');
const leakSample1 = 'You can reach me at 602-555-6251 for private questions.';
const sanitized1 = sanitizePrivacyQuarantine(leakSample1);
assert(!sanitized1.includes('6251'), 'Quarantined number 602-555-6251 is sanitized');
assert(sanitized1.includes(BAMBI_PUBLIC_PHONE), 'Replaced with authorized Bambi line (602) 767-2147');

const leakSample2 = '+16027676251';
const sanitized2 = sanitizePrivacyQuarantine(leakSample2);
assert(!sanitized2.includes('6251'), 'Quarantined international format is sanitized');

// Test Group 3: Low-Battery Override
console.log('\nTest Group 3: Low-Battery Override');
const lowBatteryRes = generateClientTomReply('My phone is at 5% battery and about to die.');
assert(lowBatteryRes.reply.includes('(602) 767-2147'), 'Low battery reply drops Bambi line (602) 767-2147');
assert(lowBatteryRes.reply.includes('CASS'), 'Low battery reply routes to CASS emergency shelter');
assert(lowBatteryRes.reply.includes('12th Ave & Madison') || lowBatteryRes.reply.includes('12th & Madison'), 'CASS cross-streets are provided');
assert(lowBatteryRes.reply.toLowerCase().includes('power') || lowBatteryRes.reply.toLowerCase().includes('screen'), 'Instructs power-down to save battery');

// Test Group 4: Overdose / Ingestion Override
console.log('\nTest Group 4: Overdose / Acute Medical Danger Override');
const overdoseRes = generateClientTomReply('Someone just took an overdose and is unresponsive');
assert(overdoseRes.reply.includes('Good Samaritan'), 'Overdose reply cites Good Samaritan law');
assert(overdoseRes.reply.includes('36-2263'), 'Cites Arizona statute A.R.S. § 36-2263');
assert(overdoseRes.reply.includes('911'), 'Directs immediately to emergency 911 / ER');

// Test Group 5: Sudo Tom Developer Telemetry
console.log('\nTest Group 5: Sudo Tom Developer Telemetry');
const sudoRes = generateClientTomReply('sudo tom status');
assert(sudoRes.reply.includes('Maestro v1.3 Universal Runtime'), 'Sudo Tom reports Maestro v1.3 Universal Runtime');
assert(sudoRes.reply.includes('Gemini Skills Architecture'), 'Sudo Tom reports Gemini Skills Architecture');
assert(sudoRes.reply.includes('Skill 0/99') && sudoRes.reply.includes('Skill 1'), 'Sudo Tom lists modular skills');

// Test Group 6: Opening Statement & Greeting
console.log('\nTest Group 6: Opening Statement & Greeting');
assert(
  TOM_OPENING_STATEMENT.chatWelcome === "Hey. You've reached Tom. What's going on?",
  'Default welcome message matches Maestro v1.3 canonical greeting'
);

// Test Group 7: Verified Phoenix Grid Memory
console.log('\nTest Group 7: Verified Phoenix Grid Memory');
assert(VERIFIED_PHOENIX_GRID.emergencyShelter.length >= 3, 'Verified emergency shelters recorded');
assert(VERIFIED_PHOENIX_GRID.lowBarrierHousing.length >= 4, 'Verified low-barrier recovery houses recorded');
// Test Group 8: Maestro Directory Database & Runtime Config
console.log('\nTest Group 8: Maestro Directory Database & Runtime Config');
assert(Array.isArray(MAESTRO_RESOURCE_DATABASE), 'MAESTRO_RESOURCE_DATABASE is an array');
assert(MAESTRO_RESOURCE_DATABASE.length >= 3, 'MAESTRO_RESOURCE_DATABASE contains core resources');
assert(MAESTRO_RESOURCE_DATABASE.some((r) => r.id === 'bambi_direct'), 'bambi_direct is present');
assert(MAESTRO_RESOURCE_DATABASE.some((r) => r.id === 'cass_shelter'), 'cass_shelter is present');
assert(MAESTRO_RESOURCE_DATABASE.some((r) => r.id === 'craig_shell'), 'craig_shell is present');
assert(MAESTRO_CONFIG.version === '1.3', 'MAESTRO_CONFIG version is 1.3');
assert(MAESTRO_CONFIG.twilioPhoneNumber === '+16027672147', 'MAESTRO_CONFIG phone number is +16027672147');
assert(MAESTRO_CONFIG.livekitUrl.includes('livekit.cloud'), 'MAESTRO_CONFIG livekitUrl is set');

// Test Group 9: Gemini Skills Transition Utility
console.log('\nTest Group 9: Gemini Skills Transition Utility');
const {
  translateLegacyGemsText,
  migrateGemModeToSkillMode,
  getSkillLabel,
  getSkillBadgeLabel,
  GEMINI_SKILLS_UI_CONFIG,
} = await import('../src/utils/geminiSkillsTransition');

assert(
  translateLegacyGemsText('Google Gems Architecture') === 'Gemini Skills Architecture',
  'translateLegacyGemsText translates Google Gems Architecture'
);
assert(
  translateLegacyGemsText('View Gem Prompts') === 'View Skills Hub',
  'translateLegacyGemsText translates Gem Prompts'
);
assert(
  translateLegacyGemsText('Gem 1: Tom Core') === 'Skill 1: Tom Core',
  'translateLegacyGemsText translates Gem 1 to Skill 1'
);
assert(
  migrateGemModeToSkillMode('tom-core') === 'tom-core',
  'migrateGemModeToSkillMode handles tom-core'
);
assert(
  migrateGemModeToSkillMode('bambi') === 'bambi',
  'migrateGemModeToSkillMode handles bambi'
);
assert(
  migrateGemModeToSkillMode('the-grower') === 'the-grower',
  'migrateGemModeToSkillMode handles the-grower'
);
assert(
  migrateGemModeToSkillMode('maestro') === 'maestro',
  'migrateGemModeToSkillMode handles maestro'
);
assert(
  getSkillLabel('tom-core').includes('Tom'),
  'getSkillLabel returns Tom title'
);
assert(
  getSkillBadgeLabel('tom-core') === 'Skill #1',
  'getSkillBadgeLabel returns Skill #1'
);
assert(
  getSkillBadgeLabel('maestro') === 'Skill 0/99',
  'getSkillBadgeLabel returns Skill 0/99'
);
assert(
  GEMINI_SKILLS_UI_CONFIG.navButtonText === 'Gemini Skills',
  'UI Config specifies Gemini Skills nav button'
);
assert(
  GEMINI_SKILLS_UI_CONFIG.activeVersion === 'v1.3',
  'UI Config active version is v1.3'
);

// Test Group 10: Core Tom Identity Prompt in creatorData.ts
console.log('\nTest Group 10: Core Tom Identity Prompt in creatorData.ts');
const {
  CORE_TOM_IDENTITY_PROMPT,
  INITIAL_CREATOR_PROFILE,
} = await import('../src/data/creatorData');

assert(typeof CORE_TOM_IDENTITY_PROMPT === 'string', 'CORE_TOM_IDENTITY_PROMPT is exported as string');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Maestro v1.3'), 'Prompt reflects Maestro v1.3 Universal Runtime');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Gemini Skills'), 'Prompt reflects Gemini Skills architecture');
assert(CORE_TOM_IDENTITY_PROMPT.includes('B.A.M.B.I.'), 'Prompt is grounded in B.A.M.B.I. framework');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Behavioral Adaptation & Mobility-Based Integration'), 'Prompt defines full B.A.M.B.I. name');
assert(CORE_TOM_IDENTITY_PROMPT.includes('RSM (Recursive Stabilization Mapping)'), 'Prompt defines RSM');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Baseline') && CORE_TOM_IDENTITY_PROMPT.includes('Awareness'), 'Prompt includes silent 5-stage B.A.M.B.I. cycle');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Never Call the Police'), 'Prompt enforces No Cold Hotlines principle');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Low-Battery Override (<10%)'), 'Prompt enforces Low-Battery override');
assert(CORE_TOM_IDENTITY_PROMPT.includes('Arizona Good Samaritan Law (A.R.S. § 36-2263)'), 'Prompt enforces Overdose Good Samaritan override');
assert(CORE_TOM_IDENTITY_PROMPT.includes('6251'), 'Prompt enforces Privacy Firewall quarantine for number ending in 6251');
assert(INITIAL_CREATOR_PROFILE.coreTomPrompt === CORE_TOM_IDENTITY_PROMPT, 'INITIAL_CREATOR_PROFILE attaches coreTomPrompt');

console.log('\n====================================================');
console.log(`Results: ${passedTests}/${totalTests} Passed (${totalTests - passedTests} Failed)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
