import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Seconds since `active` turned on, updated every frame. Drives ambient motion (orbits, rotation).
export function useTime(active) {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!active || reduceMotion) return undefined;
    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      setTime((now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduceMotion]);
  return time;
}

// Smoothed pointer position over the viewport, from -1 to 1 on both axes.
export function usePointer() {
  const target = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event) => {
      target.current = { x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return () => {
    smooth.current.x += (target.current.x - smooth.current.x) * 0.06;
    smooth.current.y += (target.current.y - smooth.current.y) * 0.06;
    return smooth.current;
  };
}
