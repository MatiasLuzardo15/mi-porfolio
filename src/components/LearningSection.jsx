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
            
            {/* Control deslizante horizontal para móviles */}
            {(isIOS || isAndroid) && (
              <div className="flex flex-col items-center gap-3 mt-6">
                <div className="relative w-52 h-10">
                  {/* Pista del slider mejorada */}
                  <div className="absolute top-1/2 left-2 right-2 h-1.5 bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/30 to-muted-foreground/20 rounded-full transform -translate-y-1/2 shadow-inner" />
                  
                  {/* Marcas de posición mejoradas */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-3 bg-muted-foreground/50 rounded-full shadow-sm"
                      style={{
                        left: `${8 + (i / 4) * 84}%`,
                        top: '50%',
                        transform: 'translateX(-50%) translateY(-50%)'
                      }}
                    />
                  ))}
                  
                  {/* Control deslizante mejorado */}
                  <div 
                    className="absolute w-8 h-8 bg-gradient-to-b from-background to-background/90 border-2 border-primary/80 rounded-full cursor-pointer transform -translate-y-1/2 transition-all duration-200 hover:scale-110 active:scale-95 hover:border-primary active:shadow-lg"
                    style={{
                      left: '8%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const rect = e.currentTarget.parentElement.getBoundingClientRect();
                      e.currentTarget.dataset.startX = touch.clientX;
                      e.currentTarget.dataset.startLeft = touch.clientX - rect.left;
                      e.currentTarget.dataset.lastScroll = scrollContainerRef.current?.scrollLeft || 0;
                      e.currentTarget.style.transition = 'none';
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const rect = e.currentTarget.parentElement.getBoundingClientRect();
                      const startX = parseFloat(e.currentTarget.dataset.startX);
                      const startLeft = parseFloat(e.currentTarget.dataset.startLeft);
                      
                      // Calcular nueva posición del slider con márgenes
                      const deltaX = touch.clientX - startX;
                      const sliderWidth = rect.width - 32; // Restar márgenes
                      const newLeft = Math.max(16, Math.min(rect.width - 16, startLeft + deltaX));
                      const percentage = (newLeft - 16) / sliderWidth;
                      
                      // Actualizar posición visual del slider
                      e.currentTarget.style.left = `${16 + percentage * sliderWidth}px`;
                      
                      // Calcular scroll de los certificados con suavizado
                      if (scrollContainerRef.current) {
                        const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.offsetWidth;
                        const targetScroll = percentage * maxScroll;
                        
                        // Scroll suavizado con interpolación
                        const currentScroll = scrollContainerRef.current.scrollLeft;
                        const smoothedScroll = currentScroll + (targetScroll - currentScroll) * 0.3;
                        scrollContainerRef.current.scrollLeft = smoothedScroll;
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transition = 'all 0.2s ease-out';
                    }}
                  >
                    {/* Centro del control mejorado */}
                    <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm" />
                    
                    {/* Anillo interior para efecto 3D */}
                    <div className="absolute top-1/2 left-1/2 w-5 h-5 border border-primary/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                {/* Texto explicativo minimalista */}
                <div className="text-[9px] text-muted-foreground/50 text-center">
                  Desliza para navegar
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
