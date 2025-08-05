import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Comprobar localStorage primero
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    
    // Si no hay preferencia guardada, usar la del sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases de tema existentes
    root.classList.remove("light", "dark");
    
    // Aplicar el tema actual
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
};