import { atom, selector, DefaultValue } from "recoil";
import memoize from "lodash/memoize";
import { setRecoil } from "recoil-nexus";

import { upsert } from "../lib/arrays";
import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { Color } from "chessground/types";
import type { GameResult } from "../lib/chess";

export type Game = {
  date: number;
  position?: string;
  pgn: string;
  color: Color | "both";
  result?: GameResult;
};

export const gameStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore(accountId), key: "games" });
  const key = accountKey(accountId);

  const gamesState = atom<Game[]>({
    key: key("games"),
    default: [],
    effects: [persisted],
  });

  const isLoadedState = atom<boolean>({
    key: key("gamesIsLoaded"),
    default: false,
  });

  const currentGameDateState = atom<number | null>({
    key: key("currentGameId"),
    default: null,
    effects: [persisted],
  });

  const currentGameState = selector<Game | null>({
    key: key("currentGame"),
    get: ({ get }) => {
      const date = get(currentGameDateState);
      return get(gamesState).find((g) => g.date === date) || null;
    },
    set: ({ get, set }, game) => {
      if (game instanceof DefaultValue) {
        return;
      }
      if (!game) {
        set(currentGameDateState, null);
        return;
      }
      const date = get(currentGameDateState);
      if (date !== game.date) {
        set(currentGameDateState, game.date);
      }
      const games = get(gamesState);
      set(
        gamesState,
        upsert(games, game, (g) => g.date === game.date)
      );
    },
  });

  accountStore(accountId)
    .getItem("games")
    .then(() => setRecoil(isLoadedState, true));

  return {
    isLoadedState,
    gamesState,
    currentGameState,
  };
});
