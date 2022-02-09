import type { Piece, Square as Key } from "chess.js";

import { readKeys } from "../lib/chess";

import type { LevelManager } from "./manager";

interface Matcher {
  type: string;
  color: "b" | "w";
}

type Assert = (level: LevelManager) => boolean;

function pieceMatch(piece: Piece | null, matcher: Matcher) {
  if (!piece) return false;
  return piece.type === matcher.type && piece.color === matcher.color;
}

function pieceOnAnyOf(matcher: Matcher, keys: Key[]) {
  return function (level: LevelManager) {
    for (const i in keys)
      if (pieceMatch(level.chess.js.get(keys[i]), matcher)) return true;
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
    return pieceMatch(level.chess.js.get(key), fenToMatcher(fenPiece));
  };
}

export function pieceNotOn(fenPiece: string, key: Key) {
  return function (level: LevelManager) {
    return !pieceMatch(level.chess.js.get(key), fenToMatcher(fenPiece));
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
    const fen = level.chess.js.fen().split(" ")[0].replace(/\//g, "");
    return fen === (color === "white" ? fen.toLowerCase() : fen.toUpperCase());
  };
}

export function lastMoveSan(san: string) {
  return function (level: LevelManager) {
    const moves = level.chess.js.history();
    return moves[moves.length - 1] === san;
  };
}

export function check(level: LevelManager) {
  return level.chess.js.in_check();
}

export function checkIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.moves.length <= nbMoves && check(level);
  };
}

export function noCheckIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.moves.length >= nbMoves && !check(level);
  };
}

export function mate(level: LevelManager) {
  return level.chess.js.in_checkmate();
}

export function mateIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.moves.length <= nbMoves && mate(level);
  };
}

export function noMateIn(nbMoves: number) {
  return function (level: LevelManager) {
    return level.moves.length >= nbMoves && !mate(level);
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
