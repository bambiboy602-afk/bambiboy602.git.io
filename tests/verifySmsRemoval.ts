/**
 * Test Suite: verifySmsRemoval.ts
 *
 * Verifies Step 19 Complete SMS Feature Removal:
 * 1. src/lib/sms.ts has been deleted.
 * 2. src/components/SMSGatewayModal.tsx has been deleted.
 * 3. server.ts contains zero SMS routes (/api/sms, /api/admin/sms-logs, /api/admin/send-sms) and zero SMS imports.
 * 4. UI components (Navbar, TomBotCard, App) have zero SMS modals, props, or buttons.
 * 5. .env.example contains zero TEXTBEE or TWILIO variable references.
 * 6. Non-SMS functionality and module contract handoffs remain completely intact.
 */

import fs from 'fs';
import path from 'path';
import {
  executeTomModule,
  createLazyFallbackEvaluator,
  buildFallbackChatPayload,
} from '../src/services/tomBrainEngine';

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

function runSmsRemovalSuite() {
  console.log('====================================================');
  console.log('Running Step 19 SMS Removal Verification Tests');
  console.log('====================================================\n');

  // Test Group 1: File Deletion Verification
  console.log('Test Group 1: SMS Files Complete Deletion');
  {
    const smsLibExists = fs.existsSync(path.resolve('src/lib/sms.ts'));
    assert(!smsLibExists, 'src/lib/sms.ts is completely deleted');

    const smsModalExists = fs.existsSync(path.resolve('src/components/SMSGatewayModal.tsx'));
    assert(!smsModalExists, 'src/components/SMSGatewayModal.tsx is completely deleted');
  }

  // Test Group 2: Server.ts Removal Verification
  console.log('\nTest Group 2: server.ts SMS Endpoints and Imports Removal');
  {
    const serverContent = fs.readFileSync(path.resolve('server.ts'), 'utf-8');

    assert(!serverContent.includes('/api/sms'), 'server.ts has no POST /api/sms endpoint');
    assert(!serverContent.includes('/api/admin/sms-logs'), 'server.ts has no GET /api/admin/sms-logs endpoint');
    assert(!serverContent.includes('/api/admin/send-sms'), 'server.ts has no POST /api/admin/send-sms endpoint');
    assert(!serverContent.includes('recordSMSLog'), 'server.ts has no recordSMSLog references');
    assert(!serverContent.includes('sendSMS'), 'server.ts has no sendSMS references');
    assert(!serverContent.includes('getSMSLogs'), 'server.ts has no getSMSLogs references');
    assert(!serverContent.includes('getSMSStats'), 'server.ts has no getSMSStats references');
    assert(!serverContent.includes('./src/lib/sms'), 'server.ts has no import from ./src/lib/sms');
    assert(!serverContent.includes('textbee'), 'server.ts has no textbee references');
  }

  // Test Group 3: Frontend UI Components Removal Verification
  console.log('\nTest Group 3: Frontend UI SMS Elements Removal');
  {
    const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
    assert(!appContent.includes('SMSGatewayModal'), 'src/App.tsx has no SMSGatewayModal import or usage');
    assert(!appContent.includes('isSMSModalOpen'), 'src/App.tsx has no isSMSModalOpen state');
    assert(!appContent.includes('onOpenSMSGateway'), 'src/App.tsx has no onOpenSMSGateway prop passing');

    const navbarContent = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
    assert(!navbarContent.includes('onOpenSMSGateway'), 'src/components/Navbar.tsx has no onOpenSMSGateway prop');
    assert(!navbarContent.includes('SMS App'), 'src/components/Navbar.tsx has no "SMS App" button');

    const tomBotCardContent = fs.readFileSync(path.resolve('src/components/TomBotCard.tsx'), 'utf-8');
    assert(!tomBotCardContent.includes('SMSGatewayModal'), 'src/components/TomBotCard.tsx has no SMSGatewayModal');
    assert(!tomBotCardContent.includes('showSMSModal'), 'src/components/TomBotCard.tsx has no showSMSModal state');
    assert(!tomBotCardContent.includes('SMS App'), 'src/components/TomBotCard.tsx has no "SMS App" button');
  }

  // Test Group 4: Environment Configuration Verification
  console.log('\nTest Group 4: Environment Configuration Cleaning');
  {
    const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf-8');
    assert(!envExample.includes('TEXTBEE_API_KEY'), '.env.example has no TEXTBEE_API_KEY');
    assert(!envExample.includes('TEXTBEE_DEVICE_ID'), '.env.example has no TEXTBEE_DEVICE_ID');
    assert(!envExample.includes('TWILIO_ACCOUNT_SID'), '.env.example has no TWILIO_ACCOUNT_SID');
  }

  // Test Group 5: Non-SMS Functionality and Contract Intactness
  console.log('\nTest Group 5: Non-SMS Core Chat and Adapter Remains Intact');
  {
    const moduleResult = executeTomModule('Hello Tom, I need help.', [], 'tom-core');
    assert(moduleResult.module === 'tom-identity', 'executeTomModule returns tom-identity');
    assert(typeof moduleResult.result.reply === 'string' && moduleResult.result.reply.length > 0, 'Reply is present');

    const payload = buildFallbackChatPayload(moduleResult);
    assert(typeof payload.reply === 'string', 'FallbackChatPayload generates reply');
    assert(payload.moduleResult?.module === 'tom-identity', 'FallbackChatPayload attaches moduleResult');

    const lazyEval = createLazyFallbackEvaluator('Need a safe curb.', [], 'tom-core');
    assert(lazyEval.isEvaluated() === false, 'Lazy evaluator initial state is false');
    const evaluated = lazyEval.getPayload();
    assert(lazyEval.isEvaluated() === true, 'Lazy evaluator executed once');
    assert(evaluated.reply.length > 0, 'Lazy evaluator returns valid reply');
  }

  // Summary
  console.log('\n====================================================');
  console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSmsRemovalSuite();
