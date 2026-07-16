const skills = [
  ["01", "React", "Interfaces"],
  ["02", "TypeScript", "Código robusto"],
  ["03", "Tailwind CSS", "Sistemas visuales"],
  ["04", "Supabase", "Datos en tiempo real"],
  ["05", "Node.js", "Servicios web"],
  ["06", "WordPress", "Experiencias CMS"],
  ["07", "Figma", "Diseño UI / UX"],
  ["08", "Git & GitHub", "Flujos de trabajo"],
];

const marquee = ["ADAPTABLE", "ACCESIBLE", "RÁPIDO", "ESCALABLE", "INTUITIVO", "OPTIMIZADO"];

export const SkillsSection = () => {
  return (
    <section id="skills" className="skills-editorial">
      <div className="marquee" aria-label="Cualidades del trabajo">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" aria-hidden={group === 1} key={group}>
              {marquee.map((item) => <span key={`${group}-${item}`}>{item} <b>✦</b></span>)}
            </div>
          ))}
        </div>
      </div>

      <div className="section-block skills-inner">
        <div className="section-kicker">
          <span>03 / HERRAMIENTAS</span>
          <span>EL SISTEMA DETRÁS DEL RESULTADO</span>
        </div>
        <div className="skills-heading">
          <p className="eyebrow"><i /> MI STACK</p>
          <h2>La tecnología es el medio.<br /><em>La experiencia, el objetivo.</em></h2>
        </div>
        <div className="skills-grid">
          {skills.map(([number, name, use]) => (
            <article key={name}>
              <span>{number}</span>
              <h3>{name}</h3>
              <p>{use}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
