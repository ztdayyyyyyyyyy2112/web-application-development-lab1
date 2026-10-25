import { useEffect, useState } from 'react';
import { PUBG_VN_SQUADS } from '../data/pubgSquads.js';
import { fetchMatchTelemetry } from '../api/fetchMatchTelemetry.js';
import styles from './PubgMatchTelemetry.module.css';

export default function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });
    fetchMatchTelemetry(squadId, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setView({ status: 'SUCCESS', data, error: null }); })
      .catch((err) => { if (controller.signal.aborted || err?.name === 'AbortError') return; setView({ status: 'ERROR', data: null, error: err.message }); });
    return () => controller.abort();
  }, [squadId]);
  return (
    <section className={styles.wrap} aria-labelledby="telemetry-heading">
      <h2 id="telemetry-heading">KRAFTON PUBG Vietnam Series</h2>
      <nav aria-label="Squad selector">{PUBG_VN_SQUADS.map((squad) => <button type="button" key={squad.id} aria-pressed={squadId === squad.id} onClick={() => setSquadId(squad.id)}>{squad.name}</button>)}</nav>
      {view.status === 'IDLE' && <p>Choose a squad.</p>}
      {view.status === 'LOADING' && <p>LOADING: Syncing radar…</p>}
      {view.status === 'ERROR' && <p>ERROR: {view.error}</p>}
      {view.status === 'SUCCESS' && <article aria-live="polite"><h3>{view.data.name}</h3><p>{view.data.map} · Kills: {view.data.kills} · Alive: {view.data.alive}</p></article>}
    </section>
  );
}
