import assert from 'node:assert/strict';
import {
  INITIAL_AUTOMATION_RULES,
  INITIAL_SCHEDULED_MESSAGES,
  INITIAL_TURNOVER_JOBS,
  INITIAL_AI_COHOST_ACTIONS,
  INITIAL_SMART_LOCK_DEVICE,
  INITIAL_SMART_LOCK_CODES,
  INITIAL_DYNAMIC_PRICING_CONFIG,
  INITIAL_DYNAMIC_RATES,
  INITIAL_OPERATIONS_INBOX,
} from './operationsData';

console.log('--- Testing Little Hut Operations Layer (Azure Haven Proving Ground) ---');

// 1. Test Automation Rules
assert(INITIAL_AUTOMATION_RULES.length >= 4, 'Must have at least 4 core automation rules');
const bookingConfirmedRule = INITIAL_AUTOMATION_RULES.find((r) => r.trigger === 'booking_confirmed');
assert(bookingConfirmedRule, 'Booking confirmed rule must exist');
assert(bookingConfirmedRule.templateBodyEn.includes('{{guest_name}}'), 'Rule must have template variables');
assert(bookingConfirmedRule.templateBodyAr.includes('{{guest_name}}'), 'Rule must have Arabic template variables');
console.log('✓ Automation rules and bilingual template variables verified');

// 2. Test Scheduled Messages
assert(INITIAL_SCHEDULED_MESSAGES.length > 0, 'Must have initial scheduled messages');
for (const msg of INITIAL_SCHEDULED_MESSAGES) {
  assert(msg.propertyId === 'property-azure-haven', 'Scheduled messages must link to Azure Haven proving ground');
  assert(['pending', 'sent', 'cancelled', 'failed'].includes(msg.status), `Invalid status: ${msg.status}`);
}
console.log('✓ Scheduled messages integrity verified');

// 3. Test Cleaner & Turnover with Photo Proof
assert(INITIAL_TURNOVER_JOBS.length > 0, 'Must have at least one turnover job');
const azureTurnover = INITIAL_TURNOVER_JOBS[0];
assert.equal(azureTurnover.propertyId, 'property-azure-haven');
assert(azureTurnover.checklist.length >= 5, 'Must have comprehensive turnover checklist');
const slowMorningCheck = azureTurnover.checklist.find((c) => c.requiredForMoment === 'slow_morning');
assert(slowMorningCheck, 'Turnover checklist must tie directly to Little Hut proven moments (Slow Morning)');
assert(azureTurnover.photos.length >= 3, 'Must have photo proofs uploaded by cleaner');
assert(azureTurnover.photos.some((p) => p.tag === 'linens'), 'Must include linen proof');
assert(azureTurnover.photos.some((p) => p.tag === 'slow_morning_tea'), 'Must include Slow Morning ritual proof');
console.log('✓ Turnover job, moment-specific checklist, and photo proofs verified');

// 4. Test AI Co-Host inside Mastermind
assert(INITIAL_AI_COHOST_ACTIONS.length >= 3, 'Must have at least 3 AI Co-Host ready-to-approve actions');
for (const action of INITIAL_AI_COHOST_ACTIONS) {
  assert(action.confidenceScore >= 80, 'Co-host actions must maintain high confidence score');
  assert(action.title && action.titleAr, 'Co-host actions must have bilingual titles');
  assert(action.contextSource.length > 0, 'Co-host action must trace to real calendar/policy context');
  assert(action.status === 'pending_review', 'Default status must be pending_review for operator approval');
}
const lateCheckoutAction = INITIAL_AI_COHOST_ACTIONS.find((a) => a.category === 'late_checkout');
assert(lateCheckoutAction, 'Must have late checkout recommendation');
console.log('✓ AI Co-Host Mastermind recommendations and approval triggers verified');

// 5. Test Smart-Lock Integration
assert.equal(INITIAL_SMART_LOCK_DEVICE.propertyId, 'property-azure-haven');
assert(INITIAL_SMART_LOCK_DEVICE.batteryLevel > 50, 'Lock battery should be healthy');
assert(['online', 'mesh_active', 'offline'].includes(INITIAL_SMART_LOCK_DEVICE.onlineStatus));
assert(INITIAL_SMART_LOCK_CODES.length >= 2, 'Must have active guest and cleaner codes');
const cleanerCode = INITIAL_SMART_LOCK_CODES.find((c) => c.role === 'cleaner');
assert(cleanerCode, 'Must have cleaner specific temporary code');
console.log('✓ Smart-lock device status and synchronized PINs verified');

// 6. Test Dynamic Pricing & Owner Floor Guard
assert(INITIAL_DYNAMIC_PRICING_CONFIG.enabled, 'Dynamic pricing should be enabled');
const ownerFloor = INITIAL_DYNAMIC_PRICING_CONFIG.rateFloorEgp;
assert.equal(ownerFloor, 6000, 'Azure Haven owner floor must be 6,000 EGP');

for (const rate of INITIAL_DYNAMIC_RATES) {
  assert(
    rate.recommendedRateEgp >= ownerFloor,
    `Dynamic pricing breached owner floor! Date: ${rate.date}, Rate: ${rate.recommendedRateEgp}, Floor: ${ownerFloor}`
  );
  assert(rate.baseFloorEgp === ownerFloor, 'Base floor must match owner mandate');
}
console.log('✓ Dynamic pricing strictly respects and guards Owner Rate Floor (6,000 EGP)');

// 7. Test Mobile Operations Inbox
assert(INITIAL_OPERATIONS_INBOX.length >= 3, 'Must have inbox items');
for (const item of INITIAL_OPERATIONS_INBOX) {
  assert(item.title && item.titleAr, 'Inbox items must be bilingual');
  assert(item.actionTarget, 'Inbox items must link to operational tab target');
}
console.log('✓ Mobile operations inbox structure verified');

console.log('--- All Little Hut Operations Layer Self-Tests Passed! ---');
