import {
  atom,
  selector,
  DefaultValue,
  selectorFamily,
  atomFamily,
} from "recoil";
import memoize from "lodash/memoize";

import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { Move } from "chess.js";
import { upsert } from "../lib/arrays";

export type ProblemId = string;
export type ProblemType = "puzzle" | "learn";
export interface ProblemBase {
  id: string;
  path: string;
  type: ProblemType;
  rating: number;
}
export interface ProblemAttempt {
  date: number;
  ratingChange: number;
  moves: Move["san"][];
  result: "incomplete" | "success" | "failure";
}
export interface ProblemAttempts extends ProblemBase {
  attempts: ProblemAttempt[];
}
export interface Problem extends ProblemBase, ProblemAttempt {}

const toProblemId = (p: Problem): ProblemId => [p.id, p.date].join("-");
const fromProblemId = (p: ProblemId): [string, number] => {
  const parts = p.split("-");
  return [parts[0], parseInt(parts[1])];
};

const problemToAttempt = (p: Problem): ProblemAttempt => ({
  date: p.date,
  ratingChange: p.ratingChange,
  moves: p.moves,
  result: p.result,
});

const attemptToProblem = (p: ProblemAttempts, index: number): Problem => {
  return {
    id: p.id,
    path: p.path,
    type: p.type,
    rating: p.rating,
    ...p.attempts[index],
  };
};
const attemptToProblemByDate = (p: ProblemAttempts, date: number): Problem =>
  attemptToProblem(
    p,
    p.attempts.findIndex((a) => a.date === date)
  );

export const problemStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({
    storage: accountStore(accountId),
    key: "problems",
  });
  const key = accountKey(accountId);

  const problemIdsState = atom<string[]>({
    key: key("problemIds"),
    default: [],
    effects: [persisted],
  });

  const currentProblemIdState = atom<ProblemId | null>({
    key: key("currentProblemId"),
    default: null,
    effects: [persisted],
  });

  const problemAttemptsState = atomFamily<ProblemAttempts | null, string>({
    key: key("problemAttempts"),
    default: null,
    effects: [persisted],
  });

  const problemsState = selector<Problem[]>({
    key: key("problems"),
    get: ({ get }) => {
      const attempts: Problem[] = [];
      get(problemIdsState)
        .map((id) => get(problemAttemptsState(id)))
        .forEach((at) =>
          at?.attempts.forEach((a, ii) =>
            attempts.push(attemptToProblem(at, ii))
          )
        );
      return attempts;
    },
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
      const pId = get(currentProblemIdState);
      if (!pId) {
        return null;
      }
      const [id, date] = fromProblemId(pId);
      const attempt = get(problemAttemptsState(id));
      return attempt ? attemptToProblemByDate(attempt, date) : null;
    },
    set: ({ get, set }, problem) => {
      if (problem instanceof DefaultValue) {
        return;
      }
      if (!problem) {
        set(currentProblemIdState, null);
        return;
      }
      let problemAttempt = get(problemAttemptsState(problem.id));
      if (!problemAttempt) {
        const problemIds = get(problemIdsState);
        set(problemIdsState, [...problemIds, problem.id]);
        problemAttempt = {
          id: problem.id,
          path: problem.path,
          type: problem.type,
          rating: problem.rating,
          attempts: [],
        };
      }
      set(currentProblemIdState, toProblemId(problem));
      const value = {
        ...problemAttempt,
        attempts: upsert(
          problemAttempt.attempts,
          problemToAttempt(problem),
          (i) => i.date === problem.date
        ),
      };
      set(problemAttemptsState(problem.id), value);
    },
  });

  return {
    currentProblemIdState,
    currentProblemState,
    problemsState,
    problemsOfTypeState,
  };
});
