import { AnimatePresence, motion } from "framer-motion";
import { RuralitMark } from "./RuralitMark";
import { Odometer } from "../Odometer";

const ease = [0.2, 0, 0.2, 1];
const PHASES = { dawn: "Amanecer", morning: "Mañana", noon: "Mediodía", afternoon: "Tarde", dusk: "Atardecer", night: "Noche" };

// Ruralit's index is a field clock: scrolling through the app is a day passing over the campo.
export function RuralitIndex({ chapters, index, p, opacity, interactive, onSelect }) {
  const day = (index + p) / chapters.length;
  const minutes = Math.round(360 + day * 960);
  const clock = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const sunT = Math.min(1, day / 0.86);
  const night = day >= 0.86;
  const sunX = 32 - 26 * Math.cos(Math.PI * sunT);
  const sunY = 30 - 24 * Math.sin(Math.PI * sunT);
  const sky = chapters[index].sky;

  return (
    <motion.nav className="rt-index" style={{ opacity, pointerEvents: interactive ? "auto" : "none" }} aria-label="Índice de Ruralit">
      <RuralitMark className="rt-index-mark" />
      <svg className="rt-index-arc" viewBox="0 0 64 36" aria-hidden="true">
        <path d="M6 30A26 24 0 0 1 58 30" />
        <path d="M6 30A26 24 0 0 1 58 30" pathLength="1" className="rt-index-trail" style={{ strokeDashoffset: 1 - sunT }} />
        <path d="M2 30.5h60" className="rt-index-horizon" />
        {night ? (
          <path className="rt-index-moon" d="M50 4a7 7 0 1 0 6.8 8.6A5.4 5.4 0 0 1 50 4Z" />
        ) : (
          <circle cx={sunX} cy={sunY} r="4.5" />
        )}
      </svg>
      <p className="rt-index-clock"><Odometer text={clock} /><span className="sr-only">{clock}</span></p>
      <p className="rt-index-phase">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={sky} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-110%", opacity: 0 }} transition={{ duration: 0.45, ease }}>
            {PHASES[sky]}
          </motion.span>
        </AnimatePresence>
      </p>
      <ol>
        <span className="rt-index-fence" aria-hidden="true"><i style={{ transform: `scaleY(${day})` }} /></span>
        {chapters.map(({ id, label, Icon }, position) => (
          <li key={id}>
            <button type="button" aria-label={label} aria-current={position === index ? "page" : undefined} className={position < index ? "is-past" : ""} onClick={() => onSelect(position)}>
              {position === index && (
                <motion.span layoutId="rt-index-active" className="rt-index-active" transition={{ type: "spring", duration: 0.45, bounce: 0 }}>
                  <i style={{ transform: `scaleY(${0.25 + 0.75 * p})` }} />
                </motion.span>
              )}
              <Icon size={17} />
              <span className="rt-index-tip" aria-hidden="true">{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}
