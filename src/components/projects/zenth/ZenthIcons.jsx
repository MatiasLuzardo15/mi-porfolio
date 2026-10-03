// Ported from zenith-productivity/components/ZenthNavigationIcons.tsx.
// The mark is a vector redraw of the official icon (public/favicon.png): four rounded pieces forming the Z.
const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" };

export const ZenthFocusIcon = ({ size = 24, strokeWidth = 2, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...stroke} {...props}>
    <path d="M9.25 2.75h5.5" />
    <path d="M12 2.75v2.5" />
    <path d="m17.25 6.15 1.45-1.45" />
    <circle cx="12" cy="13" r="7.5" />
    <path d="M12 9.15V13l2.65 1.55" />
    <circle cx="12" cy="13" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

export const ZenthProgressIcon = ({ size = 24, strokeWidth = 2, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} {...stroke} {...props}>
    <circle cx="12" cy="12" r="8.75" />
    <path d="M7.2 14.6 10.15 11.4 12.2 13.15 16.8 8.5" />
    <circle cx="16.8" cy="8.5" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

// Drawn on a 2000×2000 canvas. `from` is where each piece flies in from during the intro.
export const ZENTH_PIECES = [
  { d: "M420 240H1215C1290 240 1310 320 1255 375L620 1005C590 1035 560 1060 520 1070L375 1105C300 1120 235 1060 235 985V425C235 320 315 240 420 240Z", from: { x: -520, y: -420, rotate: -24 } },
  { d: "M1440 290C1470 260 1500 240 1535 240C1620 240 1680 310 1680 410V650C1680 730 1625 790 1550 808L860 985C815 995 780 950 815 910Z", from: { x: 560, y: -460, rotate: 20 } },
  { d: "M360 1205L1015 1035C1045 1028 1065 1065 1040 1090L435 1670C360 1745 235 1700 235 1590V1370C235 1290 290 1222 360 1205Z", from: { x: -560, y: 460, rotate: 18 } },
  { d: "M1250 975L1520 905C1610 885 1680 950 1680 1045V1520C1680 1630 1595 1720 1485 1720H670C595 1720 560 1650 610 1600L1185 1015C1205 995 1225 982 1250 975Z", from: { x: 520, y: 420, rotate: -22 } },
];

export const ZenthMark = (props) => (
  <svg viewBox="0 0 2000 2000" aria-hidden="true" {...props}>
    <rect width="2000" height="2000" rx="440" fill="var(--fr-ink, #000)" />
    {ZENTH_PIECES.map((piece) => <path key={piece.d} d={piece.d} fill="var(--fr-canvas, #fff)" />)}
  </svg>
);
