import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeIndicator = () => {
  const [show, setShow] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const theme = localStorage.getItem("theme");
      const isDarkMode = theme === "dark";
      setIsDark(isDarkMode);
      setShow(true);
      
      setTimeout(() => setShow(false), 2000);
    };

    window.addEventListener("storage", handleStorageChange);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const hasDark = document.documentElement.classList.contains("dark");
          if (hasDark !== isDark) {
            setIsDark(hasDark);
            setShow(true);
            setTimeout(() => setShow(false), 2000);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      observer.disconnect();
    };
  }, [isDark]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "bg-background/90 backdrop-blur-md border border-border rounded-full",
        "px-4 py-2 shadow-lg",
        "transition-all duration-300",
        "flex items-center gap-2",
        "md:hidden" // Solo mostrar en móvil
      )}
    >
      {isDark ? (
        <>
          <Moon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-foreground">Modo Oscuro</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-foreground">Modo Claro</span>
        </>
      )}
    </div>
  );
};
