// Zenth's story told with loose fragments of the real app floating in space. There is no app
// window: each beat brings in only the pieces it needs (the creation bar, a day, a card, a dial,
// faces, a constellation) and lets them go when the story moves on. `p` is the story beat (0–0.62)
// scrubbed by scroll. Copy, colours and data come from zenith-productivity.
import {
  BellOff, CalendarDays, Check, Ellipsis, FileText, Folder, Hand, Link2, Mail, MessageCircle, MonitorUp,
  PartyPopper, Plus, Table2, ThumbsUp,
} from "lucide-react";
import { MoodFace } from "./MoodFace";
import { ZenthFocusIcon } from "./ZenthIcons";
import { Constellation3D, LYRA_NOTE } from "./Constellation3D";
import { along, backOut, easeInOut, easeOut, lerp, life, typed } from "../fx";
import { ramp } from "../timeline";

// A fragment pinned to a point of the stage (in %), free to move in 3D from there.
const Frag = ({ x, y, style, className = "", children, label }) => (
  <div className="zs-frag" style={{ left: `${x}%`, top: `${y}%` }} aria-label={label}>
    <div className={className} style={style}>{children}</div>
  </div>
);

const Cursor = ({ name, color, x, y, opacity = 1, pressed = false }) => (
  <span className={`zn-cursor${pressed ? " is-pressed" : ""}`} style={{ left: `${x}%`, top: `${y}%`, opacity, "--cursor": color }} aria-hidden="true">
    <svg viewBox="0 0 16 16" width="18" height="18"><path d="M1.5 1.5 6.6 14.2l1.9-5.4 5.4-2Z" /></svg>
    <span>{name}</span>
  </span>
);

const TaskCard = ({ meta = "Jue 10 · 09:00" }) => (
  <div className="wt-board-card wt-board-card-colored zs-task">
    <div className="wt-board-card-top"><span className="wt-small-checkbox" /><Ellipsis size={16} /></div>
    <strong>Preparar la propuesta</strong>
    <p>Dar forma a la primera idea</p>
    <span className="wt-inline"><FileText size={13} /> Brief del proyecto</span>
    <div className="wt-board-card-bottom"><span>{meta}</span><span className="wt-avatar">AL</span></div>
  </div>
);

/* ---------- Agenda: words become a day ---------- */

const CREATE = [
  { text: "Preparar la propuesta " },
  { text: "el jueves", chip: "Jue 10" },
  { text: " " },
  { text: "a las 9", chip: "09:00" },
  { text: " " },
  { text: "por 45 minutos", chip: "45 min" },
];
const CREATE_TEXT = CREATE.map((segment) => segment.text).join("");
const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

