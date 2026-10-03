// Ruralit's story told with loose fragments floating over the field: two calves are sold by voice,
// the sale splits into the money and stock books, the calves walk off, the coin lands in April,
// it belongs to the Recría and the month prints itself. No app window, only what the beat needs.
// `p` is the story beat (0–0.62) scrubbed by scroll. Copy and figures follow ruralia.
import {
  BellRing, BookOpen, ChartNoAxesColumn, CircleCheck, Download, FileText, Folder, House, Mic, Package, TrendingUp,
} from "lucide-react";
import { Odometer } from "../Odometer";
import { along, backOut, easeInOut, easeOut, lerp, life, typed } from "../fx";
import { ramp } from "../timeline";

export const RT_CHAPTERS = [
  { id: "inicio", label: "Inicio", Icon: House, sky: "dawn" },
  { id: "libreta", label: "Movimientos", Icon: BookOpen, sky: "morning" },
  { id: "stock", label: "Stock", Icon: Package, sky: "noon" },
  { id: "balance", label: "Balances", Icon: ChartNoAxesColumn, sky: "afternoon" },
  { id: "proyectos", label: "Proyectos", Icon: Folder, sky: "dusk" },
  { id: "reportes", label: "Reportes", Icon: FileText, sky: "night" },
];

const money = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 });
const today = () => {
  const date = new Date();
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const Frag = ({ x, y, style, className = "", children }) => (
  <div className="rs-frag" style={{ left: `${x}%`, top: `${y}%` }}>
    <div className={className} style={style}>{children}</div>
  </div>
);

export const Calf = () => (
  <svg viewBox="0 0 64 44" aria-hidden="true">
    <ellipse cx="30" cy="22" rx="20" ry="11" fill="#7a5634" />
    <ellipse cx="24" cy="20" rx="7" ry="5" fill="#f2ece2" />
    <path d="M48 14c5-3 11-2 12 3 1 4-2 7-6 7-3 0-6-2-8-4Z" fill="#8a6440" />
    <ellipse cx="57" cy="20" rx="3" ry="2.4" fill="#e9b9a0" />
    <path d="M47 12l-4-5M52 12l1-6" stroke="#4b3420" strokeWidth="2" strokeLinecap="round" />
    <circle cx="53.5" cy="16" r="1.2" fill="#1d140b" />
    <path className="rfx-leg rfx-leg-a" d="M16 30v12M40 30v12" stroke="#4b3420" strokeWidth="4" strokeLinecap="round" />
    <path className="rfx-leg rfx-leg-b" d="M22 30v12M34 30v12" stroke="#5e4128" strokeWidth="4" strokeLinecap="round" />
    <path d="M10 20c-4 2-6 6-5 10" stroke="#5e4128" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------- Inicio: said out loud, understood, written down ---------- */

const SALE = [
  { text: "Vendí", kind: "tipo" },
  { text: " " },
  { text: "2 terneros", kind: "cantidad" },
  { text: " por " },
  { text: "900 USD", kind: "monto" },
];
const SALE_TEXT = SALE.map((segment) => segment.text).join("");
const WORDS = [
  { label: "Tipo", value: "Venta", kind: "tipo", from: [36, 30], sky: [12, -6], to: [32, 66] },
  { label: "Cantidad", value: "2 terneros", kind: "cantidad", from: [48, 30], sky: [50, -14], to: [50, 66] },
  { label: "Monto", value: "US$ 900", kind: "monto", from: [62, 30], sky: [86, -4], to: [68, 66] },
];
const FIELDS = [["Tipo", "Venta", "tipo"], ["Recurso", "Terneros", "cantidad"], ["Cantidad", "2 cabezas", "cantidad"], ["Monto", "900", "monto"], ["Moneda", "USD", "monto"], ["Categoría", "Hacienda", "tipo"]];

function Inicio({ p }) {
  const shown = typed(SALE_TEXT, ramp(p, 0.06, 0.26)).length;
  const listening = p > 0.01 && p < 0.27;
  const recognized = p > 0.27;
  const save = easeInOut(ramp(p, 0.46, 0.52));
  let consumed = 0;

  return (
    <>
      <Frag x={50} y={13} className="rs-caption" style={life(p, [0, 0.04], [0.28, 0.32], { y: 10 })}>¿Qué pasó hoy?</Frag>
      <Frag x={50} y={30} className={`rs-composer${listening ? " is-listening" : ""}`} style={life(p, [0, 0.04], [0.46, 0.52])}>
        <span className="rs-dictation">
          {SALE.map((segment) => {
            const start = consumed;
            consumed += segment.text.length;
            const visible = segment.text.slice(0, Math.max(0, shown - start));
            if (!visible) return null;
            return segment.kind ? <mark key={segment.text} className={recognized ? `is-${segment.kind}` : ""}>{visible}</mark> : <span key={segment.text}>{visible}</span>;
          })}
          {!shown && <em>Escuchando…</em>}
        </span>
        <span className="rs-mic">{listening ? <span className="rt-wave"><i /><i /><i /><i /></span> : <Mic size={20} />}</span>
      </Frag>

      {p > 0.27 && p < 0.43 && WORDS.map((word, index) => {
        const pos = along([[0.27, ...word.from], [0.32, ...word.sky], [0.36, word.sky[0] + 2, word.sky[1] + 4], [0.42, ...word.to]], p);
        const air = Math.sin(Math.PI * ramp(p, 0.27, 0.42));
        const pop = backOut(ramp(p, 0.27, 0.3));
        return (
          <Frag key={word.label} x={pos.x} y={pos.y} className={`rfx-word is-${word.kind}`} style={{ opacity: Math.min(1, pop * 2) * (1 - ramp(p, 0.4, 0.42)), transform: `scale(${pop * (0.6 + air * 0.9)}) rotateX(${air * 20}deg) rotateY(${(index - 1) * air * 28}deg)` }}>
            <small>{word.label}</small>{word.value}
          </Frag>
        );
      })}

      <Frag x={50 + save * 30} y={66 + save * 30} className="rs-interpretation" style={{ ...life(p, [0.3, 0.36]), opacity: life(p, [0.3, 0.36]).opacity * (1 - save), transform: `${life(p, [0.3, 0.36]).transform} scale(${1 - 0.7 * save}) rotate(${save * 12}deg)` }}>
        <p><strong>{p > 0.44 ? "Guardando registros…" : "Interpretación editable"}</strong><span>1 registro detectado</span></p>
        <div className="rs-sentence"><b>1</b>Venta de 2 terneros por 900 USD.</div>
        <div className="rs-fields">
          {FIELDS.map(([label, value, kind], index) => {
            const t = backOut(ramp(p, 0.39 + index * 0.01, 0.43 + index * 0.01));
            return <span key={label} className={`rt-pfield is-${kind}`} style={{ opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * -26}px) scale(${0.85 + 0.15 * t})` }}><small>{label}</small>{value}</span>;
          })}
        </div>
      </Frag>

      <Frag x={50} y={88} className="rs-toast" style={life(p, [0.5, 0.56], [2, 2], { y: 30, scale: 0.6 })}>
        <CircleCheck size={18} /><span><strong>Guardado en tu libreta</strong>Venta de 2 terneros · +US$ 900</span>
      </Frag>
    </>
  );
}

/* ---------- Movimientos: one record, two books ---------- */

const OLDER = ["Venta de lana · +US$ 12.000", "Arrendamiento cobrado · +US$ 12.444", "Ración novillos · −US$ 2.450"];

function Movimientos({ p }) {
  const out = easeOut(ramp(p, 0.16, 0.27));
  const back = easeInOut(ramp(p, 0.46, 0.54));
  const split = out * (1 - back);
  const count = ramp(p, 0.08, 0.2);
  const books = [
    { Icon: TrendingUp, title: "Libreta de dinero", value: "+US$ 900", note: "Ingreso · Hacienda", x: 22, y: 64 },
    { Icon: Package, title: "Libreta de stock", value: "−2 terneros", note: "Salida · Animales", x: 78, y: 64 },
  ];

  return (
    <>
      {OLDER.map((row, index) => (
        <Frag key={row} x={50} y={30 - (index + 1) * 7} className="rs-row is-ghost" style={{ ...life(p, [0.02 + index * 0.02, 0.08 + index * 0.02], [0.3, 0.36], { y: 20 }), transform: `${life(p, [0.02 + index * 0.02, 0.08 + index * 0.02], [0.3, 0.36], { y: 20 }).transform} translateZ(${-(index + 1) * 60}px)` }}>
          {row}
        </Frag>
      ))}
      <Frag x={50} y={30} className="rs-row" style={life(p, [0, 0.1], [2, 2], { x: -240, y: 0, rotate: -6 })}>
        <small>{today()}</small><strong>Venta de 2 terneros</strong><em>Hacienda</em><b>+US$ 900</b>
      </Frag>
      {split > 0 && (
        <svg className="rfx-links rs-links" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: split }} aria-hidden="true">
          {books.map((book) => <path key={book.title} d={`M 50 34 C 50 ${lerp(34, book.y, 0.5)}, ${book.x} ${lerp(34, book.y, 0.5)}, ${lerp(50, book.x, split)} ${lerp(34, book.y - 8, split)}`} />)}
        </svg>
      )}
      {books.map((book, index) => (
        <Frag key={book.title} x={lerp(50, book.x, split)} y={lerp(32, book.y, split)} className="rfx-book" style={{ opacity: Math.min(1, split * 1.6), transform: `scale(${0.5 + 0.5 * split}) rotateY(${(1 - split) * 50 + (index ? -10 : 10) * split}deg)` }}>
          <span><book.Icon size={16} /></span>
          <div><small>{book.title}</small><strong>{book.value}</strong><em>{book.note}</em></div>
        </Frag>
      ))}
      <Frag x={50} y={92} className="rs-total" style={life(p, [0.05, 0.1], [2, 2], { y: 20 })}>
        <small>Ingresos del mes · USD</small>
        <strong>US$ {money.format(35644 + 900 * count)}</strong>
        {count > 0 && count < 1 && <em>+900</em>}
      </Frag>
    </>
  );
}

/* ---------- Stock: the herd, the calves that leave, the delivery, the alert ---------- */

const HERD = 10;

function Stock({ p }) {
  const head = 64 - Math.round(2 * ramp(p, 0.1, 0.24));
  const urea = 12 + Math.round(20 * ramp(p, 0.34, 0.46));

  return (
    <>
      <Frag x={50} y={10} className="rs-count" style={life(p, [0, 0.05])}>
        <small>Terneros</small><strong><Odometer text={String(head)} /></strong><span>cabezas</span>
      </Frag>
      {Array.from({ length: HERD }, (_, cow) => {
        const leaving = cow >= HERD - 2;
        const base = { x: 18 + (cow % 5) * 16, y: 32 + Math.floor(cow / 5) * 16 };
        const enter = life(p, [0.01 + cow * 0.006, 0.06 + cow * 0.006], leaving ? [2, 2] : [0.5, 0.56], { y: 30, scale: 0.4 });
        if (!leaving) {
          return <Frag key={cow} x={base.x} y={base.y} className="rs-calf" style={enter}><Calf /></Frag>;
        }
        const start = 0.08 + (cow - (HERD - 2)) * 0.03;
        const pos = along([[start, base.x, base.y], [start + 0.04, base.x + 3, base.y - 12], [start + 0.08, base.x + 1, base.y + 10], [start + 0.3, -70, 112]], p);
        const walking = p > start + 0.07;
        return (
          <Frag key={cow} x={pos.x} y={pos.y} className={`rs-calf is-leaving${walking ? " is-walking" : ""}`} style={{ opacity: enter.opacity * (1 - ramp(p, start + 0.26, start + 0.3)), transform: `scale(${1 + ramp(p, start, start + 0.3) * 0.8}) scaleX(${walking ? -1 : 1})` }}>
            <Calf />
          </Frag>
        );
      })}
      <Frag x={72} y={80} className="rs-count rs-count-small" style={life(p, [0.28, 0.32], [2, 2], { y: 30 })}>
        <small>Fertilizante urea</small><strong><Odometer text={String(urea)} /></strong><span>bolsas</span>
      </Frag>
      {Array.from({ length: 6 }, (_, bag) => {
        const t = ramp(p, 0.3 + bag * 0.022, 0.4 + bag * 0.022);
        if (t <= 0 || t >= 1) return null;
        const fall = easeInOut(Math.min(1, t / 0.85));
        return (
          <Frag key={bag} x={lerp(56 + bag * 7, 70 + bag * 1.5, fall)} y={lerp(-70, 76, fall)} className="rfx-bag" style={{ opacity: 1 - ramp(t, 0.85, 1), transform: `rotateX(${(1 - fall) * 60}deg) rotateZ(${(1 - fall) * (bag % 2 ? 140 : -120)}deg) scale(${lerp(1.6, 0.7, fall)})` }}>
            <Package size={26} /><small>Urea</small>
          </Frag>
        );
      })}
      <Frag x={26} y={82} className="rs-toast is-warn" style={life(p, [0.5, 0.56], [2, 2], { x: -80, y: 0 })}>
        <BellRing size={18} /><span><strong>Ración por debajo del mínimo</strong>Quedan 3,2 de 5 toneladas.</span>
      </Frag>
    </>
  );
}

/* ---------- Balances: a coin falls into April ---------- */

const BARS = [["Nov", 21, 9], ["Dic", 18, 12], ["Ene", 26, 7], ["Feb", 30, 11], ["Mar", 24, 14], ["Abr", 35.6, 4.5]];

function Balance({ p }) {
  const coin = easeInOut(ramp(p, 0.04, 0.22));
  const landed = ramp(p, 0.2, 0.28);
  const ingresos = 35644 + 900 * landed;
  const margen = Math.round(((ingresos - 4470) / ingresos) * 100);
  const gauge = ramp(p, 0.3, 0.5) * margen / 100;

  return (
    <>
      <Frag x={24} y={10} className="rs-count" style={life(p, [0.14, 0.2])}>
        <small>Ingresos de abril</small><strong>US$ {money.format(ingresos)}</strong>
      </Frag>
      <Frag x={78} y={10} className="rs-gauge" style={life(p, [0.28, 0.34])}>
        <svg viewBox="0 0 100 56" aria-hidden="true">
          <path d="M8 50a42 42 0 0 1 84 0" pathLength="1" className="rt-gauge-track" />
          <path d="M8 50a42 42 0 0 1 84 0" pathLength="1" className="rt-gauge-fill" style={{ strokeDashoffset: 1 - gauge }} />
        </svg>
        <strong>{Math.round(gauge * 100)}%</strong><small>Margen</small>
      </Frag>
      {BARS.map(([month, income, expense], index) => {
        const isApril = index === 5;
        const value = isApril ? income + 0.9 * landed : income;
        return (
          <Frag key={month} x={20 + index * 12} y={62} className="rs-bars" style={life(p, [0.01 + index * 0.015, 0.06 + index * 0.015], [2, 2], { y: 30 })}>
            <div>
              <i className={`is-in${isApril && landed > 0 && landed < 1 ? " is-kick" : ""}`} style={{ height: `${value * 7}px`, transform: `scaleY(${ramp(p, 0.02 + index * 0.025, 0.18 + index * 0.025)})` }} />
              <i className="is-out" style={{ height: `${expense * 7}px`, transform: `scaleY(${ramp(p, 0.04 + index * 0.025, 0.2 + index * 0.025)})` }} />
            </div>
            <small>{month}</small>
          </Frag>
        );
      })}
      {coin > 0 && coin < 1 && (
        <Frag x={lerp(-20, 80, coin)} y={lerp(-60, 50, coin) - Math.sin(Math.PI * coin) * 16} className="rfx-coin" style={{ transform: `rotateY(${coin * 1080}deg) scale(${lerp(1.6, 0.4, coin)})` }}>
          <b>US$</b>900
        </Frag>
      )}
    </>
  );
}

/* ---------- Proyectos: the money belongs to the Recría ---------- */

const OTHERS = [["Alambrado norte", "Inversión", 18, 18], ["Maquinaria", "Activo", 84, 22], ["Galpón", "Actividad", 82, 84]];

function Proyectos({ p }) {
  const result = Math.round(900 * ramp(p, 0.2, 0.3));
  return (
    <>
      <Frag x={46} y={50} className={`rs-project${p > 0.18 && p < 0.34 ? " is-glow" : ""}`} style={life(p, [0, 0.06], [2, 2], { y: 60, scale: 0.7 })}>
        <header><strong>Recría 2026</strong><span>Actividad</span></header>
        <p>Terneros de recría y su venta</p>
        <span className="rs-progress"><i style={{ transform: `scaleX(${0.55 + 0.15 * ramp(p, 0.2, 0.3)})` }} /></span>
        <footer><span>Resultado del proyecto</span><b>+US$ {money.format(result)}</b></footer>
      </Frag>
      {Array.from({ length: 8 }, (_, coin) => {
        const t = ramp(p, 0.06 + coin * 0.018, 0.16 + coin * 0.018);
        if (t <= 0 || t >= 1) return null;
        const fall = easeInOut(t);
        return <Frag key={coin} x={lerp(8 + coin * 11, 46, fall)} y={lerp(-50, 46, fall)} className="rfx-mini-coin" style={{ opacity: 1 - ramp(t, 0.85, 1), transform: `rotateY(${t * 720}deg) scale(${lerp(1.4, 0.6, fall)})` }}>$</Frag>;
      })}
      {OTHERS.map(([name, type, x, y], index) => (
        <Frag key={name} x={x} y={y} className="rs-project is-small" style={{ ...life(p, [0.26 + index * 0.03, 0.32 + index * 0.03], [2, 2], { y: 30 }), opacity: life(p, [0.26 + index * 0.03, 0.32 + index * 0.03]).opacity * 0.85 }}>
          <header><strong>{name}</strong><span>{type}</span></header>
        </Frag>
      ))}
    </>
  );
}

/* ---------- Reportes: the month prints itself and comes to you ---------- */

function Reportes({ p }) {
  const press = p > 0.1 && p < 0.13;
  const print = easeOut(ramp(p, 0.2, 0.44));
  const out = easeInOut(ramp(p, 0.46, 0.54));
  const away = easeInOut(ramp(p, 0.55, 0.62));

  return (
    <>
      <Frag x={50} y={14} className={`rs-generate${press ? " is-pressed" : ""}`} style={life(p, [0, 0.04], [0.44, 0.5])}>
        <Download size={18} /> {p > 0.12 && p < 0.4 ? "Generando…" : "Generar PDF"}
      </Frag>
      <Frag x={50} y={26} className="rs-bar-progress" style={life(p, [0.11, 0.14], [0.4, 0.44], { y: 10 })}>
        <i style={{ transform: `scaleX(${ramp(p, 0.12, 0.4)})` }} />
      </Frag>
      <Frag x={lerp(50, 30, out) - away * 60} y={lerp(70 - print * 26, 46, out) + away * 60} className="rfx-paper rs-paper" style={{ opacity: ramp(p, 0.2, 0.22) * (1 - ramp(away, 0.6, 1)), clipPath: out > 0 ? undefined : `inset(0 0 ${(1 - print) * 100}% 0)`, transform: `scale(${lerp(1, 1.3, out) * (1 - away * 0.7)}) rotateX(${(1 - out) * 10}deg) rotateZ(${-6 * out + away * 30}deg)` }}>
        <header><BookOpen size={14} /> Informe financiero · Abril 2026</header>
        <i /><i /><i />
        <p><TrendingUp size={12} /> Venta de 2 terneros · +US$ 900</p>
        <i /><i />
      </Frag>
      <Frag x={50} y={80} className="rs-printer" style={life(p, [0.14, 0.2], [0.46, 0.52], { y: 40 })}><span /></Frag>
      <Frag x={50} y={90} className="rs-toast is-dark" style={life(p, [0.55, 0.6], [2, 2], { y: 30, scale: 0.6 })}>
        <CircleCheck size={18} /><span><strong>informe-financiero-molles-de-timote.pdf</strong>Listo para descargar</span>
      </Frag>
    </>
  );
}

export const RURALIT_BEATS = { inicio: Inicio, libreta: Movimientos, stock: Stock, balance: Balance, proyectos: Proyectos, reportes: Reportes };
