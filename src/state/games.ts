import { atom, selector, DefaultValue } from "recoil";
import memoize from "lodash/memoize";
import { accountStore } from "../storage";
import { persist } from "./";

import type { Color } from "chessground/types";

export type Game = {
  fen?: string;
  pgn: string;
  color?: Color | "both";
};

export const gameStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore, key: accountId });
  const gamesState = atom<Game[]>({
    key: accountId + "-games",
    default: [],
    effects: [persisted],
  });

  const currentGameState = selector<Game | null>({
    key: accountId + "-currentGame",
    get: ({ get }) => {
      return null;
    },
    set: ({ get, set }, game) => {
      if (!game || game instanceof DefaultValue) {
        return;
      }
      const games = get(gamesState);
      set(gamesState, [...games, game]);
    },
  });

  return {
    gamesState,
    currentGameState
  };
});


