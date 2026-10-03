// The pixel-art avatar as real pixels. The image is sampled into a grid of coloured cells drawn on
// a canvas that covers the whole viewport, so the cells can fly anywhere (`spread` = 1) and
// assemble back into the character (`spread` = 0). At rest the original image is drawn instead,
// so the avatar keeps every detail. The same cells can also rebuild a word (`morph`) and then
// condense into a single point (`collapse`). Everything is read from `stateRef` each frame.
import { useEffect, useRef } from "react";
import { PIXEL_FONT, textCells } from "./pixelText";

const COLS = 64;
const ROWS = 96;
const SRC = "/images/avatar.png?v=2";
const WORD_INK = [237, 237, 237];

const random = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => value * value * (3 - 2 * value);

// Give every avatar cell a cell of the word: left of the avatar goes to the left of the word.
const assignWord = (cells, text) => {
  let word = textCells(text, 40);
  for (let cols = 44; cols <= 320; cols += 4) {
    const next = textCells(text, cols);
    if (next.cells.length > cells.length) break;
    word = next;
  }
  const targets = [...word.cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const order = cells.map((cell, index) => ({ index, key: cell.x + random(index + 5) * 6 })).sort((a, b) => a.key - b.key);
  order.forEach(({ index }, rank) => {
    const [col, row] = targets[Math.floor((rank * targets.length) / cells.length)];
    cells[index].tc = col;
    cells[index].tr = row;
  });
  return { text, cols: word.cols, rows: word.rows };
};

export function PixelAvatar({ stateRef, active, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = SRC;
    let cells = null;
    let word = null;
    let frame = 0;
    const start = performance.now();

    image.onload = () => {
      const sampler = document.createElement("canvas");
      sampler.width = COLS;
      sampler.height = ROWS;
      const sample = sampler.getContext("2d", { willReadFrequently: true });
      sample.drawImage(image, 0, 0, COLS, ROWS);
      const { data } = sample.getImageData(0, 0, COLS, ROWS);
      cells = [];
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLS; x += 1) {
          const index = (y * COLS + x) * 4;
          if (data[index + 3] < 140) continue;
          const seed = y * COLS + x + 1;
          const angle = random(seed) * Math.PI * 2;
          const distance = 0.25 + random(seed + 7) * 0.75;
          const rgb = [data[index], data[index + 1], data[index + 2]];
          cells.push({
            x, y, rgb,
            color: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance,
            z: random(seed + 3) * 2 - 1,
            delay: random(seed + 11) * 0.35,
            wordDelay: random(seed + 13) * 0.3,
            tc: 0, tr: 0,
          });
        }
      }
    };

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const state = stateRef.current;
      if (!state || state.opacity <= 0 || !image.complete) return;

      const spread = clamp(state.spread);
      const morph = clamp(state.morph ?? 0);
      const collapse = clamp(state.collapse ?? 0);
      const time = (now - start) / 1000;
      // A slow float while the avatar is whole, like the portrait it replaces.
      const bob = Math.sin(time * 1.25) * 7 * (1 - spread);
      const boxHeight = state.height;
      const boxWidth = boxHeight * (2 / 3);
      const left = state.x - boxWidth / 2;
      const top = state.y - boxHeight / 2 + bob;

      // Soft halo behind the character.
      const glow = (1 - spread) * state.opacity * (state.glow ?? 1);
      if (glow > 0.01) {
        const radius = boxHeight * 0.34;
        const cy = top + boxHeight * 0.36;
        const gradient = context.createRadialGradient(state.x, cy, 0, state.x, cy, radius);
        gradient.addColorStop(0, `rgba(113, 133, 255, ${0.28 * glow})`);
        gradient.addColorStop(0.55, `rgba(92, 111, 255, ${0.1 * glow})`);
        gradient.addColorStop(1, "rgba(92, 111, 255, 0)");
        context.fillStyle = gradient;
        context.fillRect(state.x - radius, cy - radius, radius * 2, radius * 2);
      }

      const whole = 1 - clamp(spread / 0.06);
      if (whole > 0) {
        context.globalAlpha = whole * state.opacity;
        context.imageSmoothingEnabled = false;
        context.drawImage(image, left, top, boxWidth, boxHeight);
      }
      if (!cells || whole >= 1) {
        context.globalAlpha = 1;
        return;
      }

      // The word the pixels rebuild, laid out once the display face is ready.
      const target = morph > 0 && state.word ? state.word : null;
      if (target && word?.text !== target.text && document.fonts.check(PIXEL_FONT)) word = assignWord(cells, target.text);
      const wordOn = target && word?.text === target.text;
      const wordCell = wordOn ? target.width / word.cols : 0;
      const wordLeft = wordOn ? target.cx - target.width / 2 : 0;
      const wordTop = wordOn ? target.cy - (word.rows * wordCell) / 2 : 0;

      const cell = boxHeight / ROWS;
      for (const item of cells) {
        const local = clamp((spread * 1.35 - item.delay) / 1);
        const eased = smooth(local);
        const depth = 1 + item.z * eased * 1.4;
        let size = cell * Math.max(0.2, depth) + 0.5;
        let x = left + item.x * cell + item.dx * eased * width * 0.7;
        let y = top + item.y * cell + item.dy * eased * height * 0.6 - eased * height * 0.08;
        let alpha = 1 - eased * 0.5;
        let color = item.color;

        if (wordOn) {
          const m = smooth(clamp((morph * 1.3 - item.wordDelay) / 1));
          const c = smooth(clamp((collapse * 1.3 - item.wordDelay * 0.6) / 1));
          // The finished word breathes: a slow wave runs through its letters.
          const wave = Math.sin(time * 1.6 - item.tc * 0.12) * 1.6 * m * (1 - c);
          const tx = wordLeft + item.tc * wordCell + (target.cx - wordLeft - item.tc * wordCell) * c;
          const ty = wordTop + item.tr * wordCell + wave + (target.cy - wordTop - item.tr * wordCell) * c;
          x += (tx - x) * m;
          y += (ty - y) * m;
          size += (wordCell * 0.9 * (1 - c * 0.75) - size) * m;
          alpha = (alpha + (1 - alpha) * m) * (1 - clamp((c - 0.75) / 0.25));
          const ink = m * 0.82;
          color = `rgb(${Math.round(item.rgb[0] + (WORD_INK[0] - item.rgb[0]) * ink)}, ${Math.round(item.rgb[1] + (WORD_INK[1] - item.rgb[1]) * ink)}, ${Math.round(item.rgb[2] + (WORD_INK[2] - item.rgb[2]) * ink)})`;
        }

        if (alpha <= 0.01) continue;
        context.globalAlpha = (1 - whole) * state.opacity * alpha;
        context.fillStyle = color;
        context.fillRect(x, y, size, size);
      }

      // The condensed word becomes a point of light before the next story takes over.
      if (wordOn && collapse > 0.55) {
        const flare = Math.sin(Math.PI * clamp((collapse - 0.55) / 0.45));
        const radius = 4 + flare * 26;
        const gradient = context.createRadialGradient(target.cx, target.cy, 0, target.cx, target.cy, radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${flare})`);
        gradient.addColorStop(0.3, `rgba(170, 181, 255, ${flare * 0.5})`);
        gradient.addColorStop(1, "rgba(113, 133, 255, 0)");
        context.globalAlpha = state.opacity;
        context.fillStyle = gradient;
        context.fillRect(target.cx - radius * 3, target.cy - radius * 3, radius * 6, radius * 6);
      }
      context.globalAlpha = 1;
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [active, stateRef]);

  return <canvas ref={canvasRef} className="in-avatar" role="img" aria-label={label} />;
}
