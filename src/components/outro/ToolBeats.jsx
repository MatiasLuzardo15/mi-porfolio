// Herramientas: each tool shows what it is for by doing it. Every value is a pure function of the
// chapter's scroll progress `p` (0–1), so scrolling back rewinds each moment.
import { Check, Play, Plus } from "lucide-react";
import { along, backOut, easeInOut, easeOut, lerp, life } from "../projects/fx";
import { ramp } from "../projects/timeline";

const random = (seed) => {
  const value = Math.sin(seed * 63.71 + 4.3) * 43758.5453;
  return value - Math.floor(value);
};
const pulse = (p, from, to) => Math.sin(Math.PI * ramp(p, from, to));
const pop = (p, at, length = 0.05) => backOut(ramp(p, at, at + length));
const fade = (p, from, to) => {
  const t = easeInOut(ramp(p, from, to));
  return { opacity: 1 - t, filter: t > 0 ? `blur(${t * 10}px)` : undefined, visibility: t >= 1 ? "hidden" : undefined };
};

/* ── 01 · React: the atom spins up and grows this very site's component tree ─────────────── */

const TREE = [
  { id: "App", x: 0, y: -170, depth: 0 },
  { id: "Home", x: 0, y: -90, depth: 1, parent: "App" },
  { id: "SiteChrome", x: -390, y: 0, depth: 2, parent: "Home" },
  { id: "IntroStory", x: -234, y: 0, depth: 2, parent: "Home" },
  { id: "ProjectsSection", x: -78, y: 0, depth: 2, parent: "Home" },
  { id: "ToolsStory", x: 78, y: 0, depth: 2, parent: "Home" },
  { id: "MuseumStory", x: 234, y: 0, depth: 2, parent: "Home" },
  { id: "ContactStory", x: 390, y: 0, depth: 2, parent: "Home" },
  { id: "ZenthScene", x: -150, y: 92, depth: 3, parent: "ProjectsSection" },
  { id: "RuralitScene", x: -6, y: 92, depth: 3, parent: "ProjectsSection" },
  { id: "PixelAvatar", x: -300, y: 92, depth: 3, parent: "IntroStory" },
].map((node, index) => ({ ...node, at: 0.3 + index * 0.028 }));
const NODE = Object.fromEntries(TREE.map((node) => [node.id, node]));

export function ReactBeat({ p }) {
  const settle = easeInOut(ramp(p, 0.18, 0.32));
  const atomScale = lerp(2.6, 0.42, settle);
  const atomY = lerp(-20, NODE.App.y, settle);
  const spin = p * 900;
  return (
    <div className="tl-react" style={fade(p, 0.88, 0.97)}>
      <svg className="tl-edges" viewBox="-480 -240 960 400" aria-hidden="true">
        {TREE.filter((node) => node.parent).map((node) => {
          const parent = NODE[node.parent];
          const draw = ramp(p, node.at - 0.03, node.at + 0.02);
          const midY = (parent.y + node.y) / 2;
          return (
            <path key={node.id} d={`M${parent.x} ${parent.y + 14} C${parent.x} ${midY} ${node.x} ${midY} ${node.x} ${node.y - 14}`} pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} />
          );
        })}
      </svg>
      {TREE.map((node) => {
        const scale = pop(p, node.at);
        if (scale <= 0) return null;
        const flash = pulse(p, 0.62 + node.depth * 0.045, 0.72 + node.depth * 0.045);
        return (
          <span key={node.id} className="tl-node" style={{ transform: `translate(-50%, -50%) translate(${node.x}px, ${node.y}px) scale(${scale})`, "--flash": flash }}>
            {`<${node.id} />`}
          </span>
        );
      })}
      <svg className="tl-atom" viewBox="-60 -60 120 120" style={{ transform: `translate(-50%, -50%) translate(0px, ${atomY}px) scale(${atomScale})`, opacity: 1 - ramp(p, 0.29, 0.33) }} aria-hidden="true">
        {[0, 60, 120].map((angle, index) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse rx="52" ry="20" />
            <circle r="4" cx={52 * Math.cos(((spin + index * 120) * Math.PI) / 180)} cy={20 * Math.sin(((spin + index * 120) * Math.PI) / 180)} />
          </g>
        ))}
        <circle r="9" className="is-core" />
      </svg>
      <p className="tl-caption" style={life(p, [0.6, 0.66], [0.84, 0.88])}>Un cambio de estado y solo se vuelve a dibujar lo necesario.</p>
    </div>
  );
}

