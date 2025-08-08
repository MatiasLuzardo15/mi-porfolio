import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const LearningSection = () => {
  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  // Detectar iOS al montar el componente
  useEffect(() => {
    const iosDetection = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iosDetection);
  }, []);

  // Datos de los certificados
  const certificates = [
    {
      id: 1,
      title: "Cybersecurity Essentials",
      institution: "Cisco Networking Academy",
      image: "/learning/Certificate1.png",
      year: "2024"
    },
    {
      id: 2,
      title: "Introducción a Jenkins",
      institution: "The Linux Foundation",
      image: "/learning/Certificate2.png",
      year: "2024"
    },
    {
      id: 3,
      title: "Redes, Seguridad y Automatización",
      institution: "Cisco Networking Academy",
      image: "/learning/Certificate3.png",
      year: "2023"
    },
    {
      id: 4,
      title: "Introducción a la Ciberseguridad",
      institution: "Cisco Networking Academy",
      image: "/learning/Certificate4.png",
      year: "2024"
    },
    {
      id: 5,
      title: "Escala tu negocio digital",
      institution: "Hotmart Academy",
      image: "/learning/Certificate5.png",
      year: "2025"
    }
  ];

  // Duplicar certificados para scroll infinito
  const infiniteCertificates = [...certificates, ...certificates, ...certificates];

  // Auto-scroll infinito compatible con iOS
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let intervalId;
    let animationId;
    const scrollSpeed = 1; // Aumentar velocidad para iOS
    
    // Detectar iOS específicamente
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const autoScroll = () => {
      if (!isScrolling && autoScrollEnabled && container) {
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth / 3;
        
        // Reset cuando llega al final del segundo conjunto
        if (currentScroll >= maxScroll * 2) {
          container.scrollLeft = maxScroll;
          return;
        }
        
        // Para iOS usar una aproximación más directa
        if (isIOS) {
          container.scrollLeft = currentScroll + scrollSpeed;
        } else {
          // Para otros dispositivos usar scrollBy
          container.scrollBy({
            left: scrollSpeed,
            behavior: 'auto'
          });
        }
      }
    };

    // Usar setInterval para iOS (más confiable que setTimeout recursivo)
    if (isIOS) {
      intervalId = setInterval(autoScroll, 16); // ~60fps
    } else if (isMobile) {
      // Usar setTimeout para otros móviles
      const timeoutScroll = () => {
        autoScroll();
        if (!isScrolling && autoScrollEnabled) {
          setTimeout(timeoutScroll, 16);
        }
      };
      setTimeout(timeoutScroll, 16);
    } else {
      // requestAnimationFrame para desktop
      const rafScroll = () => {
        autoScroll();
        if (!isScrolling && autoScrollEnabled) {
          animationId = requestAnimationFrame(rafScroll);
        }
      };
      animationId = requestAnimationFrame(rafScroll);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScrolling, autoScrollEnabled]);

  const handleMouseEnter = () => {
    setIsScrolling(true);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  const handleTouchStart = () => {
    setIsScrolling(true);
  };

  const handleTouchEnd = () => {
    // Resumir después de menos tiempo en iOS
    const resumeDelay = isIOS ? 500 : 1000;
    setTimeout(() => {
      setIsScrolling(false);
    }, resumeDelay);
  };

  // Función para inicializar scroll en iOS después de primera interacción
  const handleFirstTouch = () => {
    if (isIOS && autoScrollEnabled) {
      // Forzar una pequeña interacción para "despertar" el scroll
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft += 1;
        container.scrollLeft -= 1;
      }
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsScrolling(true);
    const scrollAmount = 320; // Ancho de una tarjeta + gap
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Resumir auto-scroll después de 2 segundos
    setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  };

  const toggleAutoScroll = () => {
    setAutoScrollEnabled(!autoScrollEnabled);
  };

  return (
    <section id="aprendizaje" className="relative py-20 px-4 bg-muted/20 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header - Con animación de aparición */}
        <div className="text-center mb-12 opacity-100 transform translate-y-0 transition-all duration-700">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-primary/10 hover:scale-110 text-primary opacity-80 hover:opacity-100"
            aria-label="Anterior certificado"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Botón Derecho */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-primary/10 hover:scale-110 text-primary opacity-80 hover:opacity-100"
            aria-label="Siguiente certificado"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carrusel de Certificados Infinito */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => {
              handleFirstTouch();
              handleTouchStart();
            }}
            onTouchEnd={handleTouchEnd}
            onClick={handleFirstTouch}
            className="flex gap-6 overflow-x-auto scroll-smooth px-16 pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              // Forzar aceleración de hardware en iOS
              transform: 'translateZ(0)',
              willChange: 'scroll-position'
            }}
          >
            {infiniteCertificates.map((cert, index) => (
              <div
                key={`${cert.id}-${index}`}
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

          {/* Indicador de scroll automático clickeable */}
          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              onClick={toggleAutoScroll}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground hover:bg-background/90 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                autoScrollEnabled 
                  ? 'bg-primary animate-pulse' 
                  : 'bg-red-500'
              }`} />
              <span className="font-medium">
                {autoScrollEnabled ? 'Scroll automático activo' : 'Scroll automático pausado'}
              </span>
              <span className="text-[10px] opacity-70 hidden sm:inline">
                (Click para {autoScrollEnabled ? 'pausar' : 'reanudar'})
              </span>
              <span className="text-[10px] opacity-70 sm:hidden">
                (Toca para {autoScrollEnabled ? 'pausar' : 'reanudar'})
              </span>
            </button>
            
            {/* Debug info para iOS */}
            {isIOS && (
              <div className="text-[10px] text-muted-foreground/70 bg-orange-500/10 px-2 py-1 rounded">
                iOS detectado - Modo optimizado activo
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
