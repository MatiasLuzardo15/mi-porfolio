import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const certificates = [
  { id: 1, title: "Cybersecurity Essentials", institution: "Cisco Networking Academy", image: "/learning/Certificate1.png", year: "2024" },
  { id: 2, title: "Introducción a Jenkins", institution: "The Linux Foundation", image: "/learning/Certificate2.png", year: "2024" },
  { id: 3, title: "Redes, Seguridad y Automatización", institution: "Cisco Networking Academy", image: "/learning/Certificate3.png", year: "2023" },
  { id: 4, title: "Introducción a la Ciberseguridad", institution: "Cisco Networking Academy", image: "/learning/Certificate4.png", year: "2024" },
  { id: 5, title: "Escala tu negocio digital", institution: "Hotmart Academy", image: "/learning/Certificate5.png", year: "2025" },
  { id: 6, title: "English Grammar Mastery", institution: "Udemy", image: "/learning/Certificate6.png", year: "2025" },
  { id: 7, title: "Essential Photoshop Course", institution: "Udemy", image: "/learning/Certificate7.png", year: "2025" },
  { id: 8, title: "Technical Support Fundamentals", institution: "Coursera", image: "/learning/Certificate8.png", year: "2026", certificateLink: "https://www.coursera.org/account/accomplishments/verify/JE121XW3RVV8" },
];

const loopedCertificates = Array.from({ length: 3 }, (_, copy) =>
  certificates.map((certificate) => ({ ...certificate, copy }))
).flat();

export const LearningSection = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = selectedCertificate ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedCertificate]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const positionInMiddleCopy = () => {
      const setWidth = carousel.scrollWidth / 3;
      if (setWidth && carousel.scrollLeft < setWidth * 0.5) carousel.scrollLeft = setWidth;
    };

    const initialFrame = requestAnimationFrame(positionInMiddleCopy);
    if (reducedMotion || isPaused) return () => cancelAnimationFrame(initialFrame);

    let animationFrame;
    let previousTime;
    let virtualPosition;
    const animate = (time) => {
      const setWidth = carousel.scrollWidth / 3;
      if (!previousTime) previousTime = time;
      if (virtualPosition === undefined) virtualPosition = carousel.scrollLeft;
      const delta = Math.min(time - previousTime, 32);
      previousTime = time;
      virtualPosition += delta * 0.028;
      if (setWidth && virtualPosition >= setWidth * 2) virtualPosition -= setWidth;
      carousel.scrollLeft = virtualPosition;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(initialFrame);
      cancelAnimationFrame(animationFrame);
    };
  }, [isPaused]);

  useEffect(() => () => clearTimeout(resumeTimeoutRef.current), []);

  const keepLoopCentered = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const setWidth = carousel.scrollWidth / 3;
    if (!setWidth) return;
    if (carousel.scrollLeft >= setWidth * 2) carousel.scrollLeft -= setWidth;
    if (carousel.scrollLeft <= 1) carousel.scrollLeft += setWidth;
  };

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setIsPaused(true);
    carousel.scrollBy({ left: direction * Math.min(carousel.clientWidth * 0.78, 420), behavior: "smooth" });
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 1800);
  };

  return (
    <section id="aprendizaje" className="section-block learning-editorial">
      <div className="section-kicker">
        <span>04 / APRENDIZAJE</span>
        <span>SIEMPRE EN MOVIMIENTO</span>
      </div>
      <div className="learning-heading">
        <p className="eyebrow"><i /> FORMACIÓN CONTINUA</p>
        <h2>Curiosidad aplicada.<br /><em>Conocimiento en progreso.</em></h2>
        <p>Certificaciones que complementan mi formación y amplían mi forma de resolver problemas.</p>
      </div>

      <div
        ref={carouselRef}
        className="certificate-strip"
        onScroll={keepLoopCentered}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          clearTimeout(resumeTimeoutRef.current);
          resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 1400);
        }}
        aria-label="Certificados en movimiento continuo"
      >
        {loopedCertificates.map((certificate) => (
          <button
            key={`${certificate.copy}-${certificate.id}`}
            className="certificate-card"
            onClick={() => setSelectedCertificate(certificate)}
            tabIndex={certificate.copy === 1 ? 0 : -1}
            aria-hidden={certificate.copy === 1 ? undefined : true}
          >
            <img src={certificate.image} alt="" loading="lazy" />
            <span className="certificate-year">{certificate.year}</span>
            <span className="certificate-info">
              <small>{certificate.institution}</small>
              <strong>{certificate.title}</strong>
              <em>Ver certificado <ArrowUpRight size={14} /></em>
            </span>
          </button>
        ))}
      </div>

      <div className="certificate-controls" aria-label="Controles del carrusel">
        <span className="control-index">01</span>
        <div className="certificate-progress"><i className={isPaused ? "is-paused" : ""} /></div>
        <span className="control-index">08</span>
        <div className="certificate-buttons">
          <button onClick={() => moveCarousel(-1)} aria-label="Certificado anterior"><ChevronLeft size={16} /></button>
          <button onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}>
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button onClick={() => moveCarousel(1)} aria-label="Siguiente certificado"><ChevronRight size={16} /></button>
        </div>
      </div>

      {selectedCertificate && (
        <div className="certificate-modal" role="dialog" aria-modal="true" aria-label={selectedCertificate.title} onClick={() => setSelectedCertificate(null)}>
          <div className="certificate-modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCertificate(null)} aria-label="Cerrar"><X size={18} /></button>
            <img src={selectedCertificate.image} alt={selectedCertificate.title} />
            <div>
              <span>{selectedCertificate.institution} · {selectedCertificate.year}</span>
              <h3>{selectedCertificate.title}</h3>
              {selectedCertificate.certificateLink && <a href={selectedCertificate.certificateLink} target="_blank" rel="noreferrer">Ver credencial <ArrowUpRight size={15} /></a>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
