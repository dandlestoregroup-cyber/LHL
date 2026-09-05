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

Live requires the server-only values documented in [`.env.example`](.env.example): Firebase Auth API key, Firestore project/service-account credentials, an HMAC session secret, and the one bootstrap email.

The first configured identity may create exactly one initial verified Scout Partner record. After that, Live sourcing is role-backed and server-persisted. Public Live enquiries are written by the server; operator quote, hold, payment evidence, community approval evidence, and confirmation transitions are also server-owned. Platform-admin visibility never grants an Operator or Owner business action.

## Activepieces

LHL has one signed outbound automation gateway. See [`docs/activepieces.md`](docs/activepieces.md).

Activepieces remains orchestration only. Demo events can use the signed gateway. Live automation side effects remain disabled until the new persisted Live events are replay-safe and verified against server state; persistence alone is not treated as permission to trigger external actions.
