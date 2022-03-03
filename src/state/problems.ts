import {
  atom,
  selector,
  DefaultValue,
  selectorFamily,
  atomFamily,
} from "recoil";
import { setRecoil } from "recoil-nexus";
import memoize from "lodash/memoize";

import { accountStore } from "../storage";
import { persist, accountKey } from "./";

import type { Move } from "chess.js";
import { emptyThrows, upsert } from "../lib/arrays";

export type ProblemId = string;
export type ProblemType = "puzzle" | "learn";
export interface ProblemBase {
  id: string;
  path: string;
  type: ProblemType;
}
export interface ProblemAttempt {
  rating: number;
  date: number;
  ratingChange: number;
  moves: Move["san"][];
  result: "incomplete" | "success" | "failure";
}
export interface ProblemAttempts extends ProblemBase {
  success?: boolean;
  attempts: ProblemAttempt[];
}
export interface Problem extends ProblemBase, ProblemAttempt {}

export type ProblemAttemptsOfIds = Record<string, ProblemAttempts | null>;

const toProblemId = (p: Problem): ProblemId => [p.id, p.date].join("-");
const fromProblemId = (p: ProblemId): [string, number] => {
  const parts = p.split("-");
  const date = emptyThrows(parts.pop());
  return [parts.join("-"), parseInt(date, 10)];
};

const toAttempt = (p: Problem): ProblemAttempt => ({
  date: p.date,
  rating: p.rating,
  ratingChange: p.ratingChange,
  moves: p.moves,
  result: p.result,
});

const toProblem = (p: ProblemAttempts, attempt: ProblemAttempt): Problem => {
  return {
    id: p.id,
    path: p.path,
    type: p.type,
    ...attempt,
  };
};
const toProblemByDate = (p: ProblemAttempts, date: number): Problem | null => {
  const attempt = p.attempts.find((a) => a.date === date);
  return attempt ? toProblem(p, attempt) : null;
};

export const problemStateForAccountId = memoize((accountId: string) => {
  const persisted = persist({
    storage: accountStore(accountId),
    key: "problems",
  });
  const key = accountKey(accountId);

  const problemLoadedState = atom<boolean>({
    key: key("problemLoaded"),
    default: false,
  });

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

  const problemsOfTypeState = selectorFamily<Problem[], ProblemType>({
    key: key("problemsOfType"),
    get:
      (type) =>
      ({ get }) => {
        const problems: Problem[] = [];
        get(problemIdsState)
          .map((id) => get(problemAttemptsState(id)))
          .forEach((at) => {
            if (!at || at.type !== type) {
              return;
            }
            at.attempts.forEach((a) => problems.push(toProblem(at, a)));
          });
        return problems;
      },
  });

  const problemAttemptsOfIdsState = selectorFamily<
    ProblemAttemptsOfIds,
    string[]
  >({
    key: key("problemAttemptsOfIds"),
    get:
      (ids) =>
      ({ get }) =>
        ids.reduce((acc, id) => {
          acc[id] = get(problemAttemptsState(id));
          return acc;
        }, {} as ProblemAttemptsOfIds),
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
      return attempt ? toProblemByDate(attempt, date) : null;
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
          attempts: [],
        };
      }
      const value = {
        ...problemAttempt,
        success: problem.result === "success" ? true : problemAttempt.success,
        attempts: upsert(
          problemAttempt.attempts,
          toAttempt(problem),
          (att) => att.date === problem.date
        ),
      };
      set(problemAttemptsState(problem.id), value);
      set(currentProblemIdState, toProblemId(problem));
    },
  });

  accountStore(accountId)
    .getItem<string>("problems")
    .then((p) => {
      setRecoil(problemLoadedState, true);
      if (p) {
        const db = JSON.parse(p);
        const attempts = key('problemAttempts');
        const currentIds = db[key('problemIds')] || [];
        const ids: string[] = [];
        Object.keys(db).forEach(k => {
          if (k.startsWith(attempts)) {
            const id = k.replace(attempts+'__', '').replace(/"/g, '');
            if (!currentIds.includes(id)) {
              ids.push(id);
            }
          }
        })
        if (ids.length) {
          setRecoil(problemIdsState, ids);
        }
      }
    });

  return {
    currentProblemIdState,
    currentProblemState,
    problemsOfTypeState,
    problemAttemptsState,
    problemAttemptsOfIdsState,
    problemLoadedState,
  };
});
