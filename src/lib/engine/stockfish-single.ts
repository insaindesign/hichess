import EventEmitter from "../emitter";
import { parseUci, isOption } from "./uci";
import { collectUntil, EngineCtrl } from "./engine";

import type { Engine, EngineEvents} from "./engine";

const getStockfishSingle: () => Promise<Engine> = () => {
  const worker = new Worker("/lib/stockfish-single/stockfish-single.worker.js");
  const events = new EventEmitter<EngineEvents>();
  worker.addEventListener("message", (e) =>
    events.emit("line", parseUci(e.data))
  );
  worker.postMessage("uci");
  return collectUntil(events, (line) => line === "uciok").then((lines) => {
    return {
      settings: {
        sendMoves: true,
      },
      options: lines.filter(isOption),
      worker,
      events,
    };
  });
};

export default new EngineCtrl(getStockfishSingle());
