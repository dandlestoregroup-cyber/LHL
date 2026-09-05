# LHL → Activepieces automation boundary

## Role

Activepieces is orchestration only. It never becomes the source of truth for properties, availability, enquiries, holds, pricing, payment evidence, approval state, partner authority, assessment results, owner decisions, or the Little Hut seal.

LHL now has two deliberately separate outbound paths:

- **Demo:** browser-originated synthetic events are normalized and signed by `POST /api/activepieces`.
- **Live:** committed server-owned business writes atomically append a sanitized Firestore `liveOutbox` record. A secret-guarded drain sends those durable records to Activepieces only after the business commit succeeds.

## Demo contract

Supported Demo events:

- `enquiry.created`
- `enquiry.stage_changed`
- `community_approval.recorded`
- `scout_lead.created`

Every Demo event contains `version: 1`, a server-owned `id`, `source: lhl-web`, `dataMode: demo`, `synthetic: true`, `occurredAt`, and a validated payload.

The Demo gateway adds:

- `x-lhl-event-id`
- `x-lhl-timestamp`
- `x-lhl-signature: sha256=<HMAC>`
- `x-lhl-simulation: true`

## Live durable outbox

Every committed Live write to Property, Assessment, OwnerDecision, or Enquiry produces a sanitized outbox record inside the **same Firestore commit**. If the business write fails, no event exists. If Activepieces is unavailable, the business write remains committed and the event stays pending for retry.

Live payloads intentionally exclude sensitive or authority-bearing fields such as guest name/phone, payment references, approval evidence, owner-consent evidence, and owner nightly floor. They carry only the state facts needed for orchestration, such as supply stage, seal/public status, assessment result, owner decision, booking stage, and community-approval status.

A trusted scheduler calls:

`POST /api/internal/live-outbox/drain`

with header:

`x-lhl-outbox-secret: <LHL_OUTBOX_SECRET>`

Live delivery adds:

- `x-lhl-event-id`
- `x-lhl-idempotency-key` — same stable event ID
- `x-lhl-timestamp`
- `x-lhl-signature: sha256=<HMAC>`
- `x-lhl-simulation: false`

The signature is HMAC-SHA256 over `<timestamp>.<exact JSON body>` using `ACTIVEPIECES_SHARED_SECRET`.

Failed delivery is retained and retried with bounded exponential backoff. Activepieces must also deduplicate by `x-lhl-idempotency-key` before any downstream side effect; this makes retries safe across network ambiguity.

## GitHub scheduler

`.github/workflows/live-outbox-drain.yml` runs every five minutes and can also be invoked manually. It is deliberately inert until both repository secrets exist:

- `LHL_APP_URL` — the deployed HTTPS base URL, for example `https://lhl.example.com`
- `LHL_OUTBOX_SECRET` — the same long random value configured server-side as `LHL_OUTBOX_SECRET`

The workflow never prints either secret. It POSTs a batch limit of 20, fails on non-2xx responses, and validates that the response contains numeric `checked`, `delivered`, and `retryScheduled` fields. Missing secrets produce a harmless no-op run rather than repeated production failures.

## Activepieces verification flow

1. Receive the webhook and retain the **exact raw request body** for signature verification.
2. Reject stale timestamps.
3. Verify `x-lhl-signature` with `ACTIVEPIECES_SHARED_SECRET` over `<timestamp>.<exact body>`.
4. Branch on `x-lhl-simulation` / `dataMode`:
   - Demo: require `true`, `demo`, `synthetic=true`; permit simulations only.
   - Live: require `false`, `live`, `synthetic=false`; continue only after idempotency dedupe.
5. For Live, store/check `x-lhl-idempotency-key` before executing any connector action. An already-seen key must return success without repeating the action.
6. Route from the sanitized state payload. Never infer a payment, owner decision, community approval, assessment result, or seal beyond the explicit server state supplied by LHL.
7. Keep each external connector least-privilege. Activepieces may notify or coordinate; it cannot mutate reserved authority merely because an event exists.

## Live automation authority ceiling

Automation may react to committed truth; it cannot create that truth. In particular:

- no automation issues the Little Hut seal;
- no automation chooses an assessment result;
- no automation creates an Owner go/defer/decline decision;
- no automation fabricates payment or community-approval evidence;
- no automation changes the owner floor;
- no Demo event may reach Live connectors.

## Production configuration

Server-only environment values:

- `ACTIVEPIECES_WEBHOOK_URL`
- `ACTIVEPIECES_SHARED_SECRET`
- `LHL_OUTBOX_SECRET` — separate secret for the drain endpoint

GitHub Actions repository secrets:

- `LHL_APP_URL`
- `LHL_OUTBOX_SECRET`

The drain endpoint is intentionally not a browser/session action. Repeated drains are safe because delivered events are terminal and pending events use stable idempotency keys.
