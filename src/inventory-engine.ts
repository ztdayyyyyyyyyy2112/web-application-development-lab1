export type ReservationState = 'RESERVED' | 'EXPIRED' | 'CHECKED_OUT' | 'CANCELLED';
export type Product = { id: string; name: string; price: number; originalPrice: number; stock: number; version: number; emoji: string; sold: number };
export type Reservation = { id: string; productId: string; customerId: string; quantity: number; state: ReservationState; expiresAt: number };
export type ReserveResult = { ok: true; reservation: Reservation } | { ok: false; reason: 'VERSION_CONFLICT' | 'OUT_OF_STOCK' | 'INVALID_QUANTITY' | 'UNKNOWN_PRODUCT' };
export type Event = { at: number; text: string; kind: 'ok' | 'warn' | 'info' };

export class InventoryEngine {
  readonly products: Product[] = [
    { id: 'p1', name: 'Tai nghe Bluetooth Pro', price: 199000, originalPrice: 699000, stock: 18, version: 0, emoji: '🎧', sold: 0 },
    { id: 'p2', name: 'Bàn phím cơ RGB', price: 459000, originalPrice: 1190000, stock: 12, version: 0, emoji: '⌨️', sold: 0 },
    { id: 'p3', name: 'Chuột Gaming Wireless', price: 249000, originalPrice: 799000, stock: 15, version: 0, emoji: '🖱️', sold: 0 },
    { id: 'p4', name: 'Loa Mini Bluetooth', price: 159000, originalPrice: 499000, stock: 10, version: 0, emoji: '🔊', sold: 0 }
  ];
  readonly reservations: Reservation[] = [];
  readonly events: Event[] = [];
  private sequence = 0;
  private listeners = new Set<() => void>();
  subscribe(listener: () => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  private notify() { for (const listener of this.listeners) listener(); }
  log(text: string, kind: Event['kind'] = 'info') {
    this.events.unshift({ at: Date.now(), text, kind });
    if (this.events.length > 120) this.events.length = 120;
    this.notify();
  }
  /** Optimistic compare-and-swap. Check + decrement occur synchronously in one JS turn. */
  reserve(productId: string, quantity: number, expectedVersion: number, customerId: string, ttlMs = 15000): ReserveResult {
    const product = this.products.find(p => p.id === productId);
    if (!product) return { ok: false, reason: 'UNKNOWN_PRODUCT' };
    if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, reason: 'INVALID_QUANTITY' };
    if (product.version !== expectedVersion) return { ok: false, reason: 'VERSION_CONFLICT' };
    if (product.stock < quantity) return { ok: false, reason: 'OUT_OF_STOCK' };
    product.stock -= quantity;
    product.version++;
    const reservation: Reservation = { id: `R${++this.sequence}`, productId, customerId, quantity, state: 'RESERVED', expiresAt: Date.now() + ttlMs };
    this.reservations.unshift(reservation);
    this.log(`${customerId} giữ ${quantity} × ${product.name} (${reservation.id})`, 'ok');
    return { ok: true, reservation };
  }
  /** Retry a stale-version conflict using the latest version; bounded attempts. */
  reserveWithRetry(productId: string, quantity: number, customerId: string, attempts = 3): ReserveResult {
    for (let i = 0; i < attempts; i++) {
      const product = this.products.find(p => p.id === productId);
      if (!product) return { ok: false, reason: 'UNKNOWN_PRODUCT' };
      const result = this.reserve(productId, quantity, product.version, customerId);
      if (result.ok || result.reason !== 'VERSION_CONFLICT') return result;
    }
    return { ok: false, reason: 'VERSION_CONFLICT' };
  }
  checkout(id: string): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation || reservation.state !== 'RESERVED') return false;
    if (Date.now() >= reservation.expiresAt) { this.expireOne(reservation); return false; }
    reservation.state = 'CHECKED_OUT';
    const product = this.products.find(p => p.id === reservation.productId)!;
    product.sold += reservation.quantity;
    this.log(`${reservation.customerId} thanh toán ${reservation.id} thành công`, 'ok');
    return true;
  }
  cancel(id: string): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation || reservation.state !== 'RESERVED') return false;
    reservation.state = 'CANCELLED';
    this.releaseStock(reservation);
    this.log(`${reservation.id} đã hủy, hoàn tồn kho`, 'warn');
    return true;
  }
  private releaseStock(reservation: Reservation) {
    const product = this.products.find(p => p.id === reservation.productId)!;
    product.stock += reservation.quantity;
    product.version++;
  }
  private expireOne(reservation: Reservation) {
    if (reservation.state !== 'RESERVED') return;
    reservation.state = 'EXPIRED';
    this.releaseStock(reservation);
    this.log(`${reservation.id} hết hạn giữ hàng, hoàn tồn kho`, 'warn');
  }
  expireReservations(): void {
    for (const r of this.reservations) if (r.state === 'RESERVED' && Date.now() >= r.expiresAt) this.expireOne(r);
  }
  /** Schedules many competing requests; each attempts optimistic CAS with an initially shared version. */
  async simulate(productId: string, count: number): Promise<{ success: number; conflicts: number; soldOut: number }> {
    const product = this.products.find(p => p.id === productId);
    if (!product) return { success: 0, conflicts: 0, soldOut: 0 };
    const initialVersion = product.version;
    let success = 0, conflicts = 0, soldOut = 0;
    const requests = Array.from({ length: count }, (_, i) => Promise.resolve().then(() => {
      const customer = `Bot-${String(i + 1).padStart(3, '0')}`;
      let result = this.reserve(productId, 1, initialVersion, customer);
      if (!result.ok && result.reason === 'VERSION_CONFLICT') {
        conflicts++;
        result = this.reserveWithRetry(productId, 1, customer);
      }
      if (result.ok) {
        success++;
        // Complete purchase so demo does not reserve all items forever.
        this.checkout(result.reservation.id);
      } else if (result.reason === 'OUT_OF_STOCK') soldOut++;
    }));
    await Promise.all(requests);
    this.log(`Mô phỏng ${count} yêu cầu: ${success} thành công, ${conflicts} xung đột phiên bản, ${soldOut} hết hàng`, 'info');
    return { success, conflicts, soldOut };
  }
}
