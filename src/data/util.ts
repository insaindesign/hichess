import type { Square as Key } from "chess.js";

import { DrawShape } from "chessground/draw";
import { Color } from "chessground/types";
import ChessCtrl from "../lib/chess";
import { extinct } from "./assert";
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

export type Uci = string; // represents a move e.g, dxe5

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

interface LevelBase {
  goal: string;
  fen: string;
  nbMoves: number;
  scenario?: ScenarioLevel;
  shapes?: DrawShape[];
  cssClass?: string;
}

export interface LevelDefaults {
  id: number;
  apples: string;
  success(manager: LevelManager): boolean;
  failure(manager: LevelManager): boolean;
  color: Color;
  }

export function toLevel(l: LevelPartial, it: number): Level {
  if (l.fen.split(" ").length === 4) l.fen += " 0 1";
  return {
    id: it + 1,
    color: / w /.test(l.fen) ? "white" : "black",
        apples: "",
    success: extinct("black"),
    failure: () => false,
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
