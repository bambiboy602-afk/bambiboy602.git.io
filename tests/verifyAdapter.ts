/**
 * Test Suite: verifyAdapter.ts
 *
 * Verifies the Step 14 remediation for the shared module contract adapter:
 * 1. Source IDs are deterministic and independent of array position.
 * 2. Community phone numbers and external links default to 'unverified' without explicit live proof.
 * 3. Project specification documents can be marked verified as internal design specifications,
 *    with explicit notes that external community resources cited within them are not automatically verified.
 * 4. accessedAt and lastVerifiedAt are omitted when unknown.
 * 5. requiresOwnerApproval is evaluated strictly as an advisory signal.
 * 6. Module results retain original TomBrainResponse properties and proper ModuleName attribution.
 */

import {
  executeTomModule,
  mapToSourceReference,
  generateDeterministicSourceId,
} from '../src/services/tomBrainEngine';
import { ModuleResult, SourceReference } from '../src/types/moduleContract';
import { TomBrainResponse } from '../src/services/tomBrainEngine';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (details) {
      console.error(`    Details: ${details}`);
    }
  }
}

function runSuite() {
  console.log('====================================================');
  console.log('Running Step 14 Adapter Verification Tests');
  console.log('====================================================\n');

  // Test Group 1: Deterministic Source IDs
  console.log('Test Group 1: Deterministic Source IDs');
  {
    const id1 = generateDeterministicSourceId('tel:602-767-2147', 'Contact Bambi');
    const id2 = generateDeterministicSourceId('tel:602-767-2147', 'Contact Bambi');
    assert(id1 === id2, 'Identical inputs produce identical source IDs', `id1=${id1}, id2=${id2}`);

    const mappedAtIdx0 = mapToSourceReference({ title: 'CASS Shelter', uri: 'tel:602-256-6945' });
    const mappedAtIdx5 = mapToSourceReference({ title: 'CASS Shelter', uri: 'tel:602-256-6945' });
    assert(
      mappedAtIdx0.id === mappedAtIdx5.id,
      'Source IDs are position-independent (no array-index dependency)',
      `idA=${mappedAtIdx0.id}, idB=${mappedAtIdx5.id}`
    );

    assert(
      !mappedAtIdx0.id.includes('src-1-') && !mappedAtIdx0.id.includes('src-6-'),
      'Source ID does not embed arbitrary sequential counters'
    );
  }

  // Test Group 2: Conservative Source Provenance Statuses
  console.log('\nTest Group 2: Conservative Source Provenance');
  {
    // Crisis lifeline
    const lifelineSource = mapToSourceReference({ title: 'Suicide & Crisis Lifeline', uri: 'tel:988' });
    assert(
      lifelineSource.status === 'unverified',
      'Crisis lifeline tel:988 defaults to unverified without live verification records'
    );
    assert(
      lifelineSource.notes !== undefined && lifelineSource.notes.includes('Source authenticity known'),
      'Notes clarify authenticity vs unconfirmed live availability for lifeline'
    );

    // Community phone numbers
    const communityPhone = mapToSourceReference({ title: 'Bambi Peer Line', uri: 'tel:602-767-2147' });
    assert(
      communityPhone.status === 'unverified',
      'Community phone number defaults to unverified'
    );
    assert(
      communityPhone.notes !== undefined && communityPhone.notes.includes('Live service capacity'),
      'Community phone note indicates operational status unverified'
    );

    // External URLs (Gemini Gems, NotebookLM, general links)
    const gemLink = mapToSourceReference({
      title: 'Tom Core Direct Gem',
      uri: 'https://gemini.google.com/gem/cc4ace8c539e',
    });
    assert(
      gemLink.status === 'unverified',
      'External Google Gem URL defaults to unverified'
    );

    const notebookLink = mapToSourceReference({
      title: 'NotebookLM Master Vault',
      uri: 'https://notebooklm.google.com/notebook/a573aaf8-d9fe-4a2f-90af-6e6c1080b3d1',
    });
    assert(
      notebookLink.status === 'unverified',
      'External NotebookLM URL defaults to unverified'
    );

    // General local URI that is not a canonical spec
    const generalDoc = mapToSourceReference({
      title: 'Arbitrary Resource',
      uri: '/housing/shelter-guide.pdf',
    });
    assert(
      generalDoc.status === 'unverified',
      'Arbitrary .pdf or slash path does NOT automatically get marked verified'
    );
  }

  // Test Group 3: Canonical Project Specifications
  console.log('\nTest Group 3: Canonical Project Specifications');
  {
    const spec = mapToSourceReference({
      title: 'Master System Specification v1.0',
      uri: '/Tom-Master-System-Specification.md',
    });
    assert(
      spec.status === 'verified',
      'Canonical project design spec can be marked verified as an internal specification'
    );
    assert(
      spec.notes !== undefined &&
        spec.notes.includes('does not attest to current live service availability of external community resources'),
      'Project spec notes explicitly state external community resources cited within are not verified'
    );

    const coreSpec = mapToSourceReference({
      title: 'Tom Core Source Master',
      uri: '/Tom-Core-Sourcefile-Master.md',
    });
    assert(
      coreSpec.status === 'verified',
      'Tom-Core-Sourcefile-Master.md verified as internal engineering specification'
    );
  }

  // Test Group 4: Timestamp Omission When Unknown
  console.log('\nTest Group 4: Timestamp Omission');
  {
    const ref = mapToSourceReference({ title: 'Community Resource', uri: 'tel:602-767-2147' });
    assert(
      ref.accessedAt === undefined,
      'accessedAt is undefined when no actual timestamp is available'
    );
    assert(
      ref.lastVerifiedAt === undefined,
      'lastVerifiedAt is undefined when no actual timestamp is available'
    );
  }

  // Test Group 5: Advisory Approval Boundary & Module Execution
  console.log('\nTest Group 5: Advisory Approval Boundary & executeTomModule');
  {
    // Normal peer support message
    const normalResult: ModuleResult<TomBrainResponse> = executeTomModule(
      'I need a place to sleep tonight in Phoenix',
      [],
      'tom-core'
    );
    assert(
      normalResult.module === 'tom-identity',
      'Default mode resolves to tom-identity'
    );
    assert(
      typeof normalResult.result.reply === 'string' && normalResult.result.reply.length > 0,
      'Original TomBrainResponse.reply is preserved'
    );
    assert(
      normalResult.requiresOwnerApproval === false,
      'requiresOwnerApproval is false for ordinary support request'
    );

    // Advisory flag triggered by modification keywords
    const advisoryResult: ModuleResult<TomBrainResponse> = executeTomModule(
      'sudo modify spec for boundary conditions',
      [],
      'bambi'
    );
    assert(
      advisoryResult.module === 'bambi-rsm',
      'bambi mode resolves to bambi-rsm'
    );
    assert(
      advisoryResult.requiresOwnerApproval === true,
      'requiresOwnerApproval is set to true as an advisory signal for spec modification request'
    );

    // Check uncertainties
    assert(
      Array.isArray(advisoryResult.uncertainties) && advisoryResult.uncertainties.length > 0,
      'Uncertainties array is populated when unverified sources are present'
    );
  }

  // Test Group 6: Stale and Retired Status Handling
  console.log('\nTest Group 6: Stale & Retired Status Handling');
  {
    const retiredSource = mapToSourceReference({
      title: 'Old Shelter [Retired]',
      uri: 'tel:602-000-0000',
    });
    assert(
      retiredSource.status === 'retired',
      'Sources flagged as retired receive status: retired'
    );

    const staleSource = mapToSourceReference({
      title: 'Detox Clinic (Outdated Archive)',
      uri: 'tel:602-111-1111',
    });
    assert(
      staleSource.status === 'stale',
      'Sources flagged as outdated receive status: stale'
    );
  }

  console.log('\n====================================================');
  console.log(`Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite();
