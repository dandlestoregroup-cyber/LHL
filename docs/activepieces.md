# LHL → Activepieces automation boundary

## Role

Activepieces is an orchestration layer only. It never becomes the source of truth for properties, availability, enquiries, holds, pricing, payment evidence, approval state, or partner authority.

All outbound automation leaves LHL through one endpoint: `POST /api/activepieces`.

## Current safety state

The current Live workspace still persists in browser `localStorage`. Because a browser cannot be trusted to authorize real-world side effects, the gateway accepts **Demo events only** (`dataMode=demo`, `synthetic=true`). Live events are deliberately suppressed in the client and rejected by the server.

Live automation may be enabled only after Live mutations are persisted and authenticated server-side.

## Event contract v1

Supported events:

- `enquiry.created`
- `enquiry.stage_changed`
- `community_approval.recorded`
- `scout_lead.created`

Every event contains:

- `version: 1`
- unique `id`
- `source: lhl-web`
- `dataMode`
- `synthetic`
- `occurredAt`
- event-specific `payload`

The gateway adds:

- `x-lhl-event-id`
- `x-lhl-timestamp`
- `x-lhl-signature: sha256=<HMAC>`
- `x-lhl-simulation: true`

The signature is HMAC-SHA256 over `<timestamp>.<exact JSON body>` using `ACTIVEPIECES_SHARED_SECRET`.

## Activepieces flow: LHL Booking Spine — Demo

1. Create a flow with **Webhook → Catch Webhook** as the trigger and publish it so it has a live webhook URL.
2. Store that URL in LHL server environment variable `ACTIVEPIECES_WEBHOOK_URL`.
3. Store the same long random secret in LHL as `ACTIVEPIECES_SHARED_SECRET` and in the Activepieces verification step.
4. First step after the webhook: verify timestamp freshness and HMAC signature. Reject on mismatch.
5. Reject unless `dataMode=demo`, `synthetic=true`, and `x-lhl-simulation=true`.
6. Route by `type`:
   - `enquiry.created`: create a demo operator notification / demo task only.
   - `enquiry.stage_changed`: branch on `toStage`; calendar, payment, approval, and guest-message actions remain simulations until Live is server-backed.
   - `community_approval.recorded`: update the demo operations notification trail.
   - `scout_lead.created`: create a demo sourcing follow-up.
7. Use `id` as the idempotency key so retries cannot duplicate downstream work.

## Live exit gate

Before removing the Demo-only guard:

- Server-backed persistent Live repository exists.
- Authenticated Guest / Owner / Scout / Operator identities exist.
- Authorization is enforced server-side.
- Availability and booking writes are transactional and auditable.
- Activepieces receives events from the trusted server after successful commits, never directly from browser state.
- Each external connector gets least-privilege credentials and an explicit authority boundary.
- End-to-end tests prove duplicate events are idempotent and Demo can never reach Live connectors.
