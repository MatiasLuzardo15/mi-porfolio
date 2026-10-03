// Small helpers for scroll-scrubbed choreography. Every value is a pure function of
// chapter progress, so scrolling back rewinds the story exactly.
import { clamp } from "./timeline";

export const lerp = (from, to, t) => from + (to - from) * t;
export const easeIn = (t) => t * t * t;
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const backOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2));

// Characters of `text` revealed at progress t.
export const typed = (text, t) => text.slice(0, Math.round(text.length * clamp(t)));

// Position along waypoints [[p, x, y], ...] for chapter progress p (eased between points).
export const along = (points, p) => {
  if (p <= points[0][0]) return { x: points[0][1], y: points[0][2] };
  for (let index = 1; index < points.length; index += 1) {
    const [p1, x1, y1] = points[index];
    const [p0, x0, y0] = points[index - 1];
    if (p <= p1) {
      const t = easeInOut(clamp((p - p0) / (p1 - p0)));
      return { x: lerp(x0, x1, t), y: lerp(y0, y1, t) };
    }
  }
  const last = points[points.length - 1];
  return { x: last[1], y: last[2] };
};

// The life of a floating fragment: it arrives between `enter[0]`–`enter[1]` (rising, unblurring,
// scaling up) and leaves between `exit[0]`–`exit[1]` (drifting up and dissolving).
export const life = (p, enter, exit = [2, 2], { y = 36, x = 0, z = 0, rotate = 0, scale = 0.86 } = {}) => {
  const arrive = easeOut(clamp((p - enter[0]) / (enter[1] - enter[0])));
  const leave = easeInOut(clamp((p - exit[0]) / (exit[1] - exit[0])));
  const opacity = arrive * (1 - leave);
  return {
    opacity,
    visibility: opacity <= 0.001 ? "hidden" : undefined,
    transform: `translate3d(${(1 - arrive) * x}px, ${(1 - arrive) * y - leave * 46}px, ${(1 - arrive) * z}px) rotate(${(1 - arrive) * rotate}deg) scale(${scale + (1 - scale) * arrive - leave * 0.1})`,
    filter: arrive < 1 || leave > 0 ? `blur(${(1 - arrive) * 10 + leave * 10}px)` : undefined,
  };
};
