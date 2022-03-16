import {
  atom,
  selector,
  DefaultValue,
  atomFamily,
  selectorFamily,
} from "recoil";
import memoize from "lodash/memoize";
import isMatch from "lodash/isMatch";
import { setRecoil } from "recoil-nexus";

import { notEmpty } from "../lib/arrays";
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
  const storage = accountStore(accountId);
  const persisted = persist({ storage, key: "games" });
  const key = accountKey(accountId);

  const loadedKeys: Record<string, Promise<boolean>> = {};

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

  const gameLoadedState = selectorFamily<boolean, string>({
    key: key("gameLoaded"),
    get: (k) => () => {
      if (!loadedKeys[k]) {
        loadedKeys[k] = storage.getItem("games").then(() => true);
      }
      return loadedKeys[k];
    },
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
      if (!game || game instanceof DefaultValue) {
        return;
      }
      const id = game.date;
      const currentId = get(currentGameIdState);
      if (currentId !== id) {
        set(currentGameIdState, id);
      }
      const gameIds = get(gameIdsState);
      if (!gameIds.includes(id)) {
        set(gameIdsState, [...gameIds, id]);
      }
      set(gameState(id), game);
    },
  });

  const updateCurrentGameState = selector<Partial<Game> | null>({
    key: key("updateCurrentGame"),
    get: ({ get }) => get(currentGameState),
    set: ({ get, set }, update) => {
      const game = get(currentGameState);
      if (game && update && !isMatch(game, update)) {
        set(currentGameState, { ...game, ...update });
      }
    },
  });

  const potentialGameState = selector<Game | null>({
    key: key("potentialGame"),
    get: ({ get }) => {
      const games = get(gamesState);
      return games.find(g => !g.pgn) || null;
    },
  });

  storage
    .getItem<string>("games")
    .then((db) => {
      if (db) {
        const g = JSON.parse(db);
        const games: Game[] = g[key("games")] || [];
        const gameIds: GameId[] = g[key("gameIds")] || [];
        const gameIdsUpdates: GameId[] = [];
        const gameKey = key('game');
        Object.keys(g).forEach(k => {
          if (k.startsWith(gameKey)) {
            const game = g[k] as Game;
            if (game.date && !gameIds.includes(game.date)) {
              gameIdsUpdates.push(game.date)
            }
          }
        })
        if (games.length) {
          games.forEach((game) => {
            if (!gameIds.includes(game.date)) {
              gameIdsUpdates.push(game.date);
            }
          });
        }
        if (gameIdsUpdates.length) {
          setRecoil(gameIdsState, [...gameIds, ...gameIdsUpdates]);
        }
      }
    });

  return {
    gameLoadedState,
    gameState,
    gamesState,
    currentGameState,
    currentGameIdState,
    potentialGameState,
    updateCurrentGameState,
  };
});
