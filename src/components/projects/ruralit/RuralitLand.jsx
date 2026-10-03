// Ruralit on large screens: the field is the stage. Things happen on the land, in perspective,
// instead of in cards beside it: spoken words are planted as signposts, records travel down the
// farm road, the herd grazes, the months grow like crops, projects are plots and the night
// gathers the day into a report. `p` is the story beat (0–0.62). Figures follow ruralia.
import { BellRing, BookOpen, CircleCheck, Download, Mic, Package, TrendingUp } from "lucide-react";
import { Odometer } from "../Odometer";
import { along, easeInOut, easeOut, lerp, life, typed } from "../fx";
import { clamp, ramp } from "../timeline";
import { Calf } from "./RuralitStory";

const HORIZON = 66;
// How big something standing on the ground looks at height y (% of the viewport).
const depthAt = (y) => 0.32 + 0.68 * clamp((y - HORIZON) / (100 - HORIZON));
const money = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 });

const L = ({ x, y, style, className = "", children }) => (
  <div className="rl-frag" style={{ left: `${x}%`, top: `${y}%` }}>
    <div className={className} style={style}>{children}</div>
  </div>
);

const random = (seed) => {
  const value = Math.sin(seed * 45.17 + 2.3) * 43758.5453;
  return value - Math.floor(value);
};

/* ── Inicio: said out loud, planted in the field, gathered into one record ──────────────── */

const SALE = [
  { text: "Vendí", kind: "tipo" }, { text: " " }, { text: "2 terneros", kind: "cantidad" }, { text: " por " }, { text: "900 USD", kind: "monto" },
];
const SALE_TEXT = SALE.map((segment) => segment.text).join("");
const POSTS = [
  { label: "Tipo", value: "Venta", kind: "tipo", from: [52, 44], to: [47, 80] },
  { label: "Cantidad", value: "2 terneros", kind: "cantidad", from: [63, 44], to: [64, 90] },
  { label: "Monto", value: "US$ 900", kind: "monto", from: [74, 44], to: [82, 78] },
];

function Inicio({ p }) {
  const shown = typed(SALE_TEXT, ramp(p, 0.05, 0.2)).length;
  const recognized = p > 0.21;
  const listening = p > 0.01 && p < 0.21;
  const gather = easeInOut(ramp(p, 0.38, 0.46));
  const record = life(p, [0.42, 0.47], [0.52, 0.57], { y: 20, scale: 0.8 });
  let consumed = 0;
  return (
    <>
      <L x={63} y={20} className={`rl-mic${listening ? " is-listening" : ""}`} style={life(p, [0, 0.04], [0.28, 0.33])}>
        {[0, 1, 2].map((ring) => <i key={ring} style={{ "--ring": ((p * 9 + ring / 3) % 1) }} />)}
        <Mic size={22} />
      </L>
      <L x={63} y={36} className="rl-sentence" style={life(p, [0.03, 0.07], [0.3, 0.34], { y: 10 })}>
        {SALE.map((segment) => {
          const start = consumed;
          consumed += segment.text.length;
          const visible = segment.text.slice(0, Math.max(0, shown - start));
          if (!visible) return null;
          return segment.kind ? <mark key={segment.text} className={recognized ? `is-${segment.kind}` : ""}>{visible}</mark> : <span key={segment.text}>{visible}</span>;
        })}
        {shown < SALE_TEXT.length && <i className="rl-caret" />}
        {!shown && <em>¿Qué pasó hoy?</em>}
      </L>

      {/* The recognised words fall into the field as signposts, then gather into one record. */}
      {POSTS.map((post, index) => {
        const start = 0.23 + index * 0.025;
        const fly = easeInOut(ramp(p, start, start + 0.08));
        if (fly <= 0 || gather >= 1) return null;
        const landed = along([[0, ...post.from], [0.45, lerp(post.from[0], post.to[0], 0.5), 30], [1, ...post.to]], fly);
        const x = lerp(landed.x, 64, gather);
        const y = lerp(landed.y, 60, gather);
        const scale = lerp(lerp(1, depthAt(post.to[1]) * 1.25, fly), 0.6, gather);
        const bounce = Math.sin(Math.PI * ramp(p, start + 0.08, start + 0.11)) * -6;
        return (
          <L key={post.label} x={x} y={y} className={`rl-post is-${post.kind}`} style={{ opacity: 1 - gather, transform: `translateY(${bounce}px) scale(${scale}) rotate(${(1 - fly) * (index - 1) * 14}deg)` }}>
            <small>{post.label}</small>{post.value}
          </L>
        );
      })}

      <L x={64} y={60} className="rl-record" style={record}>
        <header><span>Hoy</span><b>+US$ 900</b></header>
        <strong>Venta de 2 terneros</strong>
        <div><em className="is-tipo">Venta</em><em className="is-cantidad">2 cabezas</em><em>Hacienda</em><em className="is-monto">USD</em></div>
      </L>
      <L x={64} y={88} className="rl-toast" style={life(p, [0.52, 0.57], [2, 2], { y: 24, scale: 0.8 })}>
        <CircleCheck size={18} /><span><strong>Guardado en tu libreta</strong>Venta de 2 terneros · +US$ 900</span>
      </L>
    </>
  );
}

