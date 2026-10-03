// Vector redraw of ruralia/public/lightrt.png: "rt" strokes plus the lime leaf.

export const RT_PATHS = {
  r: "M486 1600V840a133 133 0 0 1 133-133h302",
  t: "M1030 325v1075a132 132 0 0 0 132 132h351",
  bar: "M962 707h551",
};
export const LEAF = "M1188 520c-22-108 92-212 214-220 120-8 152 92 98 186-60 104-196 168-268 120-22-16-38-48-44-86Z";
export const VEINS = ["M1238 548 1455 398", "M1300 452l-6 44", "M1348 390l-9 72", "M1412 378l-20 46", "M1388 458l64-4", "M1322 502l130-8", "M1272 534l72-4"];

export const RuralitMark = (props) => (
  <svg viewBox="300 220 1330 1480" aria-hidden="true" {...props}>
    <g fill="none" stroke="var(--logo-ink, #2b3e2c)" strokeWidth="136">
      <path d={RT_PATHS.r} />
      <path d={RT_PATHS.t} />
      <path d={RT_PATHS.bar} />
    </g>
    <path d={LEAF} fill="#c3ff73" />
    <g stroke="#005c2e" strokeWidth="9" strokeLinecap="round">
      {VEINS.map((d) => <path key={d} d={d} />)}
    </g>
  </svg>
);
