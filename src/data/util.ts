import type { Square as Key } from "chess.js";
import { completedScenario, extinct, followScenario, not } from "./assert";
import ChessCtrl from "../lib/chess";

import type { DrawShape } from "chessground/draw";
import type { Color } from "chessground/types";
import type LevelManager from "./manager";

export interface Category {
  key: string;
  name: string;
  stages: Stage[];
}

export interface Stage {
  key: string;
  levels: Level[];
}

export type Level = LevelBase & LevelDefaults;
export type LevelPartial = LevelBase & Partial<LevelDefaults>;

export type Uci = string; // represents a move e.g, e4

export type ScenarioLevel = (
  | Uci
  | {
      move: Uci;
      shapes: DrawShape[];
    }
)[];

export interface PuzzleBase {
  id: string;
  fen: string;
  solution: string;
  themes: string;
}

interface LevelBase {
  goal: string;
  fen: string;
  apples?: string;
  walls?: string;
  nbMoves?: number;
  scenario?: ScenarioLevel;
  themes?: string[];
  shapes?: DrawShape[];
}

export interface LevelDefaults {
  id: string;
  color: Color;
  success(manager: LevelManager): boolean;
  failure(manager: LevelManager): boolean;
}

export function learnToLevel(l: LevelPartial): Level {
  if (l.fen.split(" ").length === 4) l.fen += " 0 1";
  return {
    color: / w /.test(l.fen) ? "white" : "black",
    success: extinct("black"),
    failure: () => false,
    id: '', // TODO
    ...l,
  };
}

export function puzzleToLevel(l: PuzzleBase): Level {
  return {
    color: ChessCtrl.swapColor(/ w /.test(l.fen) ? "white" : "black"),
    goal: "solvepuzzle",
    success: completedScenario,
    failure: not(followScenario),
    ...l,
    scenario: l.solution.split(" "),
    themes: l.themes.split(" "),
  };
}

export function arrow(vector: string, brush?: string) {
  return {
    brush: brush || "paleGreen",
    orig: vector.slice(0, 2) as Key,
    dest: vector.slice(2, 4) as Key,
  };
}

export function circle(key: Key, brush?: string) {
  return {
    brush: brush || "green",
    orig: key,
  };
}