/* ── Movimientos: the farm road of records; the new one splits into two books ─────────── */

const ROAD = [[0, 60, 90], [1, 67, 80.5], [2, 71.5, 74.5], [3, 74.5, 70.5], [4, 76.5, 68]];
const roadAt = (slot) => {
  const s = clamp(slot, 0, 4);
  const index = Math.min(3, Math.floor(s));
  const t = s - index;
  return { x: lerp(ROAD[index][1], ROAD[index + 1][1], t), y: lerp(ROAD[index][2], ROAD[index + 1][2], t) };
};
const OLDER = [
  { title: "Arrendamiento cobrado", value: "+US$ 12.444" },
  { title: "Ración novillos", value: "−US$ 2.450", out: true },
  { title: "Venta de lana", value: "+US$ 12.000" },
];

function Movimientos({ p }) {
  const advance = easeInOut(ramp(p, 0.04, 0.14));
  const split = easeOut(ramp(p, 0.2, 0.32));
  const count = ramp(p, 0.3, 0.4);
  const books = [
    { Icon: TrendingUp, title: "Libreta de dinero", value: "+US$ 900", note: "Ingreso · Hacienda", x: 50, y: 30, token: "US$" },
    { Icon: Package, title: "Libreta de stock", value: "−2 terneros", note: "Salida · Animales", x: 82, y: 30, token: "−2" },
  ];
  const rows = [
    ...OLDER.map((row, index) => ({ ...row, slot: index + advance, key: row.title, enter: life(p, [0.01 + index * 0.02, 0.06 + index * 0.02]) })),
    { title: "Venta de 2 terneros", value: "+US$ 900", slot: 0, key: "new", enter: life(p, [0.1, 0.16], [2, 2], { x: -260, y: 0 }), fresh: true },
  ];
  return (
    <>
      {rows.map((row) => {
        const pos = roadAt(row.slot);
        const scale = depthAt(pos.y) * 1.15;
        return (
          <L key={row.key} x={pos.x} y={pos.y} className={`rl-row${row.fresh ? " is-fresh" : ""}${row.out ? " is-out" : ""}`} style={{ ...row.enter, transform: `${row.enter.transform} scale(${scale})`, zIndex: Math.round(scale * 10) }}>
            <strong>{row.title}</strong><b>{row.value}</b>
          </L>
        );
      })}

      {books.map((book, index) => {
        const token = along([[0, 60, 88], [0.5, lerp(60, book.x, 0.5), 52], [1, book.x, book.y + 8]], split);
        return (
          <div key={book.title}>
            {split > 0 && split < 1 && <L x={token.x} y={token.y} className="rl-token" style={{ transform: `scale(${1 + Math.sin(Math.PI * split) * 0.4}) rotate(${split * (index ? -40 : 40)}deg)` }}>{book.token}</L>}
            <L x={book.x} y={book.y} className="rl-book" style={{ opacity: ramp(p, 0.16, 0.22), transform: `perspective(800px) rotateY(${(1 - ramp(p, 0.28, 0.34)) * (index ? -70 : 70)}deg)` }}>
              <span><book.Icon size={18} /></span>
              <div><small>{book.title}</small><strong>{p > 0.31 ? book.value : "—"}</strong><em>{book.note}</em></div>
            </L>
          </div>
        );
      })}
      <L x={66} y={13} className="rl-total" style={life(p, [0.26, 0.32])}>
        <small>Ingresos del mes</small>
        <strong>US$ {money.format(35644 + 900 * count)}</strong>
      </L>
    </>
  );
}

