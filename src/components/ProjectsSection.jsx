import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    id: "01",
    code: "WTH",
    title: "Weatherl",
    description: "Aplicación meteorológica moderna con animaciones fluidas y una experiencia visual inspirada en productos premium.",
    image: "/projects/project1.png",
    tags: ["React", "Tailwind CSS", "Framer Motion", "JavaScript"],
    demoUrl: "https://weatherl.space",
    githubUrl: "https://github.com/MatiasLuzardo15/weatherl",
  },
  {
    id: "02",
    code: "ML",
    title: "Portfolio Personal",
    description: "Mi espacio digital: responsivo, optimizado para SEO y construido con una arquitectura simple y mantenible.",
    tags: ["React", "Vite", "Tailwind CSS", "React Router"],
    demoUrl: "https://matiasluzardo.com",
    githubUrl: "https://github.com/MatiasLuzardo15/mi-porfolio",
  },
  {
    id: "03",
    code: "ZTH",
    title: "Zenth Productivity",
    description: "Suite de productividad con tareas, notas asistidas por IA, planificación anual, gamificación y sincronización en tiempo real.",
    image: "/projects/project4.png",
    tags: ["React", "Vite", "Framer Motion", "Supabase"],
    demoUrl: "https://www.zenth.space/",
  },
  {
    id: "04",
    code: "RLT",
    title: "Ruralit",
    description: "Software de gestión rural para registrar gastos, stock, ventas e inversiones y comprender el margen real del campo.",
    image: "/projects/project5.png",
    tags: ["React", "TypeScript", "Vite", "Supabase", "Capacitor"],
    demoUrl: "https://www.ruralit.blog/",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="section-block projects-editorial">
      <div className="section-kicker">
        <span>02 / ARCHIVO DIGITAL</span>
        <span>2024 — 2026</span>
      </div>

      <div className="projects-heading">
        <p className="eyebrow"><i /> DISEÑO + DESARROLLO</p>
        <h2>PROYECTOS<br /><span>DESTACADOS</span></h2>
        <p>Productos digitales donde conecto estrategia, interacción y código.</p>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <article className="project-showcase" key={project.id}>
            <div className={`project-image-wrap${project.image ? "" : " project-image-wrap--no-shot"}`}>
              {project.image && (
                <img src={project.image} alt={`Vista previa de ${project.title}`} loading="lazy" />
              )}
              <div className="project-cover" aria-hidden="true">
                <span>VISUAL / {project.id}</span>
                <strong>{project.code}</strong>
              </div>
              {project.note && <span className="project-note">● {project.note}</span>}
            </div>
            <div className="project-content">
              <div>
                <p className="project-type">EXPERIENCIA WEB / {project.id}</p>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
              <div className="project-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="project-links">
                <a href={project.demoUrl} target="_blank" rel="noreferrer">Ver proyecto <ArrowUpRight size={17} /></a>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Código de ${project.title}`}>
                    <Github size={17} /> Código
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
