# Lab 3 — React 19: Semantic, Derived State & PUBG Telemetry

This project implements all **three exercises** described in the supplied Lab 3 slides. It builds on Lab 2's concepts of semantic HTML, global state/store and event delegation, replacing a single global hook cursor with React 19's component-local hooks.

## Run

```powershell
npm install
npm run dev
npm run build
```

Open the localhost address shown by Vite. Use the three navigation buttons to visit each exercise.

## Exercise 1 — Semantic Developer Card

- `src/components/DeveloperCard.jsx` and `SkillBadge.jsx`.
- No `<div>` inside `DeveloperCard.jsx`; uses `article`, `header`, `hgroup`, `dl`, `dt`, `dd`, `ul`, `li`, and keyed `Fragment`.
- CSS Modules and 375px responsive layout in `DeveloperCard.module.css`.
- Remote HTTPS image with explicit `width`, `height`, and initials fallback.
- Automated source audit: `bash scripts/ex1-verification-audit.sh` (Git Bash on Windows).

## Exercise 2 — Scientist & Pioneer Directory

- `SMART_PEOPLE` in `src/data/smartPeople.js` has stable IDs.
- Case-insensitive search; numeric IQ threshold using `valueAsNumber`; immutable ES2023 `toSorted` sorting by IQ/age.
- `visiblePeople` is derived directly in render; **no `useEffect` for filtering**.
- Delete and Reset buttons, and `output role="status" aria-live="polite"` for screen readers.
- `useId` connects every label to its input.

## Exercise 3 — PUBG Vietnam Series Telemetry

- Teams: Cerberus Esports, The Expendables, Genius Esports.
- Four-state FSM: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`.
- `fetchMatchTelemetry` is a **local simulation** of unreliable satellite telemetry, with a 35% failure probability (not a real PUBG API).
- Effect cleanup aborts stale requests on squad switch or unmount.
- 220px skeleton with pulse; `role="alert"` error section and retry action, **no `window.alert()`**.

## Git checkpoints

The exercise slides require **2 atomic commits for Exercise 1**, **3 for Exercise 2**, and **2 for Exercise 3**. A separate initial project setup commit makes **8 commits total**. See `COMMIT_GUIDE.md` in the stepwise practice ZIP. A finished source tree alone cannot honestly represent 8 chronological commits; use the stepwise ZIP to record them while building.

## Screenshots recommended for submission

1. Exercise 1 semantic card at desktop and 375px; DevTools accessibility tree; verification audit output.
2. Exercise 2 search, IQ filter and sorting; delete and reset; live result count.
3. Exercise 3 success/skeleton/error-retry; rapid squad switching with previous calls cancelled; terminal `git log --oneline -8`.

## Limits

- No backend; the telemetry is a simulated asynchronous API and data is in-memory.
- Network avatars may fail in offline mode; initials fallback is provided.
- React state is deliberately held in local component hooks; navigating away unmounts the component, resetting its in-memory state.
