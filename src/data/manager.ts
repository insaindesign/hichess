import { Level } from "./util";
import ChessCtrl from "../lib/chess";

import type { PieceType, Square } from "chess.js";
import type { Color, Key } from "chessground/types";

export type Move = {
  from: Key;
  to: Key;
  promotion: PieceType;
};

export class LevelManager {
  public level: Level;
  public chess: ChessCtrl;
  public moves: Move[] = [];

  constructor(level: Level) {
    this.chess = new ChessCtrl(level.fen);
    this.level = level;
    if (level.apples) {
      this.chess.addObstacles(level.apples.split(" ") as Square[]);
    }
  }

  // called from the board (user)
  onMove = (from: Key, to: Key): void => {
    const promotion: PieceType = "q";
    this.moves.push({ from, to, promotion });
    this.chess.move(from as Square, to as Square, promotion);
    this.chess.color = this.color;
  };

  reset(): void {
    this.chess.js.load(this.level.fen);
    this.moves.length = 0;
    if (this.level.apples) {
      this.chess.addObstacles(this.level.apples.split(" ") as Square[]);
    }
  }

  get color(): Color {
    return this.level.color;
  }

  get isComplete(): boolean {
    return this.isSuccessful || this.isFailure;
  }

  get isSuccessful(): boolean {
    return this.moves.length ? this.level.success(this) : false;
  }

  get isFailure(): boolean {
    return this.moves.length ? this.level.failure(this) : false;
  }
}

export default LevelManager;
