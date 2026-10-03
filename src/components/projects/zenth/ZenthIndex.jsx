import { motion } from "framer-motion";
import { Odometer } from "../Odometer";

// A minimal timeline: the chapter counter, its name and a thin rail of stops. No card: it takes
// the theme's ink, so it reads the same on light, Zen, focus, call and night scenes.
export function ZenthIndex({ chapters, index, p, opacity, interactive, onSelect }) {
  return (
    <motion.nav className="story-rail zn-rail" style={{ opacity, pointerEvents: interactive ? "auto" : "none" }} aria-label="Índice de Zenth">
      <p className="story-rail-clock">
        <Odometer text={String(index + 1).padStart(2, "0")} />
        <small>/ {String(chapters.length).padStart(2, "0")}</small>
      </p>
      <p className="story-rail-label">{chapters[index].label}</p>
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
