// Reads the colour actually painted under a point of the page chrome and says whether ink on top
// of it should be dark or light. The stories change their backgrounds continuously (themes,
// skies, scenes), so this samples a few times per second instead of trusting a fixed palette.
import { useEffect, useState } from "react";

const CHANNELS = /rgba?\(([^)]+)\)|color\(srgb ([^)]+)\)/;

const parseColor = (value) => {
  const match = value?.match(CHANNELS);
  if (!match) return null;
  if (match[1]) {
    const [r, g, b, a = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  const [r, g, b, a = 1] = match[2].split(/[\s/]+/).filter(Boolean).map(Number);
  return { r, g, b, a };
};

// The colour of a vertical gradient at height y of the element: the nearest listed stop.
const gradientAt = (value, element, y) => {
  const stops = [...value.matchAll(/(rgba?\([^)]+\)|color\(srgb [^)]+\))\s*(-?[\d.]+%)?/g)];
  if (!stops.length) return null;
  const rect = element.getBoundingClientRect();
  const t = rect.height ? (y - rect.top) / rect.height : 0;
  let best = stops[0];
  let distance = Infinity;
  stops.forEach((stop, index) => {
    const at = stop[2] ? parseFloat(stop[2]) / 100 : index / Math.max(1, stops.length - 1);
    if (Math.abs(at - t) < distance) {
      distance = Math.abs(at - t);
      best = stop;
    }
  });
  return parseColor(best[1]);
};

// Photos (the Ruralit field, the certificates) are read from a small cached copy of the image,
// mapped the way object-fit: cover places it.
const thumbnails = new Map();
const imageAt = (image, x, y) => {
  if (!image.complete || !image.naturalWidth) return null;
  let thumb = thumbnails.get(image.currentSrc);
  if (!thumb) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = Math.max(1, Math.round((64 * image.naturalHeight) / image.naturalWidth));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    try {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.getImageData(0, 0, 1, 1);
    } catch {
      return null;
    }
    thumb = { canvas, context };
    thumbnails.set(image.currentSrc, thumb);
  }
  const rect = image.getBoundingClientRect();
  const fit = getComputedStyle(image).objectFit;
  const scale = fit === "cover"
    ? Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
    : Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  const u = (x - rect.left - (rect.width - drawnWidth) / 2) / drawnWidth;
  const v = (y - rect.top - (rect.height - drawnHeight) / 2) / drawnHeight;
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;
  // Average a small patch: a photo is busy, one pixel is not representative of what is behind text.
  const cx = Math.max(0, Math.min(59, Math.floor(u * 64) - 2));
  const cy = Math.max(0, Math.min(thumb.canvas.height - 3, Math.floor(v * thumb.canvas.height) - 1));
  const { data } = thumb.context.getImageData(cx, cy, 5, Math.min(3, thumb.canvas.height));
  let r = 0, g = 0, b = 0;
  const count = data.length / 4;
  for (let index = 0; index < data.length; index += 4) {
    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
  }
  return { r: r / count / 255, g: g / count / 255, b: b / count / 255, a: 1 };
};

const opacityOf = (element) => {
  let opacity = 1;
  for (let node = element; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    opacity *= Number(style.opacity);
    if (style.visibility === "hidden" || opacity < 0.35) return 0;
  }
  return opacity;
};

// Relative luminance of the first opaque-enough surface under (x, y), skipping the chrome itself
// and any control that measures its own backdrop.
const luminanceAt = (x, y) => {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest(".site-chrome, [data-tone-probe]")) continue;
    if (element === document.documentElement || element === document.body) break;
    const style = getComputedStyle(element);
    // A solid fill first; otherwise the gradient's colour at that height (skies, walls).
    const fill = parseColor(style.backgroundColor);
    const color = element.tagName === "IMG"
      ? imageAt(element, x, y)
      : fill && fill.a >= 0.5 ? fill : gradientAt(style.backgroundImage, element, y);
    if (!color || color.a < 0.5) continue;
    if (opacityOf(element) * color.a < 0.5) continue;
    const linear = (channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b);
  }
  return 0.003;
};

export function useBackdropTone(points) {
  const [tones, setTones] = useState(() => points.map(() => "dark"));
  const key = JSON.stringify(points);
  useEffect(() => {
    const spots = JSON.parse(key);
    const sample = () => {
      if (document.hidden) return;
      const next = spots.map(([x, y]) => {
        const left = x < 0 ? window.innerWidth + x : x;
        const top = y < 0 ? window.innerHeight + y : y;
        return luminanceAt(left, top) > 0.18 ? "light" : "dark";
      });
      setTones((previous) => (previous.join() === next.join() ? previous : next));
    };
    sample();
    const id = setInterval(sample, 160);
    return () => clearInterval(id);
  }, [key]);
  return tones;
}
