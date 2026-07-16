import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "Weatherl",
    description: "Aplicación meteorológica moderna con animaciones fluidas y una experiencia visual inspirada en productos premium.",
    image: "/projects/project1.png",
    tags: ["React", "Tailwind CSS", "Framer Motion", "JavaScript"],
    demoUrl: "https://weatherl.space",
    githubUrl: "https://github.com/MatiasLuzardo15/weatherl",
  },
  {
    id: "02",
    title: "Cold Laked Store",
    description: "E-commerce desarrollado en WordPress con una interfaz moderna y funcionalidades completas de tienda online.",
    image: "/projects/project2.png",
    tags: ["WordPress", "WooCommerce"],
    demoUrl: "https://coldlaked.store/",
    note: "En mantenimiento",
  },
  {
    id: "03",
    title: "Portfolio Personal",
    description: "Mi espacio digital: responsivo, optimizado para SEO y construido con una arquitectura simple y mantenible.",
    image: "/projects/project3.png",
    tags: ["React", "Vite", "Tailwind CSS", "React Router"],
    demoUrl: "https://matiasluzardo.com",
    githubUrl: "https://github.com/MatiasLuzardo15/mi-porfolio",
  },
  {
    id: "04",
    title: "Zenth Productivity",
    description: "Suite de productividad con tareas, notas asistidas por IA, planificación anual, gamificación y sincronización en tiempo real.",
    image: "/projects/project4.png",
    tags: ["React", "Vite", "Framer Motion", "Supabase"],
    demoUrl: "https://www.zenth.space/",
    githubUrl: "https://github.com/MatiasLuzardo15/zenth--Task",
  },
  {
    id: "05",
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
            <div className="project-image-wrap">
              <img src={project.image} alt={`Vista previa de ${project.title}`} loading="lazy" />
              <span className="project-index">{project.id}</span>
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
