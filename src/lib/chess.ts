import Chess from "chess.js";
import debounce from "lodash/debounce";

import EventEmitter from "../lib/emitter";

import type { Color } from "chessground/types";
import type {
  ChessInstance,
  Color as ChessColor,
  Piece,
  Square as Key,
  Move as ChessMove,
  ShortMove,
} from "chess.js";

export function readKeys(keys: string | Key[]): Key[] {
  return typeof keys === "string" ? (keys.split(" ") as Key[]) : keys;
}

export function setFenTurn(fen: string, turn: "b" | "w"): string {
  return fen.replace(/ (w|b) /, " " + turn + " ");
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
  >;
  public moves: ChessMove[];
  private obstacles: Key[];

  constructor(fen?: string) {
    this.chess = Chess(fen);
    this.js = this.chess;
    this.events = new EventEmitter();
    this.moves = [];
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

  set fen(fen: string) {
    const loaded = this.chess.load(fen);
    if (loaded) {
      this.handleChange();
      this.moves = [];
    }
  }

  get fen(): string {
    return this.chess.fen();
  }

  get lastMove(): Key[] | undefined {
    const last = this.moves[this.moves.length - 1];
    return last ? [last.from, last.to] : undefined;
  }

  addObstacles(obstacle: Key[], color: ChessColor) {
    obstacle.forEach((key) => {
      this.chess.put({ type: "p", color }, key);
      this.obstacles.push(key);
    });
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
      this.moves = [...this.moves, m];
      this.handleChange();
    }
    return m;
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
    this.moves = [];
    this.obstacles = [];
    this.handleChange();
  }

  undo() {
    this.chess.undo();
    this.moves = this.moves.slice(0, -1);
    this.handleChange();
  }

  private handleChange = debounce(
    () => this.events.emit("change", this.moves),
    1
  );
}

export default ChessCtrl;
