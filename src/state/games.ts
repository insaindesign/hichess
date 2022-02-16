// import { atom, selector, DefaultValue } from "recoil";
// import { gamesPersist } from "./";

import type { Color } from "chessground/types";

export type Game = {
  fen?: string;
  pgn: string;
  color?: Color | "both";
};

// export const gamesState = atom<Game[]>({
//   key: "games",
//   default: [],
//   effects_UNSTABLE: [gamesPersist],
// });

// export const currentGameState = selector<Game | null>({
//   key: "currentGame",
//   get: ({ get }) => {
//     return null;
//   },
//   set: ({ get, set }, game) => {
//     if (!game || game instanceof DefaultValue) {
//       return;
//     }
//     const games = get(gamesState);
//     set(gamesState, [...games, game]);
//   },
// });
