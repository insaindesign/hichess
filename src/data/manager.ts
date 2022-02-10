import { Level } from "./util";
import ChessCtrl from "../lib/chess";

import type { Move, Square } from "chess.js";
import type { Color, Key } from "chessground/types";
import { DrawShape } from "chessground/draw";

export class LevelManager {
  public level: Level;
  public chess: ChessCtrl;
  public shapes: DrawShape[] = [];

  constructor(level: Level) {
    this.chess = new ChessCtrl();
    this.level = level;
    this.reset();
  }

  onMove = (from: Key, to: Key): void => {
    this.chess.move(from as Square, to as Square, "q");
    if (this.level.scenario) {
      this.makeBotMove();
    } else if (!this.isComplete) {
      this.chess.color = this.color;
    }
    this.showShapes();
  };

  reset(): void {
    this.chess.fen = this.level.fen;
    this.shapes.length = 0;
    if (this.level.apples) {
      this.chess.addObstacles(this.level.apples.split(" ") as Square[]);
    }
    this.makeBotMove();
    this.showShapes();
  }

  get userMoves(): Move[] {
    return this.chess.moves.filter(
      (m) => ChessCtrl.toColor(m.color) === this.level.color
    );
  }

  get moves(): Move[] {
    return this.chess.moves;
  }

  get color(): Color {
    return this.level.color;
  }

  get isComplete(): boolean {
    return this.isSuccessful || this.isFailure;
  }

  get isSuccessful(): boolean {
    return this.userMoves.length ? this.level.success(this) && !this.isFailure : false;
  }

  get isFailure(): boolean {
    return this.userMoves.length ? this.level.failure(this) : false;
  }

  private makeBotMove() {
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.moves.length] : null;
    const move = scene
      ? ChessCtrl.toMove(typeof scene !== "string" ? scene.move : scene)
      : null;
    const piece = move ? this.chess.pieces()[move.from] : null;
    if (move && piece && ChessCtrl.toColor(piece.color) !== this.level.color) {
      setTimeout(() => {
        this.chess.move(move.from, move.to, move.promotion);
        this.showShapes();
      }, 1000);
    }
  }

  private showShapes() {
    this.shapes = !this.userMoves.length ? this.level.shapes || [] : [];
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.moves.length - 1] : null;
    if (scene && typeof scene !== "string") {
      this.shapes = scene.shapes;
    }
  }
}

export default LevelManager;
