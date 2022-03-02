import memoize from "lodash/memoize";
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
} from "recoil";
import {setRecoil} from "recoil-nexus";

import Elo from "../lib/elo";
import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { EloResult, EloValue } from "../lib/elo";

export type EloCategory = "puzzle" | "game" | "learn" | string;

const cateogries: EloCategory[] = ["puzzle", "game", "learn"];

export const elo = new Elo();

export const eloStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore(accountId), key: "elo" });
  const key = accountKey(accountId);

  const eloState = atomFamily<EloValue, EloCategory>({
    key: key("elo"),
    default: 400,
    effects: [persisted],
  });

  const eloLoadedState = atom({
    key: key("eloLoaded"),
    default: false,
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

  accountStore(accountId)
    .getItem("elo")
    .then(() => setRecoil(eloLoadedState, true));

  return {
    eloState,
    eloCalculateState,
    overallEloState,
    eloLoadedState,
  };
});
