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

# HW2: Drum Kit Engine

## Objective

Build a contract-first, architecturally decoupled drum kit using
semantic HTML, local audio assets, and Vanilla JavaScript ES6+.

---

## HW2-S1: HTML Audio Contract

### Objective

Define the drum pad interface and audio mapping in HTML before
implementing JavaScript behavior.

### Contract

- Every drum pad uses a `data-key` attribute.
- Every drum pad uses a `data-sound` attribute.
- Sound file paths are stored in HTML, not JavaScript.
- Drum pads use accessible `<button>` elements.
- Every pad has a visible label.
- JavaScript must not contain hardcoded sound-path mappings.

### Example Contract

`data-key="a"`
`data-sound="assets/sounds/kick.wav"`

### Verification

- Inspect every drum pad in DevTools.
- Verify every pad contains `data-key`.
- Verify every pad contains `data-sound`.
- Verify no JavaScript implementation exists before this milestone
  is committed.

---

## HW2-S2: Polyphonic Audio Playback Engine

### Objective

Implement an audio playback engine independently from keyboard input.

### Contract

- Read sound paths from the HTML `data-sound` contract.
- Do not use a large switch-case statement.
- Multiple sounds must be able to overlap.
- Audio engine must not depend on keyboard event handling.

### Verification

- Trigger individual pads independently.
- Trigger multiple sounds rapidly.
- Verify sounds may overlap.

---

## HW2-S3: Keyboard Controller

### Objective

Connect keyboard input to the existing audio engine.

### Contract

- Listen using the W3C `keydown` event.
- Inspect `event.key`.
- Do not use `keypress`.
- Do not use `keyCode`.
- Ignore repeated keydown events using `event.repeat`.
- Key bindings must remain defined by HTML contracts.

### Verification

- Press each configured keyboard key.
- Hold a key and confirm audio is not flooded.
- Change one `data-key` value and verify minimal refactoring.

---

## HW2-S4: FIFO Beat Recorder

### Objective

Record played drum events as a timestamped FIFO queue.

### Contract

- Preserve chronological event order.
- Record timestamps relative to recording start.
- Each event stores the triggered pad/key.
- Recording logic must remain separate from the audio engine.
- Recorded events must be replayable in the original order.

### Verification

- Start recording.
- Trigger several drum pads.
- Stop recording.
- Inspect the event queue.
- Verify timestamps increase monotonically.
- Replay the sequence and confirm FIFO order.