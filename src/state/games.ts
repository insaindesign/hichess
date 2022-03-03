import { atom, selector, DefaultValue, atomFamily } from "recoil";
import memoize from "lodash/memoize";
import { setRecoil } from "recoil-nexus";

import { notEmpty, upsert } from "../lib/arrays";
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
  ratingChange?: number;
};
export type GameId = number | string;

export const gameStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore(accountId), key: "games" });
  const key = accountKey(accountId);

  const gamesState_DEPRECATED = atom<Game[]>({
    key: key("games"),
    default: [],
    effects: [persisted],
  });

  const gameState = atomFamily<Game | null, GameId>({
    key: key("game"),
    default: null,
    effects: [persisted],
  });

  const gameIdsState = atom<GameId[]>({
    key: key("gameIds"),
    default: [],
    effects: [persisted],
  });

  const gameLoadedState = atom<boolean>({
    key: key("gameLoaded"),
    default: false,
  });

  const currentGameIdState = atom<GameId | null>({
    key: key("currentGameId"),
    default: null,
    effects: [persisted],
  });

  const gamesState = selector<Game[]>({
    key: key("allGames"),
    get: ({ get }) =>
      get(gameIdsState)
        .map((id) => get(gameState(id)))
        .filter(notEmpty),
  });

  const currentGameState = selector<Game | null>({
    key: key("currentGame"),
    get: ({ get }) => {
      const date = get(currentGameIdState);
      return date ? get(gameState(date)) : null;
    },
    set: ({ get, set }, game) => {
      if (game instanceof DefaultValue) {
        return;
      }
      if (!game) {
        set(currentGameIdState, null);
        return;
      }
      const date = get(currentGameIdState);
      if (date !== game.date) {
        set(currentGameIdState, game.date);
      }
      if (!get(gameState(game.date))) {
        const gameIds = get(gameIdsState);
        set(
          gameIdsState,
          upsert(gameIds, game.date, (id) => id !== game.date)
        );
      }
      set(gameState(game.date), game);
    },
  });

  const updateCurrentGameState = selector<Partial<Game> | null>({
    key: key("updateCurrentGame"),
    get: ({ get }) => get(currentGameState),
    set: ({ get, set }, update) => {
      const game = get(currentGameState);
      if (!game || update instanceof DefaultValue) {
        return;
      }
      if (game.pgn === update?.pgn && game.position === update?.position) {
        return;
      }
      set(currentGameState, { ...game, ...update });
    },
  });

  accountStore(accountId)
    .getItem<string>("games")
    .then((db) => {
      setRecoil(gameLoadedState, true);
      if (db) {
        const g = JSON.parse(db);
        const games: Game[] = g[key("games")] || [];
        const gameIds: GameId[] = g[key("gameIds")] || [];
        if (games.length) {
          games.forEach((game) => {
            if (!gameIds.includes(game.date)) {
              gameIds.push(game.date);
            }
            setRecoil(gameState(game.date), game);
          });
          setRecoil(gameIdsState, gameIds);
          setRecoil(gamesState_DEPRECATED, []);
        }
      }
    });

  return {
    gameLoadedState,
    gameState,
    gamesState,
    currentGameState,
    currentGameIdState,
    updateCurrentGameState,
  };
});
