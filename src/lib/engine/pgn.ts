import { toMoveInfoScore } from "./uci";

import type { MoveInfoScore } from "./uci";

export type PgnMove = {
  move: string;
  rating?: MoveInfoScore;
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

const toMove = (part?: string): PgnMove => {
  const parts = part ? part.replace("}", "").split(" {") : [""];
  const data: PgnMove = { move: parts[0] };
  if (parts[1]) {
    const commentParts = parts[1].split(", ");
    let next = commentParts.shift();
    if (next && next.match(/^[+-M]/)) {
      data.rating = toMoveInfoScore(next);
      next = commentParts.shift();
    }
    if (next) {
      const bestRating = next.replace(moveRatingRegex, "");
      data.bestMove = next.replace(bestRating, "");
      data.bestRating = toMoveInfoScore(bestRating);
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