function Agenda({ p }) {
  const shown = typed(CREATE_TEXT, ramp(p, 0.02, 0.24)).length;
  const recognized = p > 0.25;
  const grow = backOut(ramp(p, 0.42, 0.48));
  let consumed = 0;

  return (
    <>
      <Frag x={50} y={28} className="zs-create" style={life(p, [0, 0.03], [0.4, 0.46])}>
        <Plus size={20} />
        <span>
          {CREATE.map((segment) => {
            const start = consumed;
            consumed += segment.text.length;
            const visible = segment.text.slice(0, Math.max(0, shown - start));
            if (!visible) return null;
            return segment.chip ? <mark key={segment.text} className={recognized ? "is-on" : ""}>{visible}</mark> : <span key={segment.text}>{visible}</span>;
          })}
          <i className="zn-caret" />
        </span>
      </Frag>

      {p > 0.25 && p < 0.47 && CREATE.filter((segment) => segment.chip).map((segment, index) => {
        const pos = along([[0.25, 34 + index * 16, 28], [0.32, 18 + index * 32, -2 - (index % 2) * 8], [0.37, 20 + index * 30, 2], [0.45, 50, 60]], p);
        const air = Math.sin(Math.PI * ramp(p, 0.25, 0.45));
        const pop = backOut(ramp(p, 0.25, 0.29));
        return (
          <Frag key={segment.chip} x={pos.x} y={pos.y} className="zs-chip" style={{ opacity: Math.min(1, pop * 2) * (1 - ramp(p, 0.43, 0.46)), transform: `scale(${pop * (0.7 + air * 0.8)}) rotateX(${air * 26}deg) rotateY(${(index - 1) * air * 30}deg)` }}>
            {segment.chip}
          </Frag>
        );
      })}

      {DAYS.map((day, index) => {
        const isThursday = index === 3;
        const style = life(p, [0.2 + index * 0.012, 0.27 + index * 0.012], isThursday ? [2, 2] : [0.47, 0.53], { y: 26, scale: 0.4 });
        return (
          <Frag key={index} x={14 + index * 12} y={60} className={`zs-day${isThursday && p > 0.3 ? " is-today" : ""}${isThursday && p > 0.33 && p < 0.44 ? " is-pulse" : ""}`} style={isThursday ? { ...style, transform: `${style.transform} scale(${1 + 0.45 * grow})` } : style}>
            <small>{day}</small><b>{7 + index}</b>
          </Frag>
        );
      })}

      <Frag x={50} y={84} style={life(p, [0.46, 0.54], [2, 2], { y: -60, scale: 0.6 })}>
        <div className="zs-agenda-task">
          <span className="zs-check" />
          <div><strong>Preparar la propuesta</strong><p>Jueves 10 · 09:00 – 09:45</p><span className="wt-tag"><Folder size={11} /> Estudio</span></div>
          <ZenthFocusIcon size={18} />
        </div>
      </Frag>
    </>
  );
}

/* ---------- Pizarras: Alba carries the card across ---------- */

function Boards({ p }) {
  const drag = easeInOut(ramp(p, 0.3, 0.46));
  const lift = Math.sin(Math.PI * ramp(p, 0.27, 0.49));
  const enter = easeOut(ramp(p, 0.02, 0.18));
  const card = along([[0.02, -30, -30], [0.18, 27, 36], [0.3, 27, 36], [0.46, 73, 36]], p);
  const alba = along([[0.1, 10, 96], [0.27, 31, 40], [0.3, 31, 40], [0.46, 77, 40], [0.5, 77, 40], [0.62, 60, 96]], p);
  const martin = along([[0.2, 98, 92], [0.4, 92, 74], [0.52, 88, 62], [0.62, 88, 62]], p);
  const comment = backOut(ramp(p, 0.5, 0.57));

  return (
    <>
      {[["Por hacer", 27], ["En curso", 73]].map(([label, x], index) => (
        <Frag key={label} x={x} y={52} className={`zs-zone${index === 1 && drag > 0.4 ? " is-drop" : ""}`} style={life(p, [0.06 + index * 0.03, 0.14 + index * 0.03], [2, 2], { y: 30, scale: 0.92 })}>
          <span>{label} <small>{index === 0 ? (drag > 0.99 ? 1 : 2) : drag > 0.99 ? 1 : 0}</small></span>
        </Frag>
      ))}
      <Frag x={27} y={70} style={life(p, [0.12, 0.2], [2, 2], { y: 20 })}>
        <div className="wt-board-card zs-secondary"><strong>Reunir referencias</strong><div className="wt-board-card-bottom"><span className="wt-inline"><Check size={12} /> 1 / 3</span><span className="wt-inline"><MessageCircle size={12} /> 2</span></div></div>
      </Frag>
      <Frag x={card.x} y={card.y} style={{ opacity: enter, transform: `translateY(${-lift * 50}px) translateZ(${lift * 140}px) rotateX(${lift * 14}deg) rotateZ(${(1 - enter) * -24 + (drag < 0.5 ? -1 : 1) * lift * 5}deg) scale(${0.8 + 0.2 * enter})` }}>
        <TaskCard />
        <i className="zs-shadow" style={{ opacity: lift * 0.5, transform: `translateY(${lift * 70}px)` }} />
      </Frag>
      <Frag x={88} y={60} style={{ opacity: Math.min(1, comment * 1.4), transform: `scale(${0.6 + 0.4 * comment})` }}>
        <div className="zn-comment zs-comment"><span className="wt-avatar">MR</span><span><strong>Martín</strong>Lo reviso antes de la reunión.</span></div>
      </Frag>
      <Cursor name="Alba" color="#ff5c8a" x={alba.x} y={alba.y} opacity={ramp(p, 0.08, 0.14)} pressed={p > 0.28 && p < 0.47} />
      <Cursor name="Martín" color="#2fbf71" x={martin.x} y={martin.y} opacity={ramp(p, 0.18, 0.24)} />
    </>
  );
}

