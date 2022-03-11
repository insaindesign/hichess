import type { Piece, Square as Key } from "chess.js";
import { Color } from "chessground/types";

import ChessCtrl, { readKeys } from "../lib/chess";

import type { LevelManager } from "./manager";

interface Matcher {
  type: string;
  color: "b" | "w";
}

type Assert = (level: LevelManager) => boolean;

function pieceMatch(piece: Piece | undefined, matcher: Matcher) {
  if (!piece) return false;
  return piece.type === matcher.type && piece.color === matcher.color;
}

function pieceOnAnyOf(matcher: Matcher, keys: Key[]) {
  return function (level: LevelManager) {
    for (const i in keys)
      if (pieceMatch(level.chess.pieces()[keys[i]], matcher)) return true;
    return false;
  };
}

function fenToMatcher(fenPiece: string): Matcher {
  return {
    type: fenPiece.toLowerCase(),
    color: fenPiece.toLowerCase() === fenPiece ? "b" : "w",
  };
}

export function pieceOn(fenPiece: string, key: Key) {
  return function (level: LevelManager) {
    return pieceMatch(level.chess.pieces()[key], fenToMatcher(fenPiece));
  };
}

export function pieceNotOn(fenPiece: string, key: Key) {
  return function (level: LevelManager) {
    return !pieceMatch(level.chess.pieces()[key], fenToMatcher(fenPiece));
  };
}

export function noPieceOn(keys: string | Key[]) {
  keys = readKeys(keys);
  return function (level: LevelManager) {
    for (const key in level.chess.pieces())
      if (!keys.includes(key as Key)) return true;
    return false;
  };
}

export function whitePawnOnAnyOf(keys: string | Key[]) {
  return pieceOnAnyOf(fenToMatcher("P"), readKeys(keys));
}

export function extinct(color: string) {
  return function (level: LevelManager) {
    const fen = level.chess.fen.split(" ")[0].replace(/\//g, "");
    return fen === (color === "white" ? fen.toLowerCase() : fen.toUpperCase());
  };
}

export function lastMoveSan(san: string) {
  return function (level: LevelManager) {
    const moves = level.chess.moves;
    return moves[moves.length - 1].san === san;
  };
}

function canCaptureColor(level: LevelManager, color: Color) {
  const attacked = level.chess.js.threats();
  const defended = level.chess.js.defenders();
  const pieces = level.chess.pieces();
  const keys = Object.keys(attacked) as Key[];
  for (let ii = 0; ii < keys.length; ii++) {
    const piece = pieces[keys[ii]];
    if (
      piece &&
      ChessCtrl.toColor(piece.color) === color &&
      !defended[keys[ii]]
    ) {
      return true;
    }
  }
  return false;
}

export function canBeCaptured(level: LevelManager) {
  return canCaptureColor(level, level.color);
}

export function check(level: LevelManager) {
  return level.chess.js.in_check();
}

export function checkIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length <= nbMoves && check(level);
  };
}

export function noCheckIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length >= nbMoves && !check(level);
  };
}

export function mate(level: LevelManager) {
  return level.chess.js.in_checkmate();
}

export function stalemate(level: LevelManager) {
  return level.chess.js.in_draw();
}

export function mateIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length <= nbMoves && mate(level);
  };
}

export function noMateIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length >= nbMoves && !mate(level);
  };
}

export function within(moves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length <= moves;
  };
}

export function without(moves: number) {
  return function (level: LevelManager) {
    return level.userMoves.length >= moves;
  };
}

export function not(assert: Assert) {
  return function (level: LevelManager) {
    return !assert(level);
  };
}

export function and(...asserts: Assert[]) {
  return function (level: LevelManager) {
    return asserts.every(function (a) {
      return a(level);
    });
  };
}

export function or(...asserts: Assert[]) {
  return function (level: LevelManager) {
    return asserts.some(function (a) {
      return a(level);
    });
  };
}

export function followScenario(manager: LevelManager) {
  const scenario = manager.level.scenario;
  if (!manager.moves.length || !scenario) {
    return true;
  }
  const n = manager.moves.length - 1;
  const scene = scenario[n];
  const sceneMove = typeof scene === "string" ? scene : scene?.move;
  return sceneMove === ChessCtrl.fromMove(manager.moves[n]);
}

export function completedScenario(manager: LevelManager) {
  const scenario = manager.level.scenario || [];
  return followScenario(manager) && manager.moves.length === scenario.length;
}