/* ── 02 · TypeScript: a wrong type is caught before it ships, then the bad quotes fall out ── */

const TS_LINES = [
  'type Movimiento = {',
  '  tipo: "venta" | "compra";',
  "  cantidad: number;",
  "  monto: number;",
  "};",
  "",
  "const venta: Movimiento = {",
  '  tipo: "venta",',
  "  cantidad: __BAD__,",
  "  monto: 900,",
  "};",
];
const TS_TOKENS = /("[^"]*"|\b(?:type|const|number)\b|\b[A-Z][A-Za-z]+\b|\b\d+\b)/;
const tsClass = (token) => {
  if (token.startsWith('"')) return "is-string";
  if (/^(type|const|number)$/.test(token)) return "is-keyword";
  if (/^\d+$/.test(token)) return "is-number";
  if (/^[A-Z]/.test(token)) return "is-type";
  return undefined;
};
const tsTotal = TS_LINES.reduce((sum, line) => sum + line.replace("__BAD__", '"2"').length, 0);

export function TypeScriptBeat({ p }) {
  let budget = Math.round(tsTotal * ramp(p, 0.06, 0.38));
  const error = ramp(p, 0.42, 0.47) * (1 - ramp(p, 0.68, 0.72));
  const fix = easeInOut(ramp(p, 0.55, 0.68));
  const fixed = p >= 0.7;
  return (
    <div className="tl-ts" style={{ ...life(p, [0.02, 0.08]), ...(p > 0.88 ? fade(p, 0.88, 0.97) : {}) }}>
      <div className="tl-ts-card">
        <header><span>venta.ts</span><i className={fixed ? "is-ok" : error > 0.5 ? "is-error" : ""}>{fixed ? <><Check size={13} /> Sin errores</> : error > 0.5 ? "1 problema" : ""}</i></header>
        <pre>
          {TS_LINES.map((source, row) => {
            const line = source.replace("__BAD__", '"2"');
            const shown = Math.max(0, Math.min(line.length, budget));
            budget -= line.length;
            const highlight = row === 2 ? pulse(p, 0.44, 0.66) : 0;
            if (source.includes("__BAD__") && shown >= line.length) {
              return (
                <code key={row} className="is-bad-line">
                  {"  cantidad: "}
                  <span className="tl-ts-bad">
                    {['"', "2", '"'].map((char, index) => {
                      if (char === "2") return <span key={index} className={fixed ? "is-number" : "is-string"}>{char}</span>;
                      const side = index === 0 ? -1 : 1;
                      const t = fix;
                      return (
                        <span
                          key={index}
                          className="is-string tl-ts-quote"
                          style={{
                            transform: `translate(${side * t * 60}px, ${t * 120 - Math.sin(Math.PI * t) * 70}px) rotate(${side * t * 220}deg)`,
                            opacity: 1 - ramp(p, 0.63, 0.68),
                            marginRight: `${-t}ch`,
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                    <i className="tl-ts-squiggle" style={{ transform: `scaleX(${error})`, opacity: error }} />
                  </span>
                  ,
                </code>
              );
            }
            const text = line.slice(0, shown);
            return (
              <code key={row} className={highlight > 0.05 ? "is-hint" : undefined} style={{ "--hint": highlight }}>
                {text.split(TS_TOKENS).map((token, index) => token && <span key={index} className={tsClass(token)}>{token}</span>)}
                {shown > 0 && shown < line.length && <i className="tl-caret" />}
              </code>
            );
          })}
        </pre>
      </div>
      <p className="tl-ts-tooltip" style={{ opacity: error, transform: `translateY(${(1 - error) * 8}px)` }}>
        <b>ts(2322)</b> Type &apos;string&apos; is not assignable to type &apos;number&apos;.
      </p>
    </div>
  );
}

/* ── 03 · Tailwind CSS: a bare button is styled class by class as the classes are typed ──── */

const TW_CLASSES = ["px-6", "py-3", "rounded-2xl", "bg-sky-500", "text-white", "font-semibold", "shadow-xl", "shadow-sky-500/40"];
const SKY = ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"];
const SKY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export function TailwindBeat({ p }) {
  const full = TW_CLASSES.join(" ");
  const typedCount = Math.round(full.length * ramp(p, 0.12, 0.58));
  const typedText = full.slice(0, typedCount);
  let consumed = 0;
  const applied = new Set();
  TW_CLASSES.forEach((name) => {
    consumed += name.length;
    if (typedCount >= consumed) applied.add(name);
    consumed += 1;
  });
  const has = (name) => applied.has(name);
  const button = {
    padding: `${has("py-3") ? 12 : 0}px ${has("px-6") ? 24 : 0}px`,
    borderRadius: has("rounded-2xl") ? 16 : 0,
    background: has("bg-sky-500") ? "#0ea5e9" : "transparent",
    color: has("text-white") ? "#fff" : "#94a3b8",
    fontWeight: has("font-semibold") ? 600 : 400,
    boxShadow: has("shadow-sky-500/40") ? "0 20px 25px -5px rgba(14,165,233,.4), 0 8px 10px -6px rgba(14,165,233,.4)" : has("shadow-xl") ? "0 20px 25px -5px rgba(0,0,0,.35), 0 8px 10px -6px rgba(0,0,0,.35)" : "none",
    outline: applied.size === 0 ? "1px dashed #334155" : "none",
  };
  return (
    <div className="tl-tw" style={fade(p, 0.88, 0.97)}>
      <p className="tl-tw-code" style={life(p, [0.04, 0.1])}>
        <span className="is-tag">&lt;button</span> <span className="is-attr">className</span>=<span className="is-string">&quot;{TW_CLASSES.map((name, index) => {
          const start = TW_CLASSES.slice(0, index).join(" ").length + (index ? 1 : 0);
          const part = typedText.slice(start, start + name.length);
          if (!part) return null;
          return <span key={name}>{index ? " " : ""}<mark className={applied.has(name) ? "is-on" : ""}>{part}</mark></span>;
        })}<i className="tl-caret" />&quot;</span><span className="is-tag">&gt;</span>
      </p>
      <button type="button" tabIndex={-1} className="tl-tw-button" style={{ ...button, ...life(p, [0.04, 0.1]) }}>Ver proyectos</button>
      <div className="tl-tw-palette">
        {SKY.map((color, index) => {
          const t = easeOut(ramp(p, 0.64 + index * 0.012, 0.74 + index * 0.012));
          if (t <= 0) return null;
          const x = lerp(0, (index - 4.5) * 58, t);
          const y = lerp(-110, 0, t);
          return (
            <span key={color} style={{ background: color, opacity: t, transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${lerp(0.3, 1, t)})` }}>
              <small>{SKY_STEPS[index]}</small>
            </span>
          );
        })}
      </div>
      <p className="tl-caption" style={life(p, [0.74, 0.8], [0.86, 0.9])}>Un sistema: la misma escala de color, espaciado y sombras en todo el producto.</p>
    </div>
  );
}

/* ── 04 · Supabase: a row written on one screen appears on the other, live ────────────────── */

const DEVICES = { phone: { x: -270, y: 30 }, laptop: { x: 230, y: 30 }, db: { x: -20, y: -175 } };
const Rows = ({ items, fresh, checked }) => (
  <ul>
    {items.map((item, index) => (
      <li key={item} className={`${fresh === index ? "is-fresh" : ""}${checked === index ? " is-checked" : ""}`}>
        <i>{checked === index && <Check size={10} />}</i>{item}
      </li>
    ))}
  </ul>
);

export function SupabaseBeat({ p }) {
  const typedText = "Nueva tarea".slice(0, Math.round(11 * ramp(p, 0.2, 0.32)));
  const inserted = p >= 0.36;
  const onLaptop = p >= 0.57;
  const checkedLaptop = p >= 0.64;
  const checkedPhone = p >= 0.8;
  const base = ["Diseñar la portada", "Revisar la API"];
  const phoneRows = inserted ? [...base, "Nueva tarea"] : base;
  const laptopRows = onLaptop ? [...base, "Nueva tarea"] : base;
  const insertPacket = along([[0.36, DEVICES.phone.x, DEVICES.phone.y - 120], [0.46, DEVICES.db.x, DEVICES.db.y], [0.57, DEVICES.laptop.x, DEVICES.laptop.y - 80]], p);
  const updatePacket = along([[0.64, DEVICES.laptop.x, DEVICES.laptop.y - 80], [0.72, DEVICES.db.x, DEVICES.db.y], [0.8, DEVICES.phone.x, DEVICES.phone.y - 120]], p);
  const dbFlash = pulse(p, 0.42, 0.52) + pulse(p, 0.68, 0.76);
  return (
    <div className="tl-sb" style={fade(p, 0.88, 0.97)}>
      <svg className="tl-sb-links" viewBox="-480 -260 960 520" aria-hidden="true" style={{ opacity: ramp(p, 0.12, 0.2) }}>
        <path d={`M${DEVICES.phone.x} ${DEVICES.phone.y - 120} Q${DEVICES.phone.x} ${DEVICES.db.y} ${DEVICES.db.x} ${DEVICES.db.y}`} />
        <path d={`M${DEVICES.laptop.x} ${DEVICES.laptop.y - 80} Q${DEVICES.laptop.x} ${DEVICES.db.y} ${DEVICES.db.x} ${DEVICES.db.y}`} />
      </svg>
      <div className="tl-sb-db" style={{ ...life(p, [0.06, 0.14]), transform: `translate(-50%, -50%) translate(${DEVICES.db.x}px, ${DEVICES.db.y}px) scale(${1 + dbFlash * 0.08})`, "--flash": Math.min(1, dbFlash) }}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>
        <span>Postgres</span>
      </div>
      <div className="tl-sb-phone" style={{ ...life(p, [0.08, 0.16], [2, 2], { x: -60 }), left: DEVICES.phone.x, top: DEVICES.phone.y }}>
        <strong>Tareas</strong>
        <Rows items={phoneRows} fresh={p < 0.5 && inserted ? 2 : -1} checked={checkedPhone ? 0 : -1} />
        <p className="tl-sb-input"><span>{typedText || "Agregar…"}</span><b className={p > 0.33 && p < 0.37 ? "is-pressed" : ""}><Plus size={13} /></b></p>
      </div>
      <div className="tl-sb-laptop" style={{ ...life(p, [0.1, 0.18], [2, 2], { x: 60 }), left: DEVICES.laptop.x, top: DEVICES.laptop.y }}>
        <header><i /><i /><i /></header>
        <strong>Tareas</strong>
        <Rows items={laptopRows} fresh={onLaptop && p < 0.7 ? 2 : -1} checked={checkedLaptop ? 0 : -1} />
      </div>
      {p > 0.36 && p < 0.57 && <span className="tl-packet" style={{ transform: `translate(-50%, -50%) translate(${insertPacket.x}px, ${insertPacket.y}px)` }}>INSERT</span>}
      {p > 0.64 && p < 0.8 && <span className="tl-packet" style={{ transform: `translate(-50%, -50%) translate(${updatePacket.x}px, ${updatePacket.y}px)` }}>UPDATE</span>}
      <p className="tl-caption" style={life(p, [0.58, 0.64], [0.86, 0.9])}>Un cambio en un dispositivo, al instante en todos.</p>
    </div>
  );
}

/* ── 05 · Node.js: a server comes up and answers requests side by side ───────────────────── */

const REQUESTS = ["GET /proyectos", "GET /habilidades", "POST /contacto", "GET /certificados", "GET /proyectos/zenth", "GET /proyectos/ruralit"];

export function NodeBeat({ p }) {
  const boot = "$ node server.js";
  const listening = "Servidor escuchando en :3000";
  const shownBoot = boot.slice(0, Math.round(boot.length * ramp(p, 0.05, 0.14)));
  const served = REQUESTS.filter((_, index) => p >= 0.3 + index * 0.06 + 0.12).length;
  return (
    <div className="tl-node-js" style={fade(p, 0.88, 0.97)}>
      <div className="tl-terminal" style={life(p, [0.03, 0.08])}>
        <code>{shownBoot}{p < 0.15 && <i className="tl-caret" />}</code>
        <code style={{ opacity: ramp(p, 0.16, 0.18) }} className="is-ok">{listening}</code>
        {REQUESTS.map((request, index) => p >= 0.3 + index * 0.06 + 0.12 && <code key={request}>{request} <b>200</b></code>)}
      </div>
      <div className="tl-server" style={{ ...life(p, [0.16, 0.24]), "--load": Math.min(1, served / REQUESTS.length) }}>
        <svg viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" />
          <circle r="34" className="is-ring" style={{ transform: `rotate(${p * 720}deg)` }} />
        </svg>
        <span>:3000</span>
      </div>
      {REQUESTS.map((request, index) => {
        const start = 0.3 + index * 0.06;
        const y = (index % 3 - 1) * 70;
        if (p < start || p > start + 0.14) return null;
        const going = p < start + 0.06;
        const position = going
          ? along([[start, -420, y], [start + 0.06, 120, 40]], p)
          : along([[start + 0.06, 120, 40], [start + 0.14, 560, y]], p);
        return (
          <span key={request} className={`tl-packet${going ? "" : " is-response"}`} style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)` }}>
            {going ? request : "200 OK"}
          </span>
        );
      })}
      <p className="tl-caption" style={life(p, [0.62, 0.68], [0.86, 0.9])}>Sin bloquearse: atiende varias a la vez.</p>
    </div>
  );
}

/* ── 06 · Figma: the pen draws, frames snap with redlines, a prototype link connects ──────── */

export function FigmaBeat({ p }) {
  const pen = ramp(p, 0.08, 0.3);
  const header = pop(p, 0.32);
  const card = pop(p, 0.38);
  const drag = easeInOut(ramp(p, 0.5, 0.64));
  const guides = pulse(p, 0.52, 0.68);
  const noodle = ramp(p, 0.72, 0.8);
  const cursor = along([[0.48, 260, 200], [0.5, 120, 60], [0.64, 40, 40], [0.7, -150, 150], [0.72, -150, 150]], p);
  return (
    <div className="tl-figma" style={fade(p, 0.88, 0.97)}>
      <div className="tl-fg-frame" style={life(p, [0.03, 0.1], [2, 2], { scale: 0.94 })}>
        <span className="tl-fg-label">Desktop — Portfolio</span>
        <svg className="tl-fg-pen" viewBox="0 0 520 330" aria-hidden="true">
          <path d="M40 250 C 120 120, 200 300, 280 170 S 440 90, 480 160" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - pen }} />
          {[[40, 250], [280, 170], [480, 160]].map(([x, y], index) => pen > index * 0.45 && (
            <g key={x}>
              <line x1={x - 34} y1={y + 18} x2={x + 34} y2={y - 18} className="is-handle" />
              <rect x={x - 4} y={y - 4} width="8" height="8" />
            </g>
          ))}
        </svg>
        <span className="tl-fg-header" style={{ transform: `scale(${header})`, opacity: header ? 1 : 0 }} />
        <span className="tl-fg-card" style={{ transform: `translate(${lerp(70, 0, drag)}px, ${lerp(40, 0, drag)}px) scale(${card})`, opacity: card ? 1 : 0 }}>
          <i /><b /><b />
          <em className={noodle > 0 ? "is-linked" : ""}>Ver</em>
        </span>
        <span className="tl-fg-redline is-v" style={{ opacity: ramp(p, 0.4, 0.44) * (1 - ramp(p, 0.84, 0.88)) }}><b>24</b></span>
        <span className="tl-fg-redline is-h" style={{ opacity: ramp(p, 0.42, 0.46) * (1 - ramp(p, 0.84, 0.88)) }}><b>32</b></span>
        <span className="tl-fg-guide" style={{ opacity: guides }} />
      </div>
      <svg className="tl-fg-noodle" viewBox="0 0 560 200" preserveAspectRatio="none" aria-hidden="true" style={{ opacity: noodle > 0 ? 1 : 0 }}>
        <path d="M0 160 C 220 160, 300 40, 540 40" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - noodle }} />
      </svg>
      <div className="tl-fg-next" style={life(p, [0.78, 0.82], [2, 2], { scale: 0.8 })}>
        <span className="tl-fg-label">Proyecto</span>
        <i /><b /><b />
      </div>
      <span className="tl-fg-cursor" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, opacity: ramp(p, 0.47, 0.5) * (1 - ramp(p, 0.84, 0.88)) }}>
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M1.5 1.5 6.6 14.2l1.9-5.4 5.4-2Z" /></svg>
        <span>Matías</span>
      </span>
      <span className="tl-fg-play" style={life(p, [0.7, 0.74], [0.86, 0.9])}><Play size={13} /> Prototipo</span>
    </div>
  );
}

