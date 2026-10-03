// Perfil told as objects that do what they say. Every value is a pure function of the chapter's
// scroll progress `p` (0–1), so scrolling back rewinds each moment exactly.
import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight, Check, Database, Layout, Server } from "lucide-react";
import { along, backOut, easeInOut, easeOut, lerp, life } from "../projects/fx";
import { clamp, ramp } from "../projects/timeline";
import { Odometer } from "../projects/Odometer";

const random = (seed) => {
  const value = Math.sin(seed * 78.233 + 1.7) * 43758.5453;
  return value - Math.floor(value);
};

// A word arriving out of depth: scattered far behind the page, it flies forward into its place.
export const fromDepth = (t, seed, spread = 1) => {
  const e = easeOut(clamp(t));
  return {
    opacity: e,
    transform: `translate3d(${(1 - e) * (random(seed) - 0.5) * 520 * spread}px, ${(1 - e) * (random(seed + 1) - 0.5) * 320 * spread}px, ${(1 - e) * -900}px) rotateY(${(1 - e) * (random(seed + 2) - 0.5) * 100}deg)`,
    filter: e < 1 ? `blur(${(1 - e) * 10}px)` : undefined,
  };
};

const exitUp = (p, from, to) => {
  const t = easeInOut(ramp(p, from, to));
  return {
    opacity: 1 - t,
    transform: `translate3d(0, ${-t * 90}px, ${t * 160}px)`,
    filter: t > 0 ? `blur(${t * 12}px)` : undefined,
    visibility: t >= 1 ? "hidden" : undefined,
  };
};

// Words lit as the scroll reads them; the rest wait as a ghost so the paragraph never reflows.
const Reading = ({ segments, p, from, to, marks = {}, lifted = {} }) => {
  const words = segments.flatMap((segment) => segment.text.split(/(\s+)/).filter(Boolean).map((word) => ({ word, mark: segment.mark })));
  const count = words.filter(({ word }) => word.trim()).length;
  let index = 0;
  return words.map(({ word, mark }, position) => {
    if (!word.trim()) return word;
    const t = ramp(p, from + ((to - from) * index) / count, from + ((to - from) * (index + 1.5)) / count);
    index += 1;
    const style = { opacity: lerp(0.14, 1, t) * (1 - 0.75 * (lifted[mark] ?? 0)) };
    if (mark) return <mark key={position} ref={marks[mark]} className={t >= 1 ? "is-lit" : ""} style={style}>{word}</mark>;
    return <span key={position} style={style}>{word}</span>;
  });
};

/* ── 01 · Perfil ─────────────────────────────────────────────────────────────── */

const TITLE_WORDS = ["Ideas", "que", "se", "vuelven"];
const LEAD = "Soy Matías Luzardo, desarrollador web uruguayo de 22 años y estudiante de Tecnologías de la Información.";
const TECH = ["React", "TypeScript", "Supabase", "UI/UX"];
const BODY = [
  { text: "Combino formación técnica y aprendizaje autodidacta para crear productos web útiles, ágiles y visualmente cuidados. Me interesan especialmente " },
  { text: "React", mark: "React" }, { text: ", " },
  { text: "TypeScript", mark: "TypeScript" }, { text: ", " },
  { text: "Supabase", mark: "Supabase" },
  { text: " y el diseño centrado en " },
  { text: "UI/UX", mark: "UI/UX" },
  { text: ". Busco mi primera oportunidad profesional para aportar, aprender y construir productos que resuelvan problemas reales." },
];

