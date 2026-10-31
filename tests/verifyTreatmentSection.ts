/**
 * Verification Suite for Community Resources 4x4 Links Architecture & Removal of Direct Treatment Banner:
 * 1. Removal of "Community Resources • Direct Treatment & Recovery" banner
 * 2. Exactly 4 links per category (Housing, Work, Treatment, Legal)
 * 3. Removal of recoveryhomes.pdf link and replacement with template
 * 4. Preservation of Granite Mountain Behavioral, Bambi (602-767-2147), and Axiom Care in Treatment
 * 5. Provided fill-in templates across all categories
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HEALTH_RESOURCES } from '../src/data/communityResourcesData';
import { MAESTRO_RESOURCE_DATABASE } from '../src/data/geminiSkillsData';
import { COMMUNITY_RESOURCE_CATEGORIES } from '../src/data/communityResourceLinks';

function runCommunityResourcesVerificationTests() {
  console.log('====================================================');
  console.log('Running Community Resources 4x4 Links Verification Tests');
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

  // 1. Verify "Community Resources • Direct Treatment & Recovery" is completely removed
  const profileHeaderContent = readFileSync(resolve('src/components/ProfileHeader.tsx'), 'utf-8');
  const modalContent = readFileSync(resolve('src/components/CommunityResourcesModal.tsx'), 'utf-8');

  assert(
    !profileHeaderContent.includes('Community Resources • Direct Treatment'),
    'ProfileHeader: "Community Resources • Direct Treatment & Recovery" box is removed'
  );
  assert(
    !modalContent.includes('Community Resources • Direct Treatment'),
    'CommunityResourcesModal: persistent "Community Resources • Direct Treatment & Recovery" banner is removed'
  );

  // 2. Verify removal of recoveryhomes.pdf link
  assert(
    !profileHeaderContent.includes('href="/recoveryhomes.pdf"'),
    'ProfileHeader: recoveryhomes.pdf link is removed'
  );
  assert(
    !modalContent.includes('href="/recoveryhomes.pdf"'),
    'CommunityResourcesModal: recoveryhomes.pdf link is removed'
  );

  // 3. Verify COMMUNITY_RESOURCE_CATEGORIES 4x4 links data structure
  const categories = Object.keys(COMMUNITY_RESOURCE_CATEGORIES) as Array<'housing' | 'work' | 'treatment' | 'legal'>;
  assert(categories.length === 4, 'COMMUNITY_RESOURCE_CATEGORIES defines exactly 4 categories');

  categories.forEach((cat) => {
    const group = COMMUNITY_RESOURCE_CATEGORIES[cat];
    assert(
      group.links.length === 4,
      `Category "${cat}" contains exactly 4 links (found ${group.links.length})`
    );
  });

  // 4. Housing category checks
  const housingLinks = COMMUNITY_RESOURCE_CATEGORIES.housing.links;
  assert(
    housingLinks[0].isTemplate === true && housingLinks[0].title.includes('Housing Template 1'),
    'Housing Link 1: Template replaces recoveryhomes.pdf'
  );
  assert(
    housingLinks.some((l) => l.url.includes('Comprehensive_Recovery_Directory_V2.pdf')),
    'Housing Link 2: Comprehensive Recovery Directory V2.pdf is present'
  );
  assert(
    housingLinks.filter((l) => l.isTemplate).length === 3,
    'Housing has 3 template links provided for user fill-in'
  );

  // 5. Work category checks
  const workLinks = COMMUNITY_RESOURCE_CATEGORIES.work.links;
  assert(
    workLinks.some((l) => l.url.includes('Registered-Apprenticeship-Program-List.pdf')),
    'Work Link 1: Registered-Apprenticeship-Program-List.pdf is present'
  );
  assert(
    workLinks.filter((l) => l.isTemplate).length === 3,
    'Work has 3 template links provided for user fill-in'
  );

  // 6. Treatment category checks (Granite Mountain, Bambi, Axiom Care + 1 Template)
  const treatmentLinks = COMMUNITY_RESOURCE_CATEGORIES.treatment.links;
  const graniteLink = treatmentLinks.find((l) => l.title === 'Granite Mountain Behavioral');
  assert(
    !!graniteLink && graniteLink.url === 'https://granitemountainbhc.com',
    'Treatment Link 1: Granite Mountain Behavioral is present and links to https://granitemountainbhc.com'
  );

  const bambiLink = treatmentLinks.find((l) => l.title.includes('Bambi (602-767-2147)'));
  assert(
    !!bambiLink && bambiLink.url === 'tel:6027672147',
    'Treatment Link 2: Bambi (602-767-2147) is present and links to tel:6027672147'
  );

  const axiomLink = treatmentLinks.find((l) => l.title === 'Axiom Care');
  assert(
    !!axiomLink && axiomLink.url === 'https://axiomcareaz.org',
    'Treatment Link 3: Axiom Care is present and links to https://axiomcareaz.org'
  );

  const treatmentTemplate = treatmentLinks.find((l) => l.isTemplate);
  assert(
    !!treatmentTemplate && treatmentTemplate.title.includes('Treatment Template'),
    'Treatment Link 4: Treatment Template is provided for user fill-in'
  );

  // 7. Legal category checks (4 templates)
  const legalLinks = COMMUNITY_RESOURCE_CATEGORIES.legal.links;
  assert(
    legalLinks.every((l) => l.isTemplate),
    'Legal has 4 template links provided for user fill-in'
  );

  // 8. Component integration checks
  assert(
    profileHeaderContent.includes('COMMUNITY_RESOURCE_CATEGORIES.housing.links'),
    'ProfileHeader renders 4 Housing links from COMMUNITY_RESOURCE_CATEGORIES'
  );
  assert(
    profileHeaderContent.includes('COMMUNITY_RESOURCE_CATEGORIES.work.links'),
    'ProfileHeader renders 4 Work links from COMMUNITY_RESOURCE_CATEGORIES'
  );
  assert(
    profileHeaderContent.includes('COMMUNITY_RESOURCE_CATEGORIES.treatment.links'),
    'ProfileHeader renders 4 Treatment links from COMMUNITY_RESOURCE_CATEGORIES'
  );
  assert(
    profileHeaderContent.includes('COMMUNITY_RESOURCE_CATEGORIES.legal.links'),
    'ProfileHeader renders 4 Legal links from COMMUNITY_RESOURCE_CATEGORIES'
  );

  // 9. HEALTH_RESOURCES data checks
  const hasGranite = HEALTH_RESOURCES.some((r) => r.id === 'granite-mountain-behavioral' && r.website?.includes('granitemountainbhc.com'));
  assert(hasGranite, 'HEALTH_RESOURCES includes granite-mountain-behavioral with correct website');

  const hasBambi = HEALTH_RESOURCES.some((r) => r.id === 'bambi-direct-health' && r.phone.includes('602-767-2147'));
  assert(hasBambi, 'HEALTH_RESOURCES includes bambi-direct-health with 602-767-2147');

  const hasAxiom = HEALTH_RESOURCES.some((r) => r.id === 'axiom-care' && r.website?.includes('axiomcareaz.org'));
  assert(hasAxiom, 'HEALTH_RESOURCES includes axiom-care with axiomcareaz.org');

  // 10. MAESTRO_RESOURCE_DATABASE checks
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

runCommunityResourcesVerificationTests();
