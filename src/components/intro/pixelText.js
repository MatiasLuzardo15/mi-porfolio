// A word rendered with the site's display face and sampled into a grid of cells, so the avatar's
// pixels can rebuild it. `textAspect` gives its width / height for laying it out.
export const PIXEL_FONT = '800 200px "Archivo Variable", "Arial Black", sans-serif';

const render = (text) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.font = PIXEL_FONT;
  const metrics = context.measureText(text);
  const width = Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
  const height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
  canvas.width = width + 4;
  canvas.height = height + 4;
  context.font = PIXEL_FONT;
  context.fillStyle = "#fff";
  context.fillText(text, metrics.actualBoundingBoxLeft + 2, metrics.actualBoundingBoxAscent + 2);
  return canvas;
};

export const textAspect = (text) => {
  const canvas = render(text);
  return canvas.width / canvas.height;
};

// Filled cells of `text` on a grid `cols` wide, as [col, row] pairs.
export const textCells = (text, cols) => {
  const source = render(text);
  const rows = Math.max(1, Math.round((cols * source.height) / source.width));
  const grid = document.createElement("canvas");
  grid.width = cols;
  grid.height = rows;
  const context = grid.getContext("2d", { willReadFrequently: true });
  context.drawImage(source, 0, 0, cols, rows);
  const { data } = context.getImageData(0, 0, cols, rows);
  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (data[(row * cols + col) * 4 + 3] > 110) cells.push([col, row]);
    }
  }
  return { cols, rows, cells };
};
