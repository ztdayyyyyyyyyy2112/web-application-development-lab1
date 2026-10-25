import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';
import styles from './ScientistDirectory.module.css';
export default function ScientistDirectory() {
  const [people] = useState(() => SMART_PEOPLE.map((p) => ({ ...p })));
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');
  const nameId = useId();
  const iqId = useId();
  const sortId = useId();

  const visiblePeople = people
    .filter((p) => p.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && p.iq >= minIq)
    .toSorted((a, b) => sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age);

  return (
    <section className={styles.directory} aria-labelledby="directory-heading">
      <header className={styles.heading}><h2 id="directory-heading">Scientist &amp; Pioneer Directory</h2><p>Search, numeric filter and immutable sorting</p></header>
      <form className={styles.controls} role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={nameId}>Name search<input id={nameId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label htmlFor={iqId}>Minimum IQ<input id={iqId} type="number" value={minIq} onChange={(event) => setMinIq(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber)} /></label>
        <label htmlFor={sortId}>Sort by<select id={sortId} value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="iq-desc">IQ descending</option><option value="age-asc">Age ascending</option></select></label>
      </form>
      <p className={styles.counter}>Found {visiblePeople.length} pioneer(s).</p>
      <ul className={styles.list}>{visiblePeople.map((person) => <li key={person.id} className={styles.item}><article><h3>{person.name}</h3><p>Age {person.age} · IQ {person.iq}</p></article></li>)}</ul>
    </section>
  );
}
