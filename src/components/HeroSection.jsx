import { ArrowDown, Github, Linkedin } from "lucide-react";

export const HeroSection = () => {
  return (
    <section id="hero" className="hero-editorial">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-layout reveal-up">
        <div className="hero-core">
          <p className="eyebrow">DESARROLLADOR WEB · URUGUAY</p>
          <h1 aria-label="Matías Luzardo">
            <span>MATIAS</span>
            <span className="outline-name">LUZARDO</span>
          </h1>
          <div className="hero-statement">
            <div>
              <h2>
                <span className="statement-line">Construyo <em>experiencias</em></span>
                <span className="statement-line">digitales con intención</span>
              </h2>
              <p className="hero-intro">
                Diseño y desarrollo productos web modernos, claros y funcionales,
                combinando código, criterio visual y atención al detalle.
              </p>
            </div>
            <div className="hero-actions">
              <a className="button-primary" href="#projects">Explorar proyectos <span>↘</span></a>
              <a className="icon-link" href="https://github.com/MatiasLuzardo15" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
              <a className="icon-link" href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
            </div>
          </div>
        </div>

        <figure className="hero-portrait">
          <img src="/images/avatar.png?v=2" alt="Matías Luzardo" />
        </figure>
      </div>

      <div className="hero-meta hero-location">
        <span className="location-pin">●</span>
        <p>CON BASE EN<br /><strong>FLORIDA, URUGUAY</strong></p>
      </div>
      <div className="hero-meta hero-role">
        <span className="code-mark">&lt;/&gt;</span>
        <p>FRONTEND, BACKEND<br /><strong>&amp; UI / UX</strong></p>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Continuar al perfil">
        <ArrowDown size={18} /> SCROLL
      </a>
    </section>
  );
};