/* ---------- Biblioteca: a page writes itself, then turns into a sheet ---------- */

const NOTE_TITLE = "Una idea que vale la pena";
const NOTE_BODY = "Un espacio sencillo para pensar el próximo proyecto y reunir lo que vamos descubriendo.";
const SLASH = ["Texto", "Título", "Lista", "Tabla", "Hoja de cálculo"];
const PAGES = ["Brief del proyecto", "Referencias", "Notas de la reunión"];

function Library({ p }) {
  const flip = easeInOut(ramp(p, 0.43, 0.5));
  const fan = easeOut(ramp(p, 0.06, 0.3)) * (1 - easeInOut(ramp(p, 0.4, 0.48)));
  const highlight = Math.min(4, Math.floor(ramp(p, 0.3, 0.41) * 5));
  const total = Math.round(400 * ramp(p, 0.55, 0.6));

  return (
    <>
      {PAGES.map((page, index) => (
        <Frag key={page} x={44} y={50} className="zs-page" style={{ opacity: fan, transform: `translate(${-fan * (90 + index * 70)}px, ${fan * (index * 30 - 20)}px) rotateY(${fan * (26 + index * 6)}deg) rotateZ(${-fan * (6 + index * 4)}deg) translateZ(${-60 - index * 40}px)` }}>
          <strong>{page}</strong>
          {Array.from({ length: 5 }, (_, line) => <i key={line} style={{ width: `${86 - ((line * 17 + index * 11) % 40)}%` }} />)}
        </Frag>
      ))}

      <Frag x={44} y={50} className="zs-flip" style={{ ...life(p, [0, 0.05], [2, 2], { y: 60, z: -200 }), transform: `${life(p, [0, 0.05]).transform} rotateY(${flip * 180}deg)` }}>
        <div className="zs-paper zs-face" style={{ visibility: flip < 0.5 ? "visible" : "hidden" }}>
          <span className="zn-task-link" style={{ opacity: ramp(p, 0.04, 0.08) }}><Link2 size={12} /> Preparar la propuesta</span>
          <h3>{typed(NOTE_TITLE, ramp(p, 0.04, 0.12))}{p < 0.12 && <i className="zn-caret" />}</h3>
          <p>{typed(NOTE_BODY, ramp(p, 0.12, 0.22))}{p >= 0.12 && p < 0.22 && <i className="zn-caret" />}</p>
          <h4 style={{ opacity: ramp(p, 0.2, 0.24) }}>Para empezar</h4>
          <div className="wt-note-item" style={{ opacity: ramp(p, 0.21, 0.24) }}><span className={`wt-small-checkbox${p > 0.25 ? " is-checked" : ""}`}>{p > 0.25 && <Check size={11} />}</span><span className={p > 0.25 ? "zn-struck" : ""}>Definir qué queremos lograr</span></div>
          <div className="wt-note-item" style={{ opacity: ramp(p, 0.23, 0.26) }}><span className="wt-small-checkbox" /> Compartir el primer borrador</div>
          {p > 0.28 && p < 0.44 && <p className="zn-slash-line">/{typed("hoja", ramp(p, 0.3, 0.4))}<i className="zn-caret" /></p>}
        </div>
        <div className="zs-paper zs-face zs-back" style={{ visibility: flip >= 0.5 ? "visible" : "hidden" }}>
          <div className="wt-sheet-title"><Table2 size={17} /><strong>Presupuesto del proyecto</strong></div>
          <div className="wt-formula"><span>B4</span><i>fx</i><span>=SUM(B2:B3)</span></div>
          <table aria-label="Hoja de cálculo de ejemplo">
            <tbody>
              <tr><th>1</th><td>Concepto</td><td>Importe</td></tr>
              <tr><th>2</th><td>{p > 0.5 ? "Diseño" : ""}</td><td>{p > 0.5 ? "240" : ""}</td></tr>
              <tr><th>3</th><td>{p > 0.53 ? "Contenido" : ""}</td><td>{p > 0.53 ? "160" : ""}</td></tr>
              <tr><th>4</th><td>Total</td><td className="wt-cell-selected">{total}</td></tr>
            </tbody>
          </table>
        </div>
      </Frag>

      <Frag x={44} y={4} className="zs-toolbar" style={life(p, [0.12, 0.16], [0.22, 0.26], { y: 20 })}>
        <span>Texto</span><i /><b>B</b><em>I</em><u>U</u><i /><Link2 size={14} />
      </Frag>

      <Frag x={86} y={56} className="zs-slash" style={life(p, [0.27, 0.31], [0.42, 0.46], { x: -60, y: 0 })}>
        {SLASH.map((item, index) => <span key={item} className={index === highlight ? "is-on" : ""}>{index === 4 ? <Table2 size={14} /> : <FileText size={14} />}{item}</span>)}
      </Frag>
    </>
  );
}

