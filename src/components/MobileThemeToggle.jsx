import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export const MobileThemeToggle = ({ onClick, className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleClick = () => {
    toggleTheme();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-3 p-3 rounded-xl transition-all duration-300",
        "bg-background/60 hover:bg-background/90 border border-border/30",
        "hover:border-border hover:scale-105 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "backdrop-blur-sm w-full",
        className
      )}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDarkMode ? (
        <>
          <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300" />
          <span className="text-foreground font-medium">Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-300" />
          <span className="text-foreground font-medium">Modo Oscuro</span>
        </>
      )}
    </button>
  );
};