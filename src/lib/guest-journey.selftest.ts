import assert from 'node:assert/strict';
import type { Enquiry, Property } from '../types';
import { publicCardFacts } from './lh-core';
import { findGuestProperty, hasProvenGuestMoment, normalizeGuestPhone, maskGuestPhone, submitPersistedEnquiry, provenGuestMoments } from './guest-journey';

const home = { id: 'home-1', slug: 'home-one', supplyStage: 'live', publiclyVisible: true, sealIssued: true,
  provenMoments: [{ key: 'slow_morning' }], canonicalMoments: { night_swim: 'enabled' } } as unknown as Property;
assert.equal(findGuestProperty([home], 'home-one'), home);
assert.equal(findGuestProperty([home], 'unknown'), undefined);
assert.equal(findGuestProperty([{ ...home, publiclyVisible: false }], 'home-one'), undefined);
assert.equal(findGuestProperty([{ ...home, sealIssued: false }], 'home-one'), undefined);
for (const supplyStage of ['paused', 'declined'] as const) {
  const withdrawn = { ...home, supplyStage, lifecycle: 'live', joiningVisible: true } as Property;
  assert.equal(publicCardFacts(withdrawn).visible, false);
  assert.equal(findGuestProperty([withdrawn], 'home-one'), undefined);
}
assert.equal(publicCardFacts({ ...home, supplyStage: 'activation_ready' }).bookable, false);
const joining = { ...home, supplyStage: 'activation_ready', joiningVisible: true, sealIssued: false } as Property;
assert.equal(publicCardFacts(joining).visible, true);
assert.equal(publicCardFacts(joining).bookable, false);
assert.equal(hasProvenGuestMoment(home, 'slow_morning'), true);
assert.equal(hasProvenGuestMoment(home, 'night_swim'), false, 'owner-enabled claim cannot prove a Moment');
assert.equal(provenGuestMoments({ ...home, provenMoments: [{ key: 'slow_morning', level: 'nominated' }] }).length, 0);
assert.equal(provenGuestMoments({ ...home, provenMoments: [...home.provenMoments, ...home.provenMoments] }).length, 1);
assert.equal(normalizeGuestPhone('+20 (100) 000-0000'), '+201000000000');
assert.equal(maskGuestPhone('+201000000000'), '•••• 0000');
assert.throws(() => normalizeGuestPhone('not a phone'));
assert.throws(() => normalizeGuestPhone('+20 123'));
await assert.rejects(submitPersistedEnquiry(async () => { throw new Error('write failed'); }), /write failed/);
await assert.rejects(submitPersistedEnquiry(async () => ({} as Enquiry)), /could not be confirmed/);
let resolveWrite!: (enquiry: Enquiry) => void;
let finished = false;
const pending = submitPersistedEnquiry(() => new Promise(resolve => { resolveWrite = resolve; })).then(() => { finished = true; });
await Promise.resolve();
assert.equal(finished, false, 'success waits for the write');
resolveWrite({ id: 'saved-request' } as Enquiry);
await pending;
assert.equal(finished, true);
console.log('guest journey: route, provenance, contact and persistence assertions passed');
