
import "./style.css";
import { products, type Product } from "./data/products";
import type { ColumnDef, DataGridProps } from "./data-grid-contract";

const columns: ColumnDef<Product>[] = [
  { header: "Product ID", accessorKey: "id", sortable: true },
  { header: "Product Name", accessorKey: "name", sortable: true },
  { header: "Category", accessorKey: "category", sortable: true },
  { header: "Price", accessorKey: "price", sortable: true },
  { header: "Stock", accessorKey: "stock", sortable: true },
  { header: "Status", accessorKey: "status", sortable: true }
];

const gridConfig: DataGridProps<Product> = {
  data: products,
  columns,
  ariaLabel: "Product inventory data grid"
};

type SortDirection = "ascending" | "descending";

let sortKey: keyof Product | null = null;
let sortDirection: SortDirection = "ascending";
let searchQuery = "";

let currentPage = 1;
let pageSize = 5;
// M3A - Roving tabindex state
let activeRowIndex = 0;
let activeColumnIndex = 0;
// M3B - Row Selection State
const selectedProductIds = new Set<string>();

const pageSizeSelect =
  document.querySelector<HTMLSelectElement>("#page-size");

const prevButton =
  document.querySelector<HTMLButtonElement>("#prev-page");

const nextButton =
  document.querySelector<HTMLButtonElement>("#next-page");

const pageInfo =
  document.querySelector<HTMLElement>("#page-info");

const searchInput =
  document.querySelector<HTMLInputElement>("#product-search");

const searchStatus =
  document.querySelector<HTMLElement>("#search-status");
const root = document.querySelector<HTMLElement>("#grid-root");

if (!root) {
  throw new Error("Data grid root element not found");
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

const table = document.createElement("table");
table.className = "data-grid";
table.setAttribute("aria-label", gridConfig.ariaLabel);

const caption = document.createElement("caption");
caption.textContent = "Product Inventory — 10 Products";
table.appendChild(caption);

const thead = document.createElement("thead");
const headerRow = document.createElement("tr");
thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement("tbody");
table.appendChild(tbody);

const scrollRegion = document.createElement("section");
scrollRegion.className = "table-scroll";
scrollRegion.setAttribute("aria-label", "Scrollable inventory table");
scrollRegion.tabIndex = 0;
scrollRegion.appendChild(table);
root.appendChild(scrollRegion);

function getFilteredProducts(): Product[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery === "") {
    return [...gridConfig.data];
  }

  return gridConfig.data.filter((product) => {
    const searchableValues = [
      product.id,
      product.name,
      product.category
    ];

    return searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedQuery)
    );
  });
}

function getSortedProducts(): Product[] {
 const sorted = getFilteredProducts();

  if (sortKey === null) {
    return sorted;
  }

  const key = sortKey;
  const direction = sortDirection === "ascending" ? 1 : -1;

  sorted.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * direction;
    }

    return String(valueA).localeCompare(String(valueB), "en", {
      numeric: true,
      sensitivity: "base"
    }) * direction;
  });

  return sorted;
}

function getPaginatedProducts(data: Product[]): Product[] {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return data.slice(startIndex, endIndex);
}

function updatePagination(totalItems: number): void {
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  currentPage = Math.min(currentPage, totalPages);

  if (pageInfo) {
    pageInfo.textContent =
      `Page ${currentPage} of ${totalPages}`;
  }

  if (prevButton) {
    prevButton.disabled = currentPage === 1;
  }

  if (nextButton) {
    nextButton.disabled = currentPage === totalPages;
  }
}

function handleSort(key: keyof Product): void {
  if (sortKey === key) {
    sortDirection =
      sortDirection === "ascending" ? "descending" : "ascending";
  } else {
    sortKey = key;
    sortDirection = "ascending";
  }

  renderGrid();

  const activeButton = headerRow.querySelector<HTMLButtonElement>(
    `button[data-sort-key="${key}"]`
  );
  activeButton?.focus();
}

function renderHeaders(): void {
  headerRow.replaceChildren();

  gridConfig.columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";

    if (column.sortable) {
      th.setAttribute(
        "aria-sort",
        sortKey === column.accessorKey ? sortDirection : "none"
      );

      const button = document.createElement("button");
      button.type = "button";
      button.className = "sort-button";
      button.dataset.sortKey = String(column.accessorKey);

      const indicator =
        sortKey === column.accessorKey
          ? sortDirection === "ascending" ? " ▲" : " ▼"
          : "";

      button.textContent = column.header + indicator;
      button.addEventListener("click", () => handleSort(column.accessorKey));

      th.appendChild(button);
    } else {
      th.textContent = column.header;
    }

    headerRow.appendChild(th);
  });
}

