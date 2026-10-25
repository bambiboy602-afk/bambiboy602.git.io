/**
 * Verification Suite for the 3 Treatment Links:
 * 1. Granite Mountain Behavioral
 * 2. 6027672147 Bambi
 * 3. Axiom Care
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HEALTH_RESOURCES } from '../src/data/communityResourcesData';
import { MAESTRO_RESOURCE_DATABASE } from '../src/data/geminiSkillsData';

function runTreatmentSectionTests() {
  console.log('====================================================');
  console.log('Running Treatment Section 3 Links Verification Tests');
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

  // 1. ProfileHeader.tsx checks
  const profileHeaderContent = readFileSync(resolve('src/components/ProfileHeader.tsx'), 'utf-8');
  assert(profileHeaderContent.includes('Granite Mountain Behavioral'), 'ProfileHeader features Granite Mountain Behavioral');
  assert(profileHeaderContent.includes('https://granitemountainbhc.com'), 'ProfileHeader links to granitemountainbhc.com');
  assert(profileHeaderContent.includes('6027672147 Bambi'), 'ProfileHeader features 6027672147 Bambi');
  assert(profileHeaderContent.includes('tel:6027672147'), 'ProfileHeader links to tel:6027672147');
  assert(profileHeaderContent.includes('Axiom Care'), 'ProfileHeader features Axiom Care');
  assert(profileHeaderContent.includes('https://axiomcareaz.org'), 'ProfileHeader links to axiomcareaz.org');

  // 2. CommunityResourcesModal.tsx checks
  const modalContent = readFileSync(resolve('src/components/CommunityResourcesModal.tsx'), 'utf-8');
  assert(modalContent.includes('Granite Mountain Behavioral'), 'CommunityResourcesModal features Granite Mountain Behavioral');
  assert(modalContent.includes('https://granitemountainbhc.com'), 'CommunityResourcesModal links to granitemountainbhc.com');
  assert(modalContent.includes('6027672147 Bambi'), 'CommunityResourcesModal features 6027672147 Bambi');
  assert(modalContent.includes('tel:6027672147'), 'CommunityResourcesModal links to tel:6027672147');
  assert(modalContent.includes('Axiom Care'), 'CommunityResourcesModal features Axiom Care');
  assert(modalContent.includes('https://axiomcareaz.org'), 'CommunityResourcesModal links to axiomcareaz.org');

  // 3. HEALTH_RESOURCES data checks
  const hasGranite = HEALTH_RESOURCES.some((r) => r.id === 'granite-mountain-behavioral' && r.website?.includes('granitemountainbhc.com'));
  assert(hasGranite, 'HEALTH_RESOURCES includes granite-mountain-behavioral with correct website');

  const hasBambi = HEALTH_RESOURCES.some((r) => r.id === 'bambi-direct-health' && r.phone.includes('602-767-2147'));
  assert(hasBambi, 'HEALTH_RESOURCES includes bambi-direct-health with 602-767-2147');

  const hasAxiom = HEALTH_RESOURCES.some((r) => r.id === 'axiom-care' && r.website?.includes('axiomcareaz.org'));
  assert(hasAxiom, 'HEALTH_RESOURCES includes axiom-care with axiomcareaz.org');

  // 4. MAESTRO_RESOURCE_DATABASE checks
  const maestroHasGranite = MAESTRO_RESOURCE_DATABASE.some((r) => r.id === 'granite_mountain');
  assert(maestroHasGranite, 'MAESTRO_RESOURCE_DATABASE includes granite_mountain');

  const maestroHasAxiom = MAESTRO_RESOURCE_DATABASE.some((r) => r.id === 'axiom_care');
  assert(maestroHasAxiom, 'MAESTRO_RESOURCE_DATABASE includes axiom_care');

  console.log('====================================================');
  console.log(`Results: ${passed}/${passed + failed} Passed (${failed} Failed)`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTreatmentSectionTests();
