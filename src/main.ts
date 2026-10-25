import './style.css';
import { createAntiDriftTimer, formatRemaining } from './anti-drift-timer';
import { InventoryEngine } from './inventory-engine';

const engine = new InventoryEngine();
const app = document.querySelector<HTMLDivElement>('#app')!;
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const saleEnd = Date.now() + 60 * 60 * 1000;
let lastSimulation = 'Chưa chạy mô phỏng';
let isSimulating = false;

app.innerHTML = `
  <div class="topbar"><div class="shell topbar-inner"><span>⚡ FLASH<span class="brand-accent">VN</span></span><span class="top-note">11.11 MEGA SALE • DEMO ENGINE</span><span class="badge">LIVE SIMULATION</span></div></div>
  <main class="shell">
    <section class="hero"><div><div class="eyebrow">⚡ DEAL GIỚI HẠN • SĂN NGAY KẺO LỠ</div><h1>Flash Sale <span>11.11</span></h1><p>Zero-drift countdown • Optimistic inventory lock • Finite-state checkout</p></div><div class="timer-panel"><small>KẾT THÚC SAU</small><div id="countdown">01:00:00</div><div class="timer-label">GIỜ &nbsp;&nbsp;&nbsp;&nbsp; PHÚT &nbsp;&nbsp;&nbsp;&nbsp; GIÂY</div></div></section>
    <div class="section-title"><h2>🔥 Sản phẩm giá sốc</h2><span>Giữ hàng 15 giây • Thanh toán trước khi hết hạn</span></div>
    <section id="products" class="products"></section>
    <section class="bottom-grid"><div class="panel"><div class="panel-head"><h2>🛒 Đơn đang giữ & giao dịch</h2><span class="hint">FSM: RESERVED → CHECKED_OUT / EXPIRED / CANCELLED</span></div><div id="reservations" class="reservations"></div></div>
    <div class="panel"><div class="panel-head"><h2>🚀 Stress Test</h2><span class="hint">Mô phỏng tranh chấp tồn kho</span></div><div class="sim-controls"><select id="product-select"></select><select id="count-select"><option value="10">10 khách</option><option value="50">50 khách</option><option value="100" selected>100 khách</option></select><button id="simulate" class="primary">Chạy mô phỏng</button></div><p id="simulation-result" class="result">Chưa chạy mô phỏng</p><div class="legend">Mỗi request thử ghi cùng version; khi xung đột sẽ đọc version mới và thử lại. Chỉ là mô phỏng trong một tab trình duyệt.</div></div></section>
    <section class="panel activity"><div class="panel-head"><h2>📋 Nhật ký sự kiện</h2><span class="hint">Hiển thị 30 sự kiện mới nhất</span></div><div id="events" class="events"></div></section>
    <footer>FlashVN • Web Development Lab 2 / HW3 • Client-side concurrency simulation</footer>
  </main>`;
const $ = (id: string) => document.getElementById(id)!;

function renderProducts() {
  $('products').innerHTML = engine.products.map(p => {
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    return `<article class="product"><div class="product-image"><span>${p.emoji}</span><div class="discount">-${discount}%</div></div><div class="product-body"><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="old-price">${money(p.originalPrice)}</div><div class="stock-line"><span>Còn <strong>${p.stock}</strong> sản phẩm</span><span>Đã bán ${p.sold}</span></div><div class="progress"><div style="width:${Math.min(100, p.sold / (p.stock + p.sold || 1) * 100)}%"></div></div><button class="buy" data-product="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock ? '⚡ Giữ hàng ngay' : 'Hết hàng'}</button><div class="version">Inventory version: ${p.version}</div></div></article>`;
  }).join('');
}
function renderReservations() {
  const active = engine.reservations.filter(r => r.customerId === 'Bạn').slice(0, 8);
  $('reservations').innerHTML = active.length ? active.map(r => {
    const name = engine.products.find(p => p.id === r.productId)?.name ?? r.productId;
    const seconds = Math.max(0, Math.ceil((r.expiresAt - Date.now()) / 1000));
    return `<div class="reservation"><div><strong>${name}</strong><small>${r.id} • <span class="state ${r.state.toLowerCase()}">${r.state}</span>${r.state === 'RESERVED' ? ` • ${seconds}s` : ''}</small></div><div class="reservation-actions">${r.state === 'RESERVED' ? `<button class="checkout" data-checkout="${r.id}">Thanh toán</button><button class="cancel" data-cancel="${r.id}">Hủy</button>` : ''}</div></div>`;
  }).join('') : '<div class="empty">Chưa có đơn giữ hàng. Hãy chọn một sản phẩm phía trên.</div>';
}
function renderEvents() {
  $('events').innerHTML = engine.events.slice(0, 30).map(e => `<div class="event ${e.kind}"><time>${new Date(e.at).toLocaleTimeString('vi-VN')}</time><span>${e.text}</span></div>`).join('') || '<div class="empty">Chưa có sự kiện</div>';
}
function render() { renderProducts(); renderReservations(); renderEvents(); }
engine.subscribe(render);
$('product-select').innerHTML = engine.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
$('simulation-result').textContent = lastSimulation;
app.addEventListener('click', async event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const buy = target.closest<HTMLButtonElement>('[data-product]');
  if (buy) {
    const id = buy.dataset.product!;
    const result = engine.reserveWithRetry(id, 1, 'Bạn');
    if (!result.ok) engine.log(`Giữ hàng thất bại: ${result.reason}`, 'warn');
    return;
  }
  const checkout = target.closest<HTMLButtonElement>('[data-checkout]');
  if (checkout) { engine.checkout(checkout.dataset.checkout!); return; }
  const cancel = target.closest<HTMLButtonElement>('[data-cancel]');
  if (cancel) { engine.cancel(cancel.dataset.cancel!); return; }
  if (target.closest('#simulate')) {
    if (isSimulating) return;
    isSimulating = true;
    const button = $('simulate') as HTMLButtonElement;
    button.disabled = true;
    const id = ($('product-select') as HTMLSelectElement).value;
    const count = Number(($('count-select') as HTMLSelectElement).value);
    try {
      const result = await engine.simulate(id, count);
      lastSimulation = `${result.success}/${count} thành công • ${result.conflicts} xung đột version • ${result.soldOut} hết hàng`;
      $('simulation-result').textContent = lastSimulation;
    } finally { isSimulating = false; button.disabled = false; }
  }
});
const stopTimer = createAntiDriftTimer(saleEnd, remaining => { $('countdown').textContent = formatRemaining(remaining); });
const expiryInterval = window.setInterval(() => { engine.expireReservations(); renderReservations(); }, 250);
window.addEventListener('pagehide', () => { stopTimer(); clearInterval(expiryInterval); });
engine.log('Hệ thống Flash Sale đã sẵn sàng');
