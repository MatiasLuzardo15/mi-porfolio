import { motion } from "framer-motion";
import { Odometer } from "../Odometer";

const PHASES = { dawn: "Amanecer", morning: "Mañana", noon: "Mediodía", afternoon: "Tarde", dusk: "Atardecer", night: "Noche" };

// A minimal timeline that belongs to the sky: the sun's small arc, the day's clock and a thin rail.
// No card: it takes the scene's ink so it reads on dawn, noon and night alike.
export function RuralitIndex({ chapters, index, p, opacity, interactive, onSelect }) {
  const day = (index + p) / chapters.length;
  const minutes = Math.round(360 + day * 960);
  const clock = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const sunT = Math.min(1, day / 0.86);
  const night = day >= 0.86;
  const sunX = 32 - 26 * Math.cos(Math.PI * sunT);
  const sunY = 30 - 24 * Math.sin(Math.PI * sunT);

  return (
    <motion.nav className="story-rail rt-rail" style={{ opacity, pointerEvents: interactive ? "auto" : "none" }} aria-label="Índice de Ruralit">
      <svg className="rt-rail-sun" viewBox="0 0 64 34" aria-hidden="true">
        <path d="M6 30A26 24 0 0 1 58 30" className="is-track" />
        <path d="M6 30A26 24 0 0 1 58 30" pathLength="1" className="is-trail" style={{ strokeDashoffset: 1 - sunT }} />
        {night ? <path className="is-moon" d="M50 4a7 7 0 1 0 6.8 8.6A5.4 5.4 0 0 1 50 4Z" /> : <circle cx={sunX} cy={sunY} r="3.6" className="is-sun" />}
      </svg>
      <p className="story-rail-clock"><Odometer text={clock} /><span className="sr-only">{clock}</span></p>
      <p className="story-rail-label">{PHASES[chapters[index].sky]}</p>
      <ol className="story-rail-track" style={{ "--fill": (index + p) / (chapters.length - 1 || 1) }}>
        {chapters.map(({ id, label }, position) => (
          <li key={id}>
            <button
              type="button"
              className={position < index ? "is-past" : position === index ? "is-current" : ""}
              aria-label={label}
              aria-current={position === index ? "page" : undefined}
              onClick={() => onSelect(position)}
            >
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}
