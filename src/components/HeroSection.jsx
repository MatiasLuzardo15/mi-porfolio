import { ArrowDown, Code, Github, Linkedin } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10 pb-12 md:pb-16">
        <div className="space-y-6">
          {/* Imagen de perfil circular */}
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in">
            <div className="relative">
              {/* Efectos radar */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
              
              <img 
                src="/images/profile.jpg" 
                alt="Matías Luzardo - Desarrollador Web Uruguay especializado en React JavaScript WordPress" 
                title="Matías Luzardo - Portfolio Desarrollador Web"
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative z-10"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="opacity-0 animate-fade-in-delay-1"> Hola, soy</span>
            <span className="text-primary opacity-0 animate-fade-in-delay-2">
              {" "}
              Matias
            </span>
            <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-3">
              {" "}
              Luzardo
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-4">
            <span className="text-primary font-semibold">Desarrollador Web</span> en <span className="text-blue-400 font-semibold">Uruguay</span> con conocimientos en <span className="text-green-400 font-semibold">React</span>, <span className="text-yellow-400 font-semibold">JavaScript</span> y <span className="text-orange-400 font-semibold">WordPress</span>. Estudiante de <span className="text-cyan-400 font-semibold">Tecnologías de la Información</span> con experiencia en <span className="text-pink-400 font-semibold">desarrollo frontend</span>, <span className="text-purple-400 font-semibold">backend</span>, <span className="text-indigo-400 font-semibold">bases de datos</span> y <span className="text-red-400 font-semibold">marketing digital</span>. Creando soluciones web modernas y responsivas.
          </p>

          <div className="pt-4 opacity-0 animate-fade-in-delay-5">
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center max-w-md mx-auto">
              {/* Botón de disponibilidad */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 rounded-full text-sm font-medium text-white shadow-sm hover:bg-green-500 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                </div>
                Disponible para nuevas oportunidades
              </div>
              
              <a href="#projects" className="cosmic-button inline-flex items-center gap-2">
                <Code size={18} />
                Ver proyectos
              </a>
              
              <a 
                href="https://www.linkedin.com/in/matias-luzardo" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105 active:scale-95"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
              
              <a 
                href="https://github.com/MatiasLuzardo15" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:text-slate-100 transition-all duration-300 font-medium border border-slate-200 dark:border-slate-600 hover:scale-105 active:scale-95"
              >
                <Github size={18} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Intuitive "explore more" button */}
      <button 
        onClick={() => {
          document.getElementById('projects')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 animate-fade-in-delay-4 group cursor-pointer transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full p-3"
        aria-label="Ver mis proyectos"
      >
        <div className="text-center">
          {/* Beautiful cascading arrows */}
          <div className="flex flex-col items-center space-y-1">
            <ArrowDown className="h-4 w-4 text-primary/60 group-hover:text-primary animate-bounce transition-colors duration-300" style={{animationDelay: '0ms'}} />
            <ArrowDown className="h-5 w-5 text-primary/80 group-hover:text-primary animate-bounce transition-colors duration-300" style={{animationDelay: '150ms'}} />
            <ArrowDown className="h-4 w-4 text-primary/60 group-hover:text-primary animate-bounce transition-colors duration-300" style={{animationDelay: '300ms'}} />
          </div>
        </div>
      </button>
    </section>
  );
};
