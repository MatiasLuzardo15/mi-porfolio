import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { ZenthScene } from "./projects/zenth/ZenthScene";
import { RuralitScene } from "./projects/ruralit/RuralitScene";
import { TIMELINE, clamp, sceneEnd } from "./projects/timeline";
import "./projects/story.css";

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

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

export const ProjectsSection = () => {
  const storyRef = useRef(null);
  const frameRef = useRef(0);
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
  useEffect(() => {
    // Native listener as well, so jumps (anchors, restored scroll) always hand the index over.
    const onScroll = () => {
      const story = storyRef.current;
      if (story) syncScene(-story.getBoundingClientRect().top / window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [syncScene]);

  // The portfolio rail steps aside while an app shows its own index.
  useEffect(() => {
    const root = document.documentElement;
    if (scene) root.dataset.story = scene;
    else delete root.dataset.story;
    return () => { delete root.dataset.story; };
  }, [scene]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Index clicks glide to a chapter; the story plays on the way because scroll drives it.
  const navigate = useCallback((value) => {
    const story = storyRef.current;
    if (!story) return;
    const target = story.getBoundingClientRect().top + window.scrollY + window.innerHeight * value;
    if (reduceMotion) {
      window.scrollTo({ top: target });
      return;
    }
    cancelAnimationFrame(frameRef.current);
    const root = document.documentElement;
    const start = window.scrollY;
    const distance = target - start;
    const duration = clamp((Math.abs(distance) / window.innerHeight) * 900, 700, 2600);
    const startTime = performance.now();
    root.style.scrollBehavior = "auto";
    const step = (now) => {
      const progress = clamp((now - startTime) / duration);
      window.scrollTo(0, start + distance * easeInOut(progress));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else root.style.scrollBehavior = "";
    };
    frameRef.current = requestAnimationFrame(step);
  }, [reduceMotion]);

  return (
    <section id="projects" className="projects-editorial">
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

      <div className="story" ref={storyRef} style={{ height: `${(TIMELINE.units + 1) * 100}vh` }}>
        <div className="story-viewport">
          <ZenthScene u={u} onNavigate={navigate} />
          <RuralitScene u={u} onNavigate={navigate} />

          <nav className="story-hud" aria-label="Proyectos">
            <button type="button" aria-current={scene === "zenth"} onClick={() => navigate(TIMELINE.zenth.introRest)}>Zenth</button>
            <button type="button" aria-current={scene === "ruralit"} onClick={() => navigate(TIMELINE.ruralit.introRest)}>Ruralit</button>
          </nav>
          <p className={`story-next${scene ? " is-visible" : ""}`} aria-hidden="true">
            <ArrowDown size={13} /> Seguí bajando
          </p>
        </div>
      </div>

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
    </section>
  );
};
