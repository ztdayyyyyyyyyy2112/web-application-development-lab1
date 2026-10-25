# AI Failure Audit — HW3

This document records **three plausible AI-generated implementation failures** reviewed against the HW3 requirements. These are code-review scenarios, not claims that an AI tool actually produced them during this project.

## Failure 1 — Countdown drift from decrementing a counter
- **Faulty pattern:** `remaining -= 1000` in `setInterval(..., 1000)`.
- **Why it fails:** Browser scheduling is delayed by busy main threads and background-tab throttling. Errors accumulate.
- **Correction:** Store a fixed wall-clock deadline and recompute `Math.max(0, deadline - Date.now())` on each animation frame.
- **Validation:** Switch tabs for several seconds; remaining time still reflects actual elapsed wall-clock time.

## Failure 2 — Overselling from read-then-write without version check
- **Faulty pattern:** Read stock, `await` a network call, then write `stock - 1` without revalidating.
- **Why it fails:** Concurrent buyers may all observe the same stock and overcommit it.
- **Correction:** Compare `expectedVersion` with the current version, check stock, and synchronously decrement stock and increment version as one operation in this browser simulation. Real multi-user deployment requires a server-side atomic transaction or conditional database update.
- **Validation:** Run 100 simulated requests against limited stock; stock never becomes negative.

## Failure 3 — Expired reservation never releases stock
- **Faulty pattern:** Set `state = 'EXPIRED'` but forget to increment inventory, or release the same reservation twice.
- **Why it fails:** Inventory leaks or becomes inflated after repeated cleanup.
- **Correction:** Only transition from `RESERVED` to `EXPIRED`/`CANCELLED` once, release quantity once, and increment inventory version.
- **Validation:** Reserve, wait 15 seconds, confirm quantity is restored; repeated cleanup does not change stock.

## Scope and limitations
- Browser-only simulation is **not** an actual distributed high-concurrency backend.
- `Date.now()` avoids cumulative timer drift but is affected by system-clock adjustments; server-authoritative time is preferable in production.
- Reservation state and inventory reset on refresh; production requires persistence and backend authority.
