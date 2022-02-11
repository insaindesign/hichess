import type {Move} from "chess.js";
import type { DrawBrush, DrawShape } from "chessground/draw";

export type ShapeOptionType = "none" | "counts" | "both";

type BrushTypes = "threat" | "defender";

const threatBBrush: DrawBrush = {
  key: "threatB",
  color: "darkred",
  opacity: 0.7,
  lineWidth: 10,
};
const threatWBrush: DrawBrush = {
  ...threatBBrush,
  key: "threatW",
  color: "red",
};
const defenderBBrush: DrawBrush = {
  key: "defenderB",
  color: "darkgreen",
  opacity: 0.7,
  lineWidth: 10,
};
const defenderWBrush: DrawBrush = {
  ...defenderBBrush,
  key: "defenderW",
  color: "green",
};

export const brushes = {
  threatb: threatBBrush,
  threatw: threatWBrush,
  defenderb: defenderBBrush,
  defenderw: defenderWBrush,
}

function circleSvg(
  color: "b" | "w",
  key: BrushTypes,
  text: string | number
) {
  const offset = key === "defender" ? 85 : 15;
  return `<circle class="${key}-circle-${color}" cx="${offset}" cy="${offset}" r="10"/><text class="${key}-text" x="${offset}" y="${offset}" dy=".33em" text-anchor="middle">${text}</text>`;
}

export function add_shapes(
  list: DrawShape[],
  square_moves: { [square: string]: Move[] },
  key: BrushTypes,
  options: ShapeOptionType
) {
  Object.values(square_moves).forEach((t) => {
    list.push({
      orig: t[0].to,
      customSvg: circleSvg(t[0].color, key, t.length),
    });
    if (options === "both") {
      t.forEach((move) => {
        list.push({
          orig: move.from,
          dest: move.to,
          brush: key + move.color,
        });
      });
    }
  });
}
