import { useState } from 'react';
import DeveloperCard from './components/DeveloperCard.jsx';

const ACTIVITIES = [
  { id: 'ex1', label: 'Exercise 1', name: 'Semantic Developer Card' },
  { id: 'ex2', label: 'Exercise 2', name: 'Scientist Directory' },
  { id: 'ex3', label: 'Exercise 3', name: 'PUBG VN Live Telemetry' },
];
export default function App() {
  const [activeExercise, setActiveExercise] = useState('ex1');
  const activity = ACTIVITIES.find((item) => item.id === activeExercise);
  return (
    <>
      <header className="site-header">
        <p className="eyebrow">WEB APPLICATION DEVELOPMENT · LAB 3</p>
        <h1>React 19 Engineering Exercises</h1>
        <p>Based on Lab 2: semantic HTML, per-component state, derived data and abortable asynchronous effects.</p>
      </header>
      <main id="main-content" className="site-main">
        <nav className="exercise-nav" aria-label="Exercise navigation">
          {ACTIVITIES.map((item) => <button key={item.id} type="button" aria-current={activeExercise === item.id ? 'page' : undefined} className={activeExercise === item.id ? 'active' : ''} onClick={() => setActiveExercise(item.id)}><span>{item.label}</span><small>{item.name}</small></button>)}
        </nav>
        <section className="exercise-section" aria-labelledby="exercise-heading">
          <header className="exercise-header"><p className="section-kicker">{activity.label.toUpperCase()}</p><h2 id="exercise-heading">{activity.name}</h2></header>
          {activeExercise === 'ex1' && <DeveloperCard />}
          {activeExercise === 'ex2' && <p>Exercise 2 is coming in checkpoint 4.</p>}
          {activeExercise === 'ex3' && <p>Exercise 3 is coming in checkpoint 7.</p>}
        </section>
      </main>
      <footer className="site-footer">Lab 3 · React 19 · Vite</footer>
    </>
  );
}
