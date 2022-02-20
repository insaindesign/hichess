import { atom, selector, DefaultValue } from "recoil";
import memoize from "lodash/memoize";

import { upsert } from "../lib/arrays";
import { accountStore } from "../storage";
import { persist } from "./";

import type { Move } from "chess.js";

export type ProblemId = string;
export type Problem = {
  id: string;
  date: number;
  moves: Move[];
  result: "incomplete" | "success" | "failure";
};

const toProblemId = (p: Problem): ProblemId => [p.id, p.date].join("-");

export const promblemStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({ storage: accountStore, key: accountId });

  const problemsState = atom<Problem[]>({
    key: accountId + "-problems",
    default: [],
    effects: [persisted],
  });

  const currentProblemIdState = atom<ProblemId | null>({
    key: accountId + "-currentProblemId",
    default: null,
    effects: [persisted],
  });

  const currentProblemState = selector<Problem | null>({
    key: accountId + "-currentProblem",
    get: ({ get }) => {
      const id = get(currentProblemIdState);
      const problems = get(problemsState);
      return problems.find(p => toProblemId(p) === id) || null;
    },
    set: ({ get, set }, problem) => {
      if (!problem || problem instanceof DefaultValue) {
        return;
      }
      const problems = get(problemsState);
      const problemsUpdate = upsert(
        problems,
        problem,
        (p) => p.id === problem.id && p.date === problem.date
      );
      set(problemsState, problemsUpdate);
      if (problem.result !== 'incomplete') {
        set(currentProblemIdState, null);
      } else {
        set(currentProblemIdState, toProblemId(problem));
      }
    },
  });

  return {
    currentProblemIdState,
    currentProblemState,
    problemsState,
  };
});
