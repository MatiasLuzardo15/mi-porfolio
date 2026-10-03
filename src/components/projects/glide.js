// Glides the page to `target` (px) with an eased rAF scroll, so scroll-driven stories play on the
// way instead of jumping. Returns a cancel function.
import { clamp } from "./timeline";

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function glideTo(target, reduceMotion) {
  if (reduceMotion) {
    window.scrollTo({ top: target });
    return () => {};
  }
  const root = document.documentElement;
  const start = window.scrollY;
  const distance = target - start;
  const duration = clamp((Math.abs(distance) / window.innerHeight) * 900, 700, 2600);
  const startTime = performance.now();
  let frame = 0;
  root.style.scrollBehavior = "auto";
  const step = (now) => {
    const progress = clamp((now - startTime) / duration);
    window.scrollTo(0, start + distance * easeInOut(progress));
    if (progress < 1) frame = requestAnimationFrame(step);
    else root.style.scrollBehavior = "";
  };
  frame = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(frame);
    root.style.scrollBehavior = "";
  };
}
