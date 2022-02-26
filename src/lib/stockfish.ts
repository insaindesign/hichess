import memo from "lodash/memoize";

import ChessCtrl from "./chess";
import { isShortMove, isMoveInfo, linesToBestMove, parseUci } from "./uci";
import EventEmitter from "./emitter";

import type { BestMove, ParsedUci } from "./uci";

type Option = "Skill Level" | "MultiPV";
type EngineEvents = { line: ParsedUci };
interface Engine {
  worker: Worker;
  events: EventEmitter<EngineEvents>;
}

export const collectUntil = (
  events: EventEmitter<EngineEvents>,
  condition: (line: ParsedUci) => boolean
): Promise<ParsedUci[]> => {
  return new Promise((resolve) => {
    const collcation: ParsedUci[] = [];
    const removeListener = events.on("line", (line) => {
      collcation.push(line);
      if (condition(line)) {
        resolve(collcation);
        removeListener();
      }
    });
  });
};

const getStockfishSingle: () => Promise<Engine> = memo(() => {
  const worker = new Worker("/lib/stockfish-single/stockfish-single.worker.js");
  const events = new EventEmitter<EngineEvents>();
  worker.addEventListener("message", (e) =>
    events.emit("line", parseUci(e.data))
  );
  worker.postMessage("uci");
  return collectUntil(events, (line) => line === "uciok").then(() => ({
    worker,
    events,
  }));
});

// import { loadScript } from "../lib/scripts";
// interface StockfishWorker extends Worker {
//   addMessageListener: (cb: (msg: string) => void) => void;
// }
// const getStockfish: () => Promise<Engine> = memo(() =>
//   loadScript("/lib/stockfish/stockfish.js")
//     .then((w: any) => w.Stockfish() as StockfishWorker)
//     .then((worker) => {
//       const events = new EventEmitter<EngineEvents>();
//       worker.addMessageListener((line: string) =>
//         events.emit("line", parseUci(line))
//       );
//       worker.postMessage("uci");
//       return collectUntil(events, (line) => line === "uciok").then(() => ({
//         worker,
//         events,
//       }));
//     })
// );

const maxLevel = 20;

export class StockfishCtrl {
  private engine: Promise<Engine>;
  private level: number;

  constructor() {
    this.engine = getStockfishSingle();
    this.level = -1;
  }

  async setLevel(value: number) {
    if (value !== this.level) {
      this.level = value;
      return this.setOptions([
        ["Skill Level", value],
        ["MultiPV", ((maxLevel - value) / maxLevel) * 500],
      ]);
    }
    return;
  }

  private setOptions(options: [Option, boolean | string | number][]) {
    return this.send(
      options.map(([name, value]) => `setoption name ${name} value ${value}`)
    );
  }

  private async collectUntil(
    condition: (line: ParsedUci) => boolean
  ): Promise<ParsedUci[]> {
    const { events } = await this.engine;
    return collectUntil(events, condition);
  }

  async bestMove(chess: ChessCtrl): Promise<BestMove | null> {
    const moves = chess.moves.map((m) => m.to).join(" ");
    const color = chess.color;
    await this.send([`stop`]);
    this.send([`position fen ${chess.fen} moves ${moves}`, "go"]);
    let lines = await this.collectUntil(isShortMove);
    if (!lines.filter(isMoveInfo).length) {
      lines = await this.collectUntil(isShortMove);
    }
    if (!lines.filter(isMoveInfo).length) {
      return null;
    }
    return linesToBestMove(lines, color);
  }

  send = async (messages: string[]) => {
    const engine = await this.engine;
    messages.forEach((m) => engine.worker.postMessage(m));
  };

  stop = () => {
    return this.send(["stop"]);
  };
}

export default StockfishCtrl;