/* ── Stock: the herd grazing in the field, two leave, the urea arrives ─────────────────── */

const HERD = [[46, 74], [55, 71], [63, 76], [72, 72], [80, 75], [88, 70], [50, 84], [60, 88], [74, 86], [86, 90], [67, 69], [40, 90]];
const LEAVING = [7, 8];

function Stock({ p }) {
  const head = 64 - Math.round(2 * ramp(p, 0.14, 0.28));
  const urea = 12 + Math.round(20 * ramp(p, 0.34, 0.46));
  return (
    <>
      <L x={58} y={18} className="rl-count" style={life(p, [0, 0.05])}>
        <small>Terneros</small><strong><Odometer text={String(head)} /></strong><span>cabezas</span>
      </L>
      <L x={84} y={20} className="rl-count is-small" style={life(p, [0.3, 0.34])}>
        <small>Fertilizante urea</small><strong><Odometer text={String(urea)} /></strong><span>bolsas</span>
      </L>
      {HERD.map(([x, y], cow) => {
        const scale = depthAt(y) * 1.2;
        const enter = life(p, [0.01 + cow * 0.006, 0.06 + cow * 0.006], [2, 2], { y: 18, scale: 0.5 });
        const leavingIndex = LEAVING.indexOf(cow);
        if (leavingIndex === -1) {
          const graze = Math.sin(p * 30 + cow) * 1.2;
          return <L key={cow} x={x} y={y} className="rl-calf" style={{ ...enter, transform: `${enter.transform} scale(${scale}) scaleX(${cow % 3 ? 1 : -1}) translateY(${graze}px)`, zIndex: Math.round(y) }}><Calf /></L>;
        }
        const start = 0.1 + leavingIndex * 0.03;
        const walk = ramp(p, start, start + 0.22);
        const pos = along([[0, x, y], [1, 108 + leavingIndex * 6, 104]], walk);
        return (
          <L key={cow} x={pos.x} y={pos.y} className={`rl-calf${walk > 0 && walk < 1 ? " is-walking" : ""}`} style={{ opacity: enter.opacity, transform: `scale(${depthAt(pos.y) * 1.2 + walk * 0.4}) scaleX(-1)`, zIndex: 100 }}>
            <Calf />
          </L>
        );
      })}
      {Array.from({ length: 7 }, (_, bag) => {
        const t = ramp(p, 0.32 + bag * 0.018, 0.4 + bag * 0.018);
        if (t <= 0) return null;
        const fall = easeInOut(Math.min(1, t));
        const rest = [86 + (bag % 3) * 3 - 3, 84 - Math.floor(bag / 3) * 3.4];
        return (
          <L key={bag} x={lerp(80 + bag * 2, rest[0], fall)} y={lerp(-10, rest[1], fall)} className="rl-bag" style={{ transform: `rotate(${(1 - fall) * (bag % 2 ? 160 : -140)}deg) scale(${lerp(1.3, depthAt(rest[1]), fall)})`, zIndex: 60 + bag }}>
            <Package size={20} /><small>Urea</small>
          </L>
        );
      })}
      <L x={58} y={93} className="rl-toast is-warn" style={life(p, [0.5, 0.56], [2, 2], { y: 24 })}>
        <BellRing size={18} /><span><strong>Ración por debajo del mínimo</strong>Quedan 3,2 de 5 toneladas.</span>
        <i className="rl-level"><b style={{ transform: `scaleX(${0.64 * ramp(p, 0.52, 0.58)})` }} /></i>
      </L>
    </>
  );
}

/* ── Balances: the months grow from the land like crops; a coin falls into April ───────── */

const MONTHS = [["Nov", 21, 9], ["Dic", 18, 12], ["Ene", 26, 7], ["Feb", 30, 11], ["Mar", 24, 14], ["Abr", 35.6, 4.5]];

