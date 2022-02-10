import Chess, { PieceType } from "chess.js";
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

export type Move = {
  orig: Key;
  dest: Key;
};

export const roleToSan: {
  [R in PromotionRole]: PromotionChar;
} = {
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
};
export type PromotionRole = "knight" | "bishop" | "rook" | "queen";
export type PromotionChar = "n" | "b" | "r" | "q";
export type PromotionPiece = PromotionChar | PromotionRole | "";

export function isRole(
  str: PromotionChar | PromotionRole
): str is PromotionRole {
  return str.length > 1;
}

export function readKeys(keys: string | Key[]): Key[] {
  return typeof keys === "string" ? (keys.split(" ") as Key[]) : keys;
}

export function setFenTurn(fen: string, turn: "b" | "w"): string {
  return fen.replace(/ (w|b) /, " " + turn + " ");
}

export class ChessCtrl {
  private chess: ChessInstance;
  public js: Pick<
    ChessInstance,
    | "in_check"
    | "in_checkmate"
    | "game_over"
    | "history"
    | "threats"
    | "defenders"
    | "in_draw"
  >;
  private events: EventEmitter<{ change: ChessMove[] }>;

  constructor(fen?: string) {
    this.chess = Chess(fen);
    this.js = this.chess;
    this.events = new EventEmitter();
    this.handleChange();
  }

  public static toMove(move: ChessMove): Move {
    return {
      orig: move.from,
      dest: move.to,
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
    }
  }

  get fen(): string {
    return this.chess.fen();
  }

  addObstacles(obstacle: Key[]) {
    const color = this.chess.turn() === "w" ? "b" : "w";
    obstacle.forEach((key) => {
      this.chess.put({ type: "p", color }, key);
    });
    this.handleChange();
  }

  on(event: "change", callback: (moves: ChessMove[]) => void) {
    return this.events.on(event, callback);
  }

  dests(opts?: { illegal?: boolean }): Map<Key, Key[]> {
    const dests = new Map<Key, Key[]>();
    Object.keys(this.pieces()).forEach((s) => {
      const ms = this.chess.moves({
        square: s,
        verbose: true,
        legal: !opts?.illegal,
      });
      if (ms.length) {
        dests.set(
          s as Key,
          ms.map((m) => m.to)
        );
      }
    });
    return dests;
  }

  move(orig: Key, dest: Key, prom?: PromotionPiece) {
    const m = this.chess.move({
      from: orig,
      to: dest,
      promotion: prom ? (isRole(prom) ? roleToSan[prom] : prom) : undefined,
    });
    this.handleChange();
    return m;
  }

  getMove(move: string): (ShortMove & { color: Color }) | null {
    const from = move.slice(0, 2) as Key;
    const to = move.slice(2, 4) as Key;
    const promotion = move.slice(2, 4) as ShortMove["promotion"];
    const piece = this.chess.get(from);
    return piece
      ? {
          from,
          to,
          promotion,
          color: ChessCtrl.toColor(piece.color),
        }
      : null;
  }

  pieces(): Partial<Record<Key, Piece>> {
    const map: Partial<Record<Key, Piece>> = {};
    this.chess.SQUARES.forEach((s) => {
      const p = this.chess.get(s);
      if (p) map[s] = p;
    });
    return map;
  }

  piece(type: PieceType, color: Color): Key | undefined {
    for (const i in this.chess.SQUARES) {
      const k = this.chess.SQUARES[i];
      const p = this.chess.get(k);
      if (p && p.type === type && ChessCtrl.toColor(p.color) === color) {
        return k;
      }
    }
    return undefined;
  }

  kingKey(color: Color): Key | undefined {
    return this.piece("k", color);
  }

  checks(): ChessMove[] {
    if (!this.chess.in_check()) return [];
    const threats = this.chess.threats();
    const king = this.kingKey(ChessCtrl.swapColor(this.color));
    return king && threats[king] ? threats[king] : [];
  }

  randomMove(): ChessMove | null {
    const moves = this.chess.moves({ verbose: true });
    return moves.length
      ? moves[Math.floor(Math.random() * moves.length)]
      : null;
  }

  reset() {
    this.chess.reset();
    this.handleChange();
  }

  undo() {
    this.chess.undo();
    this.handleChange();
  }

  private handleChange = debounce(
    () => this.events.emit("change", this.chess.history({ verbose: true })),
    1
  );
}

export default ChessCtrl;
