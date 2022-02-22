import { atom, selector, DefaultValue } from "recoil";
import memoize from "lodash/memoize";

import { upsert } from "../lib/arrays";
import { accountStore } from "../storage";
import { persist } from "./";

import type { Color } from "chessground/types";
import type { GameResult } from "../lib/chess";

export type Game = {
  date: number;
  start: string | undefined;
  position: string;
  moves: string[];
  color?: Color | "both";
  result: GameResult;
};

export const gameStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore, key: accountId });

  const gamesState = atom<Game[]>({
    key: accountId + "-games",
    default: [],
    effects: [persisted],
  });

  const currentGameDateState = atom<number | null>({
    key: accountId + 'currentGameId',
    default: null,
    effects: [persisted],
  });

  const currentGameState = selector<Game | null>({
    key: accountId + "-currentGame",
    get: ({ get }) => {
      const date = get(currentGameDateState);
      return get(gamesState).find(g => g.date === date) || null;
    },
    set: ({ get, set }, game) => {
      if (!game || game instanceof DefaultValue) {
        return;
      }
      const date = get(currentGameDateState);
      if (date !== game.date) {
        set(currentGameDateState, game.date);
      }
      const games = get(gamesState);
      set(gamesState, upsert(games, game, (g) => g.date === game.date));
    },
  });

  return {
    gamesState,
    currentGameState
  };
});


