# Little Hut canonical product source

## Canonical product reference

Google AI Studio is the canonical product/UX reference for Little Hut Vacations:

https://ai.studio/apps/d646841f-4ce5-47f1-b146-9cf5414eb8cd?fullscreenApplet=true

## Precedence

1. AI Studio owns guest-facing product direction, brand language, interaction model, visual hierarchy, Moments experience, and hospitality tone.
2. GitHub owns durable production truth: authenticated Live access, Firestore-backed state, role authority, booking/supply gates, automation outbox, Stay Assurance, ProofStay, tests, and deployment qualification.
3. Never replace server-owned Live truth with browser/localStorage persistence to match the prototype.
4. When the two implementations differ, preserve the stronger production invariant and adapt the canonical UI around it.
5. Demo and Live must remain visibly and technically separate.

## Product completion target

The full version combines the AI Studio guest experience with the GitHub operating system across:

- public discovery and six canonical Moments
- property detail and request-to-stay journey
- owner onboarding and decisions
- Scout sourcing and consent evidence
- independent assessment/BPS assurance
- Operator activation and booking execution
- Live Partner access and role gates
- Stay Assurance and ProofStay
- durable automation/outbox delivery
- bilingual English/Arabic product surfaces
- privacy-safe evidence and auditability

Base44 is not a source of truth for this product.
