# TASK DECOMPOSITION

## T-01: Semantic DOM Architecture & A11y Contract

### Objective
Create the semantic HTML structure for the web page using HTML5 landmark elements.

### Requirements
- Use zero `<div>` elements.
- Use exactly one `<h1>` element.
- Add an accessible skip link.
- Use semantic landmark elements:
  - `<header>`
  - `<nav>`
  - `<main>`
  - `<section>`
  - `<footer>`
- Navigation must have an accessible label.
- The skip link must navigate directly to the main content.

### Landmark Hierarchy

body
├── a.skip-link
├── header
│   └── h1
├── nav
│   └── ul
│       └── li
├── main
│   ├── section#about
│   └── section#projects
└── footer

### Accessibility Contract
1. Exactly one `<h1>` exists.
2. No `<div>` elements are allowed.
3. The skip link points to `#main-content`.
4. Main navigation uses `aria-label="Primary"`.
5. Main content is represented by `<main>`.
6. Heading levels are sequential.

---

## T-02: Enterprise Developer Portfolio

### T-02A: Design Tokens & CSS Reset

#### Objective
Create reusable design tokens and a modern CSS reset.

#### Contract
- Define colors using CSS custom properties in `:root`.
- Do not hardcode colors inside component rules.
- Apply `box-sizing: border-box`.
- Remove default margin and padding.
- Use a mobile-first approach.

### T-02B: Responsive Grid Layout

#### Objective
Create a responsive project card layout using CSS Grid.

#### Contract
- Use CSS Grid for the project list.
- Use `repeat(auto-fit, minmax(...))`.
- No horizontal scrolling at 375px.
- Project cards must use semantic `<article>` elements.

### T-02C: Theme Engine

#### Objective
Implement an accessible light/dark theme switcher.

#### Contract
- Use a button for the theme switcher.
- Use `aria-pressed` to expose the current state.
- Store the selected theme in `localStorage`.
- The localStorage key must be `theme`.
- Use Vanilla JavaScript ES6+ only.
- No inline JavaScript event handlers.

---

## T-03: Resilient Component Architecture

### Objective
Build a resilient data component that can represent multiple UI states.

### State Machine

Loading -> Live Data
Loading -> Empty
Loading -> Error
Error -> Loading (Retry)

### T-03A: Loading State

#### Objective
Create a loading skeleton while data is being fetched.

#### Contract
- Use pure CSS for the loading skeleton.
- Use a shimmer animation.
- Do not use JavaScript for the visual animation.

### T-03B: Live Data State

#### Objective
Display successfully loaded data.

#### Contract
- Use semantic HTML elements.
- Use CSS Grid for the item list.
- Use Flexbox for metadata badges.
- The component must remain responsive.

### T-03C: Empty & Error States

#### Objective
Handle cases where data is unavailable.

#### Contract
- Display an accessible empty state.
- Display an accessible error message.
- Provide a Retry button for the error state.
- Retry must be keyboard accessible.

---

# HW3: Resilient Landing Page

## Objective

Build a resilient landing page using a drift-free countdown engine,
a state-machine form, and secure form submission practices.

---

## HW3-S1: Drift-Free Countdown Engine

### Objective

Implement a countdown timer based on an absolute UTC ISO 8601 timestamp.

### Contract

- Deadline must use UTC ISO 8601 format.
- Countdown must calculate remaining time from the absolute deadline.
- Do not decrement a local counter every second.
- Timer must tolerate scheduling delays without accumulating drift.
- Expired countdown must stop cleanly.
- DOM updates must use safe text APIs.

### Verification

- Verify countdown displays days, hours, minutes, and seconds.
- Delay browser execution and confirm timer corrects itself.
- Reload the page and confirm countdown remains accurate.
- Verify expired deadline displays zero values.

---

## HW3-S2: State-Machine Form

### Objective

Implement the form using explicit UI states.

### States

Idle
    ↓
Submitting
    ├── Success
    └── Error

### Contract

- Initial state is Idle.
- Submission enters Submitting.
- Success and Error must be explicit states.
- UI must reflect the current state.
- Form logic must not depend on multiple unrelated boolean flags.

### Verification

- Test Idle -> Submitting.
- Test Submitting -> Success.
- Test Submitting -> Error.

---

## HW3-S3: Secure Submission

### Objective

Prevent duplicate submissions and safely process user input.

### Contract

- Prevent double submission.
- Disable submit controls while submitting.
- Do not render user input with unsafe innerHTML.
- Use textContent for user-controlled output.
- Sanitize/normalize input before processing.
- Zero XSS vulnerabilities.

### Verification

- Double-click Submit and confirm only one submission occurs.
- Test HTML/script-like user input.
- Confirm content is displayed as text, never executed.

---

## AI Failure Audit

### Required File

`AI_FAILURE_AUDIT.md`

### Required Defects

Document three AI-induced defects including:

1. Defect description.
2. Diagnostic method.
3. Refactored and verified solution.