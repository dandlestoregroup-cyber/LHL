# Little Hut Light — operating doctrine

Status: locked for the Demo/Live operating model. Base44 v1 is a visual and operational reference only; it is not a runtime, data source, or deployment dependency.

## Core model

The app has exactly five business entities:

1. **Partner** — an owner, scout, operator, independent assessor, or community authority.
2. **Property** — the supply record and its progression toward, through, or out of Live.
3. **Assessment** — independent evidence, TRUST/SHIELD gates, and proven Moments.
4. **OwnerDecision** — the owner’s explicit go/defer/decline decision and commercial mandate.
5. **Enquiry** — the single booking record from initial interest through stay completion or closure.

Views, cards, queues, holds, payments, and approvals are projections of these five entities, not separate sources of truth.

## Exact Moments

The only canonical Moment keys are:

1. `slow_morning` — Slow Morning / الصباح الهادئ
2. `long_table` — Long Table / المائدة الممتدة
3. `afternoon_drift` — Afternoon Drift / سكون الظهيرة
4. `night_swim` — Night Swim / السباحة الليلية
5. `fire_conversation` — Fire Conversation / حوار حول النار
6. `silent_reading` — Silent Reading / القراءة الصامتة

A listing, owner claim, or scout note can nominate a Moment. Only an independent physical assessment can mark it proven. Public property copy may show proven Moments only.

## Supply stages

Every property occupies exactly one stage:

`sourced → owner_engaged → assessment_scheduled → decision_pending → activation_ready → live`

`paused` and `declined` are explicit terminal/exception states. Advancement requires the evidence or authority owned by the next gate. No screen may infer a later stage from optimistic copy.

## Booking spine

Every booking journey is one Enquiry record:

`received → qualified → availability_checked → quoted → hold → payment_pending → payment_received → community_approval_pending → community_approved → confirmed → completed`

The record may also end as `declined`, `expired`, or `cancelled`. Stages not required for a property may be recorded as satisfied and skipped, but they are never silently ignored.

- An enquiry and a quote never block a calendar.
- A hold blocks only when it has a future `expiresAt`; it releases automatically at expiry.
- Payment may be recorded only against an in-policy quote and an active hold.
- Community approval, where required, is a hard gate before confirmation.

## Partner model and authority boundaries

| Partner role | Owns | Explicitly cannot do |
| --- | --- | --- |
| Scout | Source leads, capture owner consent and listing-level evidence | Prove Moments, assess, set owner terms, quote, confirm |
| Owner | Property truth, minimum nightly floor, payout readiness, go/defer/decline decision | Assess own property, grant seal, execute booking stages |
| Independent assessor | Physical evidence, TRUST/SHIELD results, proven Moments, recommendation | Source commission, set price, decide for owner, execute bookings |
| Operator | Activation checklist, calendar verification, quote, expiring hold, payment record, approval evidence, stay execution | Lower owner floor, fabricate owner decision, assess, grant community approval |
| Community authority | Issue or decline the external guest approval | Change price, property assessment, payment, or booking data |

The platform administrator may switch datasets and inspect all surfaces. That capability does not grant business authority inside a record.

## Go-Live gate

A property can become Live only when all are true:

- the independent assessment passes and proves at least two canonical Moments;
- all required TRUST and SHIELD gates pass;
- the named owner submits an explicit `go` decision with no unresolved blocking condition;
- the owner floor is a positive amount and payout readiness is true;
- calendar authority and booking mode are explicit;
- community-approval policy is explicit;
- activation checklist is complete.

Silence is not approval. A seal without an owner decision is not Live.

## Rate-floor rule

The owner’s `nightlyFloorEgp` is the minimum nightly accommodation amount. An operator may quote at or above it, never below it. Fees and access charges must be separate line items and cannot be used to disguise a below-floor accommodation rate. No valid floor or payout destination means no money may be taken.

## Community approval gate

If a property requires community approval:

- instant confirmation is disabled;
- guest manifest and required identity evidence must be complete before submission;
- only the named community authority may issue the decision;
- the operator may record evidence of that decision but may not create it;
- payment received does not override the gate;
- confirmation remains blocked until approval is recorded.

## Demo / Live boundary

- **Demo** is a deliberately synthetic, mature operating dataset. Every record carries `dataMode: "demo"` and `synthetic: true`; the UI labels it continuously.
- **Live** is truth-only. It starts with no business records and uses polished empty states. A Live record can only be created through a Live workflow and is stored only in the Live namespace.
- The datasets share types, rules, routes, and workflows, but never storage keys, IDs, queries, mutations, or counts.
- Switching mode changes the entire active repository atomically. Demo records never appear as Live evidence, metrics, availability, revenue, or social proof.
