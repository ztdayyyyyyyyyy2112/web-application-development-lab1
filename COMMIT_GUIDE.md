# LAB 3 — 3 exercises, 8 real commits

These commands are for **PowerShell in VS Code**, in the extracted project folder. Execute each line separately and wait for the prompt. `_stages` is excluded from Git by `.gitignore`.

## Preparation

```powershell
cd D:\Study\PhatTrienWeb\lab3\lab3-react-exercises
npm install
git init
git switch -c lab3-react-exercises
```

If your machine already has Git in the folder, **do not reinitialize**; use the existing Git root. The folder name is your choice.

## Commit 1 / 8 — Vite + React 19 scaffold

```powershell
git add .gitignore index.html package.json package-lock.json vite.config.js src/main.jsx src/App.jsx src/styles.css README.md COMMIT_GUIDE.md scripts/apply-step.ps1
git commit -m "chore(lab3): scaffold react 19 vite project"
```

## Exercise 1 · Commit 2 / 8 — Semantic component

```powershell
.\scripts\apply-step.ps1 1
git add src/App.jsx src/components/DeveloperCard.jsx src/components/SkillBadge.jsx src/components/DeveloperCard.module.css
git commit -m "feat(ex1): implement semantic DeveloperCard and SkillBadge"
```

Verify `DeveloperCard.jsx` uses article/header/hgroup/dl/dt/dd/ul/li/Fragment with stable keys and has NO `<div>`.

## Exercise 1 · Commit 3 / 8 — Responsive scoped CSS

```powershell
.\scripts\apply-step.ps1 2
git add src/components/DeveloperCard.module.css scripts/ex1-verification-audit.sh
git commit -m "style(ex1): add responsive 375px css module"
```

Check Chrome Device Toolbar at **375px**. In Git Bash, optionally run `bash scripts/ex1-verification-audit.sh`.

## Exercise 2 · Commit 4 / 8 — Stable schema

```powershell
.\scripts\apply-step.ps1 3
git add src/data/smartPeople.js src/components/ScientistDirectory.jsx src/components/ScientistDirectory.module.css src/App.jsx
git commit -m "feat(ex2): normalize smartPeople schema with stable IDs"
```

## Exercise 2 · Commit 5 / 8 — Search, IQ, sorting

```powershell
.\scripts\apply-step.ps1 4
git add src/components/ScientistDirectory.jsx src/components/ScientistDirectory.module.css
git commit -m "feat(ex2): add search IQ filter and immutable toSorted"
```

Check name case insensitive; `valueAsNumber`, `useId`, no `useEffect` for derived results.

## Exercise 2 · Commit 6 / 8 — Delete/reset and live status

```powershell
.\scripts\apply-step.ps1 5
git add src/components/ScientistDirectory.jsx
git commit -m "feat(ex2): add delete reset and live result status"
```

Check deletion doesn't mutate `SMART_PEOPLE`; Reset restores all six entries; `output role="status" aria-live="polite"`.

## Exercise 3 · Commit 7 / 8 — FSM + AbortController

```powershell
.\scripts\apply-step.ps1 6
git add src/data/pubgSquads.js src/api/fetchMatchTelemetry.js src/components/PubgMatchTelemetry.jsx src/components/PubgMatchTelemetry.module.css src/App.jsx
git commit -m "feat(ex3): implement four state PUBG telemetry with abort cleanup"
```

Check fast switching CES → TE → GE; previous request must be aborted and not update UI.

## Exercise 3 · Commit 8 / 8 — Skeleton, inline error, retry

```powershell
.\scripts\apply-step.ps1 7
git add src/components/PubgMatchTelemetry.jsx src/components/PubgMatchTelemetry.module.css README.md TASK_DECOMPOSITION.md scripts/ex2-checkpoints.md scripts/ex3-checkpoints.md
git commit -m "feat(ex3): add 220px skeleton and accessible retry alert"
```

The simulation has 35% random failures. Wait for a failure and click **Reconnect Satellite (Retry)**. No window.alert.

## Run and verify

```powershell
npm run dev
npm run build
git log --oneline -8
git status
```

Recommended captures: Ex1 375px + Accessibility Tree; Ex2 search/sort/delete/reset; Ex3 skeleton/error/retry and rapid squad switching; Git 8 commits.

## Push to your repository

To create a standalone branch on the GitHub repository from prior labs:

```powershell
git remote add origin https://github.com/ztdayyyyyyyyyy2112/web-application-development-lab1.git
git push -u origin lab3-react-exercises
```

If `origin` already exists, skip `git remote add origin`. This creates an independently rooted branch; it does not alter GitHub `main`, HW2 or HW3. Do **not** use `--force`.
