# LHL — Controlled restoration and release contract

**Decision: conditional pass for controlled restoration. Launch approval withheld.**

Owner direction and evidence inspection date: 23 September 2026 (UTC).

LHL is a complete, selective experiential hospitality platform. A smaller pilot limits the number of homes; it does not remove product capabilities. The acceptance outcome is a guest who discovers, trusts, books, pays, arrives and experiences the promised stay without founder rescue.

This contract translates the latest owner direction into execution and acceptance requirements. It does not certify implementation, live services, independent assessments or a completed stay. Every capability below remains OPEN for production acceptance until its required evidence is attached and reviewed.

## 1. Current baseline and evidence boundary

| Item | Evidence inspected | Finding |
|---|---|---|
| Existing repository | `dandlestoregroup-cyber/moment-homes`, main | `503cba301bfcbb5d5db386d2e090d359059bcdd2` |
| Current root tree | GitHub main branch/tree | `e2313e70cb6663d9a5818b98d3ff4a114a6ff47b` |
| Main source qualification | GitHub Actions run `35813441048` | Reported completed/success for that exact main SHA; source/runtime fixture tests, not a real stay |
| Existing publication connection | Lovable project `5b2147ec-2556-4418-b4d0-721b32a73c3d` | Published flag true; latest synchronized commit equals main. Synchronization is separate from published identity |
| Public origin | `https://moment-homes.lovable.app` | Browser reaches the guest application |
| Published HTML declaration | DOM meta `lhl-build-commit`, observed after Homes navigation | `0c98bb51685bfcc48f0d2551b102d9479bacbb5a`; GitHub confirms this is the 22 September crawl-endpoint commit. It differs from current main; this is an HTML declaration, not whole-artifact/backend attestation |
| Public API paths | Browser navigation to `/api/health` and `/api/live/dataset` | Both render the application shell instead of API data. Runtime gate FAILS |
| Guest inventory presentation | Homes navigation | Displays “The first collection is being prepared now.” This cannot establish actual inventory while the data boundary is broken |
| Release JSON | Browser navigation blocked by client; separate HTTP retrieval returned 403 | Not obtained in this run. Do not infer its contents or interpret the local retrieval restriction as production downtime |
| Existing further candidate | Draft PR #39 | Open, draft, head `c138d118a18d3d17523aadd43560e7ed893f0c2d`; GitHub reports `mergeable: false`. Run `35821552029` reports source qualification success. This is not merge or release approval |
| Backend administration | Firebase Console | Account chooser shows signed-out state. Database ownership, deployed rules/IAM, live records and backups could not be inspected |
| Connected alternate resources | Read-only Railway project/service inventory | Two Property-Card services; neither establishes an LHL-owned backend. No substitution is authorized |
| Recovery | Existing source rollback documentation reviewed | A source revert procedure exists. No hosted rollback or database restore was demonstrated. A Git snapshot is not a runtime/data backup |

The 19 September as-is blueprint is pinned to `26c55da148022c6ad985f68c2ba023b7e79cd47e`. Keep it as historical evidence. Do not reset current main to that old snapshot. The blueprint explicitly excludes live validation; its reproduction checks cannot satisfy this release contract.

## 2. Scope and preservation rules

- Preserve the existing React/Vite/Express/Firestore architecture, Lovable publication surface, identifiers, authentication, stronger security fixes and approved original assets. No host/database migration, rebuild, parallel product or cross-product resource reuse.
- Guest discovery has equal destination-first and Moment-first routes, converging on the same property, availability, price and Stay. Neither route sends guests into owner space planning.
- Retain four public collections: Slow Down, Come Closer, Play Together and Gather Around. Retain all 30 design concepts for planning. A concept or photograph does not prove a property can deliver a Moment.
- Retain native onboarding, owner self-audit, independent certification, renewal/expiry/suspension, all operating workspaces, procurement, delivery, commerce, communications, analytics, governed automation and recovery. Sequencing delivery is not permission to delete scope.
- Preserve original property photographs and approved artwork. Record asset identity, provenance and per-breakpoint focal framing. No stretch, invented view/amenity, generated replacement or crop that conceals material property facts. Clearly distinguish inspiration artwork from evidence of an actual home.
- No Lovable/Base44 generation, paid infrastructure, provider activation or credit-consuming execution without existing explicit approval. Keep Activepieces frozen/default-off pending its credit audit. A frozen integration remains an open capability dependency; it is not silently waived.
- No production promotion follows from this plan. Retained workflows need evidence before release, even when a pilot stay does not naturally exercise every exception.