/* ---------- Enfoque: one thing, and the world waits outside ---------- */

const NOTICES = [
  { Icon: MessageCircle, title: "Alba comentó en Estudio", text: "¿Lo vemos después?", at: 0.12, y: 20 },
  { Icon: CalendarDays, title: "Reunión de equipo", text: "Empieza a las 10:00", at: 0.22, y: 50 },
  { Icon: Mail, title: "Nuevo correo", text: "Presupuesto actualizado", at: 0.32, y: 78 },
];
const SPARKS = Array.from({ length: 22 }, (_, index) => ({ angle: (index / 22) * Math.PI * 2, color: ["#0099ff", "#8B7FFF", "#A8E6CF", "#FFD3B6", "#80D4FF", "#FFAAA5"][index % 6], dist: 170 + (index % 3) * 50 }));

function Focus({ p }) {
  const remaining = 1 - ramp(p, 0.08, 0.5);
  const seconds = Math.round(25 * 60 * remaining);
  const running = p > 0.08 && p < 0.5;
  const done = p >= 0.5;
  const burst = ramp(p, 0.5, 0.62);
  const circumference = 2 * Math.PI * 100;
  const hit = Math.max(...NOTICES.map(({ at }) => Math.sin(Math.PI * ramp(p, at + 0.05, at + 0.08))));

  return (
    <>
      {running && [0, 1, 2].map((ring) => <span key={ring} className="zfx-ring zs-ring" style={{ animationDelay: `${ring * 1.3}s` }} />)}
      <Frag x={50} y={10} className="zs-mission" style={life(p, [0, 0.05])}>
        <span><i className="wt-status-dot" /> Misión actual</span>
        <strong className={done ? "zn-mission-done" : ""}>{done && <Check size={18} />}Preparar la propuesta</strong>
      </Frag>
      <Frag x={50} y={50} className={`zs-dial${running ? " is-running" : ""}`} style={life(p, [0, 0.08], [2, 2], { y: 80, scale: 0.6, z: -300 })}>
        <span className="zs-shield" style={{ opacity: hit }} />
        <svg viewBox="0 0 240 240" role="img" aria-label="Temporizador de enfoque">
          <circle className="zn-dial-track" cx="120" cy="120" r="100" />
          <circle className="zn-dial-progress" cx="120" cy="120" r="100" transform="rotate(-90 120 120)" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - remaining)} />
        </svg>
        <div className="zn-dial-copy">
          <span>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
          <span>{done ? "Sesión terminada" : running ? "Tiempo para concentrarte" : "A tu ritmo"}</span>
        </div>
      </Frag>
      {burst > 0 && burst < 1 && SPARKS.map((spark, index) => (
        <Frag key={index} x={50} y={50} className="zs-spark" style={{ background: spark.color, opacity: 1 - burst, transform: `translate(${Math.cos(spark.angle) * spark.dist * easeOut(burst)}px, ${Math.sin(spark.angle) * spark.dist * easeOut(burst)}px) scale(${1.4 - burst})` }} />
      ))}
      <Frag x={50} y={92} className="zs-pill" style={life(p, [0.52, 0.58], [2, 2], { y: 20, scale: 0.6 })}>Primera sesión · +25 min</Frag>
      <Frag x={50} y={92} className="zs-caption" style={life(p, [0.1, 0.14], [0.46, 0.5], { y: 10 })}><BellOff size={13} /> Lluvia suave · el resto espera</Frag>

      {NOTICES.map(({ Icon, title, text, at, y }, index) => {
        const approach = easeOut(ramp(p, at, at + 0.06));
        const fall = easeInOut(ramp(p, at + 0.065, at + 0.15));
        if (approach <= 0 || fall >= 1) return null;
        return (
          <Frag key={title} x={lerp(-60, 16, approach) - fall * 20} y={y + fall * 60} className="zfx-notice zs-notice" style={{ opacity: 1 - ramp(fall, 0.6, 1), filter: `blur(${fall * 6}px)`, transform: `translateZ(${(1 - approach) * 260}px) rotateY(${(1 - approach) * 40 - fall * 30}deg) rotateZ(${fall * (index % 2 ? -50 : 40)}deg)` }}>
            <Icon size={18} />
            <span><strong>{title}</strong>{text}</span>
            {fall > 0.05 && <em><BellOff size={12} /> En espera</em>}
          </Frag>
        );
      })}
    </>
  );
}

