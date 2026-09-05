# LHL production deployment

Status: repository-ready; production is not qualified until this file's runtime gates pass against the current `dandlestoregroup-cyber/LHL` repository.

## Target

Vercel currently supports Express and Node HTTP servers that listen on `process.env.PORT`. LHL already follows that server shape and its production build creates the Vite `dist/` frontend plus the Node server bundle. `package.json` pins Node `24.x` for the deployment runtime.

Do **not** point production at the older `little-hut`, `little-hut-v1`, `little-hut-stayza-live`, or `littlehut-platform` projects. The Git source must be exactly:

`dandlestoregroup-cyber/LHL`

## Vercel project

Create/import one Vercel project from `dandlestoregroup-cyber/LHL`.

- Framework/build detection may remain automatic.
- Build command: `npm run build`.
- Node runtime: `24.x` from `package.json`.
- Do not set `dist` as a static-only output directory; the Express runtime owns `/api/*` and serves the production SPA.
- Production URL must use HTTPS.

## Minimum Live server environment

Configure these as **server-only** Vercel environment variables. Never prefix them with `VITE_` and never commit values to GitHub.

- `APP_URL` — canonical production HTTPS URL.
- `FIREBASE_API_KEY` — Firebase Auth web API key used by the server.
- `FIREBASE_PROJECT_ID` — Firestore project for truth-only Live records.
- `FIREBASE_SERVICE_ACCOUNT_EMAIL` — least-privilege service account used by the server.
- `FIREBASE_PRIVATE_KEY` — matching service-account private key.
- `LHL_SESSION_SECRET` — 32+ random bytes for HttpOnly session HMAC.
- `LHL_BOOTSTRAP_EMAIL` — the one identity permitted to bootstrap the first Live Scout Partner.

The anonymous Live dataset endpoint depends on the Firestore values above. Missing or invalid Firestore configuration must fail the deep runtime smoke rather than produce a false green.

## Live automation environment

Required only when Live Activepieces orchestration is enabled:

- `ACTIVEPIECES_WEBHOOK_URL`
- `ACTIVEPIECES_SHARED_SECRET`
- `LHL_OUTBOX_SECRET`
- optional `AUTOMATION_RATE_LIMIT`

`LHL_OUTBOX_SECRET` protects the internal drain endpoint. `ACTIVEPIECES_SHARED_SECRET` signs outbound events. They must be different secrets.

## GitHub Actions repository secrets

After the production URL exists, configure:

- `LHL_APP_URL` — the same canonical HTTPS production URL used by `APP_URL`.
- `LHL_OUTBOX_SECRET` — same value as the server's `LHL_OUTBOX_SECRET` when Live automation is enabled.

Two workflows then become active:

- `Live runtime smoke` — verifies `/api/auth/me` and the Firestore-backed `/api/live/dataset` every hour.
- `Live outbox drain` — drains committed Live events every five minutes when both its secrets are configured.

Until the relevant secrets exist, both workflows are deliberately inert rather than falsely reporting production health.

## Release gates

Production is qualified only when all are true:

1. `main` repository qualification is green: tests, TypeScript, client build, server build.
2. Vercel project is linked to **`dandlestoregroup-cyber/LHL`** and the latest `main` deployment is READY.
3. `GET /api/auth/me` returns the unauthenticated shell response without a server error.
4. `GET /api/live/dataset` returns `dataset.mode = "live"` from the configured Firestore project.
5. `Live runtime smoke` passes against the production URL.
6. Bootstrap identity can authenticate and create the first Live Scout Partner exactly once.
7. A real role-separated supply journey succeeds: Scout source/consent → independent Assessor → Owner decision → Operator activation → system-issued seal.
8. A real booking journey succeeds through payment evidence / community gate where applicable → confirmation → readiness → pre-stay ProofStay → completion → post-stay ProofStay.
9. If Activepieces is enabled, one committed Live event is delivered once and a retry of the same idempotency key does not duplicate the downstream side effect.

A green GitHub build alone is not a production launch decision.