## 3. Accountability and permission contract

The functions below are accountable destinations, not invented named assignments. Before a work item enters execution, an authorized administrator must bind exactly one accountable active identity, an executor, a due date and an independent verifier where required. No named operating appointments were verified in this run. **Unassigned is an open dependency.** One person may perform several functions where policy allows; independence requirements still apply.

Mastermind owns execution coordination: read current records, identify dependencies, assign only within granted authority, execute allowed actions, verify resulting records/provider receipts, retry safely and escalate unresolved exceptions. Mastermind cannot manufacture a human appointment, independent inspection, owner consent, provider settlement or physical stay.

| Function/workspace | Accountable decisions and permitted scope | Boundary to enforce |
|---|---|---|
| Owner | Home authority, mandate, rate floor, material scope/budget approvals, payout instructions | Only own assigned homes; self-report cannot certify; consequential changes remain governed |
| Operator | Assigned stay delivery, availability operations, quotes, preparation, incidents and reconciliation work | Only granted property/actions; no independent safety sign-off or fabricated payment |
| BPS | Brand Performance Support: standards, audit oversight, evidence adequacy, certification policy, suspension/review | Standards and consequential decisions require authorized humans; no averaging away critical safety failure |
| Assessor | Assigned independent inspection, findings, evidence and reassessment | Existing server role is `assessor`; independent of owner, installer and correction author for the decision being verified |
| Scout | Sourcing, consent, applications, qualification handoff | Cannot activate, certify, move money or gain rights by changing the interface lens |
| DANDLE/DPS | Design & Project Services: proposals, upgrades, supplier/BOM, approved procurement, installation/QC | Use the existing assigned procurement capability. No self-approval of owner cost or Little Hut certification; private supplier costs stay private |
| Platform administrator | Identity binding, scoped grants/revocation, technical operations and release control | Admin status alone does not confer independent assessment or unrestricted business authority |
| Commercial reconciliation function | Provider matching, ledger exceptions, payable/payout/statement review | Bind to an existing explicitly permitted identity; do not invent a Finance server role |
| Mastermind | Policy-bounded coordination and execution, evidence verification, exceptions | Same server authorization as any actor; no UI-role elevation, private shadow database, unrestricted agent key or authority override |

Every server action must check active identity, property/tenant scope, action permission, any approval threshold, current record revision and evidence validity. Interface visibility is not authorization. Verify positive access and wrong-property, wrong-role, revoked, expired-session and concurrent-revocation denials before exposing a workflow.

## 4. Dependency register and authoritative data

