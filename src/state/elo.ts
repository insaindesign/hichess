import memoize from "lodash/memoize";
import { atom, DefaultValue, selector, selectorFamily } from "recoil";

import Elo from "../lib/elo";
import { accountStore } from "../storage";
import { persist } from "./";

import type { EloResult } from "../lib/elo";

type EloValue = number;
type EloCategory = "puzzle" | "game" | "learn" | string;
type Elos = Record<EloCategory, EloValue>;

const cateogries: EloCategory[] = ["puzzle", "game", "learn"];

export const elo = new Elo();

export const eloStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore, key: accountId });

  const elosState = atom<Elos>({
    key: accountId + "-elos",
    default: {},
    effects: [persisted],
  });

  const eloCalculateState = selectorFamily<[EloValue, EloResult], EloCategory>({
    key: accountId + "-eloCalculate",
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

  const eloState = selectorFamily<EloValue, EloCategory>({
    key: accountId + "-elo",
    get:
      (key) =>
      ({ get }) => {
        const elos = get(elosState);
        return elos[key] || 400;
      },
    set:
      (key) =>
      ({ get, set }, value) => {
        if (value instanceof DefaultValue) {
          return;
        }
        const elos = get(elosState);
        set(elosState, { ...elos, [key]: value });
      },
  });

  const overallEloState = selector<EloValue>({
    key: accountId + "-overallElo",
    get: ({ get }) => {
      const elos = get(elosState);
      let counts = 0;
      const total = cateogries.reduce((t, eloKey) => {
        if (elos[eloKey]) {
          counts += 1;
          t += elos[eloKey];
        }
        return t;
      }, 0);
      return counts ? Math.round(total / counts) : 400;
    },
  });

  return {
    eloState,
    eloCalculateState,
    overallEloState,
  };
});
