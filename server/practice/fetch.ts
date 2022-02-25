// https://lichess.org/practice/load/BJy6fEDf/dW7KIuoY
import "isomorphic-fetch";

import type { Dests, Key } from "chessground/types";

export type EncodedDests =
  | string
  | {
      [key: string]: string;
    };

export const piotr = {
  a: "a1",
  b: "b1",
  c: "c1",
  d: "d1",
  e: "e1",
  f: "f1",
  g: "g1",
  h: "h1",
  i: "a2",
  j: "b2",
  k: "c2",
  l: "d2",
  m: "e2",
  n: "f2",
  o: "g2",
  p: "h2",
  q: "a3",
  r: "b3",
  s: "c3",
  t: "d3",
  u: "e3",
  v: "f3",
  w: "g3",
  x: "h3",
  y: "a4",
  z: "b4",
  A: "c4",
  B: "d4",
  C: "e4",
  D: "f4",
  E: "g4",
  F: "h4",
  G: "a5",
  H: "b5",
  I: "c5",
  J: "d5",
  K: "e5",
  L: "f5",
  M: "g5",
  N: "h5",
  O: "a6",
  P: "b6",
  Q: "c6",
  R: "d6",
  S: "e6",
  T: "f6",
  U: "g6",
  V: "h6",
  W: "a7",
  X: "b7",
  Y: "c7",
  Z: "d7",
  "0": "e7",
  "1": "f7",
  "2": "g7",
  "3": "h7",
  "4": "a8",
  "5": "b8",
  "6": "c8",
  "7": "d8",
  "8": "e8",
  "9": "f8",
  "!": "g8",
  "?": "h8",
};

export function parsePossibleMoves(dests: string): Dests {
  const dec = new Map();
  for (const ds of dests.split(" ")) {
    dec.set(ds.slice(0, 2), ds.slice(2).match(/.{2}/g) as Key[]);
  }
  return dec;
}

const decodeDest = (a: string) => {
  let o = "";
  for (let ii = 0; ii < a.length; ii++) {
    o += piotr[a[ii]] || a[ii];
  }
  return parsePossibleMoves(o);
};

const fetchPractice = (id: string, exclude?: true) =>
  fetch("https://lichess.org/practice/load/" + id)
    .then((r) => r.json())
    .then((r) => {
      const catId = r.study.id;
      const catIds = r.study.chapters.map((c) => catId + "/" + c.id);
      if (!exclude) {
        catIds.forEach((id) =>
          !ids.includes(id) ? fetchPractice(id, true) : null
        );
      }
      r.analysis.treeParts.forEach(part => {
        console.log(part.shapes);
      });
      console.log(r.analysis.game.fen);
      console.log(r.analysis.player.color);
      console.log(r.analysis.practiceGoal);
    });

const ids = [
  "9ogFv8Ac/eHgiqLYc",
  // "BJy6fEDf/dW7KIuoY",
  // "fE4k21MW/9rd7XwOw",
  // "8yadFPpU/UZ1np9Is",
  // "PDkQDt6u/ygAaFQNc",
  // "96Lij7wH/qr2pOlrL",
  // "Rg2cMBZ6/qooQw3mQ",
];
ids.forEach((id) => fetchPractice(id));
