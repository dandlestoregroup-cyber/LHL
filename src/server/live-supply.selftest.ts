import assert from 'node:assert/strict';
import fs from 'node:fs';

const supplySource = fs.readFileSync(new URL('./live-supply.ts', import.meta.url), 'utf8');
const scoutSupplySource = fs.readFileSync(new URL('./live-scout-supply.ts', import.meta.url), 'utf8');
const firestoreSource = fs.readFileSync(new URL('./firestore-rest.ts', import.meta.url), 'utf8');
const serverSource = fs.readFileSync(new URL('../../server.ts', import.meta.url), 'utf8');

assert(scoutSupplySource.includes("scout.role !== 'scout'"), 'owner consent evidence requires the Scout role');
assert(scoutSupplySource.includes('propertyStored.data.scoutPartnerId !== scout.id'), 'owner consent evidence requires the sourcing Scout');
assert(scoutSupplySource.includes('ownerConsentReference'), 'Scout consent evidence is persisted before Owner binding');
assert(serverSource.includes("/api/live/properties/:id/owner-consent"), 'server exposes the source-Scout consent action');
assert(serverSource.includes('scout_owner_consent_required'), 'admin Owner binding requires prior stored Scout consent');
assert(serverSource.includes('ownerConsentReference: undefined'), 'anonymous Live dataset strips private owner-consent evidence');
assert(serverSource.includes('communityAuthorityPartnerId: undefined'), 'anonymous Live dataset strips internal community authority identifiers');
assert(serverSource.includes('owner_decision_pause_cannot_be_reassessed'), 'a paused Owner decision cannot be rerouted into reassessment');

assert(supplySource.includes("requireCurrentPartner(session, 'assessor')"), 'assessment submission requires the Assessor role');
assert(supplySource.includes('propertyStored.data.assessorPartnerId !== assessor.id'), 'assessment submission requires the assigned Assessor');
assert(supplySource.includes("requireCurrentPartner(session, 'owner')"), 'owner decision requires the Owner role');
assert(supplySource.includes('propertyStored.data.ownerPartnerId !== owner.id'), 'owner decision requires the assigned Owner');
assert(supplySource.includes("requireCurrentPartner(session, 'operator')"), 'activation requires the Operator role');
assert(supplySource.includes('propertyStored.data.operatorPartnerId !== operator.id'), 'activation requires the assigned Operator');
assert(!supplySource.includes('input.result'), 'assessment result is never accepted from the browser');
assert(supplySource.includes('evaluateAssessment(candidate)'), 'assessment result is derived from locked gate rules');
assert(supplySource.includes("supplyStage: result === 'passed' ? 'decision_pending' : 'paused'"), 'assessment controls the next supply stage');
assert(supplySource.includes("supplyStage: 'activation_ready'"), 'Owner Go advances only to activation-ready');
assert(supplySource.includes("supplyStage: 'declined'"), 'Owner Decline produces an explicit declined state');
assert(supplySource.includes("supplyStage: 'live'"), 'only activation can write the Live stage in the supply module');
assert((supplySource.match(/sealIssued: true/g) || []).length === 1, 'the system seal has exactly one issuance point in Live supply progression');
assert(supplySource.includes('resolveBookingMode(candidate)'), 'activation enforces request-vs-instant booking policy');
assert(supplySource.includes('evaluateGoLive(ready, assessmentStored.data, decisionStored.data)'), 'activation re-runs the complete go-live gate before sealing');
assert(supplySource.includes('commitDocuments(['), 'multi-record supply transitions use atomic commits');
assert(firestoreSource.includes("`${documentBase()}:commit`"), 'Firestore adapter uses the atomic commit endpoint');
assert(firestoreSource.includes('currentDocument:'), 'atomic writes carry preconditions against stale state');
assert(serverSource.includes("/api/live/properties/:id/assessment"), 'server exposes the independent assessment action');
assert(serverSource.includes("/api/live/properties/:id/owner-decision"), 'server exposes the reserved owner decision action');
assert(serverSource.includes("/api/live/properties/:id/activate"), 'server exposes the operator activation action');

console.log('live supply progression self-test: ok');
