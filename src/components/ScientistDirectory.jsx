import { SMART_PEOPLE } from '../data/smartPeople.js';
import styles from './ScientistDirectory.module.css';

export default function ScientistDirectory() {
  return (
    <section className={styles.directory} aria-labelledby="directory-heading">
      <h2 id="directory-heading">Scientist &amp; Pioneer Directory</h2>
      <p>Six normalized records, each with a stable ID.</p>
      <ul className={styles.list}>
        {SMART_PEOPLE.map((person) => (
          <li key={person.id} className={styles.item}>
            <strong>{person.name}</strong> · Age {person.age} · IQ {person.iq}
          </li>
        ))}
      </ul>
    </section>
  );
}
