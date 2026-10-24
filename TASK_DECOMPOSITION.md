
# LAB 2 - HW1: Production Enterprise Data-Grid

## Project Objective
Build an accessible enterprise data-grid with TypeScript, sorting, filtering, pagination, and keyboard navigation.

## M0 - Architecture & Contracts
- Define TypeScript component interfaces.
- Define data structures and interaction contracts.
- Establish accessibility and performance requirements.

## M1 - Semantic Table
- Use table, caption, thead, tbody, tr, th, td.
- Use scope="col" for headers.
- Prepare sample product data.
- Avoid unnecessary div elements.

## M2 - Data Operations
- Implement ascending/descending sorting.
- Implement text filtering.
- Implement client-side pagination.
### M2A - Column Sorting

Objective:
Implement ascending and descending sorting.

Contract:
- Clicking a sortable column header changes sort direction.
- Sorting must work for strings and numbers.
- Original product data must not be mutated.
- Use aria-sort to communicate sorting state.
- Sorting must be keyboard accessible.

Verification:
- Click Product Name to sort A-Z and Z-A.
- Click Price to sort lowest-highest and highest-lowest.
- Verify screen reader sorting semantics.

## M3 - Keyboard Navigation
- Arrow keys navigate cells.
- Enter selects a row.
- Space toggles row selection.
- Maintain visible keyboard focus.

## M4 - Accessibility
- Follow WCAG 2.2 AA.
- Minimum text contrast ratio 4.5:1.
- Support screen readers.
- Use correct ARIA grid semantics.

## M5 - Performance & Quality
- Target Lighthouse Accessibility = 100.
- Target Lighthouse Best Practices = 100.
- Test at 375px mobile viewport.
- Check console errors and memory cleanup.

## Git Commit Strategy
- docs(spec): define data grid contracts
- feat(grid): semantic table structure
- feat(grid): sorting filtering pagination
- feat(a11y): grid keyboard navigation
- fix(a11y): grid accessibility audit
- perf: optimize data grid
