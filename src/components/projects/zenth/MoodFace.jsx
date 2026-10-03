// Faces from zenith-productivity/components/MoodFace.tsx, with a single shared gesture.
import { motion, useReducedMotion } from "framer-motion";

const gesture = {
  head: { rotate: [0, -6, 7, -4, 0], scale: [1, 1.06, 1.1, 1.04, 1] },
  eyes: { scaleY: [1, 0.15, 1, 1, 1] },
};
const transition = { duration: 1.4, ease: [0.77, 0, 0.175, 1], times: [0, 0.22, 0.52, 0.78, 1] };
const origin = { transformBox: "fill-box", transformOrigin: "center" };

export const MoodFace = ({ variant, feature, size = 34, gesture: play = false }) => {
  const reduceMotion = useReducedMotion();
  const animate = play && !reduceMotion;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <motion.g initial={false} animate={animate ? gesture.head : { rotate: 0, scale: 1 }} transition={transition} style={origin}>
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <g stroke={feature} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {variant === "EXCELENTE" ? (
            <>
              <path d="M6.9 10.4c1.1-1.6 2.2-1.6 3.3 0" />
              <path d="M13.8 10.4c1.1-1.6 2.2-1.6 3.3 0" />
              <path d="M7.3 13.5h9.4a4.7 4.7 0 0 1-9.4 0Z" fill={feature} stroke="none" />
            </>
          ) : (
            <>
              <motion.g initial={false} animate={animate ? gesture.eyes : { scaleY: 1 }} transition={transition} style={origin}>
                <circle cx="8.7" cy="9.9" r="1.15" fill={feature} stroke="none" />
                <circle cx="15.3" cy="9.9" r="1.15" fill={feature} stroke="none" />
              </motion.g>
              {variant === "BIEN" && <path d="M8 14.1c1 1.9 2.4 2.8 4 2.8s3-.9 4-2.8" />}
              {variant === "NEUTRAL" && <path d="M8.6 15.2h6.8" />}
              {variant === "BAJO" && <path d="M8.2 16.5c1-1.7 2.3-2.5 3.8-2.5s2.8.8 3.8 2.5" />}
              {variant === "MAL" && (
                <>
                  <path d="M7.9 16.9c1.1-2 2.5-3 4.1-3s3 1 4.1 3" />
                  <path d="M6.6 7.9 9.9 9.3" />
                  <path d="M17.4 7.9 14.1 9.3" />
                </>
              )}
            </>
          )}
        </g>
      </motion.g>
    </svg>
  );
};
