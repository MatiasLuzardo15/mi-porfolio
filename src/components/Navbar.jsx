import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileThemeToggle } from "./MobileThemeToggle";
import { NavbarThemeToggle } from "./NavbarThemeToggle";

const navItems = [
  { name: "Inicio", href: "#hero" },
  { name: "Proyectos", href: "#projects" },
  { name: "Acerca de", href: "#about" },
  { name: "Aprendizaje", href: "#aprendizaje" },
  { name: "Contacto", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar si ha hecho scroll
      setIsScrolled(currentScrollY > 10);
      
      // Determinar la dirección del scroll y visibilidad
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & not at top
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Scrolling up or near top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <nav
      className={cn(
        "fixed w-full z-40 transition-all duration-500 ease-in-out",
        // Visibilidad basada en scroll
        isVisible ? "translate-y-0" : "-translate-y-full",
        // Estilos de fondo con blur mejorado para móvil
        isScrolled 
          ? "py-3 bg-background/85 md:bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/20" 
          : "py-5",
        // Estilo flotante en móvil cuando está scrolled
        isScrolled && "md:mx-4 md:mt-4 md:rounded-2xl md:shadow-2xl"
      )}
    >
      <div className="container flex items-center justify-between">
        <a
          className="text-xl font-bold text-primary flex items-center"
          href="#hero"
        >
          <span className="relative z-10">
            <span className="text-glow text-foreground"> [ML]</span>{" "}
            Portfolio
          </span>
        </a>

        {/* desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, key) => (
            <a
              key={key}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              {item.name}
            </a>
          ))}
          {/* Theme toggle para desktop */}
          <NavbarThemeToggle />
        </div>

        {/* mobile nav button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-foreground z-50 relative hover:text-primary transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={cn(
            "fixed top-0 left-0 w-full h-screen bg-background/98 backdrop-blur-md z-50 flex flex-col items-center justify-center",
            "transition-all duration-300 md:hidden",
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col space-y-6 text-xl px-8 w-full max-w-sm">
            {navItems.map((item, key) => (
              <a
                key={key}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Separador */}
            <div className="border-t border-border my-4"></div>
            
            {/* Toggle de tema para móvil */}
            <MobileThemeToggle 
              onClick={() => setIsMenuOpen(false)}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
