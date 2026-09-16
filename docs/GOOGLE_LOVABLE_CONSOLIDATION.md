# Little Hut — Google AI Studio / GitHub / Lovable consolidation

## Decision

Little Hut is one product with one upstream lineage.

1. **Google AI Studio** remains the product and UX origin used by the owner for ongoing Little Hut design and product work.
2. **`dandlestoregroup-cyber/LHL`** is the canonical GitHub upstream for that Google AI Studio lineage and the durable consolidation target.
3. **Lovable project `5b2147ec-2556-4418-b4d0-721b32a73c3d`** is a publication/implementation surface. Its current GitHub mirror, `dandlestoregroup-cyber/moment-homes`, is downstream work to be reconciled into `LHL`; it is not a competing product source.
4. **Vercel is not a product source.** Any stale Vercel Little Hut deployment must not be used to decide current product behavior or replace either Google AI Studio or GitHub truth.

## Non-destructive consolidation rule

`LHL` and `moment-homes` have diverged. Do not overwrite one with the other and do not use an unrelated-history merge as a shortcut.

Consolidation must preserve the strongest proven behavior from both lineages:

- Google AI Studio / `LHL`: owner-directed guest UX, hospitality tone, canonical product intent, and any newer owner edits pushed from AI Studio to GitHub.
- `moment-homes`: accepted newer product decisions, operator-first Live work, stronger production/runtime evidence, role/security invariants, and other qualified increments not yet present upstream.

When implementations differ, preserve production security/data invariants and reconcile the guest-facing experience to the owner's latest product direction.

## Change flow from now on

Owner product work may continue in Google AI Studio exactly as before:

**Google AI Studio → `LHL` GitHub → reconciliation/qualification → Lovable publication**

Lovable-originated changes are allowed only as downstream implementation work. Any accepted Lovable change must be reconciled back into `LHL` before it becomes canonical. A Lovable commit by itself does not supersede `LHL`.

## Release identity

A release may be called consolidated only when:

- the intended Google AI Studio product direction is represented in `LHL`;
- all accepted downstream `moment-homes` deltas have been reconciled without weakening production invariants;
- source qualification passes on the consolidated candidate;
- Lovable publishes that same approved product revision or a traceable downstream build of it;
- frontend and server runtime identity are verified; and
- no stale Vercel build is being used as current LHL evidence.

## Current references

- Google AI Studio app: `d646841f-4ce5-47f1-b146-9cf5414eb8cd`
- Canonical upstream repository: `dandlestoregroup-cyber/LHL`
- Lovable downstream repository: `dandlestoregroup-cyber/moment-homes`
- Lovable project: `5b2147ec-2556-4418-b4d0-721b32a73c3d`

This document governs repository/source precedence until consolidation is complete and the downstream mirror is retired or explicitly redefined.