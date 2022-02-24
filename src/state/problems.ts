import { atom, selector, DefaultValue, selectorFamily } from "recoil";
import memoize from "lodash/memoize";

import { upsert } from "../lib/arrays";
import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { Move } from "chess.js";

export type ProblemId = string;
export type ProblemType = "puzzle" | "learn";
export type Problem = {
  id: string;
  path: string;
  type: ProblemType;
  date: number;
  rating: number;
  ratingChange: number;
  moves: Move["san"][];
  result: "incomplete" | "success" | "failure";
};

const toProblemId = (p: Problem): ProblemId => [p.id, p.date].join("-");

export const problemStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore(accountId), key: 'problems' });
  const key = accountKey(accountId);

  const problemsState = atom<Problem[]>({
    key: key("problems"),
    default: [],
    effects: [persisted],
  });

  const currentProblemIdState = atom<ProblemId | null>({
    key: key("currentProblemId"),
    default: null,
    effects: [persisted],
  });

  const problemsOfTypeState = selectorFamily<Problem[], ProblemType>({
    key: key("problemsOfType"),
    get:
      (type) =>
      ({ get }) => {
        const problems = get(problemsState);
        return problems.filter((p) => p.type === type);
      },
  });

  const currentProblemState = selector<Problem | null>({
    key: key("currentProblem"),
    get: ({ get }) => {
      const id = get(currentProblemIdState);
      const problems = get(problemsState);
      return problems.find((p) => toProblemId(p) === id) || null;
    },
    set: ({ get, set }, problem) => {
      if (problem instanceof DefaultValue) {
        return;
      }
      if (!problem) {
        set(currentProblemIdState, null);
        return;
      }
      const problems = get(problemsState);
      const problemsUpdate = upsert(
        problems,
        problem,
        (p) => p.id === problem.id && p.date === problem.date
      );
      set(problemsState, problemsUpdate);
      set(currentProblemIdState, toProblemId(problem));
    },
  });

  return {
    currentProblemIdState,
    currentProblemState,
    problemsState,
    problemsOfTypeState,
  };
});
