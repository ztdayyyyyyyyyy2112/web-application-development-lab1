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