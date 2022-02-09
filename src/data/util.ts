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

export type ScenarioLevel = {};
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
  autoCastle?: boolean;
  captures?: number;
  cssClass?: string;
  emptyApples?: boolean;
  explainPromotion?: boolean;
  nextButton?: boolean;
  offerIllegalMove?: boolean;
  pointsForCapture?: boolean;
  showPieceValues?: boolean;
  showFailureFollowUp?: boolean;
}

export interface LevelDefaults {
  id: number;
  apples: string;
  success(manager: LevelManager): boolean;
  failure(manager: LevelManager): boolean;
  color: Color;
  detectCapture: "unprotected" | boolean;
}

export function toLevel(l: LevelPartial, it: number): Level {
  if (l.fen.split(" ").length === 4) l.fen += " 0 1";
  return {
    id: it + 1,
    color: / w /.test(l.fen) ? "white" : "black",
    detectCapture: l.apples ? false : "unprotected",
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

export function pieceImg(role: string) {
  console.log('pieceImg', role);
  return role; // m('div.is2d.no-square', m('piece.white.' + role));
}

export function roundSvg(url: string) {
  console.log('roundSvg', url);
  return url; // m('div.round-svg', m('img', { src: url }));
}
