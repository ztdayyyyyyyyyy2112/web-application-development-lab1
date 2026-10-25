export default function SkillBadge({ skill }) {
  return (
    <li>
      <strong>{skill.name}</strong>
      <span aria-label={`Skill level: ${skill.level}`}>{skill.level}</span>
    </li>
  );
}
