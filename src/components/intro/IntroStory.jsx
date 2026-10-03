// Hero + Perfil as one pinned, scroll-scrubbed story. On load the name and the pixel avatar
// assemble; from there the scroll drives everything: the letters fly past the camera, the avatar
// breaks into pixels and regroups as the guide of each chapter, and the three principles turn into
// objects that do what they say. Stop scrolling and the story stops with you.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowDownRight, Github, Linkedin } from "lucide-react";
import { PixelAvatar } from "./PixelAvatar";
import { PIXEL_FONT, textAspect } from "./pixelText";
import { AboutBeat, ClarityBeat, PRINCIPLES, ScaleBeat, StackBeat, fromDepth } from "./PerfilBeats";
import { along, easeIn, easeInOut, easeOut, lerp, life } from "../projects/fx";
import { clamp, ramp } from "../projects/timeline";
import { glideTo } from "../projects/glide";
import { publishScene } from "../chrome/sceneStore";
import { Odometer } from "../projects/Odometer";
import "../projects/story.css";
import "./intro.css";

// The story in viewport heights scrolled since it pinned.
const CHAPTERS = [
  { id: "about", label: "Sobre mí", start: 0.85, end: 2.25, Beat: AboutBeat },
  { id: "clarity", label: "Interfaces claras", start: 2.25, end: 3.3, Beat: ClarityBeat },
  { id: "scale", label: "Código que escala", start: 3.3, end: 4.35, Beat: ScaleBeat },
  { id: "stack", label: "Visión completa", start: 4.35, end: 5.4, Beat: StackBeat },
];
const UNITS = 7.2;
const ABOUT_ANCHOR = 1.75;
const PROJECTS_ANCHOR = 6.45;
const restOf = (chapter) => chapter.start + (chapter.end - chapter.start) * 0.82;

// Each scene has its own light: dark hero, indigo profile, paper for clarity, terminal green for
// scale, deep blue for the full stack, back to the portfolio black for the projects.
const BACKGROUND = [[0, "#080808"], [0.7, "#090a12"], [1.3, "#0d0f1f"], [2.12, "#0d0f1f"], [2.4, "#ecebe6"], [3.18, "#ecebe6"], [3.42, "#06130c"], [4.22, "#06130c"], [4.48, "#0b0c18"], [5.3, "#0b0c18"], [5.7, "#080808"]];
const INK = [[0, "#ededed"], [2.12, "#ededed"], [2.4, "#141414"], [3.18, "#141414"], [3.42, "#e3f5e9"], [4.22, "#e3f5e9"], [4.48, "#ededed"]];
const MUTED = [[0, "#8e8e8e"], [2.12, "#8e8e96"], [2.4, "#6b6b66"], [3.18, "#6b6b66"], [3.42, "#7fa58d"], [4.22, "#7fa58d"], [4.48, "#8d90a8"]];
const ACCENT = [[0, "#7185ff"], [2.12, "#7185ff"], [2.4, "#3a4fe0"], [3.18, "#3a4fe0"], [3.42, "#45e28a"], [4.22, "#45e28a"], [4.48, "#7185ff"]];

const toRgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
const mix = (stops, value) => {
  let index = stops.findIndex(([at]) => at > value);
  if (index === -1) return stops[stops.length - 1][1];
  if (index === 0) return stops[0][1];
  const [from, a] = stops[index - 1];
  const [to, b] = stops[index];
  const t = easeInOut(clamp((value - from) / (to - from)));
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return `rgb(${Math.round(lerp(r1, r2, t))} ${Math.round(lerp(g1, g2, t))} ${Math.round(lerp(b1, b2, t))})`;
};

const random = (seed) => {
  const value = Math.sin(seed * 91.17 + 3.1) * 43758.5453;
  return value - Math.floor(value);
};
const bump = (value, center, width, peak = 1) => peak * easeInOut(clamp(1 - Math.abs(value - center) / width));

const NAME = [
  { text: "MATIAS", outline: false },
  { text: "LUZARDO", outline: true },
];