| ID | Dependency owner | Required resolution before downstream execution | Evidence |
|---|---|---|---|
| D01 | Platform administrator | Reconnect authorized access to the existing LHL backend; verify project ownership, deployed runtime, Firestore, identity, IAM/rules, storage and approved same-origin routing | Resource identities, topology, redacted access tests and deployed configuration references; no secrets in this file |
| D02 | Platform administrator | Identify current frontend/backend artifacts and compatible known-good recovery pair; prove database/config backup restore in approved isolation | Artifact digests, SHA, data version, backup ID, restore and rollback record |
| D03 | Platform administrator + each function lead | Bind actual active people to homes/actions, accountable work, deadlines and independent verification | Permission/assignment records plus allow/deny tests |
| D04 | BPS | Approve versioned TRUST/SHIELD/Moment criteria, inspection methods, evidence validity, expiry, reinspection and suspension triggers | Signed standard version, assessor qualification/independence record and conflict policy; software validators alone do not establish safety compliance |
| D05 | Owner + Scout | Real pilot property authority, consent, operating mandate and permitted data use | Owner-approved mandate and property/application IDs |
| D06 | Owner + Operator | Select exactly one inventory authority per home and establish access, freshness limit, holds/conflict/reservation semantics | Authority record, provider contract/config if used, sync/reconciliation tests; personal calendar copies never count |
| D07 | Commercial function + Owner | Confirm pricing, floor, fees/tax treatment, terms, cancellation/refund policy, payout approval and economics thresholds | Versioned accepted policy and rate/quote examples; no invented commercial values |
| D08 | Commercial function + Platform administrator | Verify the existing approved payment merchant/provider and payout access | Merchant/environment binding, signed-event verification, currency/amount mapping, reconciled receipts and payout records |
| D09 | Operator + Platform administrator | Verify approved communications destinations, consent, templates and delivery provider; honor spending freeze | Provider access and delivery/retry receipts, not a queued-event count |
| D10 | DANDLE/DPS + Owner | Verify suppliers, approved scope, quotes, procurement authority and installation responsibility | Current quotes, lead times, warranty/QC terms, approved PO boundaries |
| D11 | Operator + Guest + Commercial function | Schedule a genuine pilot with consenting participants and approved financial movements | Real stay/guest/owner participation and receipt references; no synthetic participant can pass this gate |

Authority is explicit and field-specific: the canonical Property holds property identity/assignments; owner reports retain reported provenance; independent assessment records own verified findings; certification policy derives eligibility; the selected inventory authority owns availability; versioned quotes own accepted price; the processor owns payment outcome; the ledger reconciles money; delivery providers own delivery status; inventory/readiness/ProofStay records own operational evidence. Role screens project these same records and IDs. Imported listings, AI suggestions and browser state are never competing Live authorities.

Missing, stale or contradictory authority blocks the affected transition and creates a visible exception. It must not return an invented available date, valid seal, delivered message, confirmed stay or paid payout.

## 5. Capability-to-acceptance register

All rows have production acceptance status **OPEN**. Existing source may implement part of a row; the row closes only on the stated evidence. Dependencies are prerequisites, not permission to omit the capability. For each row, attach a passing normal path and the relevant denial/failure case.

