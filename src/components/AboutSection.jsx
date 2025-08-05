import { Briefcase, Code, User, FileText, UserCircle } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <UserCircle className="text-primary" size={36} />
          Acerca de <span className="text-primary"> Mí</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Estudiante de Tecnologías de la Información
            </h3>

            <p className="text-muted-foreground">
              Soy Matías, estudiante de <span className="text-primary font-semibold">4.º semestre</span> de <span className="text-blue-400 font-semibold">Licenciatura en Tecnologías de la Información</span>. He participado en <span className="text-green-400 font-semibold">proyectos integradores</span> aplicando conocimientos en <span className="text-yellow-400 font-semibold">programación</span>, <span className="text-purple-400 font-semibold">bases de datos</span>, <span className="text-cyan-400 font-semibold">redes</span> y <span className="text-pink-400 font-semibold">testing</span>. Además, me he formado de manera autodidacta en <span className="text-blue-500 font-semibold">desarrollo web</span>, <span className="text-violet-400 font-semibold">WordPress</span> y <span className="text-orange-400 font-semibold">marketing digital</span>, lo que me brinda una visión más completa para crear soluciones funcionales y atractivas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Contáctame
              </a>

              <a
                href="/Expediente_Academico.pdf"
                download="Expediente_Academico_Matias_Luzardo.pdf"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 flex items-center gap-2 justify-center"
              >
                <FileText size={18} />
                Expediente Académico
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Desarrollo Web</h4>
                  <p className="text-muted-foreground">
                    Creación de sitios web responsivos con HTML, CSS, Tailwind y JavaScript. Experiencia en frameworks modernos.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Bases de Datos y Redes</h4>
                  <p className="text-muted-foreground">
                    Conocimientos en bases de datos relacionales, infraestructura de redes y testing de aplicaciones.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">Marketing Digital</h4>
                  <p className="text-muted-foreground">
                    Formación autodidacta en marketing digital que complementa mis habilidades técnicas para soluciones integrales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
