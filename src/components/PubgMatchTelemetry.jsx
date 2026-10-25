import { useEffect, useState } from 'react';
import { PUBG_VN_SQUADS } from '../data/pubgSquads.js';
import { fetchMatchTelemetry } from '../api/fetchMatchTelemetry.js';
import styles from './PubgMatchTelemetry.module.css';

// Four-state contract: IDLE | LOADING | SUCCESS | ERROR.
// AbortController cleanup prevents old responses from replacing new squad data.
export default function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });

    fetchMatchTelemetry(squadId, controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setView({ status: 'SUCCESS', data: payload, error: null });
        }
      })
      .catch((err) => {
        if (controller.signal.aborted || err?.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err instanceof Error ? err.message : String(err) });
      });

    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <section className={styles.wrap} aria-labelledby="telemetry-heading">
      <header>
        <h2 id="telemetry-heading">KRAFTON PUBG Vietnam Series – Live Telemetry</h2>
        <p>Simulated 35% satellite packet loss · Abort-safe switching · Accessible retry</p>
      </header>

      <nav className={styles.squadPicker} aria-label="Choose PUBG Vietnam squad">
        {PUBG_VN_SQUADS.map((squad) => (
          <button
            key={squad.id}
            type="button"
            className={squad.id === squadId ? styles.selected : undefined}
            aria-pressed={squad.id === squadId}
            onClick={() => setSquadId(squad.id)}
          >
            {squad.name}
          </button>
        ))}
      </nav>

      {view.status === 'IDLE' && <p>Choose a squad to load its telemetry.</p>}

      {view.status === 'LOADING' && (
        <section className={styles.skeleton} aria-busy="true" aria-label="Loading satellite telemetry">
          <span className={styles.pulse} aria-hidden="true" />
          <p role="status">Syncing KRAFTON radar…</p>
        </section>
      )}

      {view.status === 'ERROR' && (
        <section className={styles.error} role="alert" aria-labelledby="packet-error-heading">
          <h3 id="packet-error-heading">Blue-Zone Link Lost</h3>
          <p>{view.error}</p>
          <button type="button" onClick={() => setRetryTick((tick) => tick + 1)}>
            Reconnect Satellite (Retry)
          </button>
        </section>
      )}

      {view.status === 'SUCCESS' && view.data && (
        <article className={styles.telemetry} aria-live="polite" aria-label={`Telemetry of ${view.data.name}`}>
          <header className={styles.infoHeader}>
            <h3>{view.data.name}</h3>
            <span className={styles.live}>FEED CONNECTED</span>
          </header>
          <dl className={styles.stats}>
            <dt>Map</dt><dd>{view.data.map}</dd>
            <dt>Blue Zone</dt><dd>{view.data.phase}</dd>
            <dt>Squad alive</dt><dd>{view.data.alive}</dd>
            <dt>Kills</dt><dd>{view.data.kills}</dd>
            <dt>WWCD probability</dt><dd>{view.data.wwdcProb}%</dd>
            <dt>Current status</dt><dd>{view.data.status}</dd>
          </dl>
          <p className={styles.timestamp}>Last radar sync: {view.data.receivedAt}</p>
          <button type="button" onClick={() => setRetryTick((tick) => tick + 1)}>Refresh telemetry</button>
        </article>
      )}
    </section>
  );
}