function Balance({ p }) {
  const coin = easeInOut(ramp(p, 0.16, 0.3));
  const landed = ramp(p, 0.28, 0.34);
  const ingresos = 35644 + 900 * landed;
  const margen = Math.round(((ingresos - 4470) / ingresos) * 100);
  const gauge = ramp(p, 0.36, 0.5) * (margen / 100);
  return (
    <>
      {MONTHS.map(([month, income, expense], index) => {
        const april = index === 5;
        const grow = easeOut(ramp(p, 0.02 + index * 0.025, 0.14 + index * 0.025));
        const value = april ? income + 0.9 * landed : income;
        return (
          <L key={month} x={44 + index * 8.4} y={86} className={`rl-crop${april ? " is-april" : ""}`} style={{ opacity: ramp(p, index * 0.025, 0.04 + index * 0.025) }}>
            <div>
              <i className={`is-in${april && landed > 0 && landed < 1 ? " is-kick" : ""}`} style={{ height: `calc(${value} * var(--crop-unit))`, transform: `scaleY(${grow})` }} />
              <i className="is-out" style={{ height: `calc(${expense} * var(--crop-unit))`, transform: `scaleY(${easeOut(ramp(p, 0.04 + index * 0.025, 0.16 + index * 0.025))})` }} />
            </div>
            <small>{month}</small>
          </L>
        );
      })}
      {coin > 0 && coin < 1 && (
        <L x={lerp(96, 86, coin)} y={lerp(-12, 62, coin) - Math.sin(Math.PI * coin) * 10} className="rl-coin" style={{ transform: `rotateY(${coin * 1080}deg) scale(${lerp(1.5, 0.45, coin)})` }}>
          <b>US$</b>900
        </L>
      )}
      <L x={54} y={18} className="rl-count" style={life(p, [0.26, 0.32])}>
        <small>Ingresos de abril</small><strong>US$ {money.format(ingresos)}</strong>
      </L>
      <L x={82} y={20} className="rl-gauge" style={life(p, [0.34, 0.4])}>
        <svg viewBox="0 0 100 56" aria-hidden="true">
          <path d="M8 50a42 42 0 0 1 84 0" pathLength="1" className="is-track" />
          <path d="M8 50a42 42 0 0 1 84 0" pathLength="1" className="is-fill" style={{ strokeDashoffset: 1 - gauge }} />
        </svg>
        <strong>{Math.round(gauge * 100)}%</strong><small>Margen</small>
      </L>
      <L x={86} y={50} className="rl-badge" style={life(p, [0.46, 0.52], [2, 2], { y: 14, scale: 0.6 })}>Mejor mes del año</L>
    </>
  );
}

/* ── Proyectos: the field is divided into plots; the money lands in the Recría ─────────── */

const PLOTS = [
  { name: "Recría 2026", type: "Actividad", points: "38,74 60,71.5 66,86 33,90", pin: [49, 77], main: true },
  { name: "Alambrado norte", type: "Inversión", points: "62,70.8 82,69 89,78 67.5,80", pin: [75, 73] },
  { name: "Galpón", type: "Actividad", points: "69,82.5 94,79.5 99,95 73,98", pin: [84, 86] },
];

