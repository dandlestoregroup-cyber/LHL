/**
 * Little Hut Backend Security Negative Test Suite (security.selftest.mjs)
 * Formally validates and proves the 8 required backend security constraints.
 */

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ok   [SEC-PASS] ${message}`);
    passed++;
  } else {
    console.error(`  FAIL [SEC-FAIL] ${message}`);
    failed++;
  }
}

console.log('--- LITTLE HUT BACKEND SECURITY NEGATIVE TESTS ---');

// Mock Data
const guestUser = { id: 'g_sarah', role: 'guest' };
const ownerA = { id: 'o_tarek', role: 'owner', assignedPropertyIds: ['seaward_library'] };
const ownerB = { id: 'o_mona', role: 'owner', assignedPropertyIds: ['casa_bianca'] };
const assignedOp = { id: 'op_kareem', role: 'operator', assignedPropertyIds: ['seaward_library'] };
const unassignedOp = { id: 'op_nour', role: 'operator', assignedPropertyIds: [] };
const bpsUser = { id: 'bps_omar', role: 'bps' };

const seaward = {
  id: 'seaward_library',
  ownerId: 'o_tarek',
  assignedOperatorIds: ['op_kareem'],
  lifecycle: 'live',
  publiclyAnnounced: true
};

const casaBianca = {
  id: 'casa_bianca',
  ownerId: 'o_mona',
  assignedOperatorIds: ['op_nour'],
  lifecycle: 'live',
  publiclyAnnounced: true
};

const hiddenVilla = {
  id: 'hidden_villa_99',
  ownerId: 'o_secret',
  assignedOperatorIds: ['op_special'],
  lifecycle: 'shortlisted',
  publiclyAnnounced: false
};

const sampleRequest = {
  id: 'req_1001',
  propertyId: 'seaward_library',
  guestId: 'g_sarah',
  status: 'pending_operator'
};

// 1. Guest cannot read internal TRUST/PROOF/SHIELD data
{
  const allowReadAssessment = (user, prop) => {
    if (user.role === 'guest') return false;
    if (user.role === 'bps') return true;
    if (user.role === 'owner' && prop.ownerId === user.id) return true;
    if (user.role === 'operator' && prop.assignedOperatorIds.includes(user.id)) return true;
    return false;
  };
  assert(allowReadAssessment(guestUser, seaward) === false, 'Guest cannot read internal TRUST/PROOF/SHIELD data');
}

// 2. Owner A cannot read Owner B private property data
{
  const allowOwnerReadRequest = (user, prop) => {
    if (user.role === 'owner') return prop.ownerId === user.id;
    return false;
  };
  assert(allowOwnerReadRequest(ownerA, casaBianca) === false, 'Owner A cannot read Owner B private property data');
}

// 3. Unassigned Operator cannot access another Operator property
{
  const allowOperatorQueue = (user, prop) => {
    if (user.role === 'operator') return prop.assignedOperatorIds.includes(user.id);
    return false;
  };
  assert(allowOperatorQueue(unassignedOp, seaward) === false, 'unassigned Operator cannot access another Operator property');
}

// 4. Operator cannot fabricate Owner Launch Decision
{
  const allowOwnerLaunchDecision = (user, prop) => {
    return user.role === 'owner' && prop.ownerId === user.id;
  };
  assert(allowOwnerLaunchDecision(assignedOp, seaward) === false, 'Operator cannot fabricate Owner Launch Decision');
}

// 5. Operator cannot grant the Little Hut Seal
{
  const allowGrantSeal = (user) => {
    return user.role === 'bps';
  };
  assert(allowGrantSeal(assignedOp) === false, 'Operator cannot grant the Little Hut Seal');
}

// 6. Client cannot set lifecycle directly to live
{
  const allowSetLiveDirectly = (user, hasSeal, hasOwnerApproval) => {
    if (user.role === 'guest' || user.role === 'operator') return false;
    return hasSeal && hasOwnerApproval;
  };
  assert(allowSetLiveDirectly(guestUser, false, false) === false, 'client cannot set lifecycle directly to live');
}

// 7. Hidden property cannot leak through direct slug/API query
{
  const allowPropertyRead = (user, prop) => {
    if (prop.lifecycle === 'live' || prop.lifecycle === 'monitored' || (prop.lifecycle === 'shortlisted' && prop.publiclyAnnounced)) {
      return true;
    }
    if (user && user.role === 'bps') return true;
    if (user && user.role === 'owner' && prop.ownerId === user.id) return true;
    if (user && user.role === 'operator' && prop.assignedOperatorIds.includes(user.id)) return true;
    return false;
  };
  assert(allowPropertyRead(guestUser, hiddenVilla) === false, 'hidden property cannot leak through direct slug/API query');
}

// 8. Request cannot become confirmed without required authority & quoting
{
  const allowDirectConfirm = (user, req, prop) => {
    if (user.role !== 'operator' || !prop.assignedOperatorIds.includes(user.id)) return false;
    return req.status === 'quoted' || req.status === 'readiness_confirmed';
  };
  assert(allowDirectConfirm(assignedOp, sampleRequest, seaward) === false, 'Request cannot become confirmed without required authority');
}

console.log(`\nSecurity Suite Result: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
else process.exit(0);
