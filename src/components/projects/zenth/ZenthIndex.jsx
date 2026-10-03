import { AnimatePresence, motion } from "framer-motion";
import { ZENTH_PIECES } from "./ZenthIcons";
import { ramp } from "../timeline";
import { Odometer } from "../Odometer";

const ease = [0.23, 1, 0.32, 1];

// Zenth's index: the official mark comes apart and locks again on every chapter,
// the ring fills with the whole tour and the counter rolls.
export function ZenthIndex({ chapters, index, p, overall, opacity, interactive, onSelect }) {
  const spread = 1 - ramp(p, 0, 0.34);
  const current = chapters[index];

  return (
    <motion.nav className="zn-index" style={{ opacity, pointerEvents: interactive ? "auto" : "none" }} aria-label="Índice de Zenth">
      <div className="zn-index-head" aria-hidden="true">
        <svg className="zn-index-ring" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" />
          <motion.circle cx="32" cy="32" r="29" style={{ pathLength: overall }} />
        </svg>
        <svg className="zn-index-mark" viewBox="0 0 2000 2000">
          {ZENTH_PIECES.map((piece) => (
            <path
              key={piece.d}
              d={piece.d}
              style={{ transform: `translate(${piece.from.x * 0.42 * spread}px, ${piece.from.y * 0.42 * spread}px) rotate(${piece.from.rotate * spread}deg)`, transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))}
        </svg>
      </div>

      <p className="zn-index-count">
        <Odometer text={String(index + 1).padStart(2, "0")} />
        <span>/ {String(chapters.length).padStart(2, "0")}</span>
      </p>
      <p className="zn-index-label" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={current.id} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-110%", opacity: 0 }} transition={{ duration: 0.5, ease }}>
            {current.label}
          </motion.span>
        </AnimatePresence>
      </p>

      <ol>
        <span className="zn-index-rail" aria-hidden="true"><i style={{ transform: `scaleY(${(index + p) / chapters.length})` }} /></span>
        {chapters.map(({ id, label, Icon }, position) => (
          <li key={id}>
            <button type="button" aria-label={label} aria-current={position === index} className={position < index ? "is-past" : ""} onClick={() => onSelect(position)}>
              {position === index && <motion.span layoutId="zn-index-active" className="zn-index-active" transition={{ type: "spring", duration: 0.5, bounce: 0 }} />}
              {position === index && (
                <svg className="zn-index-progress" viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="20" pathLength="1" style={{ strokeDashoffset: 1 - p }} />
                </svg>
              )}
              <Icon size={16} />
              <span className="zn-index-tip" aria-hidden="true"><small>{String(position + 1).padStart(2, "0")}</small>{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}
