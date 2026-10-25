
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
### M2B - Product Filtering

Objective:
Implement client-side text filtering for product inventory.

Contract:
- Search products by ID, name, and category.
- Search must be case-insensitive.
- Filtering must preserve the current sorting state.
- Do not mutate original data.
- Display an empty message when no products match.
- Search input must have an accessible label.

Verification:
- Search "iphone" and verify the matching product.
- Search "electronics" and verify multiple results.
- Search an invalid keyword and verify empty state.
- Verify sorting still works after filtering.
### M2C - Client-Side Pagination

Objective:
Implement pagination for the product data grid.

Contract:
- Support 5, 10, and 20 rows per page.
- Provide Previous and Next buttons.
- Show current page and total pages.
- Disable unavailable navigation buttons.
- Reset to page 1 when filtering changes.
- Preserve active sorting during pagination.
- Apply data operations in order:
  Filtering -> Sorting -> Pagination.

Verification:
- Verify 5 products per page by default.
- Next and Previous work correctly.
- Changing rows per page updates the grid.
- Filtering resets pagination to page 1.
- Sorting remains active across pages.
- Pagination controls support keyboard navigation.

## M3 - Keyboard Navigation
- Arrow keys navigate cells.
- Enter selects a row.
- Space toggles row selection.
- Maintain visible keyboard focus.

### M3A - Keyboard Navigation

Objective:
Implement keyboard navigation using roving tabindex.

Contract:
- ArrowUp moves focus to the previous row.
- ArrowDown moves focus to the next row.
- ArrowLeft moves focus to the previous column.
- ArrowRight moves focus to the next column.
- Tab enters the grid at one active cell.
- Only one grid cell has tabindex="0".
- Other cells have tabindex="-1".
- Focus must remain within valid grid boundaries.
- Sorting, filtering and pagination must continue working.

Verification:
- Tab into the grid.
- Test all four arrow keys.
- Verify focus moves between cells.
- Verify only one cell has tabindex="0".

### M3B - Accessible Row Selection

Objective:
Implement accessible row selection with mouse and keyboard.

Contract:
- Enter selects the focused row exclusively.
- Space toggles the focused row selection.
- Mouse click selects a row.
- Maintain selection by product ID.
- Preserve selection after sorting, filtering and pagination.
- Update aria-selected on grid rows.
- Announce selection changes to screen readers.
- Do not interfere with arrow-key navigation.

Verification:
- Enter selects one row.
- Space toggles the current row.
- Click selects a product.
- Selection persists across sorting and pagination.
- Focus remains usable after selecting a row.
### M3C - ARIA Grid Semantics & Focus Management

Objective:
Implement complete accessible grid semantics.

Contract:
- Use role="grid" on the table.
- Use role="row" on header and data rows.
- Use role="columnheader" on column headers.
- Use role="gridcell" on data cells.
- Maintain valid roving tabindex.
- Support keyboard navigation without focus loss.
- Preserve row selection by product ID.
- Provide accessible sorting announcements.
- Handle filtering, sorting and pagination safely.

Verification:
- Verify ARIA roles in Chrome DevTools.
- Ensure only one data cell has tabindex="0".
- Test Arrow Keys, Enter and Space.
- Test focus after sorting and pagination.
- Verify screen reader announcements.

## M4 - Accessibility
- Follow WCAG 2.2 AA.
- Minimum text contrast ratio 4.5:1.
- Support screen readers.
- Use correct ARIA grid semantics.
## M4 - WCAG 2.2 AA Accessibility Audit

### M4A - Contrast & Visual Accessibility

Objective:
Improve text contrast, focus visibility and visual accessibility.

Contract:
- Normal text contrast >= 4.5:1.
- Large text contrast >= 3:1.
- UI component boundaries >= 3:1 where required.
- Do not use color as the only status indicator.
- Focus indicators must be clearly visible.
- Support reduced-motion preferences.

Verification:
- Inspect text and background contrast in Chrome DevTools.
- Verify Active, Low Stock and Out of Stock badges.
- Test keyboard focus visibility.
- Verify selected rows are distinguishable.
- Check layout at 375px.

### M4B - Keyboard & Focus Audit
- Verify Tab and Shift+Tab navigation.
- Verify no keyboard traps.
- Test focus after filtering and pagination.
- Test Enter and Space selection.

### M4C - Screen Reader & Lighthouse
- Verify accessible names and roles.
- Verify grid selection announcements.
- Test with NVDA.
- Run Lighthouse Accessibility audit.
- Document and correct findings.

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