/* ---------- Reuniones: faces, voices and a shared screen ---------- */

const PEOPLE = [
  { name: "AL", label: "Alba", color: "#ff5c8a", at: [0.02, 0.12], from: [-40, 34], seat: [28, 36], row: [38, 12] },
  { name: "MR", label: "Martín", color: "#2fbf71", at: [0.05, 0.15], from: [140, 34], seat: [72, 36], row: [50, 12] },
  { name: "SO", label: "Sofía", color: "#8B7FFF", at: [0.28, 0.36], from: [50, 140], seat: [50, 74], row: [62, 12], guest: true },
];
const SAYS = [
  { who: 0, at: 0.1, text: "Dejé el brief en la pizarra. ¿Lo vemos?" },
  { who: 1, at: 0.2, text: "Ya la moví a En curso." },
  { who: 2, at: 0.36, text: "¡Hola! Gracias por invitarme." },
];
const REACT = [{ Icon: Hand, who: 1, at: 0.16 }, { Icon: PartyPopper, who: 0, at: 0.24 }, { Icon: ThumbsUp, who: 2, at: 0.4 }];

function Meetings({ p }) {
  const share = easeInOut(ramp(p, 0.44, 0.52));
  const spots = PEOPLE.map((person) => {
    const arrive = easeOut(ramp(p, ...person.at));
    const seat = { x: lerp(person.seat[0], person.row[0], share), y: lerp(person.seat[1], person.row[1], share) };
    return { ...person, arrive, x: lerp(person.from[0], seat.x, arrive), y: lerp(person.from[1], seat.y, arrive) };
  });

  return (
    <>
      {spots.map((person) => (
        <Frag key={person.name} x={person.x} y={person.y} className={`zs-person${p > person.at[1] && share < 0.5 ? " is-speaking" : ""}`} style={{ opacity: person.arrive, "--ring": person.color, transform: `scale(${(0.5 + 0.5 * person.arrive) * (1 - 0.45 * share)})` }}>
          <b>{person.name}</b>
          <small>{person.label}{person.guest && <em className="zn-guest">Invitado</em>}</small>
        </Frag>
      ))}
      {SAYS.map((say) => {
        const person = spots[say.who];
        const style = life(p, [say.at, say.at + 0.05], [say.at + 0.13, say.at + 0.17], { y: 16, scale: 0.6 });
        return (
          <Frag key={say.at} x={person.x} y={person.y - 19} className="zs-bubble" style={{ ...style, "--ring": person.color }}>
            {say.text}
          </Frag>
        );
      })}
      {REACT.map(({ Icon, who, at }) => {
        const t = ramp(p, at, at + 0.1);
        if (t <= 0 || t >= 1) return null;
        const person = spots[who];
        return <Frag key={at} x={person.x + 6} y={person.y - 6 - t * 40} className="zfx-reaction" style={{ opacity: Math.sin(Math.PI * t), transform: `scale(${0.6 + Math.sin(Math.PI * t) * 0.9}) rotate(${(t - 0.5) * 30}deg)` }}><Icon size={22} /></Frag>;
      })}
      <Frag x={50} y={60} className="zs-share" style={life(p, [0.44, 0.52], [2, 2], { y: 80, z: -300, scale: 0.5 })}>
        <span><MonitorUp size={14} /> Martín comparte su pantalla</span>
        <div><i /><i className="is-card" /><i /></div>
      </Frag>
    </>
  );
}

