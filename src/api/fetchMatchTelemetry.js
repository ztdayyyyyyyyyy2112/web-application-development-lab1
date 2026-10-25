import { PUBG_VN_SQUADS } from '../data/pubgSquads.js';

/**
 * Local, abortable simulation of an unreliable satellite telemetry request.
 * 35% packet-loss probability; no real network connection is made.
 */
export function fetchMatchTelemetry(squadId, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Satellite request cancelled', 'AbortError'));
      return;
    }

    const delayMs = 850 + Math.floor(Math.random() * 900);
    let settled = false;

    const cleanup = () => signal.removeEventListener('abort', handleAbort);
    const failOrResolve = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (Math.random() < 0.35) {
        reject(new Error('Satellite packet timeout: unable to synchronize match feed.'));
        return;
      }
      const squad = PUBG_VN_SQUADS.find((entry) => entry.id === squadId);
      if (!squad) {
        reject(new Error(`Unknown PUBG squad: ${squadId}`));
        return;
      }
      resolve({ ...squad, receivedAt: new Date().toLocaleTimeString('vi-VN') });
    };

    const timeoutId = window.setTimeout(failOrResolve, delayMs);

    function handleAbort() {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      cleanup();
      reject(new DOMException('Satellite request cancelled', 'AbortError'));
    }

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}
