import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

export const LearningSection = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Datos de los certificados
  const certificates = [
    {
      id: 1,
      title: "Certificado de Programación Web",
      institution: "Institución Educativa",
      image: "/learning/Certificate1.png",
      year: "2024"
    },
    {
      id: 2,
      title: "Certificado de JavaScript Avanzado",
      institution: "Plataforma de Aprendizaje",
      image: "/learning/Certificate2.png",
      year: "2024"
    },
    {
      id: 3,
      title: "Certificado de React Development",
      institution: "Academia Online",
      image: "/learning/Certificate3.png",
      year: "2024"
    },
    {
      id: 4,
      title: "Certificado de Bases de Datos",
      institution: "Centro de Formación",
      image: "/learning/Certificate4.png",
      year: "2024"
    },
    {
      id: 5,
      title: "Certificado de Marketing Digital",
      institution: "Instituto Digital",
      image: "/learning/Certificate5.png",
      year: "2024"
    }
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320; // Ancho de una tarjeta + gap
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  return (
    <section id="aprendizaje" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="text-primary" size={42} />
            Mi <span className="text-primary">Aprendizaje</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Formación continua y certificaciones que respaldan mi desarrollo profesional 
            en tecnologías web y marketing digital.
          </p>
        </div>

        {/* Carrusel Container */}
        <div className="relative">
          {/* Botón Izquierdo */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all duration-200 ${
              canScrollLeft 
                ? 'hover:bg-primary/10 hover:scale-110 text-primary' 
                : 'opacity-50 cursor-not-allowed text-muted-foreground'
            }`}
            aria-label="Anterior certificado"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Botón Derecho */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all duration-200 ${
              canScrollRight 
                ? 'hover:bg-primary/10 hover:scale-110 text-primary' 
                : 'opacity-50 cursor-not-allowed text-muted-foreground'
            }`}
            aria-label="Siguiente certificado"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carrusel de Certificados */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth px-14 pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  {/* Imagen del Certificado */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Información del Certificado */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                        {cert.title}
                      </h3>
                      <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        {cert.year}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {cert.institution}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Certificado verificado
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de scroll para móvil */}
          <div className="flex justify-center mt-6 gap-2 md:hidden">
            {certificates.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
