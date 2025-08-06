import { ArrowRight, ExternalLink, Github, FolderOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const projects = [
  {
    id: 1,
    title: "Weatherl",
    description: "Una hermosa aplicación del clima con animaciones estilo Apple, construida con React, Framer Motion y TailwindCSS.",
    image: "/projects/project1.png",
    tags: ["React", "Tailwind CSS", "Framer Motion", "JavaScript"],
    demoUrl: "https://weatherl.space",
    githubUrl: "https://github.com/MatiasLuzardo15/weatherl",
  },
  {
    id: 2,
    title: "Cold Laked Store",
    description: "Sitio web de e-commerce desarrollado en WordPress con diseño moderno y funcionalidades completas de tienda online.",
    image: "/projects/project2.png",
    tags: ["WordPress", "WooCommerce"],
    demoUrl: "https://coldlaked.store/",
    githubUrl: null,
  },
  {
    id: 3,
    title: "Portfolio Personal",
    description: "Portfolio personal desarrollado con React, Vite y TailwindCSS. Diseño moderno, responsivo y optimizado para SEO con animaciones suaves y tema oscuro/claro.",
    image: "/projects/project3.png",
    tags: ["React", "Vite", "Tailwind CSS", "React Router"],
    demoUrl: "https://matiasluzardo.com",
    githubUrl: "https://github.com/MatiasLuzardo15/mi-porfolio",
  },
];

export const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className={`py-16 px-4 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'bg-gradient-to-br from-primary/8 via-primary/2 to-secondary/12' : ''
      }`}
    >
      {/* Efectos de difuminación que aparecen cuando la sección está visible */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-10 -left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 -right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center flex items-center justify-center gap-3">
          <FolderOpen className="text-primary" size={36} />
          <span className="text-primary"> Proyectos </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Aquí puedes ver algunos de mis proyectos más recientes. Cada uno ha sido desarrollado 
          con especial atención al detalle, rendimiento y experiencia del usuario, aplicando 
          las mejores prácticas de desarrollo web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {project.id !== 3 && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        className="text-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        className="text-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/MatiasLuzardo15"
          >
            <Github size={16} />
            Revisa mi GitHub 
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
