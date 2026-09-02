# Little Hut Light

Little Hut Light is the GitHub-owned operating model for the Little Hut supply and booking business. It contains a mature, explicitly synthetic Demo workspace and a separate truth-only Live workspace.

## Run

```bash
npm install
npm run dev
```

The dev command runs the LHL server and Vite together so `/api/activepieces` remains server-side.

## Verify

```bash
npm test
npm run lint
npm run build
```

The locked business doctrine is in [`docs/operating-doctrine.md`](docs/operating-doctrine.md). Base44 v1 is reference-only and is not called, modified, or required by this repo.

## Activepieces

LHL now has one signed outbound automation gateway. See [`docs/activepieces.md`](docs/activepieces.md).

Activepieces is orchestration only. The current gateway is intentionally Demo-only because the Live workspace is not yet server-persisted/authenticated; Live browser state cannot trigger real external side effects.
