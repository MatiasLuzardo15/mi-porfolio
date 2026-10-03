import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight, CalendarDays, LayoutDashboard, LibraryBig, Phone } from "lucide-react";
import "@fontsource-variable/inter";
import "./zenth.css";
import "./zenth-story.css";
import "./zenth-fx.css";
import "./zenth-beats.css";
import { ZENTH_PIECES, ZenthFocusIcon, ZenthMark, ZenthProgressIcon } from "./ZenthIcons";
import { ZenthIndex } from "./ZenthIndex";
import { CALL_BACKGROUNDS, MOODS, ProgressSky, ZENTH_BEATS } from "./ZenthStory";
import { TIMELINE, beat, chapterAt, chapterRest, ramp, sceneEnd } from "../timeline";
import { useScrubbed } from "../useScrubbed";
import { publishScene } from "../../chrome/sceneStore";

const ease = [0.23, 1, 0.32, 1];

// Copy from zenith-productivity/components/WelcomeModal.tsx
export const ZENTH_CHAPTERS = [
  { id: "agenda", label: "Agenda", Icon: CalendarDays, theme: "light",
    title: "Hacé lugar\npara lo que querés hacer.",
    description: "Organizá tareas, eventos y reuniones en el día, la semana o el mes. Mové los bloques de la agenda y ajustá su duración cuando cambien tus planes." },
  { id: "boards", label: "Pizarras", Icon: LayoutDashboard, theme: "board",
    title: "Un proyecto.\nCada cosa en su lugar.",
    description: "Capturá ideas en la bandeja y organizalas en listas a tu medida. Arrastrá las tarjetas a medida que avanza el trabajo." },
  { id: "library", label: "Biblioteca", Icon: LibraryBig, theme: "zen",
    title: "Tus ideas tienen\ncon qué crecer.",
    description: "Escribí notas con formato, listas e imágenes. Organizalas en carpetas, compartilas en una pizarra y vinculalas a tus tareas." },
  { id: "focus", label: "Enfoque", Icon: ZenthFocusIcon, theme: "dark",
    title: "Ahora,\nuna sola cosa.",
    description: "Elegí una tarea o iniciá una sesión libre. Ajustá el tiempo, encontrá tu ambiente sonoro y dejá que el resto espere un momento." },
  { id: "meetings", label: "Reuniones", Icon: Phone, theme: "call",
    title: "La conversación,\ncerca del trabajo.",
    description: "Reuniones reúne las salas de tus pizarras, las llamadas privadas y los encuentros con invitados en un mismo lugar." },
  { id: "progress", label: "Tu progreso", Icon: ZenthProgressIcon, theme: "light",
    title: "El progreso también\nestá en volver.",
    description: "Cada tarea completada y cada sesión de enfoque cuentan. Mirá tu recorrido, descubrí logros y registrá cómo te sentís." },
];

const START = TIMELINE.zenth.start;
const END = sceneEnd("zenth");
const easeIn = (x) => x * x * x;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

// Each piece of the official mark flies in from its corner and locks into place.
const IntroPiece = ({ piece, index, u, still }) => {
  const progress = useTransform(u, [0.03 + index * 0.05, 0.29 + index * 0.03], [0, 1], { ease: easeOut });
  const x = useTransform(progress, [0, 1], [still ? 0 : piece.from.x, 0]);
  const y = useTransform(progress, [0, 1], [still ? 0 : piece.from.y, 0]);
  const rotate = useTransform(progress, [0, 1], [still ? 0 : piece.from.rotate, 0]);
  const opacity = useTransform(progress, [0, 0.4], [0, 1]);
  return <motion.path d={piece.d} fill="#ffffff" style={{ x, y, rotate, opacity, transformBox: "fill-box", transformOrigin: "center" }} />;
};

