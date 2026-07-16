import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Inicio", href: "#hero", id: "hero" },
  { name: "Perfil", href: "#about", id: "about" },
  { name: "Proyectos", href: "#projects", id: "projects" },
  { name: "Habilidades", href: "#skills", id: "skills" },
  { name: "Formación", href: "#aprendizaje", id: "aprendizaje" },
  { name: "Contacto", href: "#contact", id: "contact" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animationFrame;

    const updateNavigation = () => {
      const marker = window.scrollY + window.innerHeight * 0.42;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let currentSection = navItems[0].id;

      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= marker) currentSection = item.id;
      });

      setActiveSection(currentSection);
      setScrollProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
      setIsScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className={`editorial-nav ${isScrolled ? "is-scrolled" : ""}`}>
      <a href="#hero" className="nav-signature" aria-label="Ir al inicio">
        <span className="identity-mark" aria-hidden="true">
          <b>M</b><b>L</b><i />
        </span>
        <span className="identity-copy">
          <strong>MATÍAS LUZARDO</strong>
          <small><span>WEB / PRODUCT</span><span>UY · 2026</span></small>
        </span>
      </a>

      <nav
        className="nav-rail"
        aria-label="Navegación principal"
        style={{ "--scroll-progress": scrollProgress }}
      >
        <span className="nav-rail-track" aria-hidden="true">
          <span className="nav-rail-progress" />
        </span>
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          const position = (index / (navItems.length - 1)) * 100;

          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? "is-active" : ""}
              aria-current={isActive ? "page" : undefined}
              style={{ "--rail-position": `${position}%` }}
            >
              <span className="nav-rail-label"><small>0{index + 1}</small>{item.name}</span>
              <span className="nav-rail-dot" aria-hidden="true" />
            </a>
          );
        })}
      </nav>

      <button
        className={`nav-menu-button ${isMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`mobile-panel ${isMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-panel-header">
          <span>NAVEGACIÓN / ÍNDICE</span>
          <small>ML—26</small>
        </div>
        {navItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={activeSection === item.id ? "is-active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="mobile-nav-index">0{index + 1}</span>
            <strong>{item.name}</strong>
            <ArrowUpRight size={17} strokeWidth={1.8} />
          </a>
        ))}
        <div className="mobile-panel-footer">
          <span>MATÍAS LUZARDO</span>
          <span>FLORIDA · UY</span>
        </div>
      </div>
    </header>
  );
};
