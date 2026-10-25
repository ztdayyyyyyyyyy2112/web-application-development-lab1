# Lab 3 — Task Decomposition & Atomic Commit Plan

| Commit | Scope | Functional change | Verification |
| --- | --- | --- | --- |
| 1 | Setup | Vite + React 19 scaffold and navigation shell | Dev server starts |
| 2 | Ex1 | Semantic `DeveloperCard` / `SkillBadge` with default props and HTTPS avatar fallback | Semantic markup; no div in component |
| 3 | Ex1 | CSS Modules and responsive 375px styling | 375px device toolbar; zero horizontal overflow |
| 4 | Ex2 | Stable-ID `SMART_PEOPLE` schema, render list | Dataset contains six people |
| 5 | Ex2 | Case-insensitive search, numeric IQ and immutable sorting | Search/min-IQ/sort all work |
| 6 | Ex2 | Delete/reset + live results status | Delete and reset, role=status |
| 7 | Ex3 | Local API, FSM and AbortController cleanup | Rapid squad changes discard stale response |
| 8 | Ex3 | Skeleton, retry alert and UI polish | 35% error recovery; 220px skeleton |

Git commit messages are in `COMMIT_GUIDE.md` of the step-by-step ZIP.
