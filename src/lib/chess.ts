import Chess from "chess.js";
import debounce from "lodash/debounce";

import EventEmitter from "../lib/emitter";
import { removeAtIndex } from "./arrays";

import type { Color } from "chessground/types";
import type {
  ChessInstance,
  Color as ChessColor,
  Piece,
  Square as Key,
  Move as ChessMove,
  ShortMove,
} from "chess.js";

export type GameResult = Color | "draw" | undefined;

export function readKeys(keys: string | Key[]): Key[] {
  return typeof keys === "string" ? (keys.split(" ") as Key[]) : keys;
}

export function setFenTurn(fen: string, turn: "b" | "w"): string {
  return fen.replace(/ (w|b) /, " " + turn + " ");
}

export function fenColor(fen: string): Color {
  return / w /.test(fen) ? "white" : "black";
}

export class ChessCtrl {
  private events: EventEmitter<{ change: ChessMove[] }>;
  private chess: ChessInstance;
  // Use typescript to ensure mutations are handled in ChessCtrl
  public js: Pick<
    ChessInstance,
    | "in_check"
    | "in_checkmate"
    | "in_draw"
    | "game_over"
    | "threats"
    | "defenders"
    | "pgn"
  >;
  private _moves: ChessMove[];
  private obstacles: Key[];

  constructor(fen?: string) {
    this.chess = Chess(fen);
    this.js = this.chess;
    this.events = new EventEmitter();
    this._moves = [];
    this.obstacles = [];
  }

  public static toMove(move: string): ShortMove {
    const from = move.slice(0, 2) as Key;
    const to = move.slice(2, 4) as Key;
    const promotion = move[4] as ShortMove["promotion"];
    return {
      from,
      to,
      promotion,
    };
  }
  public static fromMove(move: ShortMove): string {
    return move.from + move.to + (move.promotion || "");
  }

  public static toColor(color: ChessColor): Color {
    return color === "w" ? "white" : "black";
  }

  public static swapColor(color: Color): Color {
    return color === "white" ? "black" : "white";
  }

  get color(): Color {
    return ChessCtrl.toColor(this.chess.turn());
  }

  set color(c: Color) {
    const turn = c === "white" ? "w" : "b";
    const fen = setFenTurn(this.chess.fen(), turn);
    const loaded = this.chess.load(fen);
    if (!loaded) {
      this.chess.load(
        fen.replace(/ (w|b) ([kKqQ-]{1,4}) \w\d /, " " + turn + " $2 - ")
      );
    }
    this.handleChange();
  }

  set moves(moves: ChessMove[]) {
    this._moves = moves;
    this.handleChange();
  }

  public get moves() {
    return this._moves;
  }

  public load(pgn: string, fen?: string) {
    if (fen) {
      this.chess.load(fen);
    }
    if (pgn || !fen) {
      this.chess.load_pgn(pgn);
    }
    this.moves = this.chess.history({ verbose: true });
  }

  set fen(fen: string) {
    const loaded = this.chess.load(fen);
    if (loaded) {
      this.moves = [];
    }
  }

  get fen(): string {
    return this.chess.fen();
  }

  get result(): GameResult {
    return this.chess.in_draw()
      ? "draw"
      : this.chess.in_checkmate()
      ? ChessCtrl.swapColor(this.color)
      : undefined;
  }

  get lastMoveKey(): Key[] | undefined {
    const last = this.lastMove;
    return last ? [last.from, last.to] : undefined;
  }

  get lastMove(): ChessMove | undefined {
    return this.moves[this.moves.length - 1];
  }

  addObstacles(obstacle: Key[], color: ChessColor) {
    obstacle.forEach((key) => {
      this.chess.put({ type: "p", color }, key);
      this.obstacles.push(key);
    });
    this.handleChange();
  }

  comment(comment: string) {
    this.chess.set_comment(comment);
    this.handleChange();
  }

  on(event: "change", callback: (moves: ChessMove[]) => void) {
    return this.events.on(event, callback);
  }

  dests(): Map<Key, Key[]> {
    const dests = new Map<Key, Key[]>();
    Object.keys(this.pieces()).forEach((square) => {
      const ms = this.chess.moves({ square, verbose: true }).map((m) => m.to);
      if (ms.length) {
        dests.set(square as Key, ms);
      }
    });
    return dests;
  }

  move = (move: ShortMove) => {
    const m = this.chess.move(move);
    if (m) {
      const obstacle = this.obstacles.findIndex((o) => o === m.to);
      if (obstacle !== -1) {
        this.obstacles = removeAtIndex(this.obstacles, obstacle);
      }
      this.moves = [...this.moves, m];
    }
    return m;
  };

  temporaryMove = (move: ShortMove) => {
    const m = this.chess.move(move);
    if (m) {
      this.moves = [...this.moves];
      setTimeout(() => {
        this.chess.undo();
        this.moves = [...this.moves];
      }, 500);
    }
  };

  pieces(): Partial<Record<Key, Piece>> {
    const map: Partial<Record<Key, Piece>> = {};
    this.chess.SQUARES.forEach((s) => {
      const p = this.chess.get(s);
      if (p && !(this.obstacles.includes(s) && p.type === "p")) map[s] = p;
    });
    return map;
  }

  reset() {
    this.chess.reset();
    this.obstacles = [];
    this.moves = [];
  }

  undo() {
    this.chess.undo();
    this.moves = this.moves.slice(0, -1);
  }

  private handleChange = debounce(
    () => this.events.emit("change", this.moves),
    1
  );
}

export default ChessCtrl;