function renderRows(): void {
  tbody.replaceChildren();

  const sortedProducts = getSortedProducts();

  updatePagination(sortedProducts.length);

  const displayedProducts = getPaginatedProducts(sortedProducts);
  activeRowIndex = Math.min(
  activeRowIndex,
  Math.max(0, displayedProducts.length - 1)
);
  if (searchStatus) {
  searchStatus.textContent =
    `${sortedProducts.length} product(s) found.`;
}
  if (displayedProducts.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = gridConfig.columns.length;
    cell.className = "empty-message";
    cell.textContent = "No matching products found.";

    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  displayedProducts.forEach((product, rowIndex) => {
    const row = document.createElement("tr");
    // M3A - Identify product rows for keyboard navigation
  row.dataset.productId = product.id;
    const isSelected = selectedProductIds.has(product.id);

  row.setAttribute("aria-selected", String(isSelected));
  row.classList.toggle("row-selected", isSelected);
    gridConfig.columns.forEach((column, columnIndex) => {
      const cell = document.createElement("td");

      // Keyboard navigation metadata
cell.dataset.rowIndex = String(rowIndex);
cell.dataset.columnIndex = String(columnIndex);

cell.tabIndex =
  rowIndex === activeRowIndex &&
  columnIndex === activeColumnIndex
    ? 0
    : -1;
      const value = product[column.accessorKey];

      if (column.accessorKey === "price") {
        cell.textContent = currencyFormatter.format(product.price);
      } else if (column.accessorKey === "status") {
        const badge = document.createElement("span");
        badge.className = "status-badge";

        if (product.status === "Active") {
          badge.classList.add("status-active");
        } else if (product.status === "Low Stock") {
          badge.classList.add("status-low");
        } else {
          badge.classList.add("status-out");
        }

        badge.textContent = product.status;
        cell.appendChild(badge);
      } else {
        cell.textContent = String(value);
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}


function focusGridCell(rowIndex: number, columnIndex: number): void {
  const cells = Array.from(
    tbody.querySelectorAll<HTMLTableCellElement>("td[data-row-index]")
  );

  const rowCount = tbody.querySelectorAll(
    "tr[data-product-id]"
  ).length;

  if (rowCount === 0) return;

  const safeRow = Math.max(0, Math.min(rowIndex, rowCount - 1));

  const safeColumn = Math.max(
    0,
    Math.min(columnIndex, gridConfig.columns.length - 1)
  );

  const target = cells.find(
    (cell) =>
      Number(cell.dataset.rowIndex) === safeRow &&
      Number(cell.dataset.columnIndex) === safeColumn
  );

  if (!target) return;

  const previous = tbody.querySelector<HTMLTableCellElement>(
    'td[tabindex="0"]'
  );

  previous?.setAttribute("tabindex", "-1");

  target.tabIndex = 0;
  activeRowIndex = safeRow;
  activeColumnIndex = safeColumn;

  target.focus();
}

tbody.addEventListener("keydown", (event: KeyboardEvent) => {
  const target = event.target;

  if (!(target instanceof HTMLTableCellElement)) {
    return;
  }

  const row = Number(target.dataset.rowIndex);
  const column = Number(target.dataset.columnIndex);
  const productRow = target.closest<HTMLTableRowElement>(
  "tr[data-product-id]"
);

const productId = productRow?.dataset.productId;

if (productId && event.key === "Enter") {
  event.preventDefault();
  selectSingleRow(productId);
  return;
}

if (productId && (event.key === " " || event.key === "Spacebar")) {
  event.preventDefault();

  if (event.repeat) return;

  toggleRowSelection(productId);
  return;
}

  let nextRow = row;
  let nextColumn = column;

  switch (event.key) {
    case "ArrowUp":
      nextRow--;
      break;

    case "ArrowDown":
      nextRow++;
      break;

    case "ArrowLeft":
      nextColumn--;
      break;

    case "ArrowRight":
      nextColumn++;
      break;

    default:
      return;
  }

  event.preventDefault();
  focusGridCell(nextRow, nextColumn);
});
tbody.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) return;

  const row = target.closest<HTMLTableRowElement>(
    "tr[data-product-id]"
  );

  if (!row) return;

  const productId = row.dataset.productId;

  if (!productId) return;

  selectSingleRow(productId);

  const clickedCell = target.closest<HTMLTableCellElement>(
    "td[data-row-index]"
  );

  if (clickedCell) {
    focusGridCell(
      Number(clickedCell.dataset.rowIndex),
      Number(clickedCell.dataset.columnIndex)
    );
  }
});
// M3B - Selection Controller

const selectionStatus =
  document.querySelector<HTMLElement>("#selection-status");

function updateSelectionUI(): void {
  const rows = tbody.querySelectorAll<HTMLTableRowElement>(
    "tr[data-product-id]"
  );

  rows.forEach((row) => {
    const productId = row.dataset.productId;

    if (!productId) return;

    const isSelected = selectedProductIds.has(productId);

    row.setAttribute("aria-selected", String(isSelected));
    row.classList.toggle("row-selected", isSelected);
  });

  if (selectionStatus) {
    const count = selectedProductIds.size;

    selectionStatus.textContent =
      count === 0
        ? "No products selected."
        : `${count} product(s) selected.`;
  }
}

function selectSingleRow(productId: string): void {
  selectedProductIds.clear();
  selectedProductIds.add(productId);

  updateSelectionUI();

  const product = gridConfig.data.find(
    (item) => item.id === productId
  );

  if (product) {
    gridConfig.onRowSelect?.(product);
  }
}

function toggleRowSelection(productId: string): void {
  if (selectedProductIds.has(productId)) {
    selectedProductIds.delete(productId);
  } else {
    selectedProductIds.add(productId);
  }

  updateSelectionUI();
}
function renderGrid(): void {
  renderHeaders();
  renderRows();
}
searchInput?.addEventListener("input", () => {
  searchQuery = searchInput.value;
  currentPage = 1;
  renderRows();
});

pageSizeSelect?.addEventListener("change", () => {
  pageSize = Number(pageSizeSelect.value);
  currentPage = 1;
  renderRows();
});

prevButton?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderRows();
  }
});

nextButton?.addEventListener("click", () => {
  const totalPages = Math.max(
    1,
    Math.ceil(getSortedProducts().length / pageSize)
  );

  if (currentPage < totalPages) {
    currentPage++;
    renderRows();
  }
});
currentPage = 1;
renderGrid();
