import memoize from "lodash/memoize";
import { atomFamily, DefaultValue, selector, selectorFamily } from "recoil";

import Elo from "../lib/elo";
import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { EloResult, EloValue } from "../lib/elo";

const cateogries = ["puzzle", "game", "learn"] as const;
export type EloCategory = typeof cateogries[number] | string;

export const elo = new Elo();

export const eloStateForAccountId = memoize((accountId: string) => {
  const storage = accountStore(accountId);
  const persisted = persist({ storage, key: "elo" });
  const key = accountKey(accountId);

  const loadedKeys: Record<string, Promise<boolean>> = {};

  const eloState = atomFamily<EloValue, EloCategory>({
    key: key("elo"),
    default: 400,
    effects: [persisted],
  });

  const eloLoadedState = selectorFamily<boolean, EloCategory>({
    key: key("eloLoaded"),
    get: (k) => () => {
      if (!loadedKeys[k]) {
        loadedKeys[k] = storage.getItem("elo").then(() => true);
      }
      return loadedKeys[k];
    },
  });

  const eloCalculateState = selectorFamily<[EloValue, EloResult], EloCategory>({
    key: key("eloCalculate"),
    get:
      (key) =>
      ({ get }) =>
        [get(eloState(key)), 0],
    set:
      (key) =>
      ({ get, set }, value) => {
        if (value instanceof DefaultValue) {
          return;
        }
        const currentRating = get(eloState(key));
        const newRatings = elo.calculate(currentRating, value[0], value[1]);
        set(eloState(key), newRatings[0]);
      },
  });

  const overallEloState = selector<EloValue>({
    key: key("overallElo"),
    get: ({ get }) => {
      const total = cateogries.reduce((t, key) => t + get(eloState(key)), 0);
      return Math.round(total / cateogries.length);
    },
  });

  return {
    eloState,
    eloCalculateState,
    overallEloState,
    eloLoadedState,
  };
});
