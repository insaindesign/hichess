import { atom, selector, DefaultValue, atomFamily } from "recoil";
import memoize from "lodash/memoize";
import { setRecoil } from "recoil-nexus";
import { isMatch } from "lodash";

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

  accountStore(accountId)
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
            if (!gameIds.includes(game.date)) {
              gameIdsUpdates.push(game.date)
            }
          }
        })
        if (games.length) {
          games.forEach((game) => {
            if (!gameIds.includes(game.date)) {
              gameIdsUpdates.push(game.date);
            }
            setRecoil(gameState(game.date), game);
          });
          setRecoil(gamesState_DEPRECATED, []);
        }
        if (gameIdsUpdates.length) {
          setRecoil(gameIdsState, [...gameIds, ...gameIdsUpdates]);
        }
      }
      setRecoil(gameLoadedState, true);
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
