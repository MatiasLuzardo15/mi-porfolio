// Herramientas as a pinned story. It opens inside this very site ("Estás adentro"), the qualities
// of the work warp past the camera, the thesis assembles, and then each tool takes the stage with
// its own light and shows what it is for by doing it.
import { useEffect, useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { FigmaBeat, GitBeat, NodeBeat, ReactBeat, SupabaseBeat, TailwindBeat, TypeScriptBeat } from "./ToolBeats";
import { StoryRail, mixColor, useDocked, useStoryGlide, useStoryValue, useViewportSize } from "./storyKit";
import { publishScene } from "../chrome/sceneStore";
import { fromDepth } from "../intro/PerfilBeats";
import { easeInOut, life } from "../projects/fx";
import { clamp, ramp } from "../projects/timeline";
import "../projects/story.css";
import "./tools.css";

export const TOOLS = [
  { id: "react", width: 980, name: "React", use: "Interfaces", bg: "#08151a", ink: "#e6f6fb", muted: "#6f8f99", accent: "#61dafb", Beat: ReactBeat },
  { id: "typescript", width: 640, name: "TypeScript", use: "Código robusto", bg: "#0a1730", ink: "#e8eefb", muted: "#7d8fb3", accent: "#4a8fe0", Beat: TypeScriptBeat },
  { id: "tailwind", width: 700, name: "Tailwind CSS", use: "Sistemas visuales", bg: "#0b1120", ink: "#e2e8f0", muted: "#7a8aa3", accent: "#38bdf8", Beat: TailwindBeat },
  { id: "supabase", width: 980, name: "Supabase", use: "Datos en tiempo real", bg: "#141414", ink: "#ededed", muted: "#8a8a8a", accent: "#3ecf8e", Beat: SupabaseBeat },
  { id: "node", width: 1000, name: "Node.js", use: "Servicios web", bg: "#0b170d", ink: "#e4f2e1", muted: "#7d9a7a", accent: "#8cc84b", Beat: NodeBeat },
  { id: "figma", width: 900, name: "Figma", use: "Diseño UI / UX", bg: "#efeeea", ink: "#151515", muted: "#6d6d68", accent: "#a259ff", Beat: FigmaBeat },
  { id: "git", width: 900, name: "Git & GitHub", use: "Flujos de trabajo", bg: "#0d1117", ink: "#e6edf3", muted: "#7d8590", accent: "#f78166", Beat: GitBeat },
];

const OPENER = 1.3;
const LEN = 0.9;
const END = OPENER + TOOLS.length * LEN;
const UNITS = END + 0.35;
const startOf = (index) => OPENER + index * LEN;

const QUALITIES = ["ADAPTABLE", "ACCESIBLE", "RÁPIDO", "ESCALABLE", "INTUITIVO", "OPTIMIZADO"];
const PORTFOLIO = {
  description: "Responsivo, optimizado para SEO y construido con una arquitectura simple y mantenible.",
  tags: ["React", "Vite", "Framer Motion"],
  githubUrl: "https://github.com/MatiasLuzardo15/mi-porfolio",
};

// Each scene's light: black for the opener, then every tool in its own colours.
const stops = (key, opener) => {
  const list = [[0, opener], [OPENER - 0.12, opener]];
  TOOLS.forEach((tool, index) => {
    list.push([startOf(index) + 0.08, tool[key]], [startOf(index + 1) - 0.12, tool[key]]);
  });
  list.push([UNITS - 0.05, opener]);
  return list;
};
const BG = stops("bg", "#080808");
const INK = stops("ink", "#ededed");
const MUTED = stops("muted", "#8e8e8e");
const ACCENT = stops("accent", "#7185ff");

function Opener({ p }) {
  const coda = life(p, [0.02, 0.12], [0.3, 0.38]);
  const headingOut = easeInOut(ramp(p, 0.9, 0.99));
  return (
    <div className="tl-opener" aria-hidden="true">
      <div className="tl-coda" style={coda}>
        <p className="tl-kicker">ESTE SITIO</p>
        <h3>Portfolio Personal</h3>
        <strong>Estás adentro.</strong>
        <p>{PORTFOLIO.description}</p>
        <div className="tl-coda-row">
          {PORTFOLIO.tags.map((tag) => <span key={tag}>{tag}</span>)}
          <a href={PORTFOLIO.githubUrl} target="_blank" rel="noreferrer" tabIndex={coda.opacity > 0.5 ? 0 : -1}><Github size={15} /> Código <ArrowUpRight size={14} /></a>
        </div>
      </div>

      {/* The qualities of the work warp past the camera. */}
      <div className="tl-warp">
        {QUALITIES.map((word, index) => {
          const t = ramp(p, 0.3 + index * 0.035, 0.52 + index * 0.035);
          if (t <= 0 || t >= 1) return null;
          const angle = (index / QUALITIES.length) * Math.PI * 2 + 0.5;
          const z = -1400 + t * 2000;
          return (
            <span
              key={word}
              style={{
                opacity: Math.sin(Math.PI * t),
                transform: `translate(-50%, -50%) translate3d(${Math.cos(angle) * 34}vw, ${Math.sin(angle) * 26}vh, ${z}px)`,
                filter: t > 0.75 ? `blur(${(t - 0.75) * 30}px)` : undefined,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div className="tl-heading" style={{ opacity: 1 - headingOut, transform: `translateY(${-headingOut * 80}px)`, filter: headingOut ? `blur(${headingOut * 10}px)` : undefined }}>
        <p className="tl-kicker" style={life(p, [0.5, 0.58])}><span>03 / HERRAMIENTAS</span><i /><span>EL SISTEMA DETRÁS DEL RESULTADO</span></p>
        <h2>
          <span className="tl-heading-line">
            {"La tecnología es el medio.".split(" ").map((word, index) => (
              <span key={word} style={fromDepth(ramp(p, 0.52 + index * 0.035, 0.68 + index * 0.035), index + 30)}>{word}</span>
            ))}
          </span>
          <em style={{ ...fromDepth(ramp(p, 0.68, 0.78), 41, 0.4), "--fill": ramp(p, 0.76, 0.86) }}>La experiencia, el objetivo.</em>
        </h2>
      </div>
    </div>
  );
}

export const ToolsStory = () => {
  const storyRef = useRef(null);
  const v = useStoryValue(storyRef, UNITS);
  const docked = useDocked(storyRef);
  const glide = useStoryGlide(storyRef);
  const size = useViewportSize();
  const compact = size.w <= 900;

  const raw = (v - OPENER) / LEN;
  const index = Math.max(0, Math.min(TOOLS.length - 1, Math.floor(raw)));
  const p = clamp(raw - index);
  const tool = TOOLS[index];
  const railOn = v > OPENER - 0.05 && v < END - 0.05;
  const onStage = v >= OPENER - 0.05 ? tool.id : null;
  // The page chrome shows the tool on stage, with its own colours.
  useEffect(() => {
    const current = TOOLS.find((item) => item.id === onStage);
    publishScene("skills", current ? { detail: current.name, mark: `tool:${current.id}` } : { detail: "Estás adentro", mark: "avatar" });
  }, [onStage]);

  const theme = {
    "--tl-bg": mixColor(BG, v, easeInOut),
    "--tl-ink": mixColor(INK, v, easeInOut),
    "--tl-muted": mixColor(MUTED, v, easeInOut),
    "--tl-accent": mixColor(ACCENT, v, easeInOut),
  };
  // Fit the tool objects to the space beside the label.
  const fit = compact ? Math.min(0.62, (size.w - 24) / tool.width) : Math.min(1, (size.w * 0.58) / tool.width, (size.h * 0.72) / 560);
  const Beat = tool.Beat;
  const toolOn = v > OPENER - 0.02 && v < END + 0.02;

  return (
    <section id="skills" className="tools-story" ref={storyRef} data-docked={docked ? "" : undefined} style={{ height: `${(UNITS + 1) * 100}vh` }}>
      <div className="tools-viewport" style={theme}>
        {v < OPENER + 0.05 && <Opener p={clamp(v / OPENER)} />}

        {toolOn && (
          <div className={`tl-stage${compact ? " is-compact" : ""}`} data-tool={tool.id} aria-hidden="true">
            <div className="tl-label" style={{ ...life(p, [0.01, 0.1], [0.88, 0.96]) }}>
              <span className="tl-label-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{tool.name}</h3>
              <p>{tool.use}</p>
            </div>
            <div className="tl-object" style={{ scale: String(fit) }}>
              <Beat key={tool.id} p={p} />
            </div>
          </div>
        )}

        <StoryRail
          className="tl-rail"
          label="Índice de herramientas"
          items={TOOLS.map(({ id, name }) => ({ id, label: name }))}
          index={index}
          p={p}
          on={railOn}
          onSelect={(position) => glide(startOf(position) + LEN * 0.8)}
        />
      </div>

      <div className="sr-only">
        <h2>Herramientas: la tecnología es el medio, la experiencia el objetivo.</h2>
        <p>Portfolio personal: {PORTFOLIO.description} Construido con {PORTFOLIO.tags.join(", ")}.</p>
        <ul>{TOOLS.map(({ name, use }) => <li key={name}>{name}: {use}</li>)}</ul>
      </div>
    </section>
  );
};