| ID | Retained capability | Accountable function | Dependencies | Measurable acceptance test | Required evidence |
|---|---|---|---|---|---|
| C01 | Destination-first discovery | Operator | D01,D04,D06 | Destination, party and dates filter eligible homes; preferences survive back/refresh; stale or failed authority shows a recoverable error | Recorded guest path, query/result IDs and stale-source test |
| C02 | Moment-first discovery, four collections and 30-concept planning | Operator | D01,D04 | Each collection reaches homes with proven matching Moments; no guest is routed to owner planning; all planning concepts remain accessible to permitted staff | Four journey traces, concept inventory and eligibility assertions |
| C03 | Rich property pages and original image framing | Operator | D04,D05 | Original photos, rooms/capacity, location context, amenities, rules, accessibility facts, promised Moments, current verification and complete price context agree with property truth; no stretch/cropped essential facts at mobile/desktop | Asset/focal manifest, property projection, screenshots and assessor factual review |
| C04 | Native onboarding, listing import, evidence capture and durable drafts | Scout | D01,D03,D05 | Owner submits and resumes across two devices; camera/file evidence remains private; import keeps provenance; failed upload/retry creates no duplicate application | Same application ID/revisions, stored asset references, access denials and recovery trace |
| C05 | Scout sourcing and consent-to-property handoff | Scout | D03,D05 | Review, request missing evidence and accept/decline use the same application/property linkage; no duplicate property or premature publication | Consent, intake decision and immutable handoff audit |
| C06 | Owner self-audit and gap closure | Owner | D03,D04 | Self-audit records history, assignee, deadline and correction evidence; rejection/resubmission/reopening works; self-audit cannot issue certification | Audit/case IDs, versions, timestamps and independent closure/rejection record |
| C07 | Independent evidence-backed assessment | BPS | D03,D04,D05 | Assigned independent assessor completes current TRUST/SHIELD/Moment criteria; missing evidence and critical failure block; outcome derived by policy | Standard version, actual inspected evidence, findings and actor separation |
| C08 | Certification, expiry, suspension and reactivation | BPS | C06,C07 | Valid certificate has scope/version/dates; controlled time advancement expires it; critical incident or revoked evidence suspends eligibility; public claims/new booking gate update; existing stays enter managed recovery; only authorized reassessment reactivates | State transitions, public/API before-after checks, incident and reinspection audit |
| C09 | Owner decisions, calendar visibility and controls | Owner | D03,D05,D06,D07 | Owner approves/defer/declines mandate and floor; calendar shows authoritative status; owner-reserved actions cannot be executed by operator/DPS | Decision versions, scoped calendar and denied-action evidence |
| C10 | Connected Owner/Operator/BPS/Assessor/Scout/DANDLE-DPS workspaces | Platform administrator | D01,D03 | Same property/application/stay IDs remain consistent across authenticated distinct actors; no re-entry or copied silo; wrong scope/revocation denies | Cross-role journey and comprehensive role/action/property access matrix |
| C11 | Upgrades, design and costed owner approval | DANDLE/DPS | D03,D10 | Existing-items/refresh/full setup options carry feasibility, scope, acceptance/reset criteria and real quote; owner can approve/reject versioned cost | Linked project, BOM, quote, owner approval and changed-scope reapproval |
| C12 | Procurement, delivery, installation, QC and defects | DANDLE/DPS | C11,D10 | Approved order proceeds through receipt/install/QC; partial/late/defective delivery raises assigned correction; completion cannot certify the home | PO, receipt, installation, defect/retest and independent handoff records |
| C13 | Authoritative availability, holds and channel reconciliation | Operator | D01,D06 | Two concurrent requests for same nights produce one hold; expiry/cancel releases it; stale/unknown external source blocks; imported reservation/maintenance conflict is reconciled without double booking | Transactions, timestamps, provider/local authority receipts and drift recovery |
| C14 | Pricing, owner floor and versioned quote acceptance | Commercial function | D06,D07 | Total/nightly rate, fees/currency and terms are transparent; below-floor offer denied; guest accepts exact quote version; expired/repriced quote cannot silently charge | Quote hash/version, consent record and floor/stale-acceptance tests |
| C15 | Booking, approvals, cancellation and secure My Stay | Operator | C08,C13,C14,C16,D03 | Secure guest retrieval survives refresh/login; confirmation requires valid acceptance, inventory/payment and any community approval; cancellation updates canonical records; bearer/ID guessing denied | Same-Stay transition trail, scoped guest view and approval/cancel evidence |
| C16 | Provider-authoritative payments and refunds | Commercial function | D08,C13,C14,C24 | Amount/currency/Stay bind to provider outcome; forged/duplicate/out-of-order/reversed events create no false or duplicate money; governed refund reaches provider and ledger | Signed-event verification, independent provider receipt/re-query, refund/exception audit |
| C17 | CRM, guest commitments and delivered communications | Operator | D09,C15 | Enquiry through post-stay history uses same guest/Stay; promised actions have owner/deadline; delivery failure retries safely and escalates; opt-out/privacy respected | Message/provider receipts, response/task links and duplicate/failure tests |
| C18 | Preparation, housekeeping, readiness and arrival | Operator | C08,C15,D03 | Access, cleanliness, utilities, sleeping, safety and Moment setup each have current evidence; failed check creates task/block/retest; guest receives usable authorized arrival instructions | Assigned work, six readiness records, delivery evidence and actual arrival acknowledgement |
| C19 | Incidents, maintenance, support and recovery | Operator | C17,C18 | Guest issue becomes severity-based assigned case; missed SLA escalates to delegated backup; maintenance blocks inventory; independent closure where required; no founder-only step | Actual or safely rehearsed incident timeline, action/compensation approvals and closure/reopen trace |
| C20 | Inventory baseline and pre/post ProofStay | Operator | C18,D04 | Pre-stay uses confirmed stay, ready home and current baseline; post-stay follows checkout; immutable comparison identifies change; no automatic damage charge | Linked baseline/pre/post snapshots and discrepancy review |
| C21 | Owner payable, payout reconciliation and statements | Commercial function | C16,C20,D07,D08 | Every receipt/refund/fee/expense/payable/payout matches same Stay; payout pending differs from settled; unexplained reconciliation difference is zero; guest/supplier privacy maintained | Ledger, bank/processor payout reference, owner statement and exception closure |
| C22 | Listing distribution, reputation and outcome analytics | Operator | C03,C08,C17,C21 | Published claims follow current eligibility; suspended claims withdraw through approved channels; review/complaint feeds cases; conversion/cost/performance figures trace to source records | Listing versions, withdrawal receipt, review workflow and reconciled metric samples |
| C23 | Mastermind execution, agent controls and exception queue | Platform administrator | D01,D03,D07,D09 | Each enabled action has trigger, allowed tools, authority, cost limit, success check, retry/timeout and escalation; demonstrate allowed execution, denied action, duplicate/retry and pause/resume | Run ledger with inputs/policy/tool versions, result IDs, verifier and usage; no autonomous certification or invented provider outcome |
| C24 | One property truth, concurrency and audit integrity | Platform administrator | D01,D02,D03 | Cross-role writes use canonical IDs and revision checks; stale/concurrent writes fail safely; retries do not duplicate; consequential events remain attributable | Data/ID mapping, transaction/conflict tests and append-only audit inspection |
| C25 | Tenant/property isolation, evidence privacy and access recovery | Platform administrator | D01,D03 | Two separate tenants/property scopes deny reads/writes/exports/media access; revocation/session expiry work; account recovery preserves authority and reveals no secrets | Positive/negative hosted tests, IAM/rules evidence, media/link expiry and recovery records |
| C26 | Failure recovery, backup restore and hosted rollback | Platform administrator | D01,D02 | Rehearse runtime/database restart, provider timeout and partial failure; recover queued work without duplicate effects; restore approved backup in isolation; roll candidate back and forward with compatible data | Timed recovery report, deployment/digest pairs, data integrity checks and backlog reconciliation |
| C27 | Mobile, Arabic/English and operator usability | Operator | C01–C23 | Guest and each action workspace complete critical tasks at 360/390/430px and desktop; Arabic RTL, keyboard/zoom, camera uploads, poor network and expired session recover; no founder explanation required | Device/browser/language matrix, recordings, task completion and usability defect closure |
| C28 | Portfolio/delegation, policy inheritance and transferability | Platform administrator | C10,C23,C25,C26 | Second authorized operator receives only assigned capabilities; two tenants inherit standards with audited allowed overrides; exports/runbooks allow operation without founder memory | Delegation test, tenant config/override audit, export/recovery and operator acceptance |
| C29 | Genuine stay and viable delivery economics | Operator | D11,all relevant C rows | One real guest completes one real property stay and the full money/evidence chain; every retained row separately qualified; no founder rescue; contribution meets approved threshold | Same-Stay dossier, independent guest/owner confirmation, settled money, actual costs/labour and incident recovery |

