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
                alt="Matias Luzardo" 
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
            Estudiante de <span className="text-primary font-semibold">3.º semestre</span> de <span className="text-blue-400 font-semibold">Lic. en TI</span> con habilidades en <span className="text-green-400 font-semibold">desarrollo web</span> (<span className="text-orange-400 font-semibold">HTML</span>, <span className="text-blue-500 font-semibold">CSS</span>, <span className="text-cyan-400 font-semibold">Tailwind</span>, <span className="text-yellow-400 font-semibold">JavaScript</span>), conocimientos en <span className="text-pink-400 font-semibold">testing</span>, <span className="text-purple-400 font-semibold">infraestructura de redes</span>, <span className="text-indigo-400 font-semibold">bases de datos relacionales</span> y una base en <span className="text-red-400 font-semibold">marketing digital</span>.
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