export function AboutBeat({ p, compact, avatar }) {
  const marks = { React: useRef(null), TypeScript: useRef(null), Supabase: useRef(null), "UI/UX": useRef(null) };
  const origins = useRef({});
  // Where each technology sits in the paragraph, so its chip can lift out of that exact word.
  useLayoutEffect(() => {
    if (p > 0.74) return;
    for (const name of TECH) {
      const node = marks[name].current;
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      origins.current[name] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  });

  const fill = ramp(p, 0.4, 0.52);
  const emArrive = ramp(p, 0.28, 0.4);
  const centerY = avatar.y - avatar.height * 0.12;

  return (
    <div className={`in-beat in-about${compact ? " is-compact" : ""}`} aria-hidden="true">
      <div className="in-about-copy" style={exitUp(p, 0.9, 0.99)}>
        <p className="in-eyebrow" style={life(p, [0.08, 0.18])}><i /> UN POCO SOBRE MÍ</p>
        <h2 className="in-about-title">
          <span className="in-about-line">
            {TITLE_WORDS.map((word, index) => (
              <span key={word} style={fromDepth(ramp(p, 0.1 + index * 0.045, 0.28 + index * 0.045), index + 3)}>{word}</span>
            ))}
          </span>
          <em style={{ ...fromDepth(emArrive, 9, 0.4), "--fill": fill }}>experiencias reales.</em>
        </h2>
        <div className="in-about-text">
          <p className="in-lead" style={compact ? life(p, [0.38, 0.44], [0.55, 0.6]) : life(p, [0.36, 0.42])}>
            <Reading segments={[{ text: LEAD }]} p={p} from={0.4} to={0.56} />
          </p>
          <p className="in-body" style={compact ? life(p, [0.58, 0.63]) : life(p, [0.54, 0.6])}>
            <Reading segments={BODY} p={p} from={0.58} to={0.74} marks={marks} lifted={Object.fromEntries(TECH.map((name, index) => [name, ramp(p, 0.72 + index * 0.025, 0.76 + index * 0.025)]))} />
          </p>
        </div>
        <a className="in-link" href="#contact" tabIndex={-1} style={life(p, [0.8, 0.86])}>Trabajemos juntos <ArrowUpRight size={16} /></a>
      </div>

      {/* The technologies lift out of the paragraph and orbit the avatar. */}
      {TECH.map((name, index) => {
        const start = 0.72 + index * 0.025;
        const t = easeInOut(ramp(p, start, start + 0.12));
        const appear = ramp(p, start, start + 0.02) * (1 - ramp(p, 0.9, 0.97));
        if (appear <= 0) return null;
        const angle = index * (Math.PI / 2) + p * 5 - 0.6;
        const orbit = {
          x: avatar.x + Math.cos(angle) * avatar.height * (compact ? 0.62 : 0.42),
          y: centerY + Math.sin(angle) * avatar.height * 0.13,
        };
        const origin = origins.current[name] ?? orbit;
        const depth = Math.sin(angle) * t;
        const x = lerp(origin.x, orbit.x, t);
        const y = lerp(origin.y, orbit.y, t) - Math.sin(Math.PI * t) * 80;
        return (
          <span
            key={name}
            className="in-chip"
            style={{
              left: x, top: y, opacity: appear * lerp(1, 0.55 + 0.45 * (depth + 1) / 2, t),
              zIndex: depth < 0 ? 1 : 3,
              transform: `translate(-50%, -50%) scale(${lerp(1, 0.9 + depth * 0.2, t)})`,
              filter: depth < -0.3 ? `blur(${(-depth - 0.3) * 4}px)` : undefined,
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}

/* ── Principles ──────────────────────────────────────────────────────────────── */

export const PRINCIPLES = [
  { icon: Layout, title: "Interfaces claras", text: "Diseño centrado en jerarquía, respuesta visual y una experiencia simple." },
  { icon: Server, title: "Código que escala", text: "Componentes mantenibles y soluciones pensadas para crecer con el producto." },
  { icon: Database, title: "Visión completa", text: "Frontend, backend y datos conectados en una experiencia coherente." },
];

const PrincipleCopy = ({ index, p }) => {
  const { icon: Icon, title, text } = PRINCIPLES[index];
  return (
    <div className="in-principle" style={exitUp(p, 0.88, 0.97)}>
      <span className="in-principle-number" style={life(p, [0.02, 0.14], [2, 2], { z: -400, y: 0 })}>0{index + 2}</span>
      <Icon size={22} strokeWidth={1.5} style={life(p, [0.06, 0.14])} />
      <h3 style={life(p, [0.07, 0.16])}>{title}</h3>
      <p style={life(p, [0.1, 0.19])}>{text}</p>
    </div>
  );
};

/* 01 · Interfaces claras: a blurry, scattered interface focuses and falls into order. */

const UI_PIECES = [
  { id: "nav", x: 0, y: -158, w: 540, h: 42 },
  { id: "title", x: -128, y: -84, w: 284, h: 58 },
  { id: "sub", x: -128, y: -28, w: 284, h: 34 },
  { id: "media", x: 142, y: -56, w: 256, h: 150 },
  { id: "button", x: -198, y: 34, w: 144, h: 44 },
  { id: "card-1", x: -182, y: 132, w: 168, h: 100 },
  { id: "card-2", x: 0, y: 132, w: 168, h: 100 },
  { id: "card-3", x: 182, y: 132, w: 168, h: 100 },
];
const UI_NOISE = [
  { id: "blob", x: 210, y: -150, w: 120, h: 120 },
  { id: "badge", x: -40, y: 40, w: 120, h: 30 },
  { id: "extra", x: 60, y: 30, w: 150, h: 44 },
];

const UiPiece = ({ piece, p, index, noise, pressed, done, hierarchy }) => {
  const seed = index * 4 + (noise ? 40 : 0);
  const appear = easeOut(ramp(p, 0.02 + random(seed + 3) * 0.08, 0.12 + random(seed + 3) * 0.08));
  const settle = noise ? 0 : easeInOut(ramp(p, 0.14 + index * 0.035, 0.42 + index * 0.035));
  const away = noise ? easeInOut(ramp(p, 0.34 + index * 0.05, 0.52 + index * 0.05)) : 0;
  const scatter = 1 - settle;
  const dx = (random(seed) - 0.5) * 680 * scatter;
  const dy = (random(seed + 1) - 0.5) * 440 * scatter;
  const rotate = (random(seed + 2) - 0.5) * 46 * scatter;
  const scale = lerp(1, 0.72 + random(seed + 5) * 0.6, scatter);
  const blur = scatter * 12 + away * 8;
  const opacity = appear * (1 - away);
  if (opacity <= 0.001) return null;
  return (
    <div
      className={`in-ui-piece is-${piece.id}${noise ? " is-noise" : ""}${pressed ? " is-pressed" : ""}${done ? " is-done" : ""}`}
      style={{
        width: piece.w, height: piece.h, opacity, "--hierarchy": hierarchy,
        transform: `translate(-50%, -50%) translate3d(${piece.x + dx + away * (piece.x * 2)}px, ${piece.y + dy - away * 120}px, ${away * 700}px) rotate(${rotate}deg) scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {piece.id === "nav" && <><i className="in-ui-logo" /><b /><b /><b /></>}
      {piece.id === "title" && <strong>Todo en su lugar.</strong>}
      {piece.id === "sub" && <><b /><b /></>}
      {piece.id === "media" && <span className="in-ui-media" />}
      {piece.id === "button" && <span>{done ? <><Check size={15} /> Listo</> : "Empezar"}</span>}
      {piece.id.startsWith("card") && <><i /><b /><b /></>}
      {piece.id === "blob" && <span />}
      {piece.id === "badge" && <span>NUEVO!!</span>}
      {piece.id === "extra" && <span>Click acá</span>}
    </div>
  );
};

export function ClarityBeat({ p, compact }) {
  const hierarchy = easeInOut(ramp(p, 0.5, 0.62));
  const cursor = along([[0.6, 330, 270], [0.73, -186, 42]], p);
  const cursorOpacity = ramp(p, 0.6, 0.63) * (1 - ramp(p, 0.86, 0.9));
  const pressed = p > 0.73 && p < 0.78;
  const done = p >= 0.78;
  const ripple = ramp(p, 0.75, 0.88);
  const guides = ramp(p, 0.22, 0.32) * (1 - ramp(p, 0.58, 0.68));
  const stage = exitUp(p, 0.88, 0.98);

  return (
    <div className={`in-beat in-clarity${compact ? " is-compact" : ""}`} aria-hidden="true">
      <PrincipleCopy index={0} p={p} />
      <div className="in-object" style={stage}>
        <div className="in-ui">
          <div className="in-ui-guides" style={{ opacity: guides }}>
            {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ transform: `scaleY(${ramp(p, 0.22 + index * 0.008, 0.3 + index * 0.008)})` }} />)}
          </div>
          {UI_NOISE.map((piece, index) => <UiPiece key={piece.id} piece={piece} index={index} p={p} noise />)}
          {UI_PIECES.map((piece, index) => (
            <UiPiece key={piece.id} piece={piece} index={index} p={p} hierarchy={hierarchy}
              pressed={piece.id === "button" && pressed} done={piece.id === "button" && done} />
          ))}
          {ripple > 0 && ripple < 1 && (
            <span className="in-ui-ripple" style={{ transform: `translate(-50%, -50%) translate(-198px, 34px) scale(${0.6 + ripple * 2.4})`, opacity: 1 - ripple }} />
          )}
          {cursorOpacity > 0 && (
            <svg className={`in-ui-cursor${pressed ? " is-pressed" : ""}`} viewBox="0 0 16 16" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, opacity: cursorOpacity }}>
              <path d="M1.5 1.5 6.6 14.2l1.9-5.4 5.4-2Z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* 02 · Código que escala: one component, written once, becomes a whole city of instances. */

const SIDE = 9;
const CENTER = (SIDE - 1) / 2;
const CELLS = Array.from({ length: SIDE * SIDE }, (_, index) => {
  const col = index % SIDE;
  const row = Math.floor(index / SIDE);
  return { col, row, distance: Math.hypot(col - CENTER, row - CENTER) };
}).sort((a, b) => a.distance - b.distance || a.row - b.row || a.col - b.col)
  .map((cell, order) => ({ ...cell, at: 0.2 + (0.46 * Math.log2(order + 1)) / Math.log2(SIDE * SIDE) }));

const CODE = [
  [["export ", "kw"], ["function ", "kw"], ["Card", "fn"], ["({ ", ""], ["title", "arg"], [" }) {", ""]],
  [["  return ", "kw"], ["<article", "tag"], ["__INSERT__", "attr"], [">", "tag"], ["{title}", "arg"], ["</article>", "tag"], [";", ""]],
  [["}", ""]],
];
const INSERT = ' tone="signal"';

const Code = ({ p }) => {
  const total = CODE.flat().reduce((sum, [text]) => sum + (text === "__INSERT__" ? 0 : text.length), 0);
  let budget = Math.round(total * ramp(p, 0.05, 0.2));
  const insert = INSERT.slice(0, Math.round(INSERT.length * ramp(p, 0.7, 0.76)));
  return (
    <pre className="in-code" style={{ ...life(p, [0.03, 0.08]), ...(p > 0.88 ? exitUp(p, 0.88, 0.97) : {}) }}>
      {CODE.map((line, row) => (
        <code key={row}>
          {line.map(([text, kind], position) => {
            if (text === "__INSERT__") return insert ? <span key={position} className={`is-${kind} is-new`}>{insert}</span> : null;
            const shown = text.slice(0, Math.max(0, budget));
            budget -= text.length;
            return shown ? <span key={position} className={kind ? `is-${kind}` : undefined}>{shown}</span> : null;
          })}
          {row === 0 && budget > -1 && p < 0.2 && <i className="in-caret" />}
        </code>
      ))}
    </pre>
  );
};

export function ScaleBeat({ p, compact }) {
  const zoom = easeInOut(ramp(p, 0.2, 0.62));
  const tilt = easeInOut(ramp(p, 0.3, 0.62));
  const leave = easeInOut(ramp(p, 0.88, 0.98));
  const visible = CELLS.filter((cell) => p >= cell.at).length;
  return (
    <div className={`in-beat in-scale${compact ? " is-compact" : ""}`} aria-hidden="true">
      <PrincipleCopy index={1} p={p} />
      <Code p={p} />
      <p className="in-count" style={{ ...life(p, [0.24, 0.3]), ...(leave > 0 ? exitUp(p, 0.88, 0.97) : {}) }}>
        <strong><Odometer text={String(Math.max(1, visible)).padStart(2, "0")} /></strong>
        <span>{"instancias de <Card />"}<small>{p > 0.76 ? "un cambio, en todas" : "un solo componente"}</small></span>
      </p>
      <div className="in-object" style={{ opacity: 1 - leave, visibility: leave >= 1 ? "hidden" : undefined }}>
        <div
          className="in-city"
          style={{
            width: SIDE * 74, height: SIDE * 50,
            transform: `translate(-50%, -50%) translateZ(${-leave * 500}px) rotateX(${tilt * 54 + leave * 10}deg) rotateZ(${tilt * -34 - leave * 20}deg) scale(${lerp(2.6, compact ? 0.62 : 0.78, zoom)})`,
          }}
        >
          {CELLS.map((cell) => {
            const pop = backOut(ramp(p, cell.at, cell.at + 0.05));
            if (pop <= 0) return null;
            const wave = ramp(p, 0.76 + cell.distance * 0.018, 0.8 + cell.distance * 0.018);
            return (
              <div
                key={`${cell.col}-${cell.row}`}
                className="in-inst"
                style={{
                  left: cell.col * 74, top: cell.row * 50, "--wave": wave,
                  transform: `translateZ(${Math.sin(Math.PI * wave) * 34}px) scale(${pop})`,
                }}
              >
                <i /><b /><b />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* 03 · Visión completa: zoom out from one button to the layers that make it work. */

const LAYERS = [
  { id: "front", label: "Frontend", detail: "React · TypeScript" },
  { id: "back", label: "Backend", detail: "API · lógica" },
  { id: "data", label: "Datos", detail: "Supabase" },
];

export function StackBeat({ p, compact }) {
  const zoom = easeInOut(ramp(p, 0.04, 0.34));
  const tilt = easeInOut(ramp(p, 0.34, 0.5));
  const explode = easeOut(ramp(p, 0.4, 0.56)) * (1 - easeInOut(ramp(p, 0.88, 0.97)));
  const gap = compact ? 104 : Math.min(140, window.innerHeight * 0.17);
  const layerY = (index) => (index - 1) * gap * explode;
  const packetOn = p > 0.55 && p < 0.86;
  const packet = along([[0.56, 0, layerY(0)], [0.63, 0, layerY(1)], [0.7, 0, layerY(2)], [0.77, 0, layerY(1)], [0.84, 0, layerY(0)]], p);
  const near = (index) => packetOn && Math.abs(packet.y - layerY(index)) < 26;
  const saved = p >= 0.84;
  const leave = exitUp(p, 0.9, 0.99);

  return (
    <div className={`in-beat in-stack${compact ? " is-compact" : ""}`} aria-hidden="true">
      <PrincipleCopy index={2} p={p} />
      <div className="in-object" style={leave}>
        <div className="in-stack-scene" style={{ ...life(p, [0.02, 0.08], [2, 2], { y: 0, scale: 1 }), transform: `scale(${lerp(3.4, 1, zoom)})`, transformOrigin: "50% calc(50% + 34px)" }}>
          <span className="in-beam" style={{ top: layerY(0), height: layerY(2) - layerY(0), opacity: explode * ramp(p, 0.5, 0.56) }} />
          {LAYERS.map((layer, index) => (
            <div
              key={layer.id}
              className={`in-layer is-${layer.id}${near(index) ? " is-hot" : ""}`}
              style={{
                zIndex: 3 - index,
                opacity: index === 0 ? 1 : explode,
                transform: `translate(-50%, -50%) translateY(${layerY(index)}px) rotateX(${tilt * 56}deg) rotateZ(${tilt * -40}deg)`,
              }}
            >
              {layer.id === "front" && (
                <>
                  <header><i /><i /><i /></header>
                  <div className="in-layer-form">
                    <span>Nueva idea</span>
                    <button type="button" tabIndex={-1} className={saved ? "is-done" : ""}>{saved ? <><Check size={13} /> Guardado</> : "Guardar"}</button>
                  </div>
                  <b /><b />
                </>
              )}
              {layer.id === "back" && (
                <>
                  <code><em>POST</em> /ideas</code>
                  <code className={p > 0.72 ? "is-ok" : ""}>{p > 0.72 ? "201 Created" : "…"}</code>
                </>
              )}
              {layer.id === "data" && (
                <div className="in-table">
                  <span /><span /><span />
                  {p > 0.69 && <span className="is-new" style={{ opacity: ramp(p, 0.69, 0.72) }}>Nueva idea</span>}
                </div>
              )}
            </div>
          ))}
          {LAYERS.map((layer, index) => (
            <p
              key={layer.id}
              className="in-layer-label"
              style={{ top: layerY(index), opacity: explode * ramp(p, 0.5 + index * 0.02, 0.56 + index * 0.02) }}
            >
              <strong>{layer.label}</strong><small>{layer.detail}</small>
            </p>
          ))}
          {packetOn && <span className="in-packet" style={{ transform: `translate(-50%, -50%) translate(${packet.x}px, ${packet.y}px)` }} />}
        </div>
      </div>
    </div>
  );
}