Original action entry coverage remains explicit: A01 owner self-audit→C06; A02 four collections→C02; A03 homes/request→C01/C03/C15; A04 30 concepts→C02/C11; A05 apply→C04; A06 owner/calendar→C09/C13; A07 review applications→C05; A08 quality/safety→C07/C08; A09 booking/arrival/checkout→C15–C21; A10 DANDLE delivery→C11/C12; A11 business control→C10/C23–C28; A12 simulated activity→C23 with an explicit Demo boundary. Preserve original route/alias behavior unless an owner-approved correction is recorded. Demo activity never qualifies Live delivery.

The nine additional action areas in the existing full brief also remain: communications C17; availability C13; revenue/pricing C14; payments/reconciliation C16/C21; housekeeping/maintenance C18/C19; owner earnings C21; marketing/reputation C22; Agent Hub C23; portfolio/franchise control C28. No new permissions arise merely from naming an action area.

## 6. Execution sequence and release gates

| Gate | Work and pass condition | Current decision |
|---|---|---|
| G0 Baseline/recovery | Bind repository/build/frontend/backend/data identities; inspect existing owned resources; prove compatible rollback and restore. Preserve imagery/security changes | HOLD: older HTML declaration, API shell responses, backend access signed out, recovery unproven |
| G1 Authority | Resolve D03–D10, independent criteria, provider authority and permissions; execute negative access tests before workflow exposure | OPEN |
| G2 Controlled source restoration | Reconcile existing candidates normally against latest main; preserve spend/security guards and imagery. Resolve PR #39 conflict deliberately. Run exact-candidate qualification in an authorized environment | OPEN; earlier CI success is retained as source evidence only |
| G3 Complete workflow qualification | Close C01–C28 against the same canonical records. Use isolated records for destructive/error/time-expiry cases; keep evidence classifications explicit | OPEN |
| G4 Genuine cross-role stay | Owner/Scout intake → independent assessment → approved upgrades/procurement → activation → both discovery routes → quote/acceptance/hold/payment → required approvals → preparation/arrival → promised experience → checkout/ProofStay → payout/reconciliation | OPEN; a physical stay cannot be simulated or accelerated into a pass |
| G5 Security/recovery/mobile | Hosted scope denials, failure suite, backup/rollback, all critical mobile/Arabic tasks and operator handover | OPEN |
| G6 Economics | Actual paid stay costs and operational labour support approved positive contribution and recovery reserve; zero unexplained money differences | OPEN |
| G7 Launch decision | Every retained capability has current evidence and authorized acceptance; no critical safety/security/financial/operational defect; exact deployed candidate matches reviewed release; explicit owner release decision | NOT APPROVED |

