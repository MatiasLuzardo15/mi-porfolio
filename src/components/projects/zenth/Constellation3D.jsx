// Zenth's level constellations, rendered in real 3D. Data from
// zenith-productivity/src/modules/progress/domain/constellations.ts: each star keeps its plotted
// position, its brightness (r) and its approximate distance in light years (d). As the note in that
// file says, distance doesn't change the flat drawing, it's what gives depth when the figure turns.
import { useMemo } from "react";
import { usePointer, useTime } from "../useTime";
import { backOut } from "../fx";
import { ramp } from "../timeline";

const FIGURES = [
  {
    name: "Triángulo", level: 1, offset: { x: -360, y: 190, z: -160 },
    stars: [{ x: 17, y: 29, r: 3.6, d: 64 }, { x: 61, y: 39, r: 4.2, d: 127 }, { x: 53, y: 53, r: 3.4, d: 118 }],
    links: [[0, 1], [1, 2], [2, 0]],
  },
  {
    name: "Lira", level: 2, offset: { x: 110, y: 50, z: 60 },
    note: "Vega está a 25 años luz; el paralelogramo que la acompaña, treinta veces más lejos.",
    stars: [{ x: 26, y: 18, r: 5, d: 25 }, { x: 34, y: 36, r: 3.2, d: 156 }, { x: 54, y: 42, r: 3.2, d: 900 }, { x: 48, y: 62, r: 3.2, d: 620 }, { x: 28, y: 54, r: 3.2, d: 960 }],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]],
  },
];

const FOCAL = 760;
const depthOf = (d) => -(Math.log(d) - Math.log(200)) * 95;

const project = (point, angle, tilt) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x1 = point.x * cos + point.z * sin;
  const z1 = -point.x * sin + point.z * cos;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const y2 = point.y * cosT - z1 * sinT;
  const z2 = point.y * sinT + z1 * cosT;
  const scale = FOCAL / (FOCAL - z2);
  return { x: x1 * scale, y: y2 * scale, scale, z: z2 };
};

export function Constellation3D({ p }) {
  const time = useTime(true);
  const pointer = usePointer()();
  const angle = time * 0.16 + pointer.x * 0.7 - 0.3;
  const tilt = pointer.y * 0.28 + 0.12;
  const reveal = ramp(p, 0.44, 0.52);
  const draw = ramp(p, 0.5, 0.6);

  const dust = useMemo(() => Array.from({ length: 90 }, (_, index) => {
    const seed = Math.sin(index * 12.9898) * 43758.5453;
    const r1 = seed - Math.floor(seed);
    const r2 = Math.abs(Math.sin(index * 78.233)) % 1;
    const r3 = Math.abs(Math.cos(index * 39.425)) % 1;
    return { x: (r1 - 0.5) * 1300, y: (r2 - 0.5) * 760, z: (r3 - 0.5) * 900, size: 0.6 + r2 * 1.4 };
  }), []);

  return (
    <svg className="zn-sky" viewBox="-560 -330 1120 660" aria-hidden="true" style={{ opacity: reveal }}>
      {dust.map((star, index) => {
        const point = project(star, angle * 0.6, tilt * 0.6);
        return <circle key={index} cx={point.x} cy={point.y} r={star.size * point.scale} className="zn-sky-dust" style={{ opacity: 0.25 + 0.5 * Math.max(0, point.scale - 0.6) }} />;
      })}
      {FIGURES.map((figure) => {
        const points = figure.stars.map((star) => project({ x: (star.x - 40) * 5.2 + figure.offset.x, y: (star.y - 40) * 5.2 + figure.offset.y, z: depthOf(star.d) + figure.offset.z }, angle, tilt));
        const isNew = figure.level === 2;
        const center = points.reduce((acc, point) => ({ x: acc.x + point.x / points.length, y: acc.y + point.y / points.length }), { x: 0, y: 0 });
        return (
          <g key={figure.name} className={isNew ? "is-new" : "is-done"}>
            {figure.links.map(([a, b], index) => {
              const t = isNew ? ramp(draw, index / figure.links.length, (index + 1) / figure.links.length) : 1;
              const from = points[a];
              const to = points[b];
              return <line key={index} x1={from.x} y1={from.y} x2={from.x + (to.x - from.x) * t} y2={from.y + (to.y - from.y) * t} />;
            })}
            {points.map((point, index) => {
              const grow = isNew ? backOut(ramp(p, 0.46 + index * 0.02, 0.5 + index * 0.02)) : 1;
              const r = figure.stars[index].r * 1.6 * point.scale * grow;
              return (
                <g key={index}>
                  <circle cx={point.x} cy={point.y} r={r * 3.2} className="zn-sky-halo" />
                  <circle cx={point.x} cy={point.y} r={r} className="zn-sky-star" />
                </g>
              );
            })}
            <text x={center.x} y={center.y + 110} textAnchor="middle" className="zn-sky-label" style={{ opacity: isNew ? ramp(p, 0.56, 0.62) : 0.55 }}>
              {`Nivel ${figure.level} · ${figure.name}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export const LYRA_NOTE = FIGURES[1].note;
