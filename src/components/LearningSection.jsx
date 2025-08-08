import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const LearningSection = () => {
  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const animationRef = useRef(null);

  // Detectar dispositivos al montar el componente
  useEffect(() => {
    const iosDetection = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const androidDetection = /Android/.test(navigator.userAgent);
    setIsIOS(iosDetection);
    setIsAndroid(androidDetection);
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

  // Auto-scroll con manejo específico por dispositivo
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Limpiar cualquier timer existente
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    // Desactivar auto-scroll en dispositivos móviles
    if (isIOS || isAndroid) return;

    if (!autoScrollEnabled || isScrolling) return;

    const scrollSpeed = 1; // Velocidad estándar para desktop
    
    const autoScroll = () => {
      if (!autoScrollEnabled || isScrolling || !container) return;
      
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth / 3;
      
      // Reset cuando llega al final del segundo conjunto
      if (currentScroll >= maxScroll * 2) {
        container.scrollTo({
          left: maxScroll,
          behavior: 'auto'
        });
        return;
      }
      
      // Desktop: scrollBy con behavior
      container.scrollBy({
        left: scrollSpeed,
        behavior: 'auto'
      });
    };

    // Solo Desktop: requestAnimationFrame
    const desktopScroll = () => {
      autoScroll();
      if (autoScrollEnabled && !isScrolling) {
        animationRef.current = requestAnimationFrame(desktopScroll);
      }
    };
    animationRef.current = requestAnimationFrame(desktopScroll);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isScrolling, autoScrollEnabled, isIOS, isAndroid]);

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
    // Limpiar timers actuales inmediatamente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Cambiar el estado
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

          {/* Controles de navegación */}
          <div className="flex flex-col items-center gap-2 mt-6">
            {/* Controles para Desktop - Auto-scroll */}
            {!isIOS && !isAndroid && (
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
                <span className="text-[10px] opacity-70">
                  (Click para {autoScrollEnabled ? 'pausar' : 'reanudar'})
                </span>
              </button>
            )}
            
            {/* Scrollbar estilo perilla de volumen para móviles */}
            {(isIOS || isAndroid) && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <div className="relative w-64 h-12 bg-gradient-to-b from-muted/20 to-muted/40 rounded-lg border border-border/50 shadow-inner p-2">
                  {/* Canal principal de la scrollbar */}
                  <div className="relative w-full h-full">
                    {/* Pista principal con efecto hundido */}
                    <div className="absolute top-1/2 left-2 right-2 h-2 bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10 rounded-full transform -translate-y-1/2 shadow-inner border border-muted-foreground/20" />
                    
                    {/* Indicadores de graduación estilo audio */}
                    <div className="absolute top-0 left-2 right-2 flex justify-between">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-px bg-muted-foreground/40 ${i % 2 === 0 ? 'h-2' : 'h-1'}`} />
                          {i % 2 === 0 && (
                            <div className="text-[8px] text-muted-foreground/60 mt-0.5 font-mono">
                              {i}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Barra de progreso que sigue al thumb */}
                    <div 
                      className="absolute top-1/2 left-2 h-2 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full transform -translate-y-1/2 transition-all duration-100"
                      style={{ 
                        width: '20%', // Se actualiza dinámicamente
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                      }}
                      id="progress-bar"
                    />
                    
                    {/* Thumb estilo perilla profesional */}
                    <div 
                      className="absolute w-6 h-8 bg-gradient-to-b from-background via-background/95 to-background/90 border-2 border-primary/70 rounded-md cursor-pointer transform -translate-y-1/2 transition-all duration-150 hover:border-primary active:scale-95 shadow-lg"
                      style={{
                        left: '20%',
                        top: '50%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const rect = e.currentTarget.parentElement.getBoundingClientRect();
                        e.currentTarget.dataset.startX = touch.clientX;
                        e.currentTarget.dataset.startLeft = touch.clientX - rect.left;
                        e.currentTarget.style.transition = 'none';
                        
                        // Añadir feedback visual
                        e.currentTarget.style.transform = 'translateX(-50%) translateY(-50%) scale(0.98)';
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const rect = e.currentTarget.parentElement.getBoundingClientRect();
                        const startX = parseFloat(e.currentTarget.dataset.startX);
                        const startLeft = parseFloat(e.currentTarget.dataset.startLeft);
                        
                        // Calcular nueva posición con límites del canal
                        const deltaX = touch.clientX - startX;
                        const trackWidth = rect.width - 16; // Ancho del canal menos márgenes
                        const newLeft = Math.max(8, Math.min(rect.width - 8, startLeft + deltaX));
                        const percentage = (newLeft - 8) / trackWidth;
                        
                        // Actualizar posición del thumb
                        e.currentTarget.style.left = `${newLeft}px`;
                        
                        // Actualizar barra de progreso
                        const progressBar = document.getElementById('progress-bar');
                        if (progressBar) {
                          progressBar.style.width = `${percentage * (trackWidth)}px`;
                        }
                        
                        // Scroll suavizado de certificados
                        if (scrollContainerRef.current) {
                          const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.offsetWidth;
                          const targetScroll = percentage * maxScroll;
                          const currentScroll = scrollContainerRef.current.scrollLeft;
                          const smoothedScroll = currentScroll + (targetScroll - currentScroll) * 0.4;
                          scrollContainerRef.current.scrollLeft = smoothedScroll;
                        }
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.transition = 'all 0.15s ease-out';
                        e.currentTarget.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
                      }}
                    >
                      {/* Detalles del thumb estilo hardware */}
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-primary/60 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                      <div className="absolute top-1 left-1/2 w-3 h-px bg-primary/30 transform -translate-x-1/2" />
                      <div className="absolute bottom-1 left-1/2 w-3 h-px bg-primary/30 transform -translate-x-1/2" />
                    </div>
                  </div>
                </div>
                
                {/* Etiquetas estilo panel de audio */}
                <div className="flex items-center gap-2 text-[8px] text-muted-foreground/60 font-mono">
                  <span>MIN</span>
                  <div className="w-8 h-px bg-muted-foreground/30" />
                  <span>CERTIFICADOS</span>
                  <div className="w-8 h-px bg-muted-foreground/30" />
                  <span>MAX</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
