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

# HW1: Production Portfolio

## Objective

Upgrade the existing developer portfolio into a production-ready
portfolio with verified accessibility, keyboard navigation,
security, and performance.

---

## M1: WCAG 2.2 AA Audit

### Objective

Audit and improve the portfolio according to WCAG 2.2 AA
accessibility requirements.

### Contract

- Preserve semantic HTML landmarks.
- Maintain exactly one primary `<h1>`.
- Preserve the accessible skip link.
- Navigation must have an accessible label.
- Normal text contrast ratio must be at least 4.5:1.
- All interactive controls must have visible keyboard focus.
- Light and dark themes must remain accessible.
- Page content must remain usable without a mouse.

### Verification

- Inspect semantic landmarks with Chrome DevTools.
- Verify heading hierarchy.
- Verify skip-link behavior.
- Test keyboard focus.
- Verify light-theme contrast.
- Verify dark-theme contrast.

---

## M2: Focus Trap Audit

### Objective

Ensure that keyboard users can navigate through the complete
application without becoming trapped.

### Contract

- Every interactive element must be reachable using Tab.
- Shift+Tab must navigate backward.
- No positive `tabindex` values.
- No component may permanently capture focus.
- Navigation links must activate using Enter.
- Buttons must activate using keyboard input.

### Verification

- Navigate the complete page using Tab.
- Navigate backward using Shift+Tab.
- Test the theme button.
- Test project links.
- Test the Retry button.

---

## M3: Strict Content Security Policy

### Objective

Apply a strict Content Security Policy and eliminate unsafe
inline JavaScript patterns.

### Contract

- No inline event handlers.
- `onclick`, `onkeydown`, `onload`, and similar handlers are prohibited.
- Events must use `addEventListener`.
- JavaScript must use external local files.
- User-controlled content must never be rendered using unsafe `innerHTML`.
- Define a Content Security Policy.

### Verification

- Search HTML for inline handlers.
- Inspect DevTools Console for CSP violations.
- Verify theme functionality.
- Verify Recent Activity functionality.

---

## M4: Lighthouse 100 Audit

### Objective

Optimize the portfolio to satisfy the required Lighthouse audit.

### Contract

- Optimize assets and resource loading.
- Prevent unexpected layout shifts.
- Remove dead code.
- Remove unnecessary resources.
- Maintain responsive behavior at 375px.
- Maintain accessibility after optimization.
- Target Lighthouse audit score: 100.

### Verification

- Run Lighthouse.
- Check Performance.
- Check Accessibility.
- Check Best Practices.
- Check SEO.
- Verify zero console errors.