/* ---------- Tu progreso: it all adds up, then the sky answers ---------- */

export const MOODS = [
  { label: "Excelente", variant: "EXCELENTE", hex: "#8B7FFF", feature: "#FFFFFF" },
  { label: "Bien", variant: "BIEN", hex: "#A8E6CF", feature: "#064e3b" },
  { label: "Neutral", variant: "NEUTRAL", hex: "#FFD3B6", feature: "#78350f" },
  { label: "Bajo", variant: "BAJO", hex: "#80D4FF", feature: "#1e3a8a" },
  { label: "Mal", variant: "MAL", hex: "#FFAAA5", feature: "#7f1d1d" },
];
const ACHIEVEMENTS = [
  { name: "Primer paso", text: "Cerraste tu primera tarea. El sistema ya tiene con qué empezar a medir.", at: [0.2, 0.27] },
  { name: "Primera sesión", text: "Veinticinco minutos sin mirar a otro lado. El foco también se entrena.", at: [0.25, 0.32] },
];

function Progress({ p, mood }) {
  const gone = [0.42, 0.47];
  const tasks = 11 + (p > 0.14 ? 1 : 0);
  const minutes = 65 + Math.round(25 * ramp(p, 0.12, 0.2));

  return (
    <>
      <Frag x={28} y={18} className="zs-stat" style={life(p, [0, 0.05], gone)}><strong className={p > 0.14 && p < 0.22 ? "zn-bump" : ""}>{tasks}</strong><span>Tareas completadas</span></Frag>
      <Frag x={68} y={18} className="zs-stat" style={life(p, [0.03, 0.08], gone)}><strong className={p > 0.16 && p < 0.24 ? "zn-bump" : ""}>{minutes}<small> min</small></strong><span>Tiempo de enfoque</span></Frag>
      {[["+1 tarea", [0.02, 0.14], 28], ["+25 min", [0.06, 0.18], 68]].map(([text, range, target]) => {
        const t = easeInOut(ramp(p, ...range));
        return t > 0 && t < 1 ? <Frag key={text} x={lerp(-30, target, t)} y={18 - Math.sin(Math.PI * t) * 16} className="zs-chip" style={{ opacity: 1 - ramp(t, 0.8, 1), transform: `scale(${1.2 - 0.4 * t})` }}>{text}</Frag> : null;
      })}
      {[38, 65, 48, 86, 58, 28, 12].map((height, index) => (
        <Frag key={index} x={20 + index * 10} y={56} className="zs-bar" style={{ ...life(p, [0.02 + index * 0.02, 0.08 + index * 0.02], gone, { y: 20 }), "--h": `${(height + (index === 3 ? 10 * ramp(p, 0.14, 0.22) : 0)) * 1.6}px` }}>
          <i className={index === 3 && p > 0.16 ? "is-today" : ""} style={{ transform: `scaleY(${ramp(p, 0.04 + index * 0.02, 0.2 + index * 0.02)})` }} />
          <small>{["L", "M", "M", "J", "V", "S", "D"][index]}</small>
        </Frag>
      ))}
      {ACHIEVEMENTS.map((achievement, index) => (
        <Frag key={achievement.name} x={82} y={36 + index * 18} className="zn-achievement zs-achievement" style={life(p, achievement.at, [0.37, 0.42], { x: 160, y: 0 })}>
          <span><Check size={14} /></span>
          <div><strong>Logro · {achievement.name}</strong><small>{achievement.text}</small></div>
        </Frag>
      ))}
      {MOODS.map((item, index) => (
        <Frag key={item.variant} x={26 + index * 12} y={86} className={`zs-mood${mood === item.variant ? " is-on" : ""}`} style={life(p, [0.26 + index * 0.02, 0.31 + index * 0.02], gone, { y: 30, scale: 0.3 })}>
          <span style={{ color: item.hex }}><MoodFace variant={item.variant} feature={item.feature} size={46} gesture={mood === item.variant} /></span>
          <small>{item.label}</small>
        </Frag>
      ))}
    </>
  );
}

