import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { ZenthScene } from "./projects/zenth/ZenthScene";
import { RuralitScene } from "./projects/ruralit/RuralitScene";
import { TIMELINE, sceneEnd } from "./projects/timeline";
import { glideTo } from "./projects/glide";
import { publishScene } from "./chrome/sceneStore";
import { useBackdropTone } from "./chrome/useBackdropTone";
import "./projects/story.css";

// Which app owns the page index at a given point of the story.
const sceneAt = (value) => {
  if (value > 0.14 && value < sceneEnd("zenth") + 0.2) return "zenth";
  if (value > TIMELINE.ruralit.introStart + 0.1 && value < sceneEnd("ruralit") + 0.2) return "ruralit";
  return null;
};

const portfolio = {
  title: "Portfolio Personal",
  description: "Responsivo, optimizado para SEO y construido con una arquitectura simple y mantenible.",
  tags: ["React", "Vite", "Framer Motion"],
  githubUrl: "https://github.com/MatiasLuzardo15/mi-porfolio",
};

export const ProjectsSection = ({ joined = false }) => {
  const storyRef = useRef(null);
  const frameRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, (value) => value * TIMELINE.units);
  // The story follows the scroll through a spring: smooth while scrolling, still when it stops.
  const smooth = useSpring(raw, { stiffness: 110, damping: 26, mass: 0.7, restDelta: 0.0005 });
  const u = smooth;

  const syncScene = useCallback((value) => {
    const next = sceneAt(value);
    setScene((current) => (current === next ? current : next));
  }, []);
  useMotionValueEvent(u, "change", syncScene);
  // Until the story pins, its viewport stays see-through so the entrance above plays to the end.
  const [docked, setDocked] = useState(false);
  // The app switcher and the scroll hint take light or dark ink from the scene behind them.
  const [hudTone, nextTone] = useBackdropTone([[70, -36], [-110, -36]]);
  useEffect(() => {
    // Native listener as well, so jumps (anchors, restored scroll) always hand the index over.
    const onScroll = () => {
      const story = storyRef.current;
      if (!story) return;
      const top = story.getBoundingClientRect().top;
      syncScene(-top / window.innerHeight);
      setDocked(top <= 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [syncScene]);

  // Between the apps the page chrome shows the archive; on stage, each app names its chapter.
  useEffect(() => {
    if (!scene) publishScene("projects", { detail: "Archivo digital", mark: "avatar" });
  }, [scene]);

  useEffect(() => () => frameRef.current?.(), []);

  // Index clicks glide to a chapter; the story plays on the way because scroll drives it.
  const navigate = useCallback((value) => {
    const story = storyRef.current;
    if (!story) return;
    const target = story.getBoundingClientRect().top + window.scrollY + window.innerHeight * value;
    frameRef.current?.();
    frameRef.current = glideTo(target, reduceMotion);
  }, [reduceMotion]);

  return (
    <section id={joined ? undefined : "projects"} className={`projects-editorial${joined ? " is-joined" : ""}`}>
      {/* Static heading only for reduced motion; otherwise the intro story builds the entrance. */}
      {!joined && (
        <div className="projects-intro">
          <div className="section-kicker">
            <span>02 / ARCHIVO DIGITAL</span>
            <span>2024 — 2026</span>
          </div>
          <div className="projects-heading">
            <p className="eyebrow"><i /> DISEÑO + DESARROLLO</p>
            <h2>PROYECTOS<br /><span>DESTACADOS</span></h2>
            <p>Dos productos en producción. Seguí bajando: el scroll cuenta su historia.</p>
          </div>
        </div>
      )}

      <div className="story" ref={storyRef} data-docked={docked ? "" : undefined} style={{ height: `${(TIMELINE.units + 1) * 100}vh` }}>
        <div className="story-viewport">
          <ZenthScene u={u} onNavigate={navigate} active={scene === "zenth"} />
          <RuralitScene u={u} onNavigate={navigate} active={scene === "ruralit"} />

          <nav className="story-hud" data-tone-probe data-tone={hudTone} aria-label="Proyectos" style={{ opacity: scene ? 1 : 0, pointerEvents: scene ? undefined : "none", transition: "opacity .4s ease-out" }}>
            <button type="button" aria-current={scene === "zenth"} onClick={() => navigate(TIMELINE.zenth.introRest)}>Zenth</button>
            <button type="button" aria-current={scene === "ruralit"} onClick={() => navigate(TIMELINE.ruralit.introRest)}>Ruralit</button>
          </nav>
          <p className={`story-next${scene ? " is-visible" : ""}`} data-tone-probe data-tone={nextTone} aria-hidden="true">
            <ArrowDown size={13} /> Seguí bajando
          </p>
        </div>
      </div>

      {/* With the stories joined, this site's own card opens Herramientas instead. */}
      {!joined && (
        <div className="projects-coda">
        <div className="coda-row">
          <div className="coda-copy">
            <h3>{portfolio.title}</h3>
            <p>Estás adentro. {portfolio.description}</p>
          </div>
          <div className="project-tags">
            {portfolio.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <a className="coda-link" href={portfolio.githubUrl} target="_blank" rel="noreferrer">
            <Github size={16} /> Código
          </a>
        </div>
      </div>
      )}
    </section>
  );
};
