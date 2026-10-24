
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

  const displayedProducts = getSortedProducts();

  if (searchStatus) {
    searchStatus.textContent =
      `${displayedProducts.length} product(s) found.`;
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

  displayedProducts.forEach((product) => {
    const row = document.createElement("tr");

    gridConfig.columns.forEach((column) => {
      const cell = document.createElement("td");
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

function renderGrid(): void {
  renderHeaders();
  renderRows();
}
searchInput?.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderRows();
});
renderGrid();
