import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "@fontsource-variable/inter-tight";
import "./ruralit.css";
import "./ruralit-story.css";
import "./ruralit-fx.css";
import "./ruralit-beats.css";
import "./ruralit-land.css";
import { RT_CHAPTERS, RURALIT_BEATS } from "./RuralitStory";
import { RURALIT_LAND } from "./RuralitLand";
import { RuralitIndex } from "./RuralitIndex";
import { LEAF, RT_PATHS, RuralitMark, VEINS } from "./RuralitMark";
import { TIMELINE, beat, chapterAt, chapterRest, sceneEnd } from "../timeline";
import { publishScene } from "../../chrome/sceneStore";

const ease = [0.2, 0, 0.2, 1];

// Copy from ruralia/src/components/FirstUseTutorial.tsx
const COPY = {
  inicio: { title: "Escribí como hablás en el campo", description: "Ingresá monto, moneda, concepto y cantidad en una sola frase. El micrófono permite dictarlo sin usar el teclado." },
  libreta: { title: "La historia completa de tu campo", description: "Esta sección reúne ingresos y gastos, con sus fechas, monedas, categorías, impuestos y notas." },
  stock: { title: "Qué hay y cuánto queda", description: "Controlá animales, cultivos, insumos, maquinaria y otros recursos con su unidad base y stock mínimo." },
  balance: { title: "La marcha económica del establecimiento", description: "Transforma los movimientos registrados en saldos, márgenes, comparaciones y señales de rentabilidad." },
  proyectos: { title: "Separá cada trabajo o inversión", description: "Agrupá costos, ingresos, tareas, metas y activos para medir un proyecto sin mezclarlo con el resto del campo." },
  reportes: { title: "Prepará información para compartir", description: "Generá informes financieros, de inventario, proyectos o ejercicios cerrados sin alterar los datos originales." },
};

const RS = TIMELINE.ruralit.introStart;
const START = TIMELINE.ruralit.start;
const END = sceneEnd("ruralit");

