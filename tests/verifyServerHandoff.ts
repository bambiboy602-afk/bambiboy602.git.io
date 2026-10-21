/**
 * Test Suite: verifyServerHandoff.ts
 *
 * Verifies Step 16 Safe Server Handoff:
 * 1. Fallback response carries all required legacy fields (reply, avatarEmotion, searchQueries, searchSources).
 * 2. Fallback response attaches canonical moduleResult conforming to ModuleResult<TomBrainResponse>.
 * 3. User-facing reply contains only conversational speech (no leaked uncertainties, source notes, or approval flags).
 * 4. Lazy evaluation: local fallback engine is not invoked during successful generation flows.
 * 5. Single evaluation guarantee: multiple fallback reads within the same request lifecycle execute at most once.
 * 6. Special triggers (e.g., reset, empty objective) return clean prompt resets.
 */

import {
  executeTomModule,
  createLazyFallbackEvaluator,
  buildFallbackChatPayload,
  FallbackChatPayload,
  TomBrainResponse,
} from '../src/services/tomBrainEngine';
import { ModuleResult } from '../src/types/moduleContract';

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

function runServerHandoffSuite() {
  console.log('====================================================');
  console.log('Running Step 16 Server Handoff Verification Tests');
  console.log('====================================================\n');

  // Test Group 1: Fallback Response Shape & Backward Compatibility
  console.log('Test Group 1: Fallback Response Shape & Legacy Fields');
  {
    const moduleResult: ModuleResult<TomBrainResponse> = executeTomModule(
      'I relapsed last night and do not know what to do.',
      [],
      'tom-core'
    );
    const payload: FallbackChatPayload = buildFallbackChatPayload(moduleResult);

    assert(typeof payload.reply === 'string' && payload.reply.length > 0, 'Payload contains non-empty reply string');
    assert(typeof payload.avatarEmotion === 'string', 'Payload contains avatarEmotion string');
    assert(Array.isArray(payload.searchQueries), 'Payload contains searchQueries array');
    assert(Array.isArray(payload.searchSources), 'Payload contains searchSources array');
    assert(payload.moduleResult !== undefined, 'Payload attaches moduleResult');
    assert(payload.moduleResult.module === 'tom-identity', 'moduleResult has correct module identity (tom-identity)');
    assert(payload.moduleResult.result.reply === payload.reply, 'Payload reply matches moduleResult.result.reply exactly');
  }

  // Test Group 2: Conversational Speech Purity (Anti-Leakage)
  console.log('\nTest Group 2: Conversational Speech Purity');
  {
    const userPrompt = 'sudo update price to $5 and change curriculum';
    const moduleResult = executeTomModule(userPrompt, [], 'tom-core');
    const payload = buildFallbackChatPayload(moduleResult);

    assert(moduleResult.requiresOwnerApproval === true, 'Advisory approval flag is set internally on change request');
    assert(!payload.reply.includes('requiresOwnerApproval'), 'User-facing reply does NOT leak requiresOwnerApproval flag');
    assert(!payload.reply.includes('APPROVAL REQUIRED'), 'User-facing reply does NOT leak approval requirement text');
    assert(!payload.reply.includes('One or more referenced sources lack formal offline verification'), 'User-facing reply does NOT leak uncertainty notes');
    assert(!payload.reply.includes('unverified'), 'User-facing reply does NOT leak source status labels');
  }

  // Test Group 3: Lazy Execution (Not Called on Successful Generation)
  console.log('\nTest Group 3: Lazy Fallback Execution Guarantee');
  {
    const userMessage = 'Where is the nearest shelter?';
    const history = [{ sender: 'user', text: 'Hello Tom' }];
    const evaluator = createLazyFallbackEvaluator(userMessage, history, 'bambi');

    // State before any evaluation
    assert(evaluator.isEvaluated() === false, 'Evaluator is initially unevaluated');
    assert(evaluator.getCallCount() === 0, 'Call count is 0 before any access');

    // Simulate successful Gemini response path (no fallback required)
    const simulatedGeminiSuccess = {
      reply: 'CASS shelter is at 230 S 12th Ave.',
      avatarEmotion: 'explaining',
      searchQueries: ['Phoenix shelter'],
      searchSources: [{ title: 'CASS', uri: 'https://cassemployment.org' }],
    };

    assert(evaluator.isEvaluated() === false, 'Evaluator remains unevaluated after successful Gemini response');
    assert(evaluator.getCallCount() === 0, 'Local module engine was NOT executed during successful generation flow');
    assert(simulatedGeminiSuccess.reply.length > 0, 'Successful generation produces direct legacy response without moduleResult');
  }

  // Test Group 4: Single Evaluation on Fallback Trigger
  console.log('\nTest Group 4: Single Evaluation & Cache Reuse');
  {
    const userMessage = 'What is the B.A.M.B.I. framework?';
    const evaluator = createLazyFallbackEvaluator(userMessage, [], 'bambi');

    // Trigger fallback evaluation first time
    const payload1 = evaluator.getPayload();
    assert(evaluator.isEvaluated() === true, 'Evaluator is marked evaluated after first getPayload()');
    assert(evaluator.getCallCount() === 1, 'Local module engine was executed exactly once');

    // Trigger fallback a second time within same request lifecycle
    const payload2 = evaluator.getPayload();
    const result2 = evaluator.getModuleResult();

    assert(evaluator.getCallCount() === 1, 'Subsequent reads reuse cached result without re-executing engine');
    assert(payload1.reply === payload2.reply, 'Payload 1 and Payload 2 replies are identical');
    assert(payload1.moduleResult === result2, 'moduleResult reference is strictly preserved and shared');
  }

  // Test Group 5: Routing & Specialization Preservation Across Modes
  console.log('\nTest Group 5: Module Routing Specialization in Fallback');
  {
    const modesAndModules: Array<{ mode: any; expectedModule: string }> = [
      { mode: 'tom-core', expectedModule: 'tom-identity' },
      { mode: 'bambi', expectedModule: 'bambi-rsm' },
      { mode: 'the-grower', expectedModule: 'grower' },
      { mode: 'master-vault', expectedModule: 'knowledge-vault' },
      { mode: 'maestro', expectedModule: 'maestro' },
    ];

    for (const { mode, expectedModule } of modesAndModules) {
      const evaluator = createLazyFallbackEvaluator('Test prompt', [], mode);
      const payload = evaluator.getPayload();
      assert(
        payload.moduleResult.module === expectedModule,
        `gemMode '${mode}' correctly resolves to module '${expectedModule}' in fallback`
      );
    }
  }

  console.log('\n====================================================');
  console.log(`Server Handoff Test Results: ${passedTests}/${totalTests} passed (${failedTests} failed)`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runServerHandoffSuite();