Technical repair can continue in the existing source while G0 access is resolved, but no live workflow exposure, migration, purchased service, paid activation or production promotion is implied. Do not rename an open capability “later” to obtain a launch pass.

## 7. Genuine pilot, economics and evidence format

Select a small real inventory with an owner mandate, named operator, independent assessor and an authentic guest. The first proof may use one home. Retained workflows that are not naturally triggered by that stay still need safe, separately labelled tests: rejection, expiry, suspension, failed payment, refund policy, incident escalation, procurement defect, provider retry, revoked access and rollback. Do not create a real incident or unnecessary charge just to fill a checklist.

Track one canonical `propertyId` and `stayId` throughout. Every handoff records the responsible active actor, receiving actor, acknowledged task, deadline, required evidence, current status and recovery/escalation path. A delegated operating team may recover failures within approved authority. Founder intervention needed to discover hidden state, correct data manually or rescue the stay fails the acceptance outcome.

Economics must show both owner net and LHL contribution. For LHL: earned stay receipts net of refunds and pass-through taxes, less owner entitlement, channel/payment fees, LHL-borne housekeeping/linen/supplies/utilities, maintenance allocation, support and preparation labour at an approved hourly cost, credits, and attributable provider/automation cost. Count owner entitlement once, whether already paid or still payable; do not subtract both payable and payout. Separate refundable deposits, capital upgrades and working-capital timing. Record actual operator minutes and manual touches, failed/repeated work and recovery cost. Require positive contribution on the approved operating assumptions, an approved minimum margin and funded recovery/refund exposure. No numeric rate/margin/reserve is invented here; D07 remains open until these policies are approved.

