// The page chrome that replaces the old navbar. Top left, a signature whose mark and line change
// with the scene on screen (the avatar, the Zenth or Ruralit mark, the tool on stage, the work in
// the museum). Top right, the section counter with the page's progress; it opens a full index.
// Each side reads the colour painted under it and switches between light and dark ink.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { useSceneDetails } from "./sceneStore";
import { useBackdropTone } from "./useBackdropTone";
import { glideTo } from "../projects/glide";
import { Odometer } from "../projects/Odometer";
import { ZenthMark } from "../projects/zenth/ZenthIcons";
import { RuralitMark } from "../projects/ruralit/RuralitMark";
import "./chrome.css";

export const SECTIONS = [
  { id: "hero", name: "Inicio", detail: "Desarrollador web · Uruguay" },
  { id: "about", name: "Perfil", detail: "Sobre mí" },
  { id: "projects", name: "Proyectos", detail: "Archivo digital" },
  { id: "skills", name: "Herramientas", detail: "El sistema detrás del resultado", offset: 0.15 },
  { id: "aprendizaje", name: "Formación", detail: "Exposición permanente", offset: 0.6 },
  { id: "contact", name: "Contacto", detail: "Florida · Uruguay", offset: 1.6 },
];

const TOOL_MARKS = {
  react: { text: "Re", bg: "#61dafb", ink: "#08151a" },
  typescript: { text: "TS", bg: "#3178c6", ink: "#fff" },
  tailwind: { text: "Tw", bg: "#38bdf8", ink: "#0b1120" },
  supabase: { text: "Sb", bg: "#3ecf8e", ink: "#111" },
  node: { text: "N", bg: "#8cc84b", ink: "#0b170d" },
  figma: { text: "Fg", bg: "#a259ff", ink: "#fff" },
  git: { text: "Git", bg: "#f78166", ink: "#0d1117" },
};

const Mark = ({ mark }) => {
  const [kind, value] = (mark ?? "avatar").split(":");
  if (kind === "zenth") return <span className="sc-mark is-zenth"><ZenthMark /></span>;
  if (kind === "ruralit") return <span className="sc-mark is-ruralit"><RuralitMark /></span>;
  if (kind === "tool" && TOOL_MARKS[value]) {
    const tool = TOOL_MARKS[value];
    return <span className="sc-mark is-text" style={{ background: tool.bg, color: tool.ink }}>{tool.text}</span>;
  }
  if (kind === "frame") return <span className="sc-mark is-frame"><span>{value}</span></span>;
  if (kind === "plane") return <span className="sc-mark is-text is-light">@</span>;
  return <span className="sc-mark is-avatar"><img src="/images/favicon.png?v=2" alt="" /></span>;
};

const flip = { initial: { rotateY: -90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: 90, opacity: 0 } };
const roll = { initial: { y: "100%", opacity: 0 }, animate: { y: "0%", opacity: 1 }, exit: { y: "-100%", opacity: 0 } };
const ease = [0.23, 1, 0.32, 1];

export const SiteChrome = () => {
  const reduceMotion = useReducedMotion();
  const details = useSceneDetails();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const cancelGlide = useRef(null);
  const firstLink = useRef(null);
  const menuButton = useRef(null);
  // Sample under the signature line and under the counter.
  const [leftTone, rightTone] = useBackdropTone([[150, 44], [-90, 42]]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const marker = window.innerHeight * 0.5;
      let current = 0;
      SECTIONS.forEach((section, index) => {
        const node = document.getElementById(section.id);
        if (node && node.getBoundingClientRect().top <= marker) current = index;
      });
      setActive(current);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => () => cancelGlide.current?.(), []);

  const go = useCallback((id) => {
    const node = document.getElementById(id);
    setOpen(false);
    if (!node) return;
    cancelGlide.current?.();
    // Land where each scene reads best: the lights on in the museum, the form built in contact.
    const offset = SECTIONS.find((item) => item.id === id)?.offset ?? 0;
    const target = id === "hero" ? 0 : node.getBoundingClientRect().top + window.scrollY + window.innerHeight * offset;
    cancelGlide.current = glideTo(Math.min(target, document.documentElement.scrollHeight - window.innerHeight), reduceMotion);
  }, [reduceMotion]);

  // The index takes over the page while open: Escape closes it and focus comes back.
  useEffect(() => {
    if (!open) return undefined;
    const button = menuButton.current;
    firstLink.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const section = SECTIONS[active];
  const live = details[section.id];
  const detail = live?.detail ?? section.detail;
  const mark = live?.mark ?? "avatar";

  return (
    <header className={`site-chrome${open ? " is-open" : ""}`} data-left={open ? "dark" : leftTone} data-right={open ? "dark" : rightTone}>
      <a
        href="#hero"
        className="sc-sign"
        aria-label={`Matías Luzardo. Ahora: ${section.name}, ${detail}. Volver al inicio`}
        onClick={(event) => { event.preventDefault(); go("hero"); }}
      >
        <span className="sc-mark-slot" aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={mark} className="sc-mark-face" {...flip} transition={{ duration: reduceMotion ? 0 : 0.45, ease }}>
              <Mark mark={mark} />
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="sc-text" aria-hidden="true">
          <strong>Matías Luzardo</strong>
          <span className="sc-roll">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={`${section.name}${detail}`} {...roll} transition={{ duration: reduceMotion ? 0 : 0.4, ease }}>
                <b>{section.name}</b> {detail}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </a>

      <button
        ref={menuButton}
        type="button"
        className="sc-menu"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="site-index"
        aria-label={open ? "Cerrar índice" : `Abrir índice. Sección ${active + 1} de ${SECTIONS.length}: ${section.name}`}
      >
        <span className="sc-menu-count" aria-hidden="true">
          <Odometer text={String(active + 1).padStart(2, "0")} />
          <small>/ {String(SECTIONS.length).padStart(2, "0")}</small>
        </span>
        <span className="sc-menu-name" aria-hidden="true">{open ? "Cerrar" : section.name}</span>
        <svg className="sc-ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="16" className="is-track" />
          <circle cx="18" cy="18" r="16" className="is-fill" pathLength="1" style={{ strokeDashoffset: 1 - progress }} />
          {open ? <path d="M13 13l10 10M23 13 13 23" /> : <path d="M12 15h12M12 21h12" />}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-index"
            className="sc-index"
            aria-label="Índice del portfolio"
            initial={{ clipPath: "circle(0% at 96% 5%)" }}
            animate={{ clipPath: "circle(150% at 96% 5%)" }}
            exit={{ clipPath: "circle(0% at 96% 5%)" }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
          >
            <ol>
              {SECTIONS.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.12 + index * 0.05, ease }}
                >
                  <a
                    ref={index === 0 ? firstLink : undefined}
                    href={`#${item.id}`}
                    className={index === active ? "is-current" : ""}
                    aria-current={index === active ? "location" : undefined}
                    onClick={(event) => { event.preventDefault(); go(item.id); }}
                  >
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <strong>{item.name}</strong>
                    <span>{details[item.id]?.detail ?? item.detail}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <footer>
              <a href="https://github.com/MatiasLuzardo15" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
              <a href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
              <a href="#contact" onClick={(event) => { event.preventDefault(); go("contact"); }}>Hablemos <ArrowUpRight size={14} /></a>
            </footer>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
