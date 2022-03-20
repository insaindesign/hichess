import { normaliseScore } from "./uci";

import type { MoveInfoScore } from "./uci";

export type PgnMove = {
  move: string;
  rating?: MoveInfoScore;
  best?: string;
  bestMove?: string;
  bestRating?: MoveInfoScore;
};

type PgnRow = {
  number: string;
  black: PgnMove;
  white: PgnMove;
};

const commentRegex = / (\{[^}]*\})/g;
const moveRatingRegex = /([a-h][1-8][a-h][1-8] )+/;
const encodeComment = (comment: string) => comment.replace(/ /g, "__");
const decodeComment = (comment: string) => comment.replace(/__/g, " ");

const toRating = (rating: string): MoveInfoScore => {
  const type = rating.includes("Mate in ") ? "mate" : "cp";
  return normaliseScore({
    value:
      type === "mate"
        ? parseFloat(rating.replace("Mate in ", ""))
        : parseFloat(rating) * 100,
    type,
  });
};

const toMove = (part?: string): PgnMove => {
  const parts = part ? part.replace("}", "").split(" {") : [""];
  const data: PgnMove = { move: parts[0] };
  if (parts[1]) {
    const commentParts = parts[1].split(", ");
    if (commentParts[0] && parts[1].includes(",")) {
      data.rating = toRating(commentParts.shift() as string);
    }
    const best = commentParts.shift();
    if (best) {
      const bestRating = best.replace(moveRatingRegex, "");
      data.bestMove = best.replace(bestRating, "");
      data.bestRating = toRating(bestRating);
    }
    // only show best if it's unique
    if (
      data.bestRating &&
      data.rating &&
      data.bestRating.normalised !== data.rating.normalised
    ) {
      data.best = best;
    }
  }
  return data;
};

export const stripPgnHeaders = (pgn: string): string => pgn.replace(/\[.*\]\n?/g, '');

export const parsePgn = (pgn: string): PgnRow[] => {
  const parts = stripPgnHeaders(pgn)
    .replace(commentRegex, encodeComment)
    .split(" ")
    .map(decodeComment);

  const out: PgnRow[] = [];
  for (let ii = 0; ii < Math.round(parts.length / 3); ii++) {
    const index = ii * 3;
    out.push({
      number: parts[index],
      black: toMove(parts[index + 2]),
      white: toMove(parts[index + 1]),
    });
  }
  return out;
};