Every evidence record must contain: capability/test ID; environment and URL; exact source/build/data versions; property/stay/application IDs where applicable; actor and permission; timestamp; expected/actual result; provenance (source test, synthetic hosted test, live provider proof or physical observation); private evidence reference; provider receipt/transaction where relevant; verifier; validity/expiry; failure and recovery record; and residual limitation. Store sensitive evidence privately; this contract contains references only. Evidence from one scope or revision does not silently qualify another. Missing, expired or contradictory evidence reopens acceptance.

The mandatory failure suite includes: competing holds; expired hold/quote/certificate/session; stale price/source; duplicate, forged and out-of-order payment events; reversal/refund; community approval rejection; communication timeout/retry; failed upload and cross-device resume; failed readiness; critical safety suspension; incident recurrence; revoked role during write; cross-tenant and media denial; runtime restart; backup restore; hosted rollback and forward recovery. All must leave consistent records and an accountable next action.

## 8. Immediate continuation and concrete access boundary

The next dependency is authorized access to the **existing LHL Firebase/backend environment** so its actual ownership, runtime, routing, permissions and recovery artifacts can be verified. The current browser is signed out. Credentials must be supplied only through the secure sign-in mechanism, never in chat or source. Do not guess the project ID, reuse Property-Card resources, provision replacements, weaken guards or publish the latest frontend to conceal this dependency.

After reconnecting: identify the existing owned project/runtime; compare deployed configuration with current source; establish the real same-origin `/api` route; inspect backup/recovery evidence; produce the specific reversible correction and validate it in the existing authorized test environment. If no suitable owned runtime/ingress exists, return one concrete topology/cost decision for approval. The no-migration/no-spend boundary remains binding.

This document closes the scope-and-acceptance specification, not the platform release. Named operational assignments, assessor standards, provider access, rollback and the genuine paid stay remain evidence requirements.

## Source references

- [Current source baseline](https://github.com/dandlestoregroup-cyber/moment-homes/tree/503cba301bfcbb5d5db386d2e090d359059bcdd2)
- [Main qualification run](https://github.com/dandlestoregroup-cyber/moment-homes/actions/runs/35813441048)
- [Existing draft PR #39](https://github.com/dandlestoregroup-cyber/moment-homes/pull/39) and [its inspected head qualification](https://github.com/dandlestoregroup-cyber/moment-homes/actions/runs/35821552029)
- [Published HTML-declared source commit](https://github.com/dandlestoregroup-cyber/moment-homes/commit/0c98bb51685bfcc48f0d2551b102d9479bacbb5a)
- [Deployment contract](https://github.com/dandlestoregroup-cyber/moment-homes/blob/503cba301bfcbb5d5db386d2e090d359059bcdd2/docs/DEPLOYMENT.md), [existing execution status](https://github.com/dandlestoregroup-cyber/moment-homes/blob/503cba301bfcbb5d5db386d2e090d359059bcdd2/docs/SHOULD_BE_EXECUTION_STATUS.md), [recovery boundaries](https://github.com/dandlestoregroup-cyber/moment-homes/blob/503cba301bfcbb5d5db386d2e090d359059bcdd2/docs/CLOSED_LOOP_V2_SAFE_RELEASE.md)
- Read source documents: `Home_Moments_As_Is_Blueprint.pdf`; `Home_Moments_AS_IS_Current_Platform_2026-09-19.md`; `Home_Moments_FAB_Master_Prompt_2026-09-19.md`. Their historical observations are not relabelled as current production proof.
- Current Lovable project details and knowledge, published browser observations, connected resource inventory, and the owner's 23 September direction.
