import { loadScript } from "../scripts";
import EventEmitter from "../emitter";
import { parseUci, isOption } from "./uci";
import { collectUntil, EngineCtrl } from "./engine";

import type { Engine, EngineEvents } from "./engine";

interface StockfishWorker extends Worker {
  addMessageListener: (cb: (msg: string) => void) => void;
}
const getStockfish: () => Promise<Engine> = () =>
  loadScript("/lib/stockfish/stockfish.js")
    .then((w: any) => w.Stockfish() as StockfishWorker)
    .then((worker) => {
      const events = new EventEmitter<EngineEvents>();
      worker.addMessageListener((line: string) =>
        events.emit("line", parseUci(line))
      );
      worker.postMessage("uci");
      return collectUntil(events, (line) => line === "uciok").then((lines) => ({
        settings: {
          sendMoves: true,
        },
        options: lines.filter(isOption),
        worker,
        events,
      }));
    });

export default new EngineCtrl(getStockfish());