function Proyectos({ p }) {
  const result = Math.round(900 * ramp(p, 0.22, 0.32));
  return (
    <>
      <svg className="rl-plots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {PLOTS.map((plot, index) => {
          const draw = ramp(p, 0.02 + index * 0.05, 0.14 + index * 0.05);
          return (
            <polygon
              key={plot.name}
              points={plot.points}
              pathLength="1"
              className={plot.main ? "is-main" : ""}
              style={{ strokeDashoffset: 1 - draw, fillOpacity: plot.main ? ramp(p, 0.16, 0.24) * (0.28 + Math.sin(Math.PI * ramp(p, 0.22, 0.34)) * 0.2) : ramp(p, 0.14 + index * 0.05, 0.2 + index * 0.05) * 0.12 }}
            />
          );
        })}
      </svg>
      {Array.from({ length: 9 }, (_, coin) => {
        const t = ramp(p, 0.1 + coin * 0.016, 0.2 + coin * 0.016);
        if (t <= 0 || t >= 1) return null;
        const fall = easeInOut(t);
        return <L key={coin} x={lerp(40 + random(coin) * 26, 47 + random(coin + 5) * 6, fall)} y={lerp(-8, 80, fall)} className="rl-mini-coin" style={{ opacity: 1 - ramp(t, 0.85, 1), transform: `rotateY(${t * 720}deg) scale(${lerp(1.3, 0.7, fall)})` }}>$</L>;
      })}
      {PLOTS.map((plot, index) => {
        const enter = life(p, plot.main ? [0.12, 0.18] : [0.28 + index * 0.03, 0.34 + index * 0.03], [2, 2], { y: 16, scale: 0.7 });
        return (
          <L key={plot.name} x={plot.pin[0]} y={plot.main ? 46 : plot.pin[1] - 10} className={`rl-pin${plot.main ? " is-main" : ""}`} style={enter}>
            <header><strong>{plot.name}</strong><span>{plot.type}</span></header>
            {plot.main && (
              <>
                <p>Terneros de recría y su venta</p>
                <span className="rl-progress"><i style={{ transform: `scaleX(${0.55 + 0.15 * ramp(p, 0.22, 0.32)})` }} /></span>
                <footer><span>Resultado</span><b>+US$ {money.format(result)}</b></footer>
              </>
            )}
            <i className="rl-pin-stick" style={{ height: plot.main ? "calc(31vh - 92px)" : "calc(10vh - 24px)" }} />
          </L>
        );
      })}
    </>
  );
}

/* ── Reportes: at night the day rises from the field as fireflies and becomes a report ── */

const FIREFLIES = Array.from({ length: 26 }, (_, index) => ({ x: 36 + random(index) * 62, y: 74 + random(index + 9) * 22, delay: random(index + 21) * 0.08 }));
const LINES = [["Ingresos", "US$ 36.544"], ["Gastos", "US$ 4.470"], ["Resultado", "US$ 32.074"]];

function Reportes({ p }) {
  const press = p > 0.04 && p < 0.07;
  const out = easeInOut(ramp(p, 0.46, 0.56));
  return (
    <>
      {FIREFLIES.map((fly, index) => {
        const t = easeInOut(ramp(p, 0.06 + fly.delay, 0.26 + fly.delay));
        if (t <= 0 || t >= 1) return null;
        const wobble = Math.sin(t * 9 + index) * 3 * (1 - t);
        return <L key={index} x={lerp(fly.x, 64, t) + wobble} y={lerp(fly.y, 42, t)} className="rl-firefly" style={{ opacity: Math.sin(Math.PI * t) }} />;
      })}
      <L x={64} y={88} className={`rl-generate${press ? " is-pressed" : ""}`} style={life(p, [0, 0.03], [0.4, 0.46])}>
        <Download size={17} /> {p > 0.06 && p < 0.34 ? "Generando…" : "Generar PDF"}
      </L>
      <L x={lerp(64, 76, out)} y={lerp(42, 34, out)} className="rl-paper" style={{ opacity: ramp(p, 0.18, 0.24) * (1 - ramp(p, 0.56, 0.62)), transform: `scale(${lerp(1, 0.7, out)}) rotate(${-4 * out}deg)` }}>
        <header><BookOpen size={15} /> Informe financiero · Abril 2026</header>
        {LINES.map(([label, value], index) => (
          <p key={label} style={{ opacity: ramp(p, 0.22 + index * 0.04, 0.26 + index * 0.04) }}><span>{label}</span><b>{value}</b></p>
        ))}
        <p className="is-highlight" style={{ opacity: ramp(p, 0.36, 0.4) }}><TrendingUp size={13} /> Venta de 2 terneros · +US$ 900</p>
      </L>
      <L x={64} y={88} className="rl-toast is-dark" style={life(p, [0.5, 0.56], [2, 2], { y: 24, scale: 0.8 })}>
        <CircleCheck size={18} /><span><strong>informe-financiero-molles-de-timote.pdf</strong>Listo para descargar</span>
      </L>
    </>
  );
}

export const RURALIT_LAND = { inicio: Inicio, libreta: Movimientos, stock: Stock, balance: Balance, proyectos: Proyectos, reportes: Reportes };
