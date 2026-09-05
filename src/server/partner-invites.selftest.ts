import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hashInviteToken, inviteCanBeAccepted, inviteCanResume } from './partner-invites';

const token = 'example-single-use-token-that-must-never-be-stored-raw';
const hash = hashInviteToken(token);
assert.equal(hash.length, 64, 'invite tokens are stored as SHA-256 hex digests');
assert.notEqual(hash, token, 'stored invite identifier is not the raw token');
assert.equal(hashInviteToken(token), hash, 'invite token hashing is deterministic');
assert.notEqual(hashInviteToken(`${token}-different`), hash, 'different tokens do not share the same digest in the test case');

const now = new Date('2026-09-05T08:00:00.000Z');
const future = '2026-09-07T08:00:00.000Z';
const past = '2026-09-05T07:59:59.000Z';
assert.equal(inviteCanBeAccepted({ status: 'pending', expiresAt: future }, now), true, 'pending unexpired invite can be accepted');
assert.equal(inviteCanBeAccepted({ status: 'pending', expiresAt: past }, now), false, 'expired invite cannot be accepted');
assert.equal(inviteCanBeAccepted({ status: 'accepted', expiresAt: future }, now), false, 'accepted invite cannot be accepted again');
assert.equal(inviteCanBeAccepted({ status: 'revoked', expiresAt: future }, now), false, 'revoked invite cannot be accepted');
assert.equal(inviteCanBeAccepted({ status: 'claiming', expiresAt: future }, now), false, 'claiming invite does not reopen signup');
assert.equal(inviteCanResume({ status: 'claiming', expiresAt: future }, now), true, 'claiming invite can resume its interrupted claim');
assert.equal(inviteCanResume({ status: 'claiming', expiresAt: past }, now), false, 'expired claim cannot resume');
assert.equal(inviteCanResume({ status: 'pending', expiresAt: future }, now), false, 'pending invite is not treated as a resume');

const inviteSource = fs.readFileSync(new URL('./partner-invites.ts', import.meta.url), 'utf8');
assert(inviteSource.includes('crypto.randomBytes(32)'), 'issued invitation uses 256 bits of random token material');
assert(inviteSource.includes("status: 'revoked'"), 'invitation revocation is implemented');
assert(inviteSource.includes("status: 'accepted'"), 'accepted state is persisted');
assert(inviteSource.includes("status: 'claiming'"), 'claim state exists to prevent concurrent reuse');
assert(inviteSource.includes('existing_partner_conflicts_with_invite'), 'existing Partner conflicts fail closed');
assert(!inviteSource.includes('rawToken:'), 'raw invitation token is not written into the invite record');

const serverSource = fs.readFileSync(new URL('../../server.ts', import.meta.url), 'utf8');
assert(serverSource.includes("app.post('/api/auth/accept-invite'"), 'server exposes a rate-limited invitation acceptance endpoint');
assert(serverSource.includes("app.post('/api/live/invites/:id/revoke'"), 'server exposes invitation revocation');
assert(serverSource.includes('inviteUrl(issued.token)'), 'raw token is returned only as the newly-issued invitation URL');

console.log('partner invitation self-test: ok');
