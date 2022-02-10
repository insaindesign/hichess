import { Level } from "./util";
import ChessCtrl from "../lib/chess";

import type { ShortMove, Square } from "chess.js";
import type { Color, Key } from "chessground/types";
import { DrawShape } from "chessground/draw";

export type Move = ShortMove;

export class LevelManager {
  public level: Level;
  public chess: ChessCtrl;
  public moves: ShortMove[] = [];
  public shapes: DrawShape[] = [];
  private scenarioMove = 0;

  constructor(level: Level) {
    this.chess = new ChessCtrl();
    this.level = level;
    this.reset();
  }

  // called from the board (user move)
  onMove = (from: Key, to: Key): void => {
    const move: ShortMove = {
      from: from as Square,
      to: to as Square,
      promotion: "q",
    };
    this.moves.push(move);
    this.chess.move(move.from, move.to, move.promotion);
    if (!this.level.scenario && !this.isComplete) {
      this.chess.color = this.color;
    } else if (this.checkMove(move)) {
      this.makeBotMove();
    }
    this.showShapes();
  };

  reset(): void {
    this.chess.fen = this.level.fen;
    this.moves.length = 0;
    this.shapes.length = 0;
    this.scenarioMove = 0;
    if (this.level.apples) {
      this.chess.addObstacles(this.level.apples.split(" ") as Square[]);
    }
    this.showShapes();
    this.makeBotMove();
  }

  private checkMove(move: Move) {
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.scenarioMove] : null;
    if (!scene) {
      return false;
    }
    this.scenarioMove += 1;
    const sceneMove = typeof scene === "string" ? scene : scene.move;
    return (
      sceneMove.slice(0, 2) === move.from && sceneMove.slice(2, 4) === move.to
    );
  }

  private makeBotMove() {
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.scenarioMove] : null;
    if (!scene) {
      return;
    }
    const move = this.chess.getMove(
      typeof scene !== "string" ? scene.move : scene
    );
    if (move && move.color !== this.level.color) {
      this.scenarioMove += 1;
      setTimeout(() => {
        this.chess.move(move.from, move.to, move.promotion);
        this.showShapes();
      }, 1000);
    }
  }

  private showShapes() {
    this.shapes = !this.scenarioMove ? this.level.shapes || [] : [];
    const scenario = this.level.scenario;
    const scene = scenario ? scenario[this.scenarioMove - 1] : null;
    if (scene && typeof scene !== "string") {
      this.shapes = scene.shapes;
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