/* ── 07 · Git & GitHub: a feature branches off, gets reviewed and merges back ──────────── */

const BRANCH = [
  { x: -150, at: 0.24, message: "feat: sala del museo" },
  { x: -40, at: 0.32, message: "feat: cuadros con foco" },
  { x: 70, at: 0.4, message: "fix: placa en móvil" },
];
const CONTRIBUTIONS = Array.from({ length: 7 * 22 }, (_, index) => Math.floor(random(index) * 5));
const GREENS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export function GitBeat({ p }) {
  const main = ramp(p, 0.06, 0.2);
  const branch = ramp(p, 0.2, 0.44);
  const merge = ramp(p, 0.62, 0.7);
  const merged = p >= 0.64;
  const grid = ramp(p, 0.74, 0.86);
  return (
    <div className="tl-git" style={fade(p, 0.9, 0.98)}>
      <svg className="tl-git-graph" viewBox="-420 -70 840 180" aria-hidden="true" style={{ opacity: 1 - ramp(p, 0.72, 0.76) * 0.65 }}>
        <path className="is-main" d="M-400 0 H 400" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - Math.max(main * 0.5, main * 0.5 + ramp(p, 0.62, 0.74) * 0.5) }} />
        <path className="is-branch" d="M-260 0 C -220 0, -220 70, -180 70 H 140" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - branch }} />
        <path className="is-branch" d="M140 70 C 180 70, 180 0, 220 0" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 - merge }} />
        {[[-340, 0.08], [-260, 0.14]].map(([x, at]) => <circle key={x} cx={x} cy="0" r={8 * pop(p, at)} className="is-main" />)}
        {BRANCH.map(({ x, at }) => <circle key={x} cx={x} cy="70" r={8 * pop(p, at)} className="is-branch" />)}
        <circle cx="220" cy="0" r={10 * pop(p, 0.69)} className="is-merge" />
        <text x="-400" y="-18">main</text>
        <text x="-176" y="100" style={{ opacity: ramp(p, 0.22, 0.26) }}>feature/museo</text>
      </svg>
      {BRANCH.map(({ x, at, message }, index) => (
        <span key={message} className="tl-git-commit" style={{ ...life(p, [at, at + 0.04], [0.5, 0.56], { y: 10 }), left: x, top: 104 + (index % 2) * 38 }}>{message}</span>
      ))}
      <div className={`tl-git-pr${merged ? " is-merged" : ""}`} style={{ ...life(p, [0.46, 0.52], [0.72, 0.76]) }}>
        <p><b>Pull request</b> feature/museo → main</p>
        <p className="is-checks"><Check size={13} /> 3 commits · revisión aprobada</p>
        <button type="button" tabIndex={-1} className={p > 0.6 && p < 0.64 ? "is-pressed" : ""}>{merged ? "Merged" : "Merge pull request"}</button>
      </div>
      <div className="tl-git-grid" style={{ opacity: ramp(p, 0.73, 0.76) }}>
        {CONTRIBUTIONS.map((level, index) => {
          const column = Math.floor(index / 7);
          const lit = ramp(grid, column / 22, column / 22 + 0.1);
          return <i key={index} style={{ background: lit > 0.5 ? GREENS[level] : GREENS[0], transform: `scale(${0.6 + 0.4 * lit})` }} />;
        })}
      </div>
    </div>
  );
}