const Title = ({ text }) => {
  let index = 0;
  return (
    <h3 aria-label={text.replace("\n", " ")}>
      {text.split("\n").map((line, lineIndex) => (
        <span key={lineIndex} style={{ display: "block" }} aria-hidden="true">
          {line.split(" ").map((word) => {
            const delay = 0.08 + index++ * 0.08;
            return (
              <motion.span
                key={`${word}-${delay}`}
                style={{ display: "inline-block", marginRight: "0.24em" }}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeOut" } }}
                transition={{ duration: 0.7, delay, ease }}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h3>
  );
};

export function ZenthScene({ u, onNavigate, active }) {
  const reduceMotion = useReducedMotion();
  const [chapter, setChapter] = useState(() => ({ index: 0, p: 0 }));
  // Scroll drives the story directly: chapter.p is scroll progress, playhead the story beat.
  const playhead = beat(chapter.p);
  const [interactive, setInteractive] = useState(false);
  const current = ZENTH_CHAPTERS[chapter.index];
  const Beat = ZENTH_BEATS[current.id];
  const focusRunning = current.id === "focus" && playhead > 0.08 && playhead < 0.5;

  const sync = useCallback((value) => {
    const next = chapterAt("zenth", value);
    const p = Math.round(next.progress * 500) / 500;
    setChapter((prev) => (prev.index === next.index && prev.p === p ? prev : { index: next.index, p }));
    const live = value > 0.9 && value < END + 0.1;
    setInteractive((prev) => (prev === live ? prev : live));
  }, []);
  useMotionValueEvent(u, "change", sync);
  // The page chrome follows the chapter while the app is on stage.
  // Only the app that owns the stage speaks for the section, so the two never overwrite each other.
  useEffect(() => {
    if (active) publishScene("projects", { detail: interactive ? `Zenth · ${current.label}` : "Zenth", mark: "zenth" });
  }, [active, interactive, current.label]);
  useEffect(() => {
    const id = requestAnimationFrame(() => sync(u.get()));
    return () => cancelAnimationFrame(id);
  }, [u, sync]);

  // Scroll-scrubbed scene state, still overridable by hand.
  const scrubbedBackground = CALL_BACKGROUNDS[Math.min(7, Math.floor(ramp(playhead, 0.08, 0.92) * 8))].id;
  const [callBackground] = useScrubbed(current.id === "meetings" ? scrubbedBackground : "aurora");
  const [mood] = useScrubbed(current.id === "progress" && playhead > 0.42 ? "BIEN" : null);

  // Intro: the mark assembles, rests, then the camera flies through its diagonal into the light.
  const reveal = useTransform(u, [0.54, 0.92], [0, 150], { ease: easeIn });
  const backdropClip = useMotionTemplate`circle(${reveal}% at 50% 42%)`;
  const markScale = useTransform(u, [0.54, 0.96], [1, reduceMotion ? 1 : 22], { ease: easeIn });
  const markOpacity = useTransform(u, [0.76, 0.96], [1, 0]);
  const introOpacity = useTransform(u, [0.18, 0.34, 0.52, 0.6], [0, 1, 1, 0]);
  const introY = useTransform(u, [0.18, 0.34, 0.6], [28, 0, -40]);
  const layoutOpacity = useTransform(u, [0.82, 1.08, END, END + 0.2], [0, 1, 1, 0]);
  const stageY = useTransform(u, [0.82, 1.12, END, END + 0.28], [160, 0, 0, -150]);
  const stageScale = useTransform(u, [0.82, 1.12, END, END + 0.28], [0.86, 1, 1, 0.92]);
  const stageRotate = useTransform(u, [0.82, 1.12], [reduceMotion ? 0 : 12, 0]);
  const copyY = useTransform(u, [0.86, 1.12, END, END + 0.22], [56, 0, 0, -80]);
  const copyBlur = useTransform(u, [0.86, 1.08, END + 0.02, END + 0.2], [10, 0, 0, 8]);
  const copyFilter = useMotionTemplate`blur(${copyBlur}px)`;
  const sceneOpacity = useTransform(u, [END + 0.14, END + 0.32], [1, 0]);
  const visibility = useTransform(u, (value) => (value < -0.3 || value > END + 0.36 ? "hidden" : "visible"));
  const overall = useTransform(u, [START, END], [0, 1]);
  const indexOpacity = useTransform(u, [0.16, 0.38, END, END + 0.2], [0, 1, 1, 0]);

  const moodHex = current.id === "progress" ? MOODS.find((item) => item.variant === mood)?.hex : null;
  const call = CALL_BACKGROUNDS.find((item) => item.id === callBackground);
  const goTo = (index) => onNavigate(chapterRest("zenth", index));
  // In Tu progreso night falls: the window steps back so the constellation can take the scene.
  const night = current.id === "progress" ? ramp(playhead, 0.42, 0.52) : 0;
  const theme = night > 0.3 ? "dark" : current.theme;

  return (
    <motion.div
      className="zn story-scene"
      data-theme={theme}
      data-night={night > 0.3 ? "" : undefined}
      data-immersive={current.id === "focus" && focusRunning ? "" : undefined}
      style={{ opacity: sceneOpacity, visibility, "--zn-tint": moodHex && !night ? `${moodHex}3d` : "transparent" }}
    >
      <motion.div className="zn-backdrop" style={{ clipPath: backdropClip }} aria-hidden="true">
        <AnimatePresence>
          {current.theme === "call" && (
            <motion.div
              key={call.id}
              className="zn-call-bg"
              style={{ background: call.gradient }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        {night > 0 && <div className="zn-night" style={{ opacity: night }} />}
      </motion.div>

      <div className="zn-intro" aria-hidden="true">
        {/* The mark grows by its real size, not a scaled bitmap, so it stays sharp up close. */}
        <span className="zn-intro-mark-slot">
          <motion.svg className="zn-intro-mark" viewBox="0 0 2000 2000" style={{ "--mark-scale": markScale, opacity: markOpacity }}>
            {ZENTH_PIECES.map((piece, index) => <IntroPiece key={piece.d} piece={piece} index={index} u={u} still={reduceMotion} />)}
          </motion.svg>
        </span>
        <motion.div className="zn-intro-copy" style={{ opacity: introOpacity, y: introY }}>
          <strong>Zenth</strong>
          <span>Menos vueltas. Más espacio para lo importante.</span>
        </motion.div>
      </div>

      <motion.div className="zn-layout" style={{ opacity: layoutOpacity, pointerEvents: interactive ? "auto" : "none" }}>
        <motion.div className="zn-copy" style={{ y: copyY, filter: copyFilter }}>
          <div className="zn-copy-inner">
            <p className="zn-brand"><ZenthMark /><span>Proyecto propio, en producción</span></p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current.id} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                <Title text={current.title} />
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease }}>
                  {current.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            <div className="zn-copy-actions">
              <a className="zn-open" href="https://www.zenth.space/" target="_blank" rel="noreferrer">Abrir Zenth <ArrowUpRight size={16} /></a>
              <span className="zn-stack">React 19, TypeScript, Supabase y LiveKit</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="zn-stage" style={{ y: stageY, scale: stageScale, rotateX: stageRotate, transformPerspective: 1400 }}>
          <div className="zs-stage" style={night ? { opacity: 1 - night } : undefined}>
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="zs-chapter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
                transition={{ duration: 0.35, ease }}
              >
                <Beat p={playhead} mood={mood} />
              </motion.div>
            </AnimatePresence>
          </div>

        </motion.div>
      </motion.div>

      {current.id === "progress" && <ProgressSky p={playhead} />}

      <ZenthIndex
        chapters={ZENTH_CHAPTERS}
        index={chapter.index}
        p={chapter.p}
        overall={overall}
        opacity={indexOpacity}
        interactive={interactive}
        onSelect={goTo}
      />
    </motion.div>
  );
}