export function RuralitScene({ u, onNavigate, active }) {
  const reduceMotion = useReducedMotion();
  const [chapter, setChapter] = useState(() => ({ index: 0, p: 0 }));
  // Scroll drives the story directly: chapter.p is scroll progress, playhead the story beat.
  const playhead = beat(chapter.p);
  const [interactive, setInteractive] = useState(false);
  const current = RT_CHAPTERS[chapter.index];
  const copy = COPY[current.id];
  const Beat = RURALIT_BEATS[current.id];
  const LandBeat = RURALIT_LAND[current.id];

  const sync = useCallback((value) => {
    const next = chapterAt("ruralit", value);
    const p = Math.round(next.progress * 500) / 500;
    setChapter((prev) => (prev.index === next.index && prev.p === p ? prev : { index: next.index, p }));
    const live = value > RS + 0.9 && value < END + 0.1;
    setInteractive((prev) => (prev === live ? prev : live));
  }, []);
  useMotionValueEvent(u, "change", sync);
  // The page chrome follows the chapter while the app is on stage.
  // Only the app that owns the stage speaks for the section, so the two never overwrite each other.
  useEffect(() => {
    if (active) publishScene("projects", { detail: interactive ? `Ruralit · ${current.label}` : "Ruralit", mark: "ruralit" });
  }, [active, interactive, current.label]);
  useEffect(() => {
    const id = requestAnimationFrame(() => sync(u.get()));
    return () => cancelAnimationFrame(id);
  }, [u, sync]);

  // Dawn: the field rises, the mark is drawn stroke by stroke and the leaf opens.
  const sceneOpacity = useTransform(u, [RS, RS + 0.2], [0, 1]);
  const fieldY = useTransform(u, [RS + 0.06, RS + 0.5], ["100%", "0%"]);
  const drawR = useTransform(u, [RS + 0.16, RS + 0.4], [0, 1]);
  const drawT = useTransform(u, [RS + 0.24, RS + 0.5], [0, 1]);
  const drawBar = useTransform(u, [RS + 0.36, RS + 0.54], [0, 1]);
  const leaf = useTransform(u, [RS + 0.52, RS + 0.62], [0, 1]);
  const leafRotate = useTransform(u, [RS + 0.52, RS + 0.64], [-40, 0]);
  const introOpacity = useTransform(u, [RS + 0.14, RS + 0.28, RS + 0.8, RS + 0.92], [0, 1, 1, 0]);
  const introScale = useTransform(u, [RS + 0.8, RS + 0.94], [1, reduceMotion ? 1 : 0.7]);
  const introY = useTransform(u, [RS + 0.8, RS + 0.94], [0, -70]);
  const layoutOpacity = useTransform(u, [RS + 0.86, RS + 1.12, END, END + 0.2], [0, 1, 1, 0]);
  const stageY = useTransform(u, [RS + 0.86, RS + 1.16, END, END + 0.28], [170, 0, 0, -150]);
  const stageScale = useTransform(u, [RS + 0.86, RS + 1.16], [0.86, 1]);
  const copyY = useTransform(u, [RS + 0.9, RS + 1.16, END, END + 0.24], [56, 0, 0, -70]);
  const copyBlur = useTransform(u, [RS + 0.9, RS + 1.12, END + 0.02, END + 0.2], [10, 0, 0, 8]);
  const copyFilter = useMotionTemplate`blur(${copyBlur}px)`;
  const night = useTransform(u, [END + 0.06, END + 0.42], [0, 1]);
  const visibility = useTransform(u, (value) => (value < RS - 0.1 || value > END + 0.6 ? "hidden" : "visible"));

  // The sun crosses the sky continuously while you scroll through the app.
  const day = useTransform(u, [START, END], [0, 1]);
  const sunX = useTransform(day, (value) => `${8 + Math.min(1, value / 0.86) * 84}vw`);
  const sunY = useTransform(day, (value) => `${value >= 0.86 ? 90 : 62 - Math.sin(Math.PI * Math.min(1, value / 0.86)) * 54}vh`);
  const sunOpacity = useTransform(day, [0, 0.8, 0.88], [1, 1, 0]);

  const indexOpacity = useTransform(u, [RS + 0.12, RS + 0.34, END, END + 0.2], [0, 1, 1, 0]);

  const goTo = (id) => onNavigate(chapterRest("ruralit", RT_CHAPTERS.findIndex((item) => item.id === id)));

  return (
    <motion.div className="rt story-scene" data-sky={current.sky} style={{ opacity: sceneOpacity, visibility }}>
      <div className="rt-sky" aria-hidden="true" />
      <motion.div className="rt-stars" aria-hidden="true" animate={{ opacity: current.sky === "night" ? 1 : 0 }} transition={{ duration: 1.4 }} />
      <motion.div className="rt-sun" aria-hidden="true" style={{ x: sunX, y: sunY, opacity: sunOpacity }} />
      <motion.div className="rt-field" style={{ y: fieldY }} aria-hidden="true">
        <img src="/projects/ruralit-campo.webp" alt="" loading="lazy" decoding="async" />
      </motion.div>

      <motion.div className="rt-intro" style={{ opacity: introOpacity, scale: introScale, y: introY }} aria-hidden="true">
        <svg viewBox="300 220 1330 1480">
          <g fill="none" stroke="#2b3e2c" strokeWidth="136">
            <motion.path d={RT_PATHS.r} style={{ pathLength: drawR }} />
            <motion.path d={RT_PATHS.t} style={{ pathLength: drawT }} />
            <motion.path d={RT_PATHS.bar} style={{ pathLength: drawBar }} />
          </g>
          <motion.g style={{ scale: leaf, rotate: leafRotate, transformOrigin: "center", transformBox: "fill-box" }}>
            <path d={LEAF} fill="#c3ff73" />
            <g stroke="#005c2e" strokeWidth="9" strokeLinecap="round">{VEINS.map((d) => <path key={d} d={d} />)}</g>
          </motion.g>
        </svg>
        <div className="rt-intro-copy">
          <span>Tu libreta digital para el campo.</span>
        </div>
      </motion.div>

      {/* Large screens: the story happens on the land itself, around the copy. */}
      <motion.div className="rs-land" style={{ opacity: layoutOpacity }} aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            className="rs-chapter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
            transition={{ duration: 0.35, ease }}
          >
            <LandBeat p={playhead} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div className="rt-layout" style={{ opacity: layoutOpacity, pointerEvents: interactive ? "auto" : "none" }}>
        <motion.div className="rt-copy" style={{ y: copyY, filter: copyFilter }}>
          <p className="rt-brand"><RuralitMark /><span>Libreta del campo, en web y Android</span></p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              className="rt-copy-text"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeOut" } }}
              transition={{ duration: 0.75, ease }}
            >
              <h3>{copy.title}</h3>
              <p>{copy.description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="rt-copy-actions">
            <a className="rt-open" href="https://www.ruralit.blog/" target="_blank" rel="noreferrer">Abrir Ruralit <ArrowUpRight size={16} /></a>
            <span className="rt-stack">React, TypeScript, Supabase y Capacitor</span>
          </div>
        </motion.div>

        <motion.div className="rt-stage" style={{ y: stageY, scale: stageScale }}>
          <div className="rs-stage">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="rs-chapter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
                transition={{ duration: 0.35, ease }}
              >
                <Beat p={playhead} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <RuralitIndex
        chapters={RT_CHAPTERS}
        index={chapter.index}
        p={chapter.p}
        opacity={indexOpacity}
        interactive={interactive}
        onSelect={(position) => goTo(RT_CHAPTERS[position].id)}
      />

      <motion.div className="rt-night" style={{ opacity: night }} aria-hidden="true" />
    </motion.div>
  );
}
