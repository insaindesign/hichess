import { Level } from "./util";
import ChessCtrl from "../lib/chess";

import type { Move, ShortMove, Square } from "chess.js";
import type { Color } from "chessground/types";
import type { DrawShape } from "chessground/draw";
import type { Config } from "chessground/config";

export class LevelManager {
  public level: Level;
  public chess: ChessCtrl;

  constructor(level: Level) {
    this.chess = new ChessCtrl();
    this.level = level;
    this.reset();
  }

  onMove = (move: ShortMove): void => {
    this.chess.move(move);
    if (this.level.scenario) {
      this.makeBotMove();
    } else if (!this.isComplete) {
      this.chess.color = this.color;
    }
  };

  reset(): void {
    this.chess.fen = this.level.fen;
    if (this.level.apples) {
      this.chess.addObstacles(this.level.apples.split(" ") as Square[]);
    }
    this.makeBotMove();
  }

  get config(): Config {
    return { movable: { color: this.color } };
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
    return this.userMoves.length
      ? this.level.success(this) && !this.isFailure
      : false;
  }

  get hasHints(): boolean {
    return Boolean(this.level.scenario);
  }

  get isFailure(): boolean {
    return this.userMoves.length ? this.level.failure(this) : false;
  }

  get isUsersTurn(): boolean {
    return this.color === this.chess.color;
  }

  get shapes(): DrawShape[] {
    const shapes = !this.userMoves.length ? this.level.shapes || [] : [];
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.moves.length - 1] : null;
    if (scene && typeof scene !== "string") {
      return scene.shapes;
    }
    return shapes;
  }

  public nextMove(): ShortMove | null {
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.moves.length] : null;
    return scene
      ? ChessCtrl.toMove(typeof scene !== "string" ? scene.move : scene)
      : null;
  }

  private makeBotMove() {
    const move = this.nextMove();
    const piece = move ? this.chess.pieces()[move.from] : null;
    if (
      move &&
      piece &&
      ChessCtrl.toColor(piece.color) !== this.level.color &&
      !this.isComplete
    ) {
      setTimeout(this.chess.move, 1000, move);
    }
  }
}

export default LevelManager;
