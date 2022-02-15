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

export type Uci = string; // represents a move e.g, e2e4

export type ScenarioLevel = (
  | Uci
  | {
      move: Uci;
      shapes: DrawShape[];
    }
)[];

export type AssertData = {
  chess: ChessCtrl;
  vm: LevelManager;
};

interface PuzzleBase {
  fen: string;
  scenario: ScenarioLevel;
}

interface LevelBase {
  goal: string;
  fen: string;
  apples?: string;
  walls?: string;
  nbMoves?: number;
  scenario?: ScenarioLevel;
  shapes?: DrawShape[];
}

export interface LevelDefaults {
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
    ...l,
  };
}

export function puzzleToLevel(l: PuzzleBase): Level {
  return {
    color: ChessCtrl.swapColor(/ w /.test(l.fen) ? "white" : "black"),
    goal: "Complete the puzzle",
    success: completedScenario,
    failure: not(followScenario),
    ...l,
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
