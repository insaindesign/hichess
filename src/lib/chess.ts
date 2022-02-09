import Chess, { PieceType } from "chess.js";

import type { Color } from "chessground/types";
import type {
  ChessInstance,
  Color as ChessColor,
  Piece,
  Square as Key,
  Move as ChessMove,
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
  public js: ChessInstance;

  constructor(fen?: string) {
    this.js = Chess(fen);
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
    return ChessCtrl.toColor(this.js.turn());
  }

  set color(c: Color) {
    const turn = c === "white" ? "w" : "b";
    const fen = setFenTurn(this.js.fen(), turn);
    const loaded = this.js.load(fen);
    if (!loaded) {
      this.js.load(
        fen.replace(/ (w|b) ([kKqQ-]{1,4}) \w\d /, " " + turn + " $2 - ")
      );
    }
  }

  addObstacles(obstacle: Key[]) {
    const color = this.js.turn() === "w" ? "b" : "w";
    obstacle.forEach((key) => {
      this.js.put({ type: "p", color }, key);
    });
  }

  dests(opts?: { illegal?: boolean }): Map<Key, Key[]> {
    const dests = new Map<Key, Key[]>();
    Object.keys(this.pieces()).forEach((s) => {
      const ms = this.js.moves({
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
    })
    return dests;
  }

  move(orig: Key, dest: Key, prom?: PromotionChar | PromotionRole | "") {
    return this.js.move({
      from: orig,
      to: dest,
      promotion: prom ? (isRole(prom) ? roleToSan[prom] : prom) : undefined,
    });
  }

  pieces(): Partial<Record<Key, Piece>> {
    const map: Partial<Record<Key, Piece>> = {};
    this.js.SQUARES.forEach((s) => {
      const p = this.js.get(s);
      if (p) map[s] = p;
    });
    return map;
  }

  piece(type: PieceType, color: Color): Key | undefined {
    for (const i in this.js.SQUARES) {
      const k = this.js.SQUARES[i];
      const p = this.js.get(k);
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
    if (!this.js.in_check()) return [];
    const threats = this.js.threats();
    const king = this.kingKey(ChessCtrl.swapColor(this.color));
    return king && threats[king] ? threats[king] : [];
  }

  randomMove(): ChessMove | null {
    const moves = this.js.moves({ verbose: true });
    return moves.length
      ? moves[Math.floor(Math.random() * moves.length)]
      : null;
  }
}

export default ChessCtrl;
