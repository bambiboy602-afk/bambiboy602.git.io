/**
 * Test Suite: verifySecurityAndValidation.ts
 *
 * Verifies Step 20 Security Audit and Safeguards:
 * 1. Health check secret sanitization: /api/health reveals no API keys, key fragments, or paths.
 * 2. Rate limiter: sliding window rate limiter blocks abuse and sets standard headers.
 * 3. Chat request validation: bounds input text (<= 2000 chars), history array (<= 50 items), and rejects malformed payloads.
 * 4. All admin / SMS routes return clean 404 JSON.
 * 5. Module contract and lazy fallback handoff integrity remain preserved.
 */

import { checkRateLimit, resetRateLimiterStore } from '../src/utils/rateLimiter';
import {
  executeTomModule,
  createLazyFallbackEvaluator,
  buildFallbackChatPayload,
} from '../src/services/tomBrainEngine';
import fs from 'fs';
import path from 'path';

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

function runSecurityAndValidationSuite() {
  console.log('====================================================');
  console.log('Running Step 20 Security & Validation Verification');
  console.log('====================================================\n');

  // Test Group 1: Diagnostics and Secret Exposure Check
  console.log('Test Group 1: Diagnostics and Secret Sanitization');
  {
    const serverSource = fs.readFileSync(path.resolve('server.ts'), 'utf-8');

    assert(!serverSource.includes('maskedApiKey'), 'server.ts does not export maskedApiKey');
    assert(!serverSource.includes('keyRotationGuide'), 'server.ts does not leak key rotation guide in client responses');

    // Verify .env.example contains only safe placeholders
    const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf-8');
    assert(envExample.includes('GEMINI_API_KEY="MY_GEMINI_API_KEY"'), '.env.example uses safe placeholder for GEMINI_API_KEY');
    assert(!envExample.includes('AIza'), '.env.example contains no real Google API keys');
    assert(!envExample.includes('sk-'), '.env.example contains no real OpenAI keys');
  }

  // Test Group 2: In-Memory Sliding Window Rate Limiter
  console.log('\nTest Group 2: Rate Limiter Enforcement');
  {
    resetRateLimiterStore();
    const testIp = '192.168.1.100';
    const limit = 5;
    const windowMs = 5000;

    // First 5 requests should be allowed
    for (let i = 1; i <= limit; i++) {
      const res = checkRateLimit(testIp, limit, windowMs);
      assert(res.allowed === true, `Rate limit allowed request ${i}/${limit}`);
      assert(res.remaining === limit - i, `Remaining count is ${limit - i}`);
    }

    // 6th request should be blocked
    const blockedRes = checkRateLimit(testIp, limit, windowMs);
    assert(blockedRes.allowed === false, 'Rate limit blocked 6th request exceeding limit');
    assert(blockedRes.remaining === 0, 'Remaining is 0 on blocked request');
    assert(blockedRes.resetSeconds > 0, 'Reset seconds is positive');

    // A different IP should have its own separate budget
    const otherIp = '192.168.1.101';
    const otherRes = checkRateLimit(otherIp, limit, windowMs);
    assert(otherRes.allowed === true, 'Different IP has its own rate limit quota');
    assert(otherRes.remaining === limit - 1, 'Different IP remaining count is correct');

    resetRateLimiterStore();
  }

  // Test Group 3: Request Validation and Input Limits
  console.log('\nTest Group 3: Input Validation and Bounds Logic');
  {
    const serverSource = fs.readFileSync(path.resolve('server.ts'), 'utf-8');

    // Confirm body limit is reduced from 10mb to 50kb
    assert(serverSource.includes('express.json({ limit: "50kb" })'), 'Body limit is configured to 50kb');
    assert(!serverSource.includes('limit: "10mb"'), 'Old 10mb limit is removed');

    // Confirm message character limit check exists
    assert(serverSource.includes('trimmedMessage.length > 2000'), 'Message length limit of 2,000 characters is enforced');

    // Confirm history item limit check exists
    assert(serverSource.includes('rawHistory.length > 50'), 'History array length limit of 50 items is enforced');

    // Confirm 413 and JSON parse error middleware exists
    assert(serverSource.includes('err.type === "entity.too.large" || err.status === 413'), '413 payload too large handler is implemented');
    assert(serverSource.includes('Invalid JSON format in request body'), '400 invalid JSON handler is implemented');
  }

  // Test Group 4: Server Routes and 404 Catch-All
  console.log('\nTest Group 4: Server Route Sanitization and 404 Catch-All');
  {
    const serverSource = fs.readFileSync(path.resolve('server.ts'), 'utf-8');

    // Ensure no admin routes exist
    assert(!serverSource.includes('/api/admin/'), 'No /api/admin/ endpoints exist in server.ts');
    assert(!serverSource.includes('/api/sms'), 'No /api/sms endpoints exist in server.ts');

    // Ensure 404 catch-all is present
    assert(serverSource.includes('app.all("/api/*"'), 'Catch-all 404 handler for /api/* is present');
  }

  // Test Group 5: Tom Handoff and Module Contract Integrity
  console.log('\nTest Group 5: Module Contract & Fallback Integrity');
  {
    // Lazy evaluator remains lazy
    const evaluator = createLazyFallbackEvaluator('Testing safe curb.', [], 'tom-core');
    assert(evaluator.isEvaluated() === false, 'Evaluator is initially unevaluated');
    assert(evaluator.getCallCount() === 0, 'Call count is 0 before read');

    // Evaluates once
    const payload = evaluator.getPayload();
    assert(evaluator.isEvaluated() === true, 'Evaluator is evaluated after getPayload');
    assert(evaluator.getCallCount() === 1, 'Call count is 1 after first read');

    // Cached on subsequent reads
    const secondPayload = evaluator.getPayload();
    assert(evaluator.getCallCount() === 1, 'Call count remains 1 on repeated reads (cached)');
    assert(payload.reply === secondPayload.reply, 'Payloads match exactly');

    // Response structure meets contract
    assert(typeof payload.reply === 'string' && payload.reply.length > 0, 'Payload contains valid reply');
    assert(typeof payload.avatarEmotion === 'string', 'Payload contains avatarEmotion');
    assert(Array.isArray(payload.searchQueries), 'Payload contains searchQueries array');
    assert(Array.isArray(payload.searchSources), 'Payload contains searchSources array');
    assert(payload.moduleResult !== undefined, 'Payload attaches moduleResult');
    assert(payload.moduleResult?.module === 'tom-identity', 'moduleResult has tom-identity module');

    // Execute direct module
    const directResult = executeTomModule('Help me map my baseline.', [], 'bambi');
    assert(directResult.module === 'bambi-rsm', 'bambi mode resolves to bambi-rsm');
    assert(directResult.result.reply.length > 0, 'Direct module returns reply');
  }

  // Summary
  console.log('\n====================================================');
  console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityAndValidationSuite();