// One letter of the name: it assembles out of depth on load, then flies apart past the camera.
const letterStyle = (index, column, length, line, boot, v, size) => {
  const r = [random(index), random(index + 20), random(index + 40), random(index + 60)];
  const arrive = easeOut(ramp(boot, 0.04 + index * 0.034, 0.5 + index * 0.034));
  const fly = Math.pow(ramp(v, 0.04 + r[0] * 0.08, 1.05 + r[1] * 0.15), 1.7);
  const direction = (column - (length - 1) / 2) / ((length - 1) / 2);
  const x = (1 - arrive) * (r[0] - 0.5) * 640 + fly * direction * size.w * (0.35 + r[2] * 0.45);
  const y = (1 - arrive) * (r[1] - 0.5) * 420 + fly * (line === 0 ? -1 : 1) * size.h * (0.25 + r[3] * 0.4);
  const z = (1 - arrive) * -(900 + r[2] * 600) + fly * (480 + r[1] * 420);
  const rotateX = (1 - arrive) * (r[3] - 0.5) * 180 + fly * (r[2] - 0.5) * 90;
  const rotateY = (1 - arrive) * (r[0] - 0.5) * 240 + fly * direction * 60;
  const opacity = arrive * (1 - ramp(fly, 0.62 + r[3] * 0.18, 0.96));
  const blur = (1 - arrive) * 12 + ramp(fly, 0.4, 1) * 10;
  return {
    opacity,
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
  };
};

// Text that rises on load and drifts up, out of focus, as the camera moves in.
const heroText = (boot, v, delay, out = [0.03, 0.32]) => {
  const arrive = easeOut(ramp(boot, 0.45 + delay, 0.85 + delay));
  const leave = easeInOut(ramp(v, out[0], out[1]));
  const opacity = arrive * (1 - leave);
  return {
    opacity,
    visibility: opacity <= 0.001 ? "hidden" : undefined,
    transform: `translate3d(0, ${(1 - arrive) * 24 - leave * 120}px, ${leave * 120}px)`,
    filter: leave > 0 ? `blur(${leave * 10}px)` : undefined,
  };
};

const exitBlur = (v, from, to) => {
  const t = easeInOut(ramp(v, from, to));
  return { opacity: 1 - t, transform: `translateY(${-t * 50}px)`, filter: t > 0 ? `blur(${t * 10}px)` : undefined };
};

// Where the avatar stands in each chapter, as fractions of the viewport.
const placesFor = (compact) => (compact
  ? { about: [0.5, 0.2, 0.32], clarity: [0.82, 0.86, 0.27], scale: [0.82, 0.86, 0.27], stack: [0.82, 0.86, 0.27] }
  : { about: [0.24, 0.56, 0.8], clarity: [0.12, 0.7, 0.44], scale: [0.85, 0.7, 0.44], stack: [0.13, 0.68, 0.46] });

