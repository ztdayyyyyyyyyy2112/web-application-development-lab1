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