# Little Hut Light

Little Hut Light is the GitHub-owned operating model for the Little Hut supply and booking business. It contains a mature, explicitly synthetic Demo workspace and a separate truth-only Live workspace.

## Run

```bash
npm install
npm run dev
```

The dev command runs the LHL Node server and Vite together. Demo remains browser-local and synthetic. Live records are server-owned and persist in Firestore; the browser has no Live localStorage fallback.

## Verify

```bash
npm test
npm run lint
npm run build
```

The locked business doctrine is in [`docs/operating-doctrine.md`](docs/operating-doctrine.md). Base44 v1 is reference-only and is not called, modified, or required by this repo.

## Live production boundary

Live requires the server-only values documented in [`.env.example`](.env.example): Firebase Auth API key, Firestore project/service-account credentials, an HMAC session secret, bootstrap email, and the automation secrets when Activepieces is enabled.

The first configured identity may create exactly one initial verified Scout Partner record. After that, Partner access is invitation-only. Live supply progresses through Scout sourcing/consent, independent Assessor evidence, reserved Owner decision, and Operator activation; only the server can issue the Live seal after every gate passes. Public Live enquiries and booking transitions are also server-owned.

## Activepieces

See [`docs/activepieces.md`](docs/activepieces.md).

Demo continues through the signed simulation gateway. Live automation now uses a durable Firestore outbox: each trusted Live business write atomically appends a sanitized event, and a secret-guarded scheduler drain signs and forwards pending events after commit. Retries use stable idempotency keys; Activepieces remains orchestration only and cannot create reserved business truth.