export const IntroStory = () => {
  const storyRef = useRef(null);
  const viewportRef = useRef(null);
  const slotRef = useRef(null);
  const avatarRef = useRef(null);
  const glideRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [v, setV] = useState(0);
  const [boot, setBoot] = useState(0);
  const [size, setSize] = useState(() => ({ w: typeof window === "undefined" ? 1440 : window.innerWidth, h: typeof window === "undefined" ? 900 : window.innerHeight }));
  const [hero, setHero] = useState(null);
  const [active, setActive] = useState(true);
  const [aspect, setAspect] = useState(5.6);

  // The pixel word needs the display face loaded before it can be measured and sampled.
  useEffect(() => {
    let alive = true;
    document.fonts?.load(PIXEL_FONT).then(() => alive && setAspect(textAspect("PROYECTOS")));
    return () => { alive = false; };
  }, []);

  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, (value) => value * UNITS);
  const smooth = useSpring(raw, { stiffness: 110, damping: 26, mass: 0.7, restDelta: 0.0005 });
  useMotionValueEvent(smooth, "change", setV);

  // The opening: name and avatar assemble on their own, once, before the scroll takes over.
  const bootValue = useMotionValue(0);
  useMotionValueEvent(bootValue, "change", setBoot);
  useEffect(() => {
    const controls = animate(bootValue, 1, { duration: reduceMotion ? 0 : 2.1, ease: "linear" });
    return () => controls.stop();
  }, [bootValue, reduceMotion]);

  // The avatar starts exactly where the portrait sits in the hero layout.
  const measure = useCallback(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
    const slot = slotRef.current;
    const viewport = viewportRef.current;
    if (!slot || !viewport) return;
    const rect = slot.getBoundingClientRect();
    const base = viewport.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(slot).getPropertyValue("--avatar-scale")) || 1.75;
    setHero({
      x: rect.left - base.left + rect.width / 2,
      y: rect.top - base.top + rect.height / 2,
      height: Math.min(rect.height, rect.width * 1.5) * scale,
    });
  }, []);
  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Only animate the canvas while the story is on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, []);

  const compact = size.w <= 900;
  const current = CHAPTERS.findIndex((chapter) => v < chapter.end);
  const chapterIndex = current === -1 ? CHAPTERS.length - 1 : current;
  const chapter = CHAPTERS[chapterIndex];
  const chapterP = clamp((v - chapter.start) / (chapter.end - chapter.start));
  const railOn = v > 0.95 && v < CHAPTERS[3].end - 0.05;

  // The page chrome follows the profile chapter on screen.
  useEffect(() => {
    publishScene("about", { detail: chapter.label, mark: "avatar" });
  }, [chapter.label]);
  useEffect(() => () => glideRef.current?.(), []);

  const navigate = useCallback((value) => {
    const story = storyRef.current;
    if (!story) return;
    glideRef.current?.();
    glideRef.current = glideTo(story.getBoundingClientRect().top + window.scrollY + window.innerHeight * value, reduceMotion);
  }, [reduceMotion]);

  // The avatar's path through the story; it breaks into pixels on every hand-over.
  const places = placesFor(compact);
  const at = (key) => [places[key][0] * size.w, places[key][1] * size.h, places[key][2] * size.h];
  const start = hero ? [hero.x, hero.y, hero.height] : at("about");
  const route = [[0.12, ...start], [1.1, ...at("about")], [2.12, ...at("about")], [2.38, ...at("clarity")], [3.17, ...at("clarity")], [3.43, ...at("scale")], [4.22, ...at("scale")], [4.48, ...at("stack")]];
  const position = along(route.map(([p, x, y]) => [p, x, y]), v);
  const height = along(route.map(([p, , , h]) => [p, h, 0]), v).x;
  const spread = Math.max(
    1 - easeOut(ramp(boot, 0.12, 0.9)),
    bump(v, 0.62, 0.52, 0.75),
    bump(v, 2.25, 0.18, 0.62),
    bump(v, 3.3, 0.18, 0.62),
    bump(v, 4.35, 0.18, 0.62),
    easeIn(ramp(v, 5.3, 5.68)),
  );

  // Entrance to the projects: the avatar's pixels rebuild the word, then condense into the point
  // of light where the Zenth mark is born.
  const wordWidth = compact ? size.w * 0.88 : Math.min(size.w * 0.66, 1000);
  const wordHeight = wordWidth / aspect;
  const word = { text: "PROYECTOS", cx: size.w / 2, cy: size.h * 0.42, width: wordWidth };
  const projectsOut = exitBlur(v, 6.66, 6.9);
  avatarRef.current = { x: position.x, y: position.y, height, spread, opacity: ramp(boot, 0, 0.12), word, morph: ramp(v, 5.5, 6.2), collapse: ramp(v, 6.72, 7.12) };

  const floor = ramp(v, 0, 0.9);
  const theme = {
    "--in-bg": mix(BACKGROUND, v),
    "--in-ink": mix(INK, v),
    "--in-muted": mix(MUTED, v),
    "--in-accent": mix(ACCENT, v),
  };
  const Beat = chapter.Beat;
  const beatOn = v > chapter.start - 0.02 && v < CHAPTERS[3].end + 0.02;
  let letterIndex = 0;

  return (
    <section id="hero" className="intro-story" ref={storyRef} style={{ height: `${(UNITS + 1) * 100}vh` }}>
      <span id="about" className="intro-anchor" style={{ top: `${ABOUT_ANCHOR * 100}vh` }} aria-hidden="true" />
      <span id="projects" className="intro-anchor" style={{ top: `${PROJECTS_ANCHOR * 100}vh` }} aria-hidden="true" />

      <div className="intro-viewport" ref={viewportRef} style={theme}>
        {/* The floor grid tilts away under the camera as it dives in. */}
        <div className="in-floor-wrap" aria-hidden="true" style={{ opacity: (0.3 + bump(v, 0.45, 0.45, 0.5)) * (1 - ramp(v, 0.85, 1.25)) }}>
          <div className="in-floor" style={{ transform: `rotateX(${easeInOut(floor) * 68}deg) translateY(${floor * 18}%)`, backgroundPositionY: `${v * 520}px` }} />
        </div>

        <PixelAvatar stateRef={avatarRef} active={active} label="Matías Luzardo, avatar en pixel art" />

        {/* Hero */}
        <div className="in-hero" style={{ visibility: v > 1.35 ? "hidden" : undefined }}>
          <div className="hero-layout in-hero-layout">
            <div className="hero-core">
              <p className="eyebrow" style={heroText(boot, v, 0)}>DESARROLLADOR WEB · URUGUAY</p>
              <h1 className="in-name" aria-label="Matías Luzardo">
                {NAME.map(({ text, outline }, line) => (
                  <span key={text} className={`in-name-line${outline ? " outline-name" : ""}`} aria-hidden="true">
                    {[...text].map((char, column) => {
                      const index = letterIndex;
                      letterIndex += 1;
                      return <span key={column} className="in-letter" style={letterStyle(index, column, text.length, line, boot, v, size)}>{char}</span>;
                    })}
                  </span>
                ))}
              </h1>
              <div className="hero-statement" style={heroText(boot, v, 0.06)}>
                <div>
                  <h2>
                    <span className="statement-line">Construyo <em>experiencias</em></span>
                    <span className="statement-line">digitales con intención</span>
                  </h2>
                  <p className="hero-intro">
                    Diseño y desarrollo productos web modernos, claros y funcionales,
                    combinando código, criterio visual y atención al detalle.
                  </p>
                </div>
                <div className="hero-actions">
                  <a className="button-primary" href="#projects">Explorar proyectos <ArrowDownRight size={16} strokeWidth={1.8} /></a>
                  <a className="icon-link" href="https://github.com/MatiasLuzardo15" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
                  <a className="icon-link" href="https://www.linkedin.com/in/matias-luzardo-a87280248/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
                </div>
              </div>
            </div>
            <figure className="hero-portrait in-slot" ref={slotRef} aria-hidden="true" />
          </div>

          <div className="hero-meta hero-location" style={heroText(boot, v, 0.12, [0, 0.14])}>
            <span className="location-pin">●</span>
            <p>CON BASE EN<br /><strong>FLORIDA, URUGUAY</strong></p>
          </div>
          <div className="hero-meta hero-role" style={heroText(boot, v, 0.12, [0, 0.14])}>
            <span className="code-mark">&lt;/&gt;</span>
            <p>FRONTEND, BACKEND<br /><strong>&amp; UI / UX</strong></p>
          </div>
          <a href="#about" className="scroll-cue" aria-label="Continuar al perfil" style={heroText(boot, v, 0.15, [0, 0.1])}>
            <ArrowDown size={18} /> SCROLL
          </a>
        </div>

        {/* Entrance to the projects, around the word the pixels build. */}
        {v > 5.7 && v < 7 && (
          <div className="in-projects" style={{ ...projectsOut, "--word-top": `${word.cy - wordHeight / 2}px`, "--word-bottom": `${word.cy + wordHeight / 2}px`, "--word-height": `${wordHeight}px` }}>
            <p className="in-projects-kicker" style={life(ramp(v, 5.95, 6.25), [0, 1], [2, 2], { y: 14 })}>
              <span>02 / ARCHIVO DIGITAL</span><i /><span>2024 — 2026</span>
            </p>
            <h2 className="in-projects-title" aria-label="Proyectos destacados">
              {[..."DESTACADOS"].map((char, index) => (
                <span key={index} aria-hidden="true" style={fromDepth(ramp(v, 6.02 + index * 0.018, 6.2 + index * 0.018), index)}>{char}</span>
              ))}
            </h2>
            <p className="in-projects-copy" style={life(ramp(v, 6.15, 6.35), [0, 1], [2, 2], { y: 14 })}>
              Dos productos en producción. Seguí bajando: el scroll cuenta su historia.
            </p>
          </div>
        )}

        {/* Perfil */}
        <div className="in-stage">
          {beatOn && <Beat p={chapterP} compact={compact} avatar={avatarRef.current} />}
        </div>

        <nav className="story-rail in-rail" style={{ opacity: railOn ? 1 : 0, pointerEvents: railOn ? "auto" : "none" }} aria-label="Índice del perfil">
          <p className="story-rail-clock">
            <Odometer text={String(chapterIndex + 1).padStart(2, "0")} />
            <small>/ {String(CHAPTERS.length).padStart(2, "0")}</small>
          </p>
          <p className="story-rail-label">{chapter.label}</p>
          <ol className="story-rail-track" style={{ "--fill": (chapterIndex + chapterP) / (CHAPTERS.length - 1) }}>
            {CHAPTERS.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={index < chapterIndex ? "is-past" : index === chapterIndex ? "is-current" : ""}
                  aria-label={item.label}
                  aria-current={index === chapterIndex ? "step" : undefined}
                  onClick={() => navigate(restOf(item))}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* The same profile as plain text, for screen readers and search engines. */}
      <div className="sr-only">
        <h2>Perfil: ideas que se vuelven experiencias reales.</h2>
        <p>Soy Matías Luzardo, desarrollador web uruguayo de 22 años y estudiante de Tecnologías de la Información.</p>
        <p>
          Combino formación técnica y aprendizaje autodidacta para crear productos web útiles, ágiles y visualmente cuidados.
          Me interesan especialmente React, TypeScript, Supabase y el diseño centrado en UI/UX. Busco mi primera oportunidad
          profesional para aportar, aprender y construir productos que resuelvan problemas reales.
        </p>
        <a href="#contact">Trabajemos juntos</a>
        <ul>
          {PRINCIPLES.map(({ title, text }) => <li key={title}><strong>{title}.</strong> {text}</li>)}
        </ul>
      </div>
    </section>
  );
};
