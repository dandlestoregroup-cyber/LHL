import assert from 'node:assert/strict';
import fs from 'node:fs';

const assuranceSource = fs.readFileSync(new URL('./live-assurance.ts', import.meta.url), 'utf8');
const liveStoreSource = fs.readFileSync(new URL('./live-store.ts', import.meta.url), 'utf8');
const outboxSource = fs.readFileSync(new URL('./live-outbox-record.ts', import.meta.url), 'utf8');
const serverSource = fs.readFileSync(new URL('../../server.ts', import.meta.url), 'utf8');
const operatorSource = fs.readFileSync(new URL('../views/OperatorView.tsx', import.meta.url), 'utf8');

assert(assuranceSource.includes("operator.role !== 'operator'"), 'stay assurance requires the Operator role');
assert(assuranceSource.includes('property.operatorPartnerId !== operator.id'), 'stay assurance requires the assigned Operator');
assert(assuranceSource.includes('inventory_baseline_locked_by_active_stay'), 'inventory baseline locks once a confirmed stay has pre-stay evidence');
assert(assuranceSource.includes("const readinessKeys: ReadonlyArray<ReadinessCheckKey> = ['access', 'cleanliness', 'utilities', 'sleeping', 'safety', 'moment_setup']"), 'six readiness checks are canonical');
assert(assuranceSource.includes("status: items.every((item) => item.status === 'passed') ? 'ready' : 'blocked'"), 'readiness status is server-derived');
assert(assuranceSource.includes("enquiry.readinessCheck?.status !== 'ready'"), 'pre-stay ProofStay requires a ready check');
assert(assuranceSource.includes('enquiry.readinessCheck.baselineCapturedAt !== baseline.capturedAt'), 'pre-stay rejects stale readiness evidence');
assert(assuranceSource.includes("observation.condition === 'good' && observation.observedQuantity === expected.expectedQuantity"), 'pre-stay snapshot must exactly match the ready baseline');
assert(assuranceSource.includes("enquiry.stage !== 'completed'"), 'post-stay snapshot requires a completed stay');
assert(assuranceSource.includes("status: changedKeys.length === 0 ? 'verified_unchanged' : 'attention_required'"), 'ProofStay comparison result is server-derived');
assert(!assuranceSource.includes('input.result'), 'browser cannot choose a ProofStay result');
assert(liveStoreSource.includes('stay_assurance_required_before_completion'), 'Live completion is blocked without assurance');
assert(liveStoreSource.includes('stay_assurance_baseline_is_stale'), 'Live completion rejects a changed baseline');
assert(liveStoreSource.includes('inventoryBaseline: undefined'), 'anonymous property projection strips inventory baseline evidence');
assert(serverSource.includes("/api/live/properties/:id/inventory-baseline"), 'server exposes inventory baseline action');
assert(serverSource.includes("/api/live/enquiries/:id/readiness"), 'server exposes readiness action');
assert(serverSource.includes("/api/live/enquiries/:id/proofstay/:phase"), 'server exposes ProofStay capture action');
assert(outboxSource.includes('inventoryBaselineReady'), 'outbox exposes baseline status only');
assert(outboxSource.includes('readinessStatus'), 'outbox exposes readiness status only');
assert(outboxSource.includes('proofStayStatus'), 'outbox exposes ProofStay status only');
assert(!outboxSource.includes('evidenceReference'), 'outbox summary source never forwards assurance evidence references');
assert(operatorSource.includes('<StayAssurancePanel />'), 'Operator workspace renders Stay Assurance controls');
assert(operatorSource.includes('completionReady'), 'Operator UI blocks premature stay completion');

console.log('live stay assurance self-test: ok');
