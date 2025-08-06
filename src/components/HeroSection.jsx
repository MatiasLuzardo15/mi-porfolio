import { ArrowDown, Code } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          {/* Imagen de perfil circular */}
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in">
            <div className="relative">
              <img 
                src="/images/profile.jpg" 
                alt="Matías Luzardo - Desarrollador Web Uruguay especializado en React JavaScript WordPress" 
                title="Matías Luzardo - Portfolio Desarrollador Web"
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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

          <p className="text-lg md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-4">
            <span className="text-primary font-semibold">Desarrollador Web</span> en <span className="text-blue-400 font-semibold">Uruguay</span> con conocimientos en <span className="text-green-400 font-semibold">React</span>, <span className="text-yellow-400 font-semibold">JavaScript</span> y <span className="text-orange-400 font-semibold">WordPress</span>. Estudiante de <span className="text-cyan-400 font-semibold">Tecnologías de la Información</span> con experiencia en <span className="text-pink-400 font-semibold">desarrollo frontend</span>, <span className="text-purple-400 font-semibold">backend</span>, <span className="text-indigo-400 font-semibold">bases de datos</span> y <span className="text-red-400 font-semibold">marketing digital</span>. Creando soluciones web modernas y responsivas.
          </p>

          <div className="pt-4 opacity-0 animate-fade-in-delay-5">
            <a href="#projects" className="cosmic-button inline-flex items-center gap-2">
              <Code size={18} />
              Ver proyectos
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-base md:text-lg text-muted-foreground mb-2">Desliza para explorar</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};
