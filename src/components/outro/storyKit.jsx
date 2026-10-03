// Shared plumbing for the pinned, scroll-scrubbed stories after the projects: the smoothed scroll
// value, the hand-over between stacked stories and a minimal rail.
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Odometer } from "../projects/Odometer";
import { glideTo } from "../projects/glide";

const SPRING = { stiffness: 110, damping: 26, mass: 0.7, restDelta: 0.0005 };

// Viewport heights scrolled since the story pinned, through the same spring as the other stories.
export function useStoryValue(ref, units) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, (value) => value * units);
  const smooth = useSpring(raw, SPRING);
  const [value, setValue] = useState(0);
  useMotionValueEvent(smooth, "change", setValue);
  return value;
}

// True once the story has pinned. Until then its viewport stays see-through, so the story it
// overlaps can finish on screen: there is no dead scroll between two stories.
export function useDocked(ref) {
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const node = ref.current;
      if (node) setDocked(node.getBoundingClientRect().top <= 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return docked;
}

// Glide to a point of the story (in viewport heights), so it plays on the way.
export function useStoryGlide(ref) {
  const reduceMotion = useReducedMotion();
  const cancel = useRef(null);
  useEffect(() => () => cancel.current?.(), []);
  return useCallback((value) => {
    const node = ref.current;
    if (!node) return;
    cancel.current?.();
    cancel.current = glideTo(node.getBoundingClientRect().top + window.scrollY + window.innerHeight * value, reduceMotion);
  }, [ref, reduceMotion]);
}

export function useViewportSize() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

// The minimal timeline rail used by every story, taking the scene's ink.
export function StoryRail({ label, items, index, p, on, onSelect, className = "" }) {
  return (
    <nav className={`story-rail ${className}`} style={{ opacity: on ? 1 : 0, pointerEvents: on ? "auto" : "none" }} aria-label={label}>
      <p className="story-rail-clock">
        <Odometer text={String(index + 1).padStart(2, "0")} />
        <small>/ {String(items.length).padStart(2, "0")}</small>
      </p>
      <p className="story-rail-label">{items[index].label}</p>
      <ol className="story-rail-track" style={{ "--fill": (index + p) / (items.length - 1 || 1) }}>
        {items.map((item, position) => (
          <li key={item.id}>
            <button
              type="button"
              className={position < index ? "is-past" : position === index ? "is-current" : ""}
              aria-label={item.label}
              aria-current={position === index ? "step" : undefined}
              onClick={() => onSelect(position)}
            >
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const mixColor = (stops, value, ease = (t) => t) => {
  const index = stops.findIndex(([at]) => at > value);
  if (index === -1) return stops[stops.length - 1][1];
  if (index === 0) return stops[0][1];
  const [from, a] = stops[index - 1];
  const [to, b] = stops[index];
  const t = ease(Math.min(1, Math.max(0, (value - from) / (to - from))));
  const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)} ${Math.round(g1 + (g2 - g1) * t)} ${Math.round(b1 + (b2 - b1) * t)})`;
};
