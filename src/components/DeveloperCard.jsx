import { Fragment, useState } from 'react';
import SkillBadge from './SkillBadge.jsx';
import styles from './DeveloperCard.module.css';

const DEFAULT_SKILLS = [
  { id: 'sk-1', name: 'React 19', level: 'Intermediate' },
  { id: 'sk-2', name: 'JavaScript', level: 'Intermediate' },
  { id: 'sk-3', name: 'Semantic HTML', level: 'Advanced' },
  { id: 'sk-4', name: 'CSS Modules', level: 'Intermediate' },
];

const METRIC_LABELS = {
  commits: 'Git commits',
  projects: 'Projects',
  score: 'Profile score',
};

// Semantic-only composition: no <div> inside DeveloperCard.
// The display works without the remote avatar by falling back to initials.
export default function DeveloperCard({
  fullName = 'Hà Nguyễn Việt Thành',
  role = 'Information Systems Student · React Developer',
  avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop',
  metrics = { commits: 512, projects: 6, score: 100 },
  skills = DEFAULT_SKILLS,
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initials = fullName.trim().split(/\s+/).slice(-2).map((word) => word[0]).join('').toUpperCase();

  return (
    <article className={styles.card} aria-labelledby="dev-heading">
      <header className={styles.header}>
        {avatarFailed || !avatarUrl ? (
          <span className={styles.avatarFallback} role="img" aria-label={`Avatar initials: ${initials}`}>
            {initials}
          </span>
        ) : (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={`Portrait avatar of ${fullName}`}
            width="120"
            height="120"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setAvatarFailed(true)}
          />
        )}
        <hgroup>
          <h2 id="dev-heading" className={styles.heading}>{fullName}</h2>
          <p className={styles.role}>{role}</p>
        </hgroup>
      </header>

      <section aria-label="Profile metrics">
        <dl className={styles.metrics}>
          {Object.entries(metrics).map(([key, value]) => (
            <Fragment key={key}>
              <dt>{METRIC_LABELS[key] ?? key}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section aria-labelledby="skills-heading" className={styles.skillsSection}>
        <h3 id="skills-heading">Engineering skills</h3>
        <ul className={styles.skills} aria-label="Engineering Skills">
          {skills.map((skill) => <SkillBadge key={skill.id} skill={skill} />)}
        </ul>
      </section>
    </article>
  );
}
