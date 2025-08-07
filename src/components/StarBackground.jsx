import { useEffect, useState, useMemo } from "react";

export const StarBackground = () => {
  const [stars, setStars] = useState([]);

  // Memoizar el cálculo de estrellas para evitar recálculos innecesarios
  const starCount = useMemo(() => {
    if (typeof window === 'undefined') return 50; // SSR safety
    return Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 15000),
      100 // Límite máximo para mejor rendimiento
    );
  }, []);

  useEffect(() => {
    generateStars();

    // Debounce resize handler para mejor rendimiento
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(generateStars, 250);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [starCount]);

  const generateStars = () => {
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 2 + 1, // Tamaño reducido
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    setStars(newStars);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: star.size + "px",
            height: star.size + "px",
            left: star.x + "%",
            top: star.y + "%",
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};
