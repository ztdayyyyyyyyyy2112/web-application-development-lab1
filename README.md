# FlashVN — HW3 High-Concurrency Flash-Sale E-Commerce Engine

TypeScript + Vite implementation for Lab 2 / Homework 3.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Features
- Deadline-based countdown using `Date.now()` and `requestAnimationFrame` (no accumulated interval drift).
- Optimistic stock compare-and-swap using a product `version`.
- Reservation finite-state machine: `RESERVED → CHECKED_OUT | EXPIRED | CANCELLED`.
- 15-second reservation TTL and inventory restoration on expiry/cancellation.
- Simulated 10/50/100 competing purchase attempts and event log.
- `AI_FAILURE_AUDIT.md` documents three reviewed failure scenarios.

## Concurrency scope
All inventory changes are atomic only within one JavaScript event loop. This is an educational **single-browser simulation**, not a real multi-user transaction service. Production requires server-side locking/conditional updates, authentication, durable storage, and server-authoritative time.

## Suggested atomic commit plan (at least 8 commits)
1. `chore(hw3): initialize vite typescript project`
2. `feat(timer): implement anti-drift countdown`
3. `feat(inventory): define inventory and reservation states`
4. `feat(inventory): add optimistic version checks`
5. `feat(reservation): implement checkout and expiration`
6. `feat(simulation): add concurrent buyer simulator`
7. `feat(ui): build flash-sale storefront`
8. `docs(audit): document three AI failure scenarios`

**Do not fabricate commits:** If using this completed starter, make eight genuine incremental changes and commit each separately (e.g. feature improvements, validation, UI, documentation), rather than rewriting history or claiming the files were committed incrementally.
