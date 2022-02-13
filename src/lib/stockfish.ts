import memo from "lodash/memoize";
import { loadScript } from "../lib/scripts";
import ChessCtrl from "./chess";
import {
  isShortMove,
  isMoveInfo,
  parseUci,
  isFinalEvaluation,
  isEvaluation,
} from "./uci";
import EventEmitter from "./emitter";

import type {
  BestMove,
  MoveInfo,
  ParsedUci,
  Evaluation,
  Evaluations,
} from "./uci";
import { Color } from "chessground/types";

type StockfishWorker = {
  addMessageListener: (cb: (msg: string) => void) => void;
  postMessage: (message: string) => void;
};
type Option = "Skill Level" | "MultiPV";

const StockfishEvents = new EventEmitter<{ line: ParsedUci }>();

export const collectUntil = (
  condition: (line: ParsedUci) => boolean
): Promise<ParsedUci[]> => {
  return new Promise((resolve) => {
    const collcation: ParsedUci[] = [];
    const removeListener = StockfishEvents.on("line", (line) => {
      collcation.push(line);
      if (condition(line)) {
        resolve(collcation);
        removeListener();
      }
    });
  });
};

const getStockfish: () => Promise<StockfishWorker> = memo(() =>
  loadScript("/lib/stockfish/stockfish.js")
    .then((w: any) => w.Stockfish() as StockfishWorker)
    .then((sf) => {
      sf.addMessageListener((line: string) =>
        StockfishEvents.emit("line", parseUci(line))
      );
      sf.postMessage("uci");
      return collectUntil((line) => line === "uciok").then(() => sf);
    })
);

const bestFor = (color: Color) => {
  const order = color === "white" ? 1 : -1;
  return (a: MoveInfo, b: MoveInfo) => (b.score.value - a.score.value) * order;
};

export class StockfishCtrl {
  private stockfish: Promise<StockfishWorker>;
  private level: number;

  constructor() {
    this.stockfish = getStockfish();
    this.level = -1;
    this.setLevel(0);
  }

  setLevel(value: number) {
    if (value !== this.level) {
      this.setOption("Skill Level", value);
      this.setOption("MultiPV", 500);
      this.level = value;
    }
  }

  setOption(name: Option, value: string | number) {
    this.send([`setoption name ${name} value ${value}`]);
  }

  evaluate(chess: ChessCtrl): Promise<Evaluations> {
    const moves = chess.moves.map((m) => m.to).join(" ");
    this.send([`position fen ${chess.fen} moves ${moves}`, "eval"]);
    return collectUntil(isFinalEvaluation).then((lines) => {
      const evals = lines.filter(isEvaluation);
      return {
        Final: evals.find((e) => e.type === "Final") as Evaluation,
        Classical: evals.find((e) => e.type === "Classical"),
        NNUE: evals.find((e) => e.type === "NNUE"),
      };
    });
  }

  bestMove(chess: ChessCtrl): Promise<BestMove> {
    const moves = chess.moves.map((m) => m.to).join(" ");
    return this.send([`stop`]).then(() => {
      this.send([`position fen ${chess.fen} moves ${moves}`, "go multipv 500"]);
      return collectUntil(isShortMove).then((lines: ParsedUci[]) => ({
        move: lines.find(isShortMove) as BestMove["move"],
        best: lines.filter(isMoveInfo).sort(bestFor(chess.color))[0],
        info: lines.filter(isMoveInfo),
      }));
    });
  }

  send = (messages: string[]) => {
    return this.stockfish.then((sf) =>
      messages.forEach((m) => sf.postMessage(m))
    );
  };

  stop = () => {
    return this.send(["stop"]);
  };
}

export default StockfishCtrl;
