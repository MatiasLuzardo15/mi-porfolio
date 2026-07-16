import { ArrowUpRight, Database, FileText, Layout, Server } from "lucide-react";

const principles = [
  { icon: Layout, title: "Interfaces claras", text: "Diseño centrado en jerarquía, respuesta visual y una experiencia simple." },
  { icon: Server, title: "Código que escala", text: "Componentes mantenibles y soluciones pensadas para crecer con el producto." },
  { icon: Database, title: "Visión completa", text: "Frontend, backend y datos conectados en una experiencia coherente." },
];

export const AboutSection = () => {
  return (
    <section id="about" className="section-block about-editorial">
      <div className="section-kicker">
        <span>01 / PERFIL</span>
        <span>DETALLE · LÓGICA · EXPERIENCIA</span>
      </div>

      <div className="about-layout">
        <div className="about-heading">
          <p className="eyebrow"><i /> UN POCO SOBRE MÍ</p>
          <h2>Ideas que se vuelven<br /><em>experiencias reales.</em></h2>
        </div>

        <div className="about-copy">
          <p className="about-lead">
            Soy Matías Luzardo, desarrollador web uruguayo de 22 años y estudiante
            de Tecnologías de la Información.
          </p>
          <p>
            Combino formación técnica y aprendizaje autodidacta para crear productos
            web útiles, ágiles y visualmente cuidados. Me interesan especialmente React,
            TypeScript, Supabase y el diseño centrado en UI/UX. Busco mi primera oportunidad
            profesional para aportar, aprender y construir productos que resuelvan problemas reales.
          </p>
          <div className="about-links">
            <a href="#contact">Trabajemos juntos <ArrowUpRight size={16} /></a>
            <a href="/Expediente_Academico.pdf" download="Expediente_Academico_Matias_Luzardo.pdf">
              Expediente académico <FileText size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="principles-grid">
        {principles.map(({ icon: Icon, title, text }, index) => (
          <article key={title} className="principle-card">
            <span className="principle-number">0{index + 1}</span>
            <Icon size={24} strokeWidth={1.5} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
