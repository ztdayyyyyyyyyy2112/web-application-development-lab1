/** Recompute from wall-clock time each frame; no cumulative interval drift. */
export function createAntiDriftTimer(targetTime: number, onTick: (remainingMs: number) => void): () => void {
  let rafId: number | null = null;
  let cancelled = false;
  const tick = () => {
    if (cancelled) return;
    const remaining = Math.max(0, targetTime - Date.now());
    onTick(remaining);
    if (remaining > 0) rafId = requestAnimationFrame(tick);
  };
  tick();
  return () => { cancelled = true; if (rafId !== null) cancelAnimationFrame(rafId); };
}
export function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}
