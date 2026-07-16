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

const marquee = [
  "ADAPTABLE",
  "ACCESIBLE",
  "RÁPIDO",
  "ESCALABLE",
  "INTUITIVO",
  "OPTIMIZADO",
];

const MarqueeGlyph = ({ variant }) => {
  const type = variant % 3;

  if (type === 1) {
    return (
      <svg className="marquee-glyph" viewBox="0 0 48 18" aria-hidden="true">
        <path d="M2 9h12M34 9h12" />
        <rect x="18" y="3" width="12" height="12" />
        <path d="M21 6l6 6M27 6l-6 6" />
      </svg>
    );
  }

  if (type === 2) {
    return (
      <svg className="marquee-glyph" viewBox="0 0 48 18" aria-hidden="true">
        <path d="M3 15L15 3M15 15L27 3M27 15L39 3" />
        <circle cx="43" cy="9" r="3" />
      </svg>
    );
  }

  return (
    <svg className="marquee-glyph" viewBox="0 0 48 18" aria-hidden="true">
      <path d="M2 9h16M30 9h16" />
      <path d="M24 2v14M17 9l7-7 7 7-7 7-7-7z" />
    </svg>
  );
};

export const SkillsSection = () => {
  return (
    <section id="skills" className="skills-editorial">
      <div className="marquee" aria-label="Cualidades del trabajo">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" aria-hidden={group === 1} key={group}>
              {[...marquee, ...marquee].map((item, index) => (
                <span className="marquee-item" key={`${group}-${item}-${index}`}>
                  <small>{String((index % marquee.length) + 1).padStart(2, "0")}</small>
                  <strong>{item}</strong>
                  <MarqueeGlyph variant={index} />
                </span>
              ))}
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