// Night falls over the whole scene and the level's constellation lights up in 3D.
export function ProgressSky({ p }) {
  if (p < 0.42) return null;
  return (
    <div className="zfx-sky-layer" style={{ opacity: ramp(p, 0.42, 0.5) }}>
      <Constellation3D p={p} />
      <p className="zfx-lyra" style={{ opacity: ramp(p, 0.58, 0.62) }}>
        <small>Nivel 2 desbloqueado</small>
        <strong>Lira</strong>
        {LYRA_NOTE}
      </p>
    </div>
  );
}

// From src/modules/meetings/domain/backgrounds.ts
export const CALL_BACKGROUNDS = [
  { id: "midnight", label: "Medianoche", gradient: "radial-gradient(circle at 26% 20%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(160deg, #0b1220 0%, #1a2340 55%, #05060a 100%)" },
  { id: "ocean", label: "Océano", gradient: "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(160deg, #062f3a 0%, #0d4f5e 45%, #04141c 100%)" },
  { id: "aurora", label: "Aurora", gradient: "radial-gradient(circle at 24% 16%, rgba(255,255,255,0.12), transparent 50%), linear-gradient(135deg, #1b1035 0%, #33236b 35%, #0c5a63 75%, #041018 100%)" },
  { id: "sunset", label: "Atardecer", gradient: "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(150deg, #3a1030 0%, #7a2c4a 40%, #c1553f 75%, #1a0d12 100%)" },
  { id: "forest", label: "Bosque", gradient: "radial-gradient(circle at 24% 18%, rgba(255,255,255,0.09), transparent 55%), linear-gradient(160deg, #0c2318 0%, #163d27 50%, #05100a 100%)" },
  { id: "grape", label: "Uva", gradient: "radial-gradient(circle at 26% 18%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(150deg, #2a0f3d 0%, #5b1f66 45%, #14071e 100%)" },
  { id: "graphite", label: "Grafito", gradient: "radial-gradient(circle at 24% 18%, rgba(255,255,255,0.07), transparent 55%), linear-gradient(160deg, #202226 0%, #35383e 50%, #0d0e10 100%)" },
  { id: "rose", label: "Rosa", gradient: "radial-gradient(circle at 26% 18%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(150deg, #33101c 0%, #6e1f3d 45%, #170a10 100%)" },
];

export const ZENTH_BEATS = { agenda: Agenda, boards: Boards, library: Library, focus: Focus, meetings: Meetings, progress: Progress };
