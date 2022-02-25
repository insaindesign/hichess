import memo from "lodash/memoize";
import ChessCtrl from "./chess";
import {
  isShortMove,
  linesToBestMove,
  parseUci,
  isFinalEvaluation,
  isEvaluation,
} from "./uci";
import EventEmitter from "./emitter";

import type {
  BestMove,
  ParsedUci,
  Evaluation,
  Evaluations,
} from "./uci";

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

const getStockfishSingle: () => Promise<Worker> = memo(() => {
  const sf = new Worker('/lib/stockfish-single/stockfish-single.worker.js');
  sf.addEventListener('message', (e) => StockfishEvents.emit("line", parseUci(e.data)));
  sf.postMessage("uci");
  return collectUntil((line) => line === "uciok").then(() => sf);
});

// import { loadScript } from "../lib/scripts";
// interface StockfishWorker extends Worker {
//   addMessageListener: (cb: (msg: string) => void) => void;
// };
// const getStockfish: () => Promise<StockfishWorker> = memo(() =>
//   loadScript("/lib/stockfish/stockfish.js")
//     .then((w: any) => w.Stockfish() as StockfishWorker)
//     .then((sf) => {
//       sf.addMessageListener((line: string) =>
//         StockfishEvents.emit("line", parseUci(line))
//       );
//       sf.postMessage("uci");
//       return collectUntil((line) => line === "uciok").then(() => sf);
//     })
// );

const maxLevel = 20;

export class StockfishCtrl {
  private stockfish: Promise<Worker>;
  private level: number;

  constructor() {
    this.stockfish = getStockfishSingle();
    this.level = -1;
  }

  setLevel(value: number) {
    if (value !== this.level) {
      this.setOption("Skill Level", value);
      this.setOption("MultiPV", ((maxLevel -  value) / maxLevel) * 500);
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
        Final: evals.find((e) => e.type === "Final") as Evaluation<"Final">,
        Classical: evals.find((e) => e.type === "Classical") as Evaluation<"Classical">,
        NNUE: evals.find((e) => e.type === "NNUE") as Evaluation<"NNUE">,
      };
    });
  }

  bestMove(chess: ChessCtrl): Promise<BestMove> {
    const moves = chess.moves.map((m) => m.to).join(" ");
    const color = chess.color;
    return this.send([`stop`]).then(() => {
      this.send([`position fen ${chess.fen} moves ${moves}`, "go"]);
      return collectUntil(isShortMove).then(l => linesToBestMove(l, color));
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
