import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export const NavbarThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2.5 rounded-lg transition-all duration-300",
        "bg-background/60 hover:bg-background/90 border border-border/30",
        "hover:border-border hover:scale-105 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "backdrop-blur-sm"
      )}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-yellow-400 transition-all duration-300 hover:rotate-180 hover:scale-110" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:rotate-12 hover:scale-110" />
      )}
    </button>
  );
};
