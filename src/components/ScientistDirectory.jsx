import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';
import styles from './ScientistDirectory.module.css';

// The visible list is DERIVED from state during render (no useEffect).
export default function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const [people, setPeople] = useState(() => initialData.map((item) => ({ ...item })));
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');
  const nameId = useId();
  const iqId = useId();
  const sortId = useId();

  const visiblePeople = people
    .filter((person) =>
      person.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
      person.iq >= minIq
    )
    .toSorted((a, b) => {
      switch (sortBy) {
        case 'age-asc': return a.age - b.age || a.name.localeCompare(b.name);
        case 'age-desc': return b.age - a.age || a.name.localeCompare(b.name);
        case 'iq-asc': return a.iq - b.iq || a.name.localeCompare(b.name);
        default: return b.iq - a.iq || a.name.localeCompare(b.name);
      }
    });

  function removePerson(personId) {
    setPeople((prev) => prev.filter((person) => person.id !== personId));
  }

  function resetDirectory() {
    setPeople(initialData.map((item) => ({ ...item })));
    setQuery('');
    setMinIq(160);
    setSortBy('iq-desc');
  }

  return (
    <section className={styles.directory} aria-labelledby="directory-heading">
      <header className={styles.heading}>
        <h2 id="directory-heading">Interactive Scientist &amp; Pioneer Directory</h2>
        <p>Single source of truth · Pure derived state · Accessible search</p>
      </header>
      <form className={styles.controls} role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={nameId}>Name search
          <input id={nameId} type="search" value={query} autoComplete="off" placeholder="Try Einstein or da Vinci..." onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label htmlFor={iqId}>Minimum IQ
          <input id={iqId} type="number" min="0" max="300" value={minIq} onChange={(event) => setMinIq(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber)} />
        </label>
        <label htmlFor={sortId}>Sort by
          <select id={sortId} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="iq-desc">IQ: high → low</option>
            <option value="iq-asc">IQ: low → high</option>
            <option value="age-asc">Age: young → old</option>
            <option value="age-desc">Age: old → young</option>
          </select>
        </label>
        <button className={styles.reset} type="button" onClick={resetDirectory}>Reset directory</button>
      </form>
      <output role="status" aria-live="polite" className={styles.counter}>
        Found {visiblePeople.length} pioneer(s) · {people.length} in current dataset
      </output>
      {visiblePeople.length === 0 ? (
        <p className={styles.empty}>No matching pioneers. Try lowering the minimum IQ or resetting the directory.</p>
      ) : (
        <ul className={styles.list} aria-label="Scientist results">
          {visiblePeople.map((person) => (
            <li key={person.id} className={styles.item}>
              <article>
                <h3>{person.name}</h3>
                <p>Age <strong>{person.age}</strong> · IQ <strong>{person.iq}</strong></p>
              </article>
              <button type="button" aria-label={`Delete ${person.name}`} onClick={() => removePerson(person.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
