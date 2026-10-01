# LHL — own the layer above rental automation

Owner direction: 1 October 2026. Status: execution specification; production acceptance remains open.

## 1. Summary

Little Hut helps a guest choose a stay worth travelling for, then makes that stay happen. Destination → Moment → verified home → authoritative availability and price → booking/payment → arrival → delivered experience is one continuous journey.

Rentello is the automation benchmark. Little Hut's differentiator is a recommendation tied to independently verified property evidence, followed by accountable delivery. A small pilot limits inventory, never property depth or retained capabilities.

## 2. Contacts

Mourad owns product direction and the release decision. Execution follows the existing Owner, Operator, BPS, Assessor, Scout, DANDLE/DPS, administrator and commercial reconciliation functions. Named assignments, deadlines and independent verifiers must be bound to active authorized identities; none is invented by this plan.

The [controlled restoration contract](LHL_Controlled_Restoration_Contract_2026-09-23.md) remains the governing acceptance register. Preserve D01–D11, C01–C29, A01–A12 and G0–G7. This plan sequences that scope and adds the competitive intent; it grants no new operating authority or production approval.

## 3. Background and current truth

Inspection on 1 October 2026 established:

- Canonical upstream: `dandlestoregroup-cyber/LHL`, main `e681ad026d94a48cab6594ec5b981cec13c7d412`. Its exact-head [qualification run](https://github.com/dandlestoregroup-cyber/LHL/actions/runs/36298702918) failed. Local inspection found a missing `firebase-applet-config.json` import; source repair must precede any readiness claim.
- Downstream: `moment-homes`, main `4ed1436e870a1b2df73337f654f46bae105de65d`, contains stronger guest intake, phone privacy and availability work. Reconcile accepted deltas into LHL deliberately; do not overwrite either lineage or discard stronger guards.
- `Lhl-v2`, main `bd3965a1d046495398ae0c60d4d5c2c24b452cf2`, passed source qualification after disabling a stale outbox schedule. This does not qualify canonical LHL, prove event delivery, or establish a current production runtime.
- Current LHL source already has separate Demo/Live datasets, server-owned Live Firestore records, scoped partners, supply gates, owner floor protection, an enquiry spine, readiness, ProofStay and outbox foundations. Their presence is source evidence, not live acceptance.
- Lovable is the publication surface. AI Studio remains the UX origin; GitHub owns durable product truth. The [consolidation decision](GOOGLE_LOVABLE_CONSOLIDATION.md) supersedes older Vercel deployment assumptions. Current frontend/backend/data identities and same-origin API routing still require fresh proof; this inspection did not requalify a deployed product.

[Rentello's own website](https://rentello.ai/) was checked on 1 October 2026. It markets conversational reservations, calendar/PMS/channel/payment integration, WhatsApp/web/SMS/voice, check-in instructions, concierge, upsells, review requests and custom escalation. These are advertised capabilities, not independently verified performance. Its FAQ says some integrations exist and others are on a roadmap; do not infer universal provider support.

## 4. Objective and measures

North star: **completed stays that deliver the guest's intended Moments, supported by current evidence and reconciled positive LHL contribution, without founder rescue.** Report total eligible stays and the delivered share together; do not hide failures behind a curated numerator.

First release outcomes, measured before G7 approval:

- One genuine paid stay completes the full cross-role journey on the same property/Stay IDs; guest and owner independently confirm the result.
- Both destination-first and Moment-first paths work in English and Arabic on mobile and desktop. Every displayed match explains its property-specific basis.
- Every retained C01–C29 row has normal and relevant failure/denial evidence. No missing provider, physical observation or recovered data is counted as a pass.
- No unexplained payment/refund/payout differences; contribution, operator labour and recovery exposure satisfy the owner-approved D07 thresholds.
- A delegated operator completes and recovers the journey without founder intervention.

Commercial instrumentation: discovery→property→valid request→quote acceptance→paid confirmation→completed stay; response time, abandonment, manual touches, operator minutes, delivery failures, recovery cost, owner net, LHL contribution and repeat bookings. Targets beyond release acceptance are hypotheses until a live baseline exists.

## 5. Market segments

- Guests who need the right setting for rest, time together, play or gathering and cannot judge that from listing amenities alone.
- Owners who want better demand and accountable delivery without running a hospitality operation themselves.
- Local operators who need one property truth and clear authority to deliver each promise.
- Independent assessors and BPS who need valid evidence, gap closure and control over certification.
- DANDLE/DPS teams who prepare homes through approved improvements and procurement, with private commercial data protected.

Start with one owner-mandated home in one destination. Azure Haven is a candidate only after current consent, operator/assessor assignments, eligibility and inventory authority are established. Memory or a Demo record cannot onboard it.

## 6. Value propositions and commercial engine

Guest: “Tell us why you are travelling. See the homes that can actually deliver it.” Rich property pages retain original photography, rooms/capacity, location context, amenities, rules, accessibility facts, evidence-based Moments, verification status and full price/terms context. Unknown facts remain unknown; inspirational artwork remains separate from home evidence.

Owner: self-assessment → visible gaps → approved improvements → independent verification → certification → expiry/reverification → stay outcomes → better next decisions. Buying improvements never guarantees admission.

Revenue follows attributable delivery: booking margin, owner SaaS, independent certification services, upgrades/procurement and experience commissions. Terms, taxes, fee disclosure, refund treatment, independence and economics must be approved before collection. Assessment is paid for work performed; a positive certification decision is never sold. Each revenue line needs its own delivery/cost/reconciliation evidence. Validate booking contribution first; introduce recurring owner SaaS only when operators use the workflow repeatedly.

## 7. Solution

### 7.1 Guest and supply journeys

Equal entry routes converge on one property and one Stay. Retain Slow Down, Come Closer, Play Together and Gather Around, all 30 staff planning concepts, original route/alias behavior and every operating workspace. No guest is routed into owner planning.

Availability has exactly one authority per home. An enquiry is not a reservation. Unknown/stale authority yields a recoverable exception or explicit human review; an active expiring hold owns the reservation window. Payment and community approvals remain independent gates before confirmation.

### 7.2 Moment Graph and Little Hut Standard

The graph links guest intent → applicable Moment → property-specific independent findings → current standard/certificate → availability and readiness → actual stay outcome. Implement it as linked projections over existing canonical records, not a second property database.

Every link carries provenance, record/version identity, validity and its permitted use. Owner/listing claims nominate; independent evidence proves. Safety or critical standard failures cannot be averaged away. Invalidation, expiry or suspension removes affected public claims and blocks new stays; existing stays enter a governed recovery path.

Recommendation output explains why the home fits and what remains conditional. Accessibility, quiet, privacy, water access and suitability are never inferred from photos or generic amenity names. Post-stay feedback and ProofStay may trigger review and improve ranking; neither automatically certifies a home or assigns damage liability.

The moat hypothesis is tested through better matched delivered stays, lower manual effort and repeat demand. More data alone does not establish a moat.

### 7.3 Booking and concierge table stakes

Use the existing approved channel/PMS infrastructure, with SiteMinder as the intended distribution path subject to documented product fit, access and owner approval. Verify the exact API/product against home inventory, rate, reservation, cancellation and reconciliation requirements; a meeting or provider logo is not an integration.

Native guest/owner records, quotes, payment receipts, permissions and delivery stay in LHL. Build web chat first, then approved WhatsApp, and voice only after the same booking truth works. One conversation maintains intent and passes a consented, complete brief to a named human. No AI message can fabricate available dates, a paid outcome, approval, certification, access code delivery or experience fulfilment.

Check-in, concierge, upsells and reviews require the relevant confirmed Stay, consent, approved provider and delivery receipts. Failed/duplicate/out-of-order events must preserve canonical state and produce a visible accountable exception.

### 7.4 Boundaries and assumptions

Preserve React/Vite/Express/Firestore and the existing publication lineage. No parallel product, cross-product credentials, host/database migration, provider activation or paid execution is authorized by this plan. Zero Lovable/Base44 generation credits; Activepieces stays frozen/default-off pending its audit. Do not create a replacement backend to conceal missing access.

Unproven dependencies: current backend ownership/access, deployed API topology, compatible backup restore/rollback, approved independent standards/validity, real role assignments, SiteMinder eligibility, payment merchant authority, message-provider receipts and viable unit economics. They remain visible D-register work.

## 8. Release sequence

G0 resource identity, recovery and authority are prerequisites within the first milestone. Technical source repair may continue while access is unresolved; production exposure and launch do not follow automatically.

| Order | Working deliverable | Evidence to exit the milestone |
| --- | --- | --- |
| 1 Guest journey | Destination/Moment discovery, rich factual property pages, original image framing and durable request receipt | Both routes, EN/AR mobile/desktop; hidden/withdrawn/unknown homes denied; rejected/pending saves never show success; same request survives refresh and reaches the authorized operator |
| 2 Booking truth | One inventory authority, conflict-safe holds, transparent accepted quote, processor payment, approvals, cancellation/refund and secure My Stay | Concurrent/expired/stale cases; signed and replayed provider events; persisted confirmation; guest/owner payable and payout reconciliation |
| 3 AI concierge | Grounded web conversation, human takeover, approved communications, usable arrival and experience offers | Intent/evidence trace; refusal of unsupported promises; consenting physical delivery receipt; retry/takeover and channel opt-out |
| 4 Certification | Owner self-audit, gaps, independent standard, certificate validity, suspension and reverification | Independent normal/rejected assessments, expiry/suspension public/API effects, managed recovery for existing stays and authorized reactivation |
| 5 Operator OS | Connected workspaces, upgrades/procurement/QC, readiness, incidents, ProofStay and accountable handoffs | Cross-role allow/deny tests; six readiness checks; pre/post baseline; failed/late/defective work recovered; delegated operator acceptance |
| 6 Scale destinations | Repeatable owner/operator onboarding, scoped second tenant, channel reconciliation and sustainable owner SaaS | C01–C29/G0–G7 current evidence, true stay/economics dossier, two-tenant isolation, restore/rollback, transferable runbooks and explicit owner release decision |

Existing certification and operating foundations stay in use throughout; order means completion priority, not permission to weaken earlier gates. The first genuinely bookable home still requires independent assessment and every existing supply gate.

Each milestone has an acceptance ledger using the restoration contract's exact environment/source/build/data versions, actor/permission, property/Stay IDs, time, expected/actual result, provenance, provider receipt, verifier, validity, failure/recovery and limitations. Missing or contradictory evidence reopens the gate. Timelines are relative to resolved dependencies; no unsupported delivery date is promised.

**Positioning:** Rentello automates renting. Little Hut decides which stay is worth having, then makes the entire stay happen.
