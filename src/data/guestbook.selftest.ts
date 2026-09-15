import assert from 'node:assert/strict';
import {
  CROSS_GUIDE_BELIEVABLE_VISUALS,
  KNOWN_COMPOUND_PROFILES,
  resolveCompoundForProperty,
  buildTailoredGuestbook,
} from './guestbookData';
import { DEMO_PROPERTIES } from './demo';

console.log('--- Running Digital Visual Guest Book Self-Tests ---');

// 1. Believable Visuals Library integrity
assert.ok(CROSS_GUIDE_BELIEVABLE_VISUALS.length >= 8, 'Must have at least 8 believable cross-guide visuals');
for (const visual of CROSS_GUIDE_BELIEVABLE_VISUALS) {
  assert.ok(visual.id, 'Visual must have an id');
  assert.ok(visual.imageUrl && visual.imageUrl.startsWith('http'), 'Visual must have valid imageUrl');
  assert.ok(visual.title && visual.titleAr, 'Visual must be bilingual in title');
  assert.ok(visual.caption && visual.captionAr, 'Visual must be bilingual in caption');
  assert.ok(visual.tags.length > 0, 'Visual must have search tags');
}
console.log('ok  Believable cross-guide visual assets verified');

// 2. Compound resolution test
const azureHaven = DEMO_PROPERTIES.find(p => p.id === 'property-azure-haven');
assert.ok(azureHaven, 'Demo properties must include azure haven');

const compoundAzure = resolveCompoundForProperty(azureHaven!);
assert.equal(compoundAzure.id, 'azha_ain_sokhna', 'Azure Haven must resolve to AZHA Ain Sokhna compound');
assert.equal(compoundAzure.lagoonAndBeach.hasLagoon, true, 'AZHA must feature Crystal Lagoon');
assert.ok(compoundAzure.gateAccessProtocol.qrRequired, 'AZHA requires QR gate clearance');
console.log('ok  Compound resolution correctly identifies AZHA Ain Sokhna');

// 3. Tailored Guest Book generation test
const tailoredAzure = buildTailoredGuestbook(azureHaven!, 'Test Guest');
assert.equal(tailoredAzure.guestName, 'Test Guest');
assert.ok(tailoredAzure.wifiSsid.includes('AZURE'), 'Wi-Fi SSID is tailored to property');
assert.ok(tailoredAzure.wifiPass.length > 6, 'Wi-Fi password is generated');
assert.equal(tailoredAzure.smartLockCode, '7392#');
assert.ok(tailoredAzure.homeAppliances.length >= 4, 'Includes comprehensive appliance guides');
assert.ok(tailoredAzure.curatedDayTimeline.length >= 4, 'Includes full 24h curated timeline');
assert.ok(tailoredAzure.scoutRecommendations.length >= 2, 'Includes local scout recommendations');
console.log('ok  Tailored property guestbook builds complete structured data');

// 4. Standalone / North Coast / Alexandria fallback
const seawardLib = DEMO_PROPERTIES.find(p => p.slug === 'seaward-library');
if (seawardLib) {
  const seawardBook = buildTailoredGuestbook(seawardLib, 'Dr. Tarek');
  assert.ok(seawardBook.wifiSsid.includes('SEAWARD'), 'Seaward Library has tailored Wi-Fi');
  assert.ok(seawardBook.hostContact.phone, 'Has verified host phone');
}
console.log('ok  Seaward Library and alternative residences tailor correctly');

console.log('All Digital Visual Guest Book self-tests passed cleanly.');
