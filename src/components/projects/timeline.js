// Shared scroll timeline for the projects story, in viewport heights (u) since the story pinned.
// Scroll drives everything: each chapter is a stretch of scroll and every beat inside it is
// scrubbed by that scroll, so when the visitor stops scrolling the story stops too.

export const CHAPTER_LEN = 0.9;
// Where a chapter "rests" when reached from the index: its story has fully played.
export const CHAPTER_REST = 0.86;

const zenthStart = 1.1;
const zenthEnd = zenthStart + 6 * CHAPTER_LEN;
const ruralitIntro = zenthEnd + 0.35;

export const TIMELINE = {
  zenth: { introRest: 0.45, start: zenthStart, count: 6 },
  ruralit: { introStart: ruralitIntro, introRest: ruralitIntro + 0.7, start: ruralitIntro + 1.2, count: 6 },
};

export const sceneEnd = (scene) => TIMELINE[scene].start + TIMELINE[scene].count * CHAPTER_LEN;
TIMELINE.units = sceneEnd("ruralit") + 0.6;

export const chapterRest = (scene, index) => TIMELINE[scene].start + (index + CHAPTER_REST) * CHAPTER_LEN;

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const ramp = (value, from, to) => clamp((value - from) / (to - from));

// Chapter index and its scroll progress (0–1) for a scene at a given u.
export const chapterAt = (scene, u) => {
  const { start, count } = TIMELINE[scene];
  const raw = (u - start) / CHAPTER_LEN;
  const index = Math.min(count - 1, Math.max(0, Math.floor(raw)));
  return { index, progress: clamp(raw - index) };
};

// Story beats are authored on a 0–0.62 scale. They play across the first ~80% of a chapter's
// scroll; the rest is a short hold on the finished moment before the next chapter takes over.
export const beat = (scroll) => 0.62 * ramp(scroll, 0.03, 0.8);

// Reveal a piece of UI when the story needs it: fades and rises in between `from` and `to`.
export const reveal = (p, from, to = from + 0.06, distance = 18) => {
  const t = clamp((p - from) / (to - from));
  const eased = 1 - Math.pow(1 - t, 3);
  return {
    opacity: eased,
    transform: `translateY(${(1 - eased) * distance}px)`,
    filter: eased < 1 ? `blur(${(1 - eased) * 6}px)` : undefined,
  };
};
