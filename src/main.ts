
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

const root = document.querySelector<HTMLElement>("#grid-root");

if (!root) {
  throw new Error("Data grid root element not found");
}

const table = document.createElement("table");
table.className = "data-grid";
table.setAttribute("aria-label", gridConfig.ariaLabel);

const caption = document.createElement("caption");
caption.textContent = "Product Inventory — 10 Products";
table.appendChild(caption);

const thead = document.createElement("thead");
const headerRow = document.createElement("tr");

gridConfig.columns.forEach((column) => {
  const th = document.createElement("th");
  th.scope = "col";
  th.textContent = column.header;
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement("tbody");

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

gridConfig.data.forEach((product) => {
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

table.appendChild(tbody);

const scrollRegion = document.createElement("section");
scrollRegion.className = "table-scroll";
scrollRegion.setAttribute("aria-label", "Scrollable inventory table");
scrollRegion.tabIndex = 0;
scrollRegion.appendChild(table);

root.appendChild(scrollRegion);
