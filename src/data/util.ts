import { completedScenario, extinct, followScenario, not } from "./assert";
import ChessCtrl, { fenColor } from "../lib/chess";

import type { Square as Key } from "chess.js";
import type { DrawShape } from "chessground/draw";
import type { Color } from "chessground/types";
import type LevelManager from "./manager";

export type CategoryType =
  | "pieces"
  | "fundamentals"
  | "intermediate"
  | "advanced";

export interface Category {
  key: CategoryType;
  name: string;
  stages: Stage[];
}

export interface RawStage {
  category: string;
  stage: string;
  levels: LearnBase[];
}

export interface Stage {
  key: string;
  levels: Level[];
}

export type Level = LevelBase & LevelDefaults;
export type LearnBase = LevelBase & Partial<LevelDefaults>;

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
  rating: number;
}

export interface LevelBase {
  id: string;
  goal: string;
  fen: string;
  apples?: string;
  walls?: string;
  nbMoves?: number;
  scenario?: ScenarioLevel;
  shapes?: DrawShape[];
}

interface LevelDefaults {
  color: Color;
  rating: number;
  path: string;
  success(manager: LevelManager): boolean;
  failure(manager: LevelManager): boolean;
  themes: string[];
}

export function learnToLevel(l: LearnBase, rawStage: RawStage): Level {
  if (l.fen.split(" ").length === 4) l.fen += " 0 1";
  return {
    color: fenColor(l.fen),
    success: extinct("black"),
    failure: () => false,
    rating: 600,
    ...l,
    path: "/"+["learn", rawStage.category, rawStage.stage, l.id].join('/'),
    themes: ["learn", rawStage.stage, rawStage.category],
  };
}

export function puzzleToLevel(l: PuzzleBase): Level {
  return {
    color: ChessCtrl.swapColor(fenColor(l.fen)),
    goal: "solvepuzzle",
    success: completedScenario,
    failure: not(followScenario),
    ...l,
    path: "/puzzles/all/" + l.id,
    scenario: l.solution.split(" "),
    themes: l.themes.split(" ").concat("puzzle"),